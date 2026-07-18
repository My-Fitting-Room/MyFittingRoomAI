import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../App";
import ClothesTile from "./ClothesTile";
import SectionHeader from "./SectionHeader";
import { styles } from "../stylesheets/avatarClothesCarousel";

export default function AvatarClothesCarousel({ profile = null, setInputClothImage }) {
  const [clothesImages, setClothesImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClothesImage, setSelectedClothesImage] = useState(null);

  const updateSelectedImage = (image) => {
    setSelectedClothesImage(image);
    setInputClothImage(image);
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
        <ActivityIndicator size="small" color="black" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionHeader title="Your clothes" />
      {clothesImages.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {clothesImages.map((image, index) => (
            <ClothesTile
              key={image.id || index}
              image={image}
              selected={selectedClothesImage?.id === image.id}
              onPress={() => updateSelectedImage(image)}
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.hintText}>No clothes yet — upload some on the Try-On tab</Text>
      )}
    </View>
  );
}
