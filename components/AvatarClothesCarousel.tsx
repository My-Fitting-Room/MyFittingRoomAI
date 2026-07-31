import { View, Text, ActivityIndicator, ScrollView, Alert } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { launchImageLibrary } from "react-native-image-picker";
import { supabase } from "../App";
import ClothesTile from "./ClothesTile";
import AddClothesTile from "./AddClothesTile";
import SectionHeader from "./SectionHeader";
import { styles } from "../stylesheets/avatarClothesCarousel";

const CATEGORY_SECTIONS = [
  { key: "top",    title: "Tops" },
  { key: "bottom", title: "Bottoms" },
  { key: "shoes",  title: "Shoes" },
];

const CATEGORY_LABEL: Record<string, string> = {
  top:    "Tops",
  bottom: "Bottoms",
  shoes:  "Shoes",
};

export default function AvatarClothesCarousel({ profile = null, setSelectedOutfit }) {
  const [clothesImages, setClothesImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState({});
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);

  const toggleItem = (image) => {
    const category = image.category || "top";
    const next = { ...selection };
    if (next[category]?.id === image.id) {
      delete next[category];
    } else {
      next[category] = image;
    }
    setSelection(next);
    setSelectedOutfit(next);
  };

  const fetchImages = useCallback(async () => {
    if (!profile) return [];
    const { data, error } = await supabase
      .from("clothes_images")
      .select("*")
      .eq("profiles_id", profile.id)
      .order("created_at", { ascending: false });
    if (error) return [];
    return data || [];
  }, [profile]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchImages();
      setClothesImages(data);
      setLoading(false);
    };
    load();
  }, [fetchImages]);

  const handleUploadForCategory = async (targetCategory: string) => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        Alert.alert("Error", "Please log in to upload images.");
        return;
      }

      const result = await launchImageLibrary({
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.8,
      });

      if (result.didCancel || result.errorCode || !result.assets?.length) return;

      setUploadingCategory(targetCategory);

      const existingIds = new Set(clothesImages.map((img) => img.id));

      const selectedImage = result.assets[0];
      const formData = new FormData();
      formData.append("file", {
        uri: selectedImage.uri,
        type: selectedImage.type || "image/jpeg",
        name: selectedImage.fileName || "image.jpg",
      } as any);
      formData.append("image_bucket", "clothes");
      formData.append("image_table", "clothes_images");

      const response = await fetch(
        "https://my-fitting-room-server.onrender.com/api/image/upload",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: formData,
        }
      );

      if (!response.ok) {
        Alert.alert("Error", "Failed to upload image. Please try again.");
        return;
      }

      // Re-fetch to get the server-assigned categories
      const newList = await fetchImages();
      setClothesImages(newList);

      // Detect mismatch between where user tapped and what AI detected
      const newItems = newList.filter((img) => !existingIds.has(img.id));
      const movedItem = newItems.find(
        (img) => (img.category || "top") !== targetCategory
      );

      if (movedItem) {
        const detectedLabel = CATEGORY_LABEL[movedItem.category || "top"] ?? movedItem.category;
        const intendedLabel = CATEGORY_LABEL[targetCategory] ?? targetCategory;
        Alert.alert(
          "Item moved",
          `We detected this as a ${detectedLabel.slice(0, -1).toLowerCase()} and moved it from ${intendedLabel} to ${detectedLabel}.`
        );
      }
    } catch {
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setUploadingCategory(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {CATEGORY_SECTIONS.map(({ key, title }) => {
        const sectionImages = clothesImages.filter(
          (image) => (image.category || "top") === key
        );

        return (
          <View key={key}>
            <SectionHeader title={title} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
            >
              <AddClothesTile
                uploading={uploadingCategory === key}
                onPress={() => handleUploadForCategory(key)}
              />
              {sectionImages.map((image, index) => (
                <ClothesTile
                  key={image.id || index}
                  image={image}
                  selected={selection[key]?.id === image.id}
                  onPress={() => toggleItem(image)}
                />
              ))}
            </ScrollView>
          </View>
        );
      })}
    </View>
  );
}
