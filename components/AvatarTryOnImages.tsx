import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import FastImage from "react-native-fast-image";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feathericons from "react-native-vector-icons/Feather";
import { styles } from "../stylesheets/avatarTryonImages";
import { triggerHaptic } from "../utils/haptics";

import { supabase } from "../App";


const getImages = async (profileId) => {
  // Multiple FKs point at clothes_images, so every embed needs a column
  // hint or PostgREST rejects the query as ambiguous
  const { data, error } = await supabase
    .from("avatar_tryon_images")
    .select("*, avatars(*), clothes_images!clothes_images_id(*), top_item:clothes_images!top_clothes_images_id(*), bottom_item:clothes_images!bottom_clothes_images_id(*), shoes_item:clothes_images!shoes_clothes_images_id(*)")
    .eq("profiles_id", profileId)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data || [];
};

export default function AvatarTryOnImages({ profile = null, navigation }) {
  const [tryonImages, setTryonImages] = useState<any[]>([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [failedImages, setFailedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // null until the first fetch seeds the baseline, so pre-existing
    // failed rows don't fire the alert on every remount
    let currentFailedImages: any[] | null = null;

    const fetchImages = async () => {
      let tryonImagesData = await getImages(profile.id);

      const failImages = tryonImagesData.filter(img => img.status === "failed");
      const succImages = tryonImagesData.filter(img => img.status === "success");
      const pendImages = tryonImagesData.filter(img => img.status === "pending");

      if (currentFailedImages !== null && failImages.length > currentFailedImages.length) {
        Alert.alert("Error", "Your avatar try on failed!");
      }

      setTryonImages(succImages || []);
      setPendingImages(pendImages || []);
      setFailedImages(failImages || []);

      currentFailedImages = failImages;
    };

    const loadImages = async () => {
      await fetchImages();
      setLoading(false);
    };

    loadImages();

    const interval = setInterval(() => {
      fetchImages();
    }, 15000);

    return () => clearInterval(interval);
  }, [profile]);

  const visibleImages = filter === "saved"
    ? tryonImages.filter(img => img.is_favorite)
    : tryonImages;
  const safeIndex = Math.min(currentImageIndex, Math.max(visibleImages.length - 1, 0));
  const currentImage = visibleImages[safeIndex];

  // The garments that went into this generation; legacy rows only carry the
  // single clothes_images relation
  const outfitItems = currentImage
    ? [currentImage.top_item, currentImage.bottom_item, currentImage.shoes_item].filter(Boolean)
    : [];

  if (outfitItems.length === 0 && currentImage?.clothes_images) {
    outfitItems.push(currentImage.clothes_images);
  }

  const handleFilterChange = (nextFilter) => {
    triggerHaptic();
    setFilter(nextFilter);
    setCurrentImageIndex(0);
  };

  const handleToggleFavorite = async () => {
    if (!currentImage) {
      return;
    }

    triggerHaptic();
    const nextValue = !currentImage.is_favorite;

    // Optimistic flip; the 15s poll re-syncs with server truth either way
    setTryonImages(prevImages => prevImages.map(img =>
      img.id === currentImage.id ? { ...img, is_favorite: nextValue } : img
    ));

    const { error } = await supabase
      .from("avatar_tryon_images")
      .update({ is_favorite: nextValue })
      .eq("id", currentImage.id);

    if (error) {
      setTryonImages(prevImages => prevImages.map(img =>
        img.id === currentImage.id ? { ...img, is_favorite: !nextValue } : img
      ));
      console.error("Toggle favorite error:", error);
      Alert.alert("Error", "Failed to update saved looks. Please try again.");
    }
  };

  const handleDeleteImage = async () => {
    let tryonImage = currentImage;

    try {
      setDeleting(true);
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        Alert.alert("Error", "Failed to delete image. Please try again.");
        return;
      }

      if (!session) {
        Alert.alert("Error", "Failed to delete image. Please try again.");
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
            image_bucket: "avatar_tryon",
            image_table: "avatar_tryon_images",
            image_slug: tryonImage.slug,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete image");
      }

      navigation.replace("Avatar");
    } catch (error) {
      Alert.alert("Error", "Failed to delete image. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const viewImage = (slug) => {
    Linking.openURL(`https://app.myfittingroom.ai/image/avatar_tryon_images/${slug}`);
  };

  const goToPrevious = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex > 0 ? prevIndex - 1 : visibleImages.length - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex < visibleImages.length - 1 ? prevIndex + 1 : 0
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color="black" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if(failedImages.length > 0 || pendingImages.length > 0 || tryonImages.length > 0) {

    return (
      <ScrollView>
        <View style={styles.container}>
          {pendingImages.length > 0 && (
            <View style={styles.sectionContainer}>

              {pendingImages.map((image, index) => (
                <View key={index} style={styles.pendingItem}>
                  <View style={styles.loadingBar}></View>
                  <Text style={styles.pendingText}>Generating Image....</Text>
                </View>
              ))}
            </View>
          )}

          {failedImages.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeading}>Failed Avatar Try On Images</Text>
              {failedImages.map((image, index) => (
                <View key={index} style={styles.failedItem}>
                  <Text style={styles.failedText}>Failed to generate image ID: {image.task_id}</Text>
                </View>
              ))}
            </View>
          )}

          {tryonImages.length > 0 && (
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[styles.filterChip, filter === "all" && styles.filterChipActive]}
                onPress={() => handleFilterChange("all")}
              >
                <Text style={[styles.filterChipText, filter === "all" && styles.filterChipTextActive]}>
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.filterChip, filter === "saved" && styles.filterChipActive]}
                onPress={() => handleFilterChange("saved")}
              >
                <Text style={[styles.filterChipText, filter === "saved" && styles.filterChipTextActive]}>
                  Saved
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {tryonImages.length > 0 && visibleImages.length === 0 && (
            <Text style={styles.savedEmptyText}>
              No saved looks yet — tap the heart on a try-on to save it.
            </Text>
          )}

          {visibleImages.length > 0 && (
            <View style={styles.carouselContainer}>
              <View style={styles.imageContainer}>
                {outfitItems.length > 0 ? (
                  <View style={styles.splitImageContainer}>
                    {/* The outfit that went into the generation — the plain
                        avatar is deliberately not shown */}
                    <View style={styles.leftColumn}>
                      {outfitItems.map((item) => (
                        <FastImage
                          key={item.id}
                          source={{
                            uri: item.url,
                            priority: FastImage.priority.normal
                          }}
                          style={styles.clothingImage}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      ))}
                    </View>
                    <View style={styles.rightColumn}>
                      <FastImage
                        source={{
                          uri: currentImage.url,
                          priority: FastImage.priority.high
                        }}
                        style={styles.resultImage}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={styles.fullImageContainer}>
                    <FastImage
                      source={{
                        uri: currentImage.url,
                        priority: FastImage.priority.high
                      }}
                      style={styles.fullImage}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                )}

                {visibleImages.length > 1 && (
                  <>
                    <TouchableOpacity
                      style={[styles.navArrow, styles.leftArrow]}
                      onPress={goToPrevious}
                    >
                      <View style={styles.arrowCircle}>
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.navArrow, styles.rightArrow]}
                      onPress={goToNext}
                    >
                      <View style={styles.arrowCircle}>
                        <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <View style={styles.imageCounter}>
                <Text style={styles.counterText}>
                  {safeIndex + 1} / {visibleImages.length}
                </Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => viewImage(currentImage.slug)}>
                  <Feathericons name="eye" size={24} color="#000" style={styles.viewIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggleFavorite()}>
                  <Ionicons
                    name={currentImage.is_favorite ? "heart" : "heart-outline"}
                    size={24}
                    color="#000"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteImage()} disabled={deleting}>
                  {deleting ? (
                    <ActivityIndicator size="small" color="#FF0000" />
                  ) : (
                    <Feathericons name="trash" size={24} color="#000" style={styles.deleteIcon} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  } else {
    return <></>;
  }
}
