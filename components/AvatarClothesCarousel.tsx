import { View, Text, TouchableOpacity, ActivityIndicator, Image, ScrollView, Animated } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import Feathericons from "react-native-vector-icons/Feather";
import { supabase } from "../App";
import { styles } from "../stylesheets/avatarClothesCarousel";

function ClothesTile({ image, selected, onPress }) {
  // 0 = resting, 1 = selected (lifted)
  const lift = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(lift, {
      toValue: selected ? 1 : 0,
      friction: 5,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  const scale = lift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });
  const restOpacity = lift.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const badgeScale = lift.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <TouchableOpacity style={styles.tileWrapper} onPress={onPress} activeOpacity={0.85}>
      <Animated.View style={[styles.tileScaler, { transform: [{ scale }] }]}>
        {/* shadow props can't animate on the native driver, so cross-fade
            a resting and a lifted shadow layer instead */}
        <Animated.View style={[styles.cardShadowRest, { opacity: restOpacity }]} />
        <Animated.View style={[styles.cardShadowLift, { opacity: lift }]} />
        <View style={styles.card}>
          <Image
            source={{ uri: image.url }}
            style={styles.tileImage}
            resizeMode="contain"
          />
        </View>
        <Animated.View style={[styles.badge, { opacity: lift, transform: [{ scale: badgeScale }] }]}>
          <Feathericons name="check" size={14} color="#fff" />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

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
      <Text style={styles.heading}>Your clothes</Text>
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
