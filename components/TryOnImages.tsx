import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Linking,
  Alert,
  Platform,
  StyleSheet,
  Animated,
} from "react-native";
import FastImage from "react-native-fast-image";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feathericons from "react-native-vector-icons/Feather";
import { GlassEffectView } from "react-native-glass-effect-view";
import { styles } from "../stylesheets/tryonImages";
import { triggerHaptic } from "../utils/haptics";

import { supabase } from "../App";

const IS_IOS26 = Platform.OS === "ios" && parseInt(Platform.Version as string, 10) >= 26;


const getImages = async (profileId, table) => {
  const { data, error } = await supabase
    .from(table)
    .select("*, model_images(*), clothes_images(*)")
    .eq("profiles_id", profileId)
    .order("created_at", { ascending: false });
  
  if (error) {
    return [];
  }
  
  return data || [];
};

export default function TryOnImages({ profile = null, navigation }) {
  const [tryonImages, setTryonImages] = useState<any[]>([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [failedImages, setFailedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedVisible, setFailedVisible] = useState(false);
  const failedOpacity = useRef(new Animated.Value(0)).current;

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
    let currentTryonImages = [];
    let currentPendingImages = [];
    // null until the first fetch seeds the baseline, so pre-existing
    // failed rows don't fire the alert on every remount
    let currentFailedImages: any[] | null = null;
  
    const fetchImages = async () => {
      let tryonImagesData = await getImages(profile.id, "tryon_images");

      const failImages = tryonImagesData.filter(img => img.status === "failed");
      const succImages = tryonImagesData.filter(img => img.status === "success");
      const pendImages = tryonImagesData.filter(img => img.status === "pending");
  
      if (currentFailedImages !== null && failImages.length > currentFailedImages.length) {
        Alert.alert("Error", "Your virtual try on failed!");
      }
  
      setTryonImages(succImages || []);
      setPendingImages(pendImages || []);
      setFailedImages(failImages || []);
  
      currentTryonImages = succImages;
      currentPendingImages = pendImages;
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

  
  const handleToggleFavorite = async () => {
    const currentImage = tryonImages[currentImageIndex];

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
      .from("tryon_images")
      .update({ is_favorite: nextValue })
      .eq("id", currentImage.id);

    if (error) {
      setTryonImages(prevImages => prevImages.map(img =>
        img.id === currentImage.id ? { ...img, is_favorite: !nextValue } : img
      ));
      Alert.alert("Error", "Failed to update saved looks. Please try again.");
    }
  };

  const handleDeleteImage = async () => {
    let tryonImage =  tryonImages[currentImageIndex]

    try {
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
            image_bucket: "tryon",
            image_table: "tryon_images",
            image_slug: tryonImage.slug,
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
    }
  };

  const viewImage = (slug) => {
    Linking.openURL(`https://app.myfittingroom.ai/image/tryon_images/${slug}`);

  };

  const goToPrevious = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex > 0 ? prevIndex - 1 : tryonImages.length - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(prevIndex => 
      prevIndex < tryonImages.length - 1 ? prevIndex + 1 : 0
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
        <View style={[styles.container, IS_IOS26 && styles.containerGlass]}>
          {IS_IOS26 && <GlassEffectView style={StyleSheet.absoluteFillObject} pointerEvents="none" />}
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
  
          {tryonImages.length > 0 && (
            <View style={styles.carouselContainer}>
              <View style={styles.imageContainer}>
                {(tryonImages[currentImageIndex].clothes_images !== null && tryonImages[currentImageIndex].model_images !== null) ? (
                  <View style={styles.splitImageContainer}>
                    <View style={styles.leftColumn}>
                      <FastImage
                        source={{ 
                          uri: tryonImages[currentImageIndex].model_images.url,
                          priority: FastImage.priority.normal
                        }}
                        style={styles.modelImage}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                      <FastImage
                        source={{ 
                          uri: tryonImages[currentImageIndex].clothes_images.url,
                          priority: FastImage.priority.normal
                        }}
                        style={styles.clothingImage}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                    </View>
                    <View style={styles.rightColumn}>
                      <FastImage
                        source={{ 
                          uri: tryonImages[currentImageIndex].url,
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
                        uri: tryonImages[currentImageIndex].url,
                        priority: FastImage.priority.high
                      }}
                      style={styles.fullImage}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  </View>
                )}
  
                {tryonImages.length > 1 && (
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
                  {currentImageIndex + 1} / {tryonImages.length}
                </Text>
              </View>
  
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => viewImage(tryonImages[currentImageIndex].slug)}>
                  <Feathericons name="eye" size={24} color="#000" style={styles.viewIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleToggleFavorite()}>
                  <Ionicons
                    name={tryonImages[currentImageIndex].is_favorite ? "heart" : "heart-outline"}
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