import { View, Text,  TouchableOpacity, ActivityIndicator, Image, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../App";
import { launchImageLibrary } from "react-native-image-picker";
import Feathericons from "react-native-vector-icons/Feather";
import { styles } from "../stylesheets/modelImages";

export default function ModelImages({ profile = null, setInputModelImage, navigation }) {
  const [modelImages, setModelImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedModelImage, setSelectedModelImage] = useState(null);
  
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
        <Text style={styles.heading}>Model</Text>
        <Text style={styles.subheading}>For best results, use well-lit, front-facing photos</Text>

        {modelImages.length > 0 ? (
          <>
            <View style={styles.selectedImageContainer}>
              <Image 
                source={{ uri: selectedModelImage?.url }} 
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
                disabled={!selectedModelImage || deleting}
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
                {uploading ? "Uploading..." : "Upload your model image here"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {modelImages.length > 0 && (
        <>
          <Text style={styles.yourModelsHeading}>Your models</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {modelImages.map((image, index) => (
              <TouchableOpacity 
                key={image.id || index} 
                style={[
                  styles.thumbnailContainer,
                  selectedModelImage?.id === image.id && styles.selectedThumbnail
                ]}
                onPress={() => handleImageSelect(image)}
              >
                <Image 
                  source={{ uri: image.url }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}
