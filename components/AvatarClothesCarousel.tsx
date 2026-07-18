import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../App";
import ClothesTile from "./ClothesTile";
import SectionHeader from "./SectionHeader";
import { styles } from "../stylesheets/avatarClothesCarousel";

const CATEGORY_SECTIONS = [
  { key: "top", title: "Tops" },
  { key: "bottom", title: "Bottoms" },
  { key: "shoes", title: "Shoes" },
];

export default function AvatarClothesCarousel({ profile = null, setSelectedOutfit }) {
  const [clothesImages, setClothesImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState({});

  // One selected item per category; tapping the selected tile deselects it,
  // so any subset of categories can compose the try-on
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
      {clothesImages.length > 0 ? (
        CATEGORY_SECTIONS.map(({ key, title }) => {
          const sectionImages = clothesImages.filter(
            (image) => (image.category || "top") === key
          );

          if (sectionImages.length === 0) {
            return null;
          }

          return (
            <View key={key}>
              <SectionHeader title={title} />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
              >
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
        })
      ) : (
        <>
          <SectionHeader title="Your clothes" />
          <Text style={styles.hintText}>No clothes yet — upload some on the Try-On tab</Text>
        </>
      )}
    </View>
  );
}
