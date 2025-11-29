import { View, TouchableOpacity, Text, Alert, Image, Pressable, ActivityIndicator, Dimensions, TextInput, ScrollView, Vibration, Keyboard, Platform, Animated } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONTS } from "../constants/fonts";
import { supabase } from "../App";
import InAppReview from "react-native-in-app-review";
import { getStyles } from "../stylesheets/onboardingScreen";
import mixpanel from "../utils/mixpanel";
import { launchImageLibrary } from "react-native-image-picker";
import Feathericons from "react-native-vector-icons/Feather";
import Purchases from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { trackTikTokPurchase } from "../utils/tiktok";
import { trackSingularPurchase } from "../utils/singular";
import Video from "react-native-video";

const STYLE_OPTIONS = [
  "Y2k", "Streetwear", "Preppy", "Boho", "Minimalist", "Vintage",
  "Chic", "Casual", "Sporty", "Punk", "Corporate", "Grunge",
  "Futuristic", "Thrifted", "Retro", "Maximalist", "Clean girl", "Coquette",
  "Edgy", "Tomboy", "Trendy", "Elegant", "Old Money", "Flashy"
];

export default function OnboardingScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadingModel, setUploadingModel] = useState(false);
  const [modelImage, setModelImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [selectedStyles, setSelectedStyles] = useState([]);

  const hasCompleted = useRef(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width, height);
  const insets = useSafeAreaInsets();

  const STYLE_COLORS = {
    "Y2k": "#FF69B4",
    "Streetwear": "#4ECDC4",
    "Preppy": "#FFE66D",
    "Boho": "#F4A460",
    "Minimalist": "#B8E0D2",
    "Vintage": "#EAB8E4",
    "Chic": "#FFB6C1",
    "Casual": "#87CEEB",
    "Sporty": "#98D8C8",
    "Punk": "#FF6B9D",
    "Corporate": "#9DD1F1",
    "Grunge": "#C9ADA7",
    "Futuristic": "#A0E7E5",
    "Thrifted": "#F7DC6F",
    "Retro": "#FFA07A",
    "Maximalist": "#DDA0DD",
    "Clean girl": "#E0BBE4",
    "Coquette": "#FFDEE9",
    "Edgy": "#D4A5A5",
    "Tomboy": "#95E1D3",
    "Trendy": "#FFC8DD",
    "Elegant": "#E8C5E5",
    "Old Money": "#C2E9FB",
    "Flashy": "#FFD93D"
};

  const totalSteps = 6;



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
          onboarding_wizard_step: 7
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

  const handlePaywall = async () => {
    
    try {
      const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "Unlimited"
      });

      mixpanel.track("Paywall Displayed On Onboarding");
      
      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          await trackTikTokPurchase();
          await trackSingularPurchase();
          mixpanel.track("Paywall CTA Clicked On Onboarding");
          await completeOnboarding();
          navigation.replace("TryOn");
          break;
        case PAYWALL_RESULT.NOT_PRESENTED:
          await completeOnboarding();
          navigation.replace("TryOn");
          break;
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          mixpanel.track("Primary Paywall Dismissed On Onboarding");
          await handleDiscountedPaywall();
          break;
      }
    } catch (error) {
      console.error("Error presenting paywall:", error);
      await completeOnboarding();
      navigation.navigate("TryOn");
    }
  };

  const handleDiscountedPaywall = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      
      if (offerings.all["Discounted Offering"]) {
        const paywallResult = await RevenueCatUI.presentPaywall({
          offering: offerings.all["Discounted Offering"]
        });

        mixpanel.track("Discounted Paywall Displayed On Onboarding");
        
        switch (paywallResult) {
          case PAYWALL_RESULT.PURCHASED:
          case PAYWALL_RESULT.RESTORED:
            await trackTikTokPurchase();
            await trackSingularPurchase();
            mixpanel.track("Discounted Paywall CTA Clicked On Onboarding");
            await completeOnboarding();
            navigation.replace("TryOn");
            break;
          case PAYWALL_RESULT.NOT_PRESENTED:
          case PAYWALL_RESULT.ERROR:
          case PAYWALL_RESULT.CANCELLED:
            mixpanel.track("Both Paywalls Dismissed On Onboarding");
            await completeOnboarding();
            navigation.navigate("TryOn");
            break;
        }
      } else {
        console.log("Discounted offering not found");
        await completeOnboarding();
        navigation.navigate("TryOn");
      }
    } catch (error) {
      console.error("Error presenting discounted paywall:", error);
      await completeOnboarding();
      navigation.navigate("TryOn");
    }
  };

  const handleRateAndContinue = async () => {
    
    if (InAppReview.isAvailable()) {
      InAppReview.RequestInAppReview()
        .then(() => {
          handlePaywall();
        })
        .catch(() => {
          handlePaywall();
        });
    } else {
      handlePaywall();
    }
  };

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const animateToNextStep = (nextStep) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(nextStep);
      updateOnboardingStep(nextStep);
    });
  };

  const goToNextStep = async () => {
    const nextStep = currentStep + 1;
    animateToNextStep(nextStep);
  };

  const goToPreviousStep = async () => {
    
    if (currentStep > 1) {
      const previousStep = currentStep - 1;
      animateToNextStep(previousStep);
    }
  };

  const handleNameSubmit = async () => {
    
    if (!userName.trim()) {
      Alert.alert("Name Required", "Please enter your name to continue");
      return;
    }

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ name: userName.trim() })
        .eq("id", profile.id);

      if (profileError) throw profileError;

      const { error: metaError } = await supabase.auth.updateUser({
        data: { name: userName.trim() }
      });

      if (metaError) throw metaError;

      mixpanel.track('Onboarding Name Submitted', { name: userName.trim() });
      goToNextStep();
    } catch (error) {
      Alert.alert("Error", "Failed to save name. Please try again.");
      console.error("Error saving name:", error);
    }
  };

  const toggleStyle = (style) => {
    
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      if (selectedStyles.length < 6) {
        setSelectedStyles([...selectedStyles, style]);
      }
    }
  };

  const handleStylesSubmit = async () => {
    
    if (selectedStyles.length < 3) {
      Alert.alert("Select Styles", "Please select at least 3 styles to continue");
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ styles: selectedStyles })
        .eq("id", profile.id);

      if (error) throw error;

      mixpanel.track('Onboarding Styles Submitted', { styles: selectedStyles });
      goToNextStep();
    } catch (error) {
      Alert.alert("Error", "Failed to save styles. Please try again.");
      console.error("Error saving styles:", error);
    }
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
        
        if (profileData.name) {
          setUserName(profileData.name);
        }
        
        if (profileData.styles && Array.isArray(profileData.styles)) {
          setSelectedStyles(profileData.styles);
        }
        
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
        
        const step = profileData.onboarding_wizard_step || 1;
        setCurrentStep(step);
        setLoading(false);

        mixpanel.track('Onboarding Screen Viewed');

      } catch (error) {
        navigation.navigate("First");
      }
    };

    checkSession();
  }, [supabase]);

  const ProgressBar = () => {
    const progressPercentage = (currentStep / totalSteps) * 100;
    
    return (
      <View className={styles.progressBarContainer}>
        <Text className={styles.progressText} style={{ fontFamily: FONTS.SATOSHI }}>
          Step {currentStep} of {totalSteps}
        </Text>
        <View className={styles.progressBarWrapper}>
          {currentStep > 0 && (
            <TouchableOpacity 
              className={styles.backButton}
              style={{ backgroundColor: styles.backButtonBackground }}
              onPress={goToPreviousStep}
              disabled={currentStep < 2}
            >
              <Feathericons name="arrow-left" size={20} color="black" />
            </TouchableOpacity>
          )}
          <View className={styles.progressBarOuter}>
            <View 
              className={styles.progressBarInner}
              style={{ width: `${progressPercentage}%` }}
            />
          </View>
        </View>
      </View>
    );
  };

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

  if (currentStep === 1) {
    return (
      <View 
        className="flex-1 bg-white"
      >
        <ProgressBar />
        <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
          <View className={styles.container}>
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step0MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                What's your name?
              </Text>
              <Text 
                className={styles.step0SubHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                We'd love to personalize your experience
              </Text>
              
              <View className={styles.step0InputContainer}>
                <TextInput
                  className={styles.step0Input}
                  style={{ 
                    fontFamily: FONTS.SATOSHI,
                    width: 320,
                    color: 'black',
                    height: 50,
                    paddingBottom: 5
                  }}
                  placeholder="Enter your name?"
                  placeholderTextColor="#9CA3AF"
                  value={userName}
                  onChangeText={setUserName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  selectionColor="black"
                />
              </View>
            </View>
          </View>
          <View 
            className={styles.step0ButtonsGroup}
           
          >
            <Pressable 
              className={ (userName.length >  0) ?  styles.selectButton : styles.selectButtonDisabled}
              onPress={handleNameSubmit}
              disabled={userName.length === 0}            
            >
              <Text 
                className={styles.continueButtonText}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Get Started
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    );
  }

  if (currentStep === 2) {
    return (
      <View className="flex-1 bg-white">
        <ProgressBar />
        <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
          <ScrollView className="flex-1">
            <View className={styles.container}>
              <View className={styles.stepContainer}>
                <Text 
                  className={styles.step1MainHeader}
                  style={{ fontFamily: FONTS.SWITZER }}
                >
                  Choose your styles
                </Text>
                <Text 
                  className={styles.step1SubHeader}
                  style={{ fontFamily: FONTS.SATOSHI }}
                >
                  Select at least 3 styles that resonate with you (max 6)
                </Text>
                
                <View className={styles.step1StylesContainer}>
                  {STYLE_OPTIONS.map((style) => {
                    const isSelected = selectedStyles.includes(style);
                    const bgColor = isSelected ? STYLE_COLORS[style] : "#fff";
                    const borderColor = isSelected ? STYLE_COLORS[style] : "#D1D5DB";
                    
                    return (
                      <Pressable
                        key={style}
                        className={styles.step1StyleChip}
                        style={{
                          backgroundColor: bgColor,
                          borderColor: borderColor,
                        }}
                        onPress={() => toggleStyle(style)}
                      >
                        <Text
                          className={styles.step1StyleChipText}
                          style={{
                            fontFamily: FONTS.SATOSHI,
                            color: "#000",
                          }}
                        >
                          {style}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
          </ScrollView>
          <View className={styles.step1ButtonsGroup}>
            <Pressable 
              className={styles.selectButton}
              onPress={handleStylesSubmit}
              disabled={selectedStyles.length < 3}
              style={{ opacity: selectedStyles.length < 3 ? 0.5 : 1 }}
            >
              <Text 
                className={styles.continueButtonText}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    );
  }

  if (currentStep === 3) {
    return (
      <View className="flex-1 bg-white">
        <ProgressBar />
        <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
          <View className={styles.container}>
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step2MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                For best results
              </Text>
              <Text 
                  className={styles.step2SubHeader}
                  style={{ fontFamily: FONTS.SATOSHI }}
                >
                  Tips to get the best outcomes
                </Text>
              
              <View className={styles.step2TipsContainer}>
                <View className={styles.step2TipCard}>
                  <View className={styles.step2IconContainer} style={{ backgroundColor: "#BDF4FF" }}>
                    <Image 
                      source={require("../assets/card-image-1.png")}
                      style={{ width: 48, height: 48 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View className={styles.step2TipTextContainer}>
                    <Text className={styles.step2TipTitle} style={{ fontFamily: FONTS.SWITZER }}>
                      Full Body Pic
                    </Text>
                    <Text className={styles.step2TipDescription} style={{ fontFamily: FONTS.SATOSHI }}>
                      Upload a photo showing your complete body from head to toe
                    </Text>
                  </View>
                </View>

                <View className={styles.step2TipCard}>
                  <View className={styles.step2IconContainer} style={{ backgroundColor: "#FFEBEE" }}>
                    <Image 
                      source={require("../assets/card-image-2.png")}
                      style={{ width: 48, height: 48 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View className={styles.step2TipTextContainer}>
                    <Text className={styles.step2TipTitle} style={{ fontFamily: FONTS.SWITZER }}>
                      Plain Background
                    </Text>
                    <Text className={styles.step2TipDescription} style={{ fontFamily: FONTS.SATOSHI }}>
                      Images with clean uncluttered background allow our AI to focus best
                    </Text>
                  </View>
                </View>

                <View className={styles.step2TipCard}>
                  <View className={styles.step2IconContainer} style={{ backgroundColor: "#FFA10014" }}>
                    <Image 
                      source={require("../assets/card-image-3.png")}
                      style={{ width: 48, height: 48 }}
                      resizeMode="contain"
                    />
                  </View>
                  <View className={styles.step2TipTextContainer}>
                    <Text className={styles.step2TipTitle} style={{ fontFamily: FONTS.SWITZER }}>
                      Good Lighting
                    </Text>
                    <Text className={styles.step2TipDescription} style={{ fontFamily: FONTS.SATOSHI }}>
                      The more light in the image the better, avoid dim images with heavy shadows
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View className={styles.step2ButtonsGroup}>
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
        </Animated.View>
      </View>
    );
  }

  if (currentStep === 4) {
    return (
      <View className="flex-1 bg-white">
        <ProgressBar />
        <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
          <View className={styles.container}>
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step3MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Upload a full body pic
              </Text>
              <Text 
                className={styles.step3SubHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Use a photo taken by someone else in good lighting.
              </Text>
              
              <View className="flex-row mt-8 px-4 gap-x-2 justify-between items-center">
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
          <View className={styles.step3ButtonsGroup}>
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
        </Animated.View>
      </View>
    );
  }

  if (currentStep === 5) {
    return (
      <View className="flex-1 bg-white">
        <ProgressBar />
        <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
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
                className={styles.step4AllDoneText}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                All done!
              </Text>
              <Text 
                className={styles.step4MainHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Perfect just one more step to generate your first try-on!
              </Text>
            </View>
          </View>
          <View className={styles.step4ButtonsGroup}>
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
        </Animated.View>
      </View>
    );
  }

  if (currentStep === 6) {
    return (
      <View className="flex-1 bg-white">
        <ProgressBar />
        <Animated.View className="flex-1" style={{ opacity: fadeAnim }}>
          <View className={styles.container}>
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step5MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Please give us a rating
              </Text>
              <Text 
                className={styles.step5SubHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Your feedback helps us improve!
              </Text>
              <Image source={require("../assets/review.png")} className={styles.reviewImage} />
            </View>
          </View>
          <View className={styles.step5ButtonsGroup}>
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
              onPress={handlePaywall}
            >
              <Text 
                className={styles.continueButtonText}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Continue
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    );
  }

  return null;
}