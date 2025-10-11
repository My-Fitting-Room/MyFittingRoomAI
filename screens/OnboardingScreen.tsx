import { View, TouchableOpacity, Text, Alert, Image, Pressable, ActivityIndicator, Dimensions } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { FONTS } from "../constants/fonts";
import { supabase } from "../App";
import InAppReview from "react-native-in-app-review";
import { getStyles } from "../stylesheets/onboardingScreen";
import mixpanel from "../utils/mixpanel";
import { launchImageLibrary } from "react-native-image-picker";
import Feathericons from "react-native-vector-icons/Feather";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { trackTikTokPurchase } from "../utils/tiktok";
import { trackSingularPurchase } from "../utils/singular";
import Video from "react-native-video";

export default function OnboardingScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [processingTryOn, setProcessingTryOn] = useState(false);
  const [profile, setProfile] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadingModel, setUploadingModel] = useState(false);
  const [uploadingClothes, setUploadingClothes] = useState(false);
  const [modelImage, setModelImage] = useState(null);
  const [clothesImage, setClothesImage] = useState(null);
  const hasCompleted = useRef(false);

  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width, height);

  const updateOnboardingStep = async (step) => {
    if (!profile?.id) return;
    
    try {
      await supabase
        .from("profiles")
        .update({ onboarding_wizard_step: step })
        .eq("id", profile.id);
    } catch (error) {
      console.error("Error updating onboarding step:", error);
    }
  };

  const completeOnboarding = async () => {
    try {
      if (!profile?.id) {
        Alert.alert("Error", "Please try again later!", [{ text: "OK" }]);
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          onboarding_complete: true,
          onboarding_wizard_step: 5
        })
        .eq("id", profile.id);

      if (updateError) {
        Alert.alert("Error", "Please Try Again Later!", [{ text: "OK" }]);
        return;
      }

      hasCompleted.current = true;
      mixpanel.track('Onboarding Completed');
    } catch (error) {
      Alert.alert("Error", error.message, [{ text: "OK" }]);
    }
  };

  const handleTryOnAfterPaywall = async () => {
    if (!modelImage || !clothesImage || !modelImage.slug || !clothesImage.slug) {
      Alert.alert("Error", "Please select both model and clothing images");
      return;
    }

    setProcessingTryOn(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.access_token) {
        Alert.alert("Error", "Authentication required");
        setProcessingTryOn(false);
        return;
      }

      const requestBody = {
        model_image_slug: modelImage.slug,
        clothes_image_slug: clothesImage.slug
      };

      const response = await fetch("https://my-fitting-room-server.onrender.com/api/kling/try-on", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error("Failed to process try-on request");
      }

      const result = await response.json();
      
      await completeOnboarding();
      navigation.replace("TryOn");
      
    } catch (error) {
      Alert.alert("Try-on Failed", "Failed to process your request. Please try again later.");
    } finally {
      setProcessingTryOn(false);
    }
  };

  const handleRateAndContinue = async () => {
    if (InAppReview.isAvailable()) {
      InAppReview.RequestInAppReview()
        .then(() => {
          goToNextStep();
        })
        .catch(() => {
          goToNextStep();
        });
    } else {
      goToNextStep();
    }
  };

  const goToNextStep = async () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    await updateOnboardingStep(nextStep);
  };

  const handleUploadModelImage = async () => {
    try {
      setUploadingModel(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        Alert.alert("Error", "Authentication required. Please log in again.");
        setUploadingModel(false);
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
        setUploadingModel(false);
        return;
      }
      
      if (result.errorCode) {
        Alert.alert("Error", `Image picker error: ${result.errorMessage}`);
        setUploadingModel(false);
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
        
        const { data: modelImageRecord, error: fetchError } = await supabase
          .from("model_images")
          .select("*")
          .eq("profiles_id", profile.id)
          .eq("url", responseData.image_url)
          .single();
        
        if (fetchError || !modelImageRecord) {
          throw new Error("Failed to fetch uploaded image record");
        }
        
        setModelImage(modelImageRecord);
        mixpanel.track('Onboarding Model Image Uploaded');
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setUploadingModel(false);
    }
  };

  const handleUploadClothesImage = async () => {
    try {
      setUploadingClothes(true);
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        Alert.alert("Error", "Authentication required. Please log in again.");
        setUploadingClothes(false);
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
        setUploadingClothes(false);
        return;
      }
      
      if (result.errorCode) {
        Alert.alert("Error", `Image picker error: ${result.errorMessage}`);
        setUploadingClothes(false);
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
        
        const { data: clothesImageRecord, error: fetchError } = await supabase
          .from("clothes_images")
          .select("*")
          .eq("profiles_id", profile.id)
          .eq("url", responseData.image_url)
          .single();
        
        if (fetchError || !clothesImageRecord) {
          throw new Error("Failed to fetch uploaded image record");
        }
        
        setClothesImage(clothesImageRecord);
        mixpanel.track('Onboarding Clothes Image Uploaded');
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload image. Please try again.");
    } finally {
      setUploadingClothes(false);
    }
  };

  const handleUnlockPhoto = async () => {
    try {
      const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "Unlimited"
      });

      mixpanel.track("Paywall Displayed On Onboarding Unlock");
      
      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          await trackTikTokPurchase();
          await trackSingularPurchase();
          mixpanel.track("Paywall CTA Clicked On Onboarding");
          await handleTryOnAfterPaywall();
          break;
        case PAYWALL_RESULT.NOT_PRESENTED:
          await handleTryOnAfterPaywall();
          break;
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          await completeOnboarding();
          navigation.navigate("TryOn");
          break;
      }
    } catch (error) {
      console.error("Error presenting paywall:", error);
      await completeOnboarding();
      navigation.navigate("TryOn");
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigation.navigate("First");
          return;
        }

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session?.user?.id)
          .single();

        if (error) {
          Alert.alert("Error", "Please Try Again Later!", [{ text: "OK" }]);
          return;
        }

        if (profileData.onboarding_complete === true) {
          navigation.navigate("TryOn");
          return;
        }

        setProfile(profileData);
        
        const { data: latestModelImage } = await supabase
          .from("model_images")
          .select("*")
          .eq("profiles_id", profileData.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        
        if (latestModelImage) {
          setModelImage(latestModelImage);
        }
        
        const { data: latestClothesImage } = await supabase
          .from("clothes_images")
          .select("*")
          .eq("profiles_id", profileData.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        
        if (latestClothesImage) {
          setClothesImage(latestClothesImage);
        }
        
        setCurrentStep(profileData.onboarding_wizard_step || 0);
        setLoading(false);

        mixpanel.track('Onboarding Screen Viewed');

      } catch (error) {
        navigation.navigate("First");
      }
    };

    checkSession();
  }, [supabase]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size={"large"} color="black" />
        <Text 
          className="mt-3 text-2xl text-black"
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  // Step 0: Simple 2 step process
  if (currentStep === 0) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-1">
          <View className={styles.container}>
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step0MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Simple 2 step process
              </Text>
              <Text 
                className={styles.step0SubHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Upload Photo of You, Clothes & Try-On!
              </Text>
              <View className={styles.step0ImageView}>
                <Image 
                  source={require("../assets/step1.png")} 
                  className={styles.step0Image}
                  resizeMode="contain"
                />
              </View>
            </View>
          </View>
          <View className={styles.step0ButtonsGroup}>
            <Pressable 
              className={styles.selectButton}
              onPress={goToNextStep}
            >
              <Text 
                className={styles.continueButtonText}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Upload photo of yourself
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Step 1: Review Prompt
  if (currentStep === 1) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-1">
          <View className={styles.container}>
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step1MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Please give us a rating
              </Text>
              <Text 
                className={styles.step1SubHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Your feedback helps us improve!
              </Text>
              <Image source={require("../assets/review.png")} className={styles.reviewImage} />
            </View>
          </View>
          <View className={styles.step1ButtonsGroup}>
            <Pressable 
              className={styles.selectButton}
              onPress={handleRateAndContinue}
            >
              <Text 
                className={styles.continueButtonText}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Rate & Continue
              </Text>
            </Pressable>
            <Pressable 
              className={styles.selectButton}
              onPress={goToNextStep}
            >
              <Text 
                className={styles.continueButtonText}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Step 2: Upload Model Image
  if (currentStep === 2) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-1">
          <View className={styles.container}>
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step2MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Upload a full body photo of yourself
              </Text>
              <Text 
                className={styles.step2SubHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Use a photo taken by someone else in good lighting.
              </Text>
              
              <View className="flex-row mt-8 px-4  gap-x-2 justify-between items-center">
                <TouchableOpacity 
                  onPress={handleUploadModelImage}
                  disabled={uploadingModel}
                >
                  <Image 
                    source={modelImage ? { uri: modelImage.url } : require("../assets/step3.png")} 
                    className={styles.uploadedImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <TouchableOpacity 
                  className={styles.uploadPlaceholder}
                  onPress={handleUploadModelImage}
                  disabled={uploadingModel}
                >
                  {uploadingModel ? (
                    <ActivityIndicator size="large" color="black" />
                  ) : (
                    <View className="items-center">
                      <Feathericons name="upload-cloud" size={48} color="black" />
                      <Text 
                        className="mt-4 text-base text-center px-4"
                        style={{ fontFamily: FONTS.SATOSHI }}
                      >
                        Upload here
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className={styles.step2ButtonsGroup}>
            <Pressable 
              className={styles.selectButton}
              onPress={goToNextStep}
              disabled={!modelImage}
              style={{ opacity: !modelImage ? 0.5 : 1 }}
            >
              <Text 
                className={styles.continueButtonText}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Step 3: Upload Clothes Image
  if (currentStep === 3) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-1">
          <View className={styles.container}>
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step3MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Upload a photo of clothing
              </Text>
              <Text 
                className={styles.step3SubHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Use a photo of clothing with good lighting.
              </Text>
              
              <View className="flex-row mt-8 px-4  gap-x-2 justify-between items-center">
                <TouchableOpacity 
                  onPress={handleUploadClothesImage}
                  disabled={uploadingClothes}
                >
                  <Image 
                    source={clothesImage ? { uri: clothesImage.url } : require("../assets/step4.png")} 
                    className={styles.uploadedImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>

                <TouchableOpacity 
                  className={styles.uploadPlaceholder}
                  onPress={handleUploadClothesImage}
                  disabled={uploadingClothes}
                >
                  {uploadingClothes ? (
                    <ActivityIndicator size="large" color="black" />
                  ) : (
                    <View className="items-center">
                      <Feathericons name="upload-cloud" size={48} color="black" />
                      <Text 
                        className="mt-4 text-base text-center px-4"
                        style={{ fontFamily: FONTS.SATOSHI }}
                      >
                        Upload here
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View className={styles.step3ButtonsGroup}>
            <Pressable 
              className={styles.selectButton}
              onPress={goToNextStep}
              disabled={!clothesImage}
              style={{ opacity: !clothesImage ? 0.5 : 1 }}
            >
              <Text 
                className={styles.continueButtonText}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Step 4: Unlock Photo (Blurred Preview + Paywall)
  if (currentStep === 4) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-1">
          <View className={styles.container}>
            <View className={styles.stepContainer}>
              <View className={styles.checkmarkContainer}>
                <Video
                  source={require("../assets/black_check_mark_animation.mp4")}
                  style={{ width: 160, height: 160 }}
                  resizeMode="contain"
                  repeat={true}
                  muted={true}
                />
              </View>
              <Text 
                className={styles.step4MainHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Your uploads are good time to generate your try-on!
              </Text>
            </View>
          </View>
          <View className={styles.step4ButtonsGroup}>
            <Pressable 
              className={styles.selectButton}
              onPress={handleUnlockPhoto}
              disabled={processingTryOn}
            >
              {processingTryOn ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text 
                  className={styles.continueButtonText}
                  style={{ fontFamily: FONTS.SATOSHI }}
                >
                  Try-On
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return null;
}