import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Dimensions, 
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import FastImage from "react-native-fast-image";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feathericons from "react-native-vector-icons/Feather";
import { styles } from "../stylesheets/tryonImages";

import { supabase } from "../App";

const windowWidth = Dimensions.get("window").width;

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
  const [tryonImages, setTryonImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [failedImages, setFailedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    let currentTryonImages = [];
    let currentPendingImages = [];
    let currentFailedImages = [];
  
    const fetchImages = async () => {
      let tryonImagesData = await getImages(profile.id, "tryon_images");

      const failImages = tryonImagesData.filter(img => img.status === "failed");
      const succImages = tryonImagesData.filter(img => img.status === "success");
      const pendImages = tryonImagesData.filter(img => img.status === "pending");
  
      // if (succImages.length > currentTryonImages.length && currentTryonImages.length !== 0) {
      //   Alert.alert("Success", "Your virtual try on is ready!");
      // }
  
      if (failImages.length > currentFailedImages.length) {
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
    }, 20000);
  
    return () => clearInterval(interval); 
  }, [profile]);

  
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
              <Text style={styles.sectionHeading}>Failed Try On Images</Text>
              {failedImages.map((image, index) => (
                <View key={index} style={styles.failedItem}>
                  <Text style={styles.failedText}>Failed to generate image ID: {image.kling_task_id}</Text>
                </View>
              ))}
            </View>
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
    return <>gg</>;
  }

}

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: "#fff",
//     paddingTop: 20,
//     paddingHorizontal: 20,

//     marginTop: 15,
//     marginHorizontal:15,
    
//     elevation: 3,
   
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: "black",
//   },
//   sectionContainer: {
//     marginBottom: 24,
//   },
//   sectionHeading: {
//     fontSize: 18,
//     fontWeight: "500",
//     marginBottom: 8,
//     color: "#000",
//   },
//   sectionSubheading: {
//     fontSize: 14,
//     color: "#000",
//     marginBottom: 16,
//   },
//   pendingItem: {
//     padding: 16,
//   },
//   loadingBar: {
//     width: "100%",
//     height: 16,
//     backgroundColor: "#6666FF",
//     borderRadius: 8,
//     opacity: 0.7,
//   },
//   pendingText: {
//     fontSize: 14,
//     color: "#000",
//     marginTop: 8,
//   },
//   failedItem: {
//     padding: 16,
//     backgroundColor: "rgba(153, 27, 27, 0.2)",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#991B1B",
//   },
//   failedText: {
//     fontSize: 14,
//     color: "#EF4444",
//   },
//   carouselContainer: {
//     marginBottom: 24,
//   },
//   imageContainer: {
//     position: "relative",
//     borderRadius: 12,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   splitImageContainer: {
//     flexDirection: "row",
//     height: 400,
//   },
//   leftColumn: {
//     width: "33%",
//     height: "100%",
//   },
//   rightColumn: {
//     width: "67%",
//     height: "100%",
//   },
//   modelImage: {
//     width: "100%",
//     height: "50%",
//     borderTopLeftRadius: 12,
//   },
//   clothingImage: {
//     width: "100%",
//     height: "50%",
//     borderBottomLeftRadius: 12,
//   },
//   resultImage: {
//     width: "100%",
//     height: "100%",
//     borderTopRightRadius: 12,
//     borderBottomRightRadius: 12,
//   },
//   fullImageContainer: {
//     height: 400,
//   },
//   fullImage: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 12,
//   },
//   navArrow: {
//     position: "absolute",
//     top: "50%",
//     transform: [{ translateY: -25 }],
//     zIndex: 10,
//   },
//   leftArrow: {
//     left: 10,
//   },
//   rightArrow: {
//     right: 10,
//   },
//   arrowCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   imageCounter: {
//     alignItems: "center",
//     marginTop: 8,
//   },
//   counterText: {
//     fontSize: 14,
//     color: "#666",
//   },
//   actionButtons: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingTop: 16,
//     paddingHorizontal: 16,

    
//   },
//   viewIcon: {
//     marginRight: 32,
//   },
//   deleteIcon: {
//     marginLeft: 32,
//   },
// });
