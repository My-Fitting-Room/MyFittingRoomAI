import { View, Text, TouchableOpacity, ActivityIndicator, Image, Alert, ScrollView } from "react-native";
import Feathericons from "react-native-vector-icons/Feather";
import React, { useEffect, useState } from "react";
import { supabase } from "../App";
import { launchImageLibrary } from "react-native-image-picker";
import { styles } from "../stylesheets/clothesImages";

export default function ClothesImages({ profile = null, setInputClothImage, navigation, returnScreen = "TryOn" }) {
  const [clothesImages, setClothesImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedClothesImage, setSelectedClothesImage] = useState(null);
  
  const updateSelectedImage = (image) => {
    setSelectedClothesImage(image);
    setInputClothImage(image);
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
        
        formData.append("image_bucket", "clothes");
        formData.append("image_table", "clothes_images");
        
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

        navigation.replace(returnScreen);
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
            image_bucket: "clothes",
            image_table: "clothes_images",
            image_slug: selectedClothesImage.slug,
          }),
        }
      );
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete image");
      }

      navigation.replace(returnScreen);
    } catch (error) {
      Alert.alert("Error", "Failed to delete image. Please try again.");
    } finally {
      setDeleting(false);
    }
  };


  useEffect(() => {
    const loadImages = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }
      
      const { data: clothesImagesData, error: imageError } = await supabase
        .from("clothes_images")
        .select("*")
        .eq("profiles_id", profile.id)
        .order("created_at", { ascending: false });

      if (imageError) {
        setLoading(false);
        return;
      }
      
      if (clothesImagesData && clothesImagesData.length > 0) {
        updateSelectedImage(clothesImagesData[0]);
      }
      setClothesImages(clothesImagesData || []);
      setLoading(false);
    };

    loadImages();
  }, [profile]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color="black" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <View style={styles.container}>
        <Text style={styles.heading}>Clothing</Text>
        <Text style={styles.subheading}>For best results, use well-lit, front-facing photos</Text>

        {clothesImages.length > 0 ? (
          <>
            <View style={styles.selectedImageContainer}>
              <Image 
                source={{ uri: selectedClothesImage?.url }} 
                style={styles.selectedImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity style={styles.actionButton} onPress={handleUploadImage} disabled={uploading}>
                {uploading ? (
                  <ActivityIndicator size="small" color="#4052FF" />
                ) : (
                  <Feathericons name="upload" size={24} color="black" />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleDeleteImage}
                disabled={!selectedClothesImage || deleting}
              >
                {deleting ? (
                  <ActivityIndicator size="small" color="#FF0000" />
                ) : (
                  <Feathericons name="trash" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
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
                {uploading ? "Uploading..." : "Upload your clothes image here"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {clothesImages.length > 0 && (
        <>
          <Text style={styles.yourClothesHeading}>Your clothes</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {clothesImages.map((image, index) => (
              <TouchableOpacity 
                key={image.id || index} 
                style={styles.thumbnailContainer}
                onPress={() => handleImageSelect(image)}
              >
                <Image 
                  source={{ uri: image.url }}
                  style={styles.thumbnailImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}