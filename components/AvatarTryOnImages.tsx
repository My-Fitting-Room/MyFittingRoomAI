import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
  Alert,
  Animated,
  Platform,
} from "react-native";
import FastImage from "react-native-fast-image";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feathericons from "react-native-vector-icons/Feather";
import { Skeleton } from "./Skeleton";
import { styles } from "../stylesheets/avatarTryonImages";
import { triggerHaptic } from "../utils/haptics";

import { supabase } from "../App";

// On iPad the result box is wider than the tall portrait render, so `cover`
// crops the model's head/feet. Fit the whole image instead; phone keeps the
// edge-to-edge `cover` look it ships with.
const MODEL_RESIZE = Platform.isPad
  ? FastImage.resizeMode.contain
  : FastImage.resizeMode.cover;

// Neutral icon tone (iOS label) and the accent used for a saved look.
const ICON_COLOR = "#1C1C1E";
const FAVORITE_COLOR = "#FF4D6D";

// A floating circular control with a smooth press animation. Icons are
// centered; the button surface styling lives in the stylesheet.
function ActionButton({ children, onPress, disabled = false, style }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const animateTo = (toValue: number) =>
    Animated.spring(scale, {
      toValue,
      friction: 6,
      tension: 220,
      useNativeDriver: true,
    }).start();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onPressIn={() => animateTo(0.92)}
      onPressOut={() => animateTo(1)}
      disabled={disabled}
    >
      <Animated.View style={[styles.actionButton, style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

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
  const [failedVisible, setFailedVisible] = useState(false);
  const failedOpacity = useRef(new Animated.Value(0)).current;
  const heartPop = useRef(new Animated.Value(1)).current;

  // Show the error toast as a transient popup: fade in, hold 3s, fade out.
  // Keyed on the count so it only re-fires when the number of failures changes,
  // not on every 15s poll that re-sets the same failed rows.
  useEffect(() => {
    if (failedImages.length === 0) {
      return;
    }

    setFailedVisible(true);
    Animated.timing(failedOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(failedOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setFailedVisible(false));
    }, 3000);

    return () => clearTimeout(timer);
  }, [failedImages.length]);

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

  const visibleImages = tryonImages;
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

  const handleToggleFavorite = async () => {
    if (!currentImage) {
      return;
    }

    triggerHaptic();
    const nextValue = !currentImage.is_favorite;

    // A subtle pop so the toggle feels tactile
    heartPop.setValue(1);
    Animated.sequence([
      Animated.timing(heartPop, { toValue: 1.25, duration: 120, useNativeDriver: true }),
      Animated.spring(heartPop, { toValue: 1, friction: 4, tension: 220, useNativeDriver: true }),
    ]).start();

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

  // Confirm before the destructive action; red emphasis lives in the alert.
  const confirmDelete = () => {
    if (!currentImage || deleting) return;
    triggerHaptic();
    Alert.alert(
      "Delete try-on?",
      "This will permanently remove this look.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleDeleteImage },
      ]
    );
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

      // Drop the deleted look from local state instead of remounting the whole
      // Avatar screen — that full reload is what triggered the old loading
      // spinner. safeIndex re-clamps so the hero lands on a valid neighbour.
      setTryonImages(prev => prev.filter(img => img.id !== tryonImage.id));
    } catch (error) {
      Alert.alert("Error", "Failed to delete image. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const viewImage = (slug) => {
    Linking.openURL(`https://app.myfittingroom.ai/image/avatar_tryon_images/${slug}`);
  };

  if (loading) {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.carouselContainer}>
            {/* Hero result */}
            <View style={styles.imageContainer}>
              <Skeleton width="100%" height="100%" borderRadius={16} />
            </View>
            {/* view / favourite / delete */}
            <View style={styles.actionButtons}>
              {[0, 1, 2].map(i => (
                <Skeleton key={i} width={52} height={52} borderRadius={26} />
              ))}
            </View>
            {/* generation thumbnails */}
            <View style={styles.thumbGrid}>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <View key={i} style={styles.thumb}>
                  <Skeleton width="100%" height="100%" />
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
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

          {failedVisible && (
            <Animated.View style={[styles.sectionContainer, { opacity: failedOpacity }]}>
              <View style={styles.failedItem}>
                <View style={styles.failedIcon}>
                  <Ionicons name="close" size={14} color="#000" />
                </View>
                <Text style={styles.failedText} numberOfLines={1}>
                  Generation error, try to use a different item
                </Text>
              </View>
            </Animated.View>
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
                        resizeMode={MODEL_RESIZE}
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
                      resizeMode={MODEL_RESIZE}
                    />
                  </View>
                )}

              </View>

              <View style={styles.actionButtons}>
                <ActionButton onPress={() => viewImage(currentImage.slug)}>
                  <Feathericons name="eye" size={22} color={ICON_COLOR} />
                </ActionButton>

                <ActionButton
                  onPress={handleToggleFavorite}
                  style={currentImage.is_favorite && styles.actionButtonActive}
                >
                  <Animated.View style={{ transform: [{ scale: heartPop }] }}>
                    <Ionicons
                      name={currentImage.is_favorite ? "heart" : "heart-outline"}
                      size={22}
                      color={currentImage.is_favorite ? FAVORITE_COLOR : ICON_COLOR}
                    />
                  </Animated.View>
                </ActionButton>

                <ActionButton onPress={confirmDelete} disabled={deleting}>
                  {deleting ? (
                    <ActivityIndicator size="small" color="#8E8E93" />
                  ) : (
                    <Feathericons name="trash" size={22} color={ICON_COLOR} />
                  )}
                </ActionButton>
              </View>

              {/* Every generation as a tappable tile; the most recent leads
                  (rows are ordered newest-first). Tapping promotes a look to
                  the hero above. */}
              {visibleImages.length > 1 && (
                <View style={styles.thumbGrid}>
                  {visibleImages.map((image, index) => (
                    <TouchableOpacity
                      key={image.id}
                      activeOpacity={0.85}
                      style={[
                        styles.thumb,
                        index === safeIndex && styles.thumbActive,
                      ]}
                      onPress={() => {
                        triggerHaptic();
                        setCurrentImageIndex(index);
                      }}
                    >
                      <FastImage
                        source={{ uri: image.url, priority: FastImage.priority.normal }}
                        style={styles.thumbImage}
                        resizeMode={FastImage.resizeMode.contain}
                      />
                      {image.is_favorite && (
                        <View style={styles.thumbFavoriteBadge}>
                          <Ionicons name="heart" size={12} color={FAVORITE_COLOR} />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    );
  } else {
    return <></>;
  }
}
