import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, Dimensions, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import { supabase } from "../App";
import { launchImageLibrary } from "react-native-image-picker";
import { FONTS } from "../constants/fonts";
import Feathericons from "react-native-vector-icons/Feather";


const { width } = Dimensions.get("window");

export default function ModelImages({ profile = null, setInputModelImage, navigation }) {
  const [modelImages, setModelImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedModelImage, setSelectedModelImage] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  const imagesPerPage = 3;
  const maxPages = Math.ceil(modelImages.length / imagesPerPage);

  const updateSelectedImage = (image) => {
    setSelectedModelImage(image);
    setInputModelImage(image);
  };

  useEffect(() => {
    const loadImages = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }
      
      const { data: modelImagesData, error: imageError } = await supabase
        .from("model_images")
        .select("*")
        .eq("profiles_id", profile.id)
        .order("created_at", { ascending: false });

      if (imageError) {
        setLoading(false);
        return;
      }
      
      if (modelImagesData && modelImagesData.length > 0) {
        updateSelectedImage(modelImagesData[0]);
      }
      setModelImages(modelImagesData || []);
      setLoading(false);
    };

    loadImages();
  }, [profile]);

  const handlePrevious = () => {
    if (carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1);
    }
  };

  const handleNext = () => {
    if (carouselIndex < maxPages - 1) {
      setCarouselIndex(carouselIndex + 1);
    }
  };

  const handleImageSelect = (image) => {
    updateSelectedImage(image);
  };

  const handleUploadImage = async () => {
    try {
      setUploading(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        Alert.alert("Error", "Failed to get authentication session. Please log in again.");
        setUploading(false);
        return;
      }
      
      if (!session) {
        Alert.alert("Error", "You must be logged in to upload images.");
        setUploading(false);
        return;
      }
      
      const supabaseToken = session.access_token;
      
      const result = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
      });
      
      if (result.didCancel) {
        setUploading(false);
        return;
      }
      
      if (result.errorCode) {
        Alert.alert("Error", `Image picker error: ${result.errorMessage}`);
        setUploading(false);
        return;
      }
      
      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        
        const formData = new FormData();
        formData.append("file", {
          uri: selectedImage.uri,
          type: selectedImage.type || "image/jpeg", 
          name: selectedImage.fileName || "image.jpg",
        });
        
        formData.append("image_bucket", "models");
        formData.append("image_table", "model_images");
        
        const response = await fetch(
          "https://my-fitting-room-server.onrender.com/api/image/upload",
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${supabaseToken}`,
            },
            body: formData,
          }
        );
        
        const responseData = await response.json();
        
        if (!response.ok) {
          throw new Error(responseData.message || "Failed to upload image");
        }
        
        Alert.alert("Success", "Model image uploaded successfully!");
        navigation.replace("TryOn");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setDeleting(true);
      const { data: { session }, error } = await supabase.auth.getSession();
    
      if (error) {
        Alert.alert("Error", "Failed to delete image. Please try again.");
        setDeleting(false);
        return;
      }
    
      if (!session) {
        Alert.alert("Error", "Failed to delete image. Please try again.");
        setDeleting(false);
        return;
      }
    
      const supabaseToken = session.access_token;

      const response = await fetch(
        "https://my-fitting-room-server.onrender.com/api/image/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseToken}`,
          },
          body: JSON.stringify({
            image_bucket: "models",
            image_table: "model_images",
            image_slug: selectedModelImage.slug,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete image");
      }
  
      navigation.replace("TryOn"); 
    } catch (error) {
      Alert.alert("Error", "Failed to delete image. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const renderCarouselImages = () => {
    const startIndex = carouselIndex * imagesPerPage;
    const endIndex = Math.min(startIndex + imagesPerPage, modelImages.length);
    const visibleImages = modelImages.slice(startIndex, endIndex);

    return (
      <View style={styles.carouselContainer}>
        <View style={styles.arrowButtonLeft}>
          <TouchableOpacity 
            style={[styles.arrowCircle, carouselIndex === 0 && styles.arrowButtonDisabled]} 
            onPress={handlePrevious}
            disabled={carouselIndex === 0}
          >
            <Ionicons name="chevron-back" size={20} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.carouselImagesContainer}>
          {visibleImages.map((image, index) => (
            <TouchableOpacity 
              key={image.id || index} 
              style={[
                styles.carouselImageWrapper,
                selectedModelImage?.id === image.id && styles.selectedCarouselImage
              ]}
              onPress={() => handleImageSelect(image)}
            >
              <Image 
                source={{ uri: image.url }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
          
          {Array(imagesPerPage - visibleImages.length).fill().map((_, index) => (
            <View key={`empty-${index}`} style={styles.emptySlot} />
          ))}
        </View>
        
        <View style={styles.arrowButtonRight}>
          <TouchableOpacity 
            style={[styles.arrowCircle, carouselIndex >= maxPages - 1 && styles.arrowButtonDisabled]} 
            onPress={handleNext}
            disabled={carouselIndex >= maxPages - 1}
          >
            <Ionicons name="chevron-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4052FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Models</Text>
      
      <Text style={styles.subheading}>
        Images of Models you"ve uploaded appear here.
      </Text>

      {modelImages.length > 0
        ? (
          <>
            <View style={styles.selectedImageContainer}>
              <Image 
                source={{ uri: selectedModelImage?.url }} 
                style={styles.selectedImage}
                resizeMode="contain"
              />
            </View>
            
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleUploadImage}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#4052FF" />
                ) : (
                  <Feathericons name="upload" size={24} color="black" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleDeleteImage}
                disabled={!selectedModelImage || deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#FF0000" />
                ) : (
                  <Feathericons name="trash" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
            
            {renderCarouselImages()}
          </>
        )
        : (
          <>
            <View style={styles.uploadSection}>
              <TouchableOpacity 
                style={styles.uploadButton} 
                onPress={handleUploadImage}
                disabled={uploading}
              >
                <View style={styles.uploadIconContainer}>
                  {uploading ? (
                    <ActivityIndicator size="small" color="#4052FF" />
                  ) : (
                    <Feathericons name="upload" size={24} color="black" />
                  )}
                </View>
                <Text style={styles.uploadText}>
                  {uploading ? "Uploading..." : "Upload your model image here"}
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.tip}>
              For best results, use photos taken in bright lighting with a straight-on angle.
            </Text>
          </>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    fontSize: 28,
    fontWeight: "400",
    marginBottom: 15,
    fontFamily: FONTS.SWITZER,

  },
  subheading: {
    fontSize: 14,
    marginBottom: 20,
    fontFamily: FONTS.SATOSHI,
    fontWeight: "400",

  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4052FF",
  },
  selectedImageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20, 
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 8,
  },
  actionButtonText: {
    fontSize: 16,
    marginLeft: 5,
    color: "#4052FF",
  },
  carouselContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: "100%",
  },
  arrowButtonLeft: {
    position: "absolute",
    left: 0,
    zIndex: 10,
  },
  arrowButtonRight: {
    position: "absolute",
    right: 0,
    zIndex: 10,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8,
  },
  arrowButtonDisabled: {
    opacity: 0.3,
  },
  carouselImagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%", 
    paddingHorizontal: 15,
  },
  carouselImageWrapper: {
    width: (width - 180) / 3, 
    height: (width - 180) / 3,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
  },
  selectedCarouselImage: {
    // borderWidth: 3,
    // borderColor: "#4052FF",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  emptySlot: {
    width: (width - 180) / 3,
    height: (width - 180) / 3,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  uploadSection: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 40,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  uploadButton: {
    alignItems: "center",
  },
  uploadText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: FONTS.SWITZER
  },
  tip: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontFamily: FONTS.SATOSHI
  },
});