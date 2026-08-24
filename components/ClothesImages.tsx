import { View, Text, TouchableOpacity, ActivityIndicator, Image, Alert, ScrollView, Platform, StyleSheet } from "react-native";
import Feathericons from "react-native-vector-icons/Feather";
import React, { useEffect, useState } from "react";
import { supabase } from "../App";
import { launchImageLibrary } from "react-native-image-picker";
import ClothesTile from "./ClothesTile";
import { GlassEffectView } from "react-native-glass-effect-view";
import SectionHeader from "./SectionHeader";
import ImagePickerSkeleton from "./ImagePickerSkeleton";
import { styles } from "../stylesheets/clothesImages";

const IS_IOS26 = Platform.OS === "ios" && parseInt(Platform.Version as string, 10) >= 26;

export default function ClothesImages({ profile = null, setInputClothImage, navigation, returnScreen = "TryOn" }) {
  const [clothesImages, setClothesImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedClothesImage, setSelectedClothesImage] = useState<any>(null);
  
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

        // Refresh the list in place and select the new upload instead of
        // remounting the screen (the remount is what showed the old loading
        // spinner). A single upload can create several rows (outfit
        // categories) and the endpoint only returns image_url, so re-fetch.
        if (profile) {
          const { data: refreshed } = await supabase
            .from("clothes_images")
            .select("*")
            .eq("profiles_id", profile.id)
            .order("created_at", { ascending: false });

          setClothesImages(refreshed || []);
          if (refreshed && refreshed.length > 0) {
            updateSelectedImage(refreshed[0]);
          }
        }
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

      // Remove locally and re-select the next item instead of remounting the
      // screen (the remount is what showed the old loading spinner).
      // updateSelectedImage keeps the parent's input clothing in sync.
      const remaining = clothesImages.filter(img => img.id !== selectedClothesImage.id);
      setClothesImages(remaining);
      updateSelectedImage(remaining[0] || null);
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
    return <ImagePickerSkeleton styles={styles} />;
  }

  return (
    <View style={styles.rootContainer}>
      <View style={[styles.container, IS_IOS26 && styles.containerGlass]}>
        {IS_IOS26 && <GlassEffectView style={StyleSheet.absoluteFillObject} pointerEvents="none" />}
        <SectionHeader
          title="Clothing"
          subtitle="For best results, use well-lit, front-facing photos"
          inset={false}
        />

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
          <SectionHeader title="Your clothes" />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {clothesImages.map((image, index) => (
              <ClothesTile
                key={image.id || index}
                image={image}
                selected={selectedClothesImage?.id === image.id}
                onPress={() => handleImageSelect(image)}
              />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}