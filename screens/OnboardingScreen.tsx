import { View, TouchableOpacity, Text, Alert, Image, Pressable, Linking, ActivityIndicator, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { FONTS } from "../constants/fonts";
import { supabase } from "../App";
import InAppReview from "react-native-in-app-review";
import Slider from "@react-native-community/slider";

export default function OnboardingScreen({ navigation }) {
  const { width } = Dimensions.get("window");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [step, setStep] = useState(0);
  const [referralSource, setReferralSource] = useState(null);
  const [sizePickingConfidence, setSizePickingConfidence] = useState(null);
  const [clothingPurchaseRegrets, setClothingPurchaseRegrets] = useState(null);
  const [returnHesitation, setReturnHesitation] = useState(null);
  const [sliderValue, setSliderValue] = useState(50);

  const deviceType = width <= 375 ? "small" : width <= 390 ? "regular" : "proMax";
  
  const deviceStyles = {
    small: {
      container: "pt-24 px-8",
      mainHeader: "text-2xl text-center mb-3 mt-5 font-semibold text-black",
      step0MainHeader : "text-2xl text-center mb-3 mt-5 font-semibold text-black",
      subHeader: "text-sm text-center mb-5 mt-2 text-gray-600 leading-5 px-2",
      buttonText: "text-base font-medium",
      selectbuttonText: "text-base font-medium",
      selectButton: "rounded-[10px] py-4 px-4 items-center justify-center mb-6 bg-black active:bg-neutral-800 active:scale-[0.98]",
      sliderContainer: "w-full items-center mb-24",
      sliderValueText: "text-xl text-black font-medium mb-8",
      stepContainer: "mt-12",
      smallerText: "text-sm",
      backButton: "absolute top-28 left-5 w-8 h-8 items-center justify-center z-10",
      step0ButtonsGroup: "flex-2 px-8 pb-12",
      step1ButtonsGroup: "flex-2 px-8 pb-36 pt-6",
      step3ButtonsGroup: "flex-2 px-8 pb-40 pt-6",
      step4ButtonsGroup: "flex-2 px-8 pb-40 pt-6",
      sliderContinueButton: "bg-black rounded-[10px] py-4 px-3 items-center w-full mb-24",
      continueButton: "bg-black rounded-[10px] py-4 px-3 items-center w-full mb-24",
      continueButtonText:"text-white text-base font-medium "
    },
    regular: {
      container: "pt-28 px-12",
      mainHeader: "text-[28px] text-center mb-3 mt-4 font-semibold text-black",
      step0MainHeader: "text-[28px] text-center mb-3 mt-4 font-semibold text-black",
      subHeader: "text-base text-center mb-5 mt-2 text-gray-600 leading-[22px] px-2",
      buttonText: "text-base font-medium ",
      selectButton: "rounded-[10px] py-4 px-4 items-center justify-center mb-9 bg-black active:bg-neutral-800 active:scale-[0.98]",
      sliderContainer: "w-full items-center mb-20",
      sliderValueText: "text-2xl text-black font-medium mb-10",
      stepContainer: "mt-14",
      smallerText: "text-base",
      backButton: "absolute top-32 left-5 w-8 h-8 items-center justify-center z-10",
      step0ButtonsGroup: "flex-2 px-8 pb-44",
      step1ButtonsGroup: "flex-2 px-8 pb-56 pt-6",
      step3ButtonsGroup: "flex-2 px-8 pb-72 pt-6",
      step4ButtonsGroup: "flex-2 px-8 pb-60 pt-6",
      sliderContinueButton: "bg-black rounded-[10px] py-4 px-3 items-center w-full mb-48",
      continueButtonText:"text-white text-base font-medium",
      continueButton: "bg-black rounded-[10px] py-4 px-3 items-center w-full mt-5 mb-60",
    },
    proMax: {
      container: "pt-32 px-16",
      mainHeader: "text-[28px] text-center mb-3  font-semibold text-black",
      step0MainHeader: "text-[28px] text-center mb-3  font-semibold text-black",
      subHeader: "text-base text-center mb-5 mt-3 text-gray-600 leading-[22px] px-3",
      buttonText: "text-lg font-medium ",
      selectButton: "rounded-[10px] py-4 px-4 items-center justify-center mb-9 bg-black active:bg-neutral-800 active:scale-[0.98]",
      sliderContainer: "w-full items-center mb-24",
      sliderValueText: "text-2xl text-black font-medium mb-10",
      stepContainer: "mt-16",
      smallerText: "text-base",
      backButton: "absolute top-32 left-5 w-8 h-8 items-center justify-center z-10",
      step0ButtonsGroup: "flex-2 px-8 pb-48",
      step1ButtonsGroup: "flex-2 px-8 pb-64 pt-6",
      step3ButtonsGroup: "flex-2 px-8 pb-80 pt-6",
      step4ButtonsGroup: "flex-2 px-8 pb-60 pt-6",
      sliderContinueButton: "bg-black rounded-[10px] py-4 px-3 items-center w-full mb-52",
      continueButtonText:"text-white text-base font-medium",
      continueButton: "bg-black rounded-[10px] py-4 px-3 items-center w-full mt-5 mb-60",
    }
  };

  const styles = deviceStyles[deviceType];

  const handleSkipToFittingRoom = async () => {
    if (profile?.id) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          onboarding_complete: true 
        })
        .eq("id", profile.id);

      if (updateError) {
        Alert.alert(
          "Error",
          "Please Try Again Later!",
          [{ text: "OK" }]
        );
        return;
      }
    }

    navigation.navigate("TryOn");
  };
  
  const handleSelection = async (field, value, nextStep, setStateFunction = null) => {
    if (setStateFunction) {
      setStateFunction(value);
    }

    let updateObj = {
      onboarding_wizard_step: nextStep
    };
    if(field) {
      updateObj = {
        [field]: value,
        onboarding_wizard_step: nextStep,
        onboarding_complete: (nextStep === 5)
      };
    }
    
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updateObj)
      .eq("id", profile.id);

    if (updateError) {
      Alert.alert(
        "Error",
        "Please Try Again Later!",
        [{ text: "OK" }]
      );
      return;
    }

    if(nextStep === 5) {
      navigation.navigate("TryOn");
    } else {
      setStep(nextStep);
    }
  };

  const handleBackNavigation = async (prevStep) => {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ 
        onboarding_wizard_step: prevStep 
      })
      .eq("id", profile.id);

    if (updateError) {
      Alert.alert(
        "Error",
        "Please Try Again Later!",
        [{ text: "OK" }]
      );
      return;
    }

    setStep(prevStep);
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
          Alert.alert(
            "Error",
            "Please Try Again Later!",
            [{ text: "OK" }]
          );
          return;
        }

        if (profileData.onboarding_complete === true) {
          navigation.navigate("TryOn");
          return;
        }

        setStep(profileData.onboarding_wizard_step);
        setProfile(profileData);
        
        if (profileData.referral_source) setReferralSource(profileData.referral_source);
        if (profileData.size_picking_confidence) setSizePickingConfidence(profileData.size_picking_confidence);
        if (profileData.clothing_purchase_regrets) {
          setClothingPurchaseRegrets(profileData.clothing_purchase_regrets);
          setSliderValue(profileData.clothing_purchase_regrets);
        }
        if (profileData.return_hesitation) setReturnHesitation(profileData.return_hesitation);
        
        setLoading(false);

      } catch (error) {
        navigation.navigate("First");
      }
    };

    checkSession();
  }, [supabase]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#4052FF" />
        <Text 
          className="mt-3 text-base text-[#4052FF]"
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  const renderBackButton = (currentStep) => {
    if (currentStep === 0) return null;
    
    return (
      <TouchableOpacity 
      className={styles.backButton}
        onPress={() => handleBackNavigation(currentStep - 1)}
      >
        <Text className="text-2xl font-light text-black">←</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View className="flex-1 bg-white">
      {/* Skip to Fitting Room Banner */}
      <TouchableOpacity 
        className="absolute w-full bg-black pt-14 pb-3 items-center justify-center z-10 active:bg-neutral-800 active:scale-[0.98]"
        onPress={handleSkipToFittingRoom}
        activeOpacity={0.9}
        style={{ elevation: 5 }}
      >
        <Text 
          className="text-white text-sm font-normal"
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          Skip To Your Fitting Room
        </Text>
      </TouchableOpacity>

      {(step === 0) && (
        <View className="flex-1">
          <View className={`flex-1 items-center ${styles.container}`}>
            {renderBackButton(step)}
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step0MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Where Did You Hear About Us?
              </Text>
            </View>
          </View>

          <View className={styles.step0ButtonsGroup}>
            <Pressable 
              className="flex-row items-center bg-black rounded-[10px] py-4 px-5 mb-7 active:bg-neutral-800 active:scale-[0.98]"
              onPress={() => handleSelection("referral_source", "instagram", 1, setReferralSource)}
            >
              <Image source={require("../assets/InstagramLogo.png")} className="w-9 h-9 ml-5 mr-3" />
              <Text 
                className={`flex-1 text-center text-white text-lg font-medium mr-12 ${referralSource === "instagram" ? "text-[#7A8BFF] font-bold" : ""}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Instagram
              </Text>
            </Pressable>

            <Pressable 
              className="flex-row items-center bg-black rounded-[10px] py-4 px-5 mb-7 active:bg-neutral-800 active:scale-[0.98]"
              onPress={() => handleSelection("referral_source", "facebook", 1, setReferralSource)}
            >
              <Image source={require("../assets/FacebookLogo.png")} className="w-9 h-9 ml-5 mr-3" />
              <Text 
                className={`flex-1 text-center text-white text-lg font-medium mr-12 ${referralSource === "facebook" ? "text-[#7A8BFF] font-bold" : ""}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Facebook
              </Text>
            </Pressable>

            <Pressable 
              className="flex-row items-center bg-black rounded-[10px] py-4 px-5 mb-7 active:bg-neutral-800 active:scale-[0.98]"
              onPress={() => handleSelection("referral_source", "tiktok", 1, setReferralSource)}
            >
              <Image source={require("../assets/TikTokLogo.png")} className="w-9 h-9 ml-5 mr-3" />
              <Text 
                className={`flex-1 text-center text-white text-lg font-medium mr-12 ${referralSource === "tiktok" ? "text-[#7A8BFF] font-bold" : ""}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                TikTok
              </Text>
            </Pressable>

            <Pressable 
              className="flex-row items-center bg-black rounded-[10px] py-4 px-5 mb-7 active:bg-neutral-800 active:scale-[0.98]"
              onPress={() => handleSelection("referral_source", "youtube", 1, setReferralSource)}
            >
              <Image source={require("../assets/YoutubeLogo.png")} className="w-9 h-9 ml-5 mr-3" />
              <Text 
                className={`flex-1 text-center text-white text-lg font-medium mr-12 ${referralSource === "youtube" ? "text-[#7A8BFF] font-bold" : ""}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Youtube
              </Text>
            </Pressable>

            <Pressable 
              className="flex-row items-center bg-black rounded-[10px] py-4 px-5 mb-7 active:bg-neutral-800 active:scale-[0.98]"
              onPress={() => handleSelection("referral_source", "friends_or_family", 1, setReferralSource)}
            >
              <Image source={require("../assets/PersonIcon.png")} className="w-9 h-9 ml-5 mr-3" />
              <Text 
                className={`flex-1 text-center text-white text-lg font-medium mr-12 ${referralSource === "friends_or_family" ? "text-[#7A8BFF] font-bold" : ""}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Friends or Family
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {(step === 1) && (
        <View className="flex-1">
          <View className={`flex-1 items-center ${styles.container}`}>
            {renderBackButton(step)}
            <View className={styles.stepContainer}>
              <Text 
                className={styles.mainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                How confident are you when shopping for clothes online?
              </Text>
              <Text 
                className={styles.subHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View className={styles.step1ButtonsGroup}>
            <Pressable 
              className={styles.selectButton}
              onPress={() => handleSelection("size_picking_confidence", "very", 2, setSizePickingConfidence)}
            >
              <Text 
                className={`${styles.buttonText} ${sizePickingConfidence === "very" ? "text-[#7A8BFF] font-bold" : "text-white"}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Very confident - I rarely get it wrong
              </Text>
            </Pressable>

            <Pressable 
              className={styles.selectButton}
              onPress={() => handleSelection("size_picking_confidence", "somewhat", 2, setSizePickingConfidence)}
            >
              <Text 
                className={`${styles.buttonText} ${sizePickingConfidence === "somewhat" ? "text-[#7A8BFF] font-bold" : "text-white"}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Somewhat confident - I guess and hope
              </Text>
            </Pressable>

            <Pressable 
              className={styles.selectButton}
              onPress={() => handleSelection("size_picking_confidence", "not", 2, setSizePickingConfidence)}
            >
              <Text 
                className={`${styles.buttonText} ${sizePickingConfidence === "not" ? "text-[#7A8BFF] font-bold" : "text-white"}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Not confident - its always a gamble
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {(step === 2) && (
        <View className="flex-1">
          <View className={`flex-1 items-center ${styles.container}`}>
            {renderBackButton(step)}
            <View className={styles.stepContainer}>
              <Text 
                className={styles.mainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                How Often Do You Regret Clothing Purchases Online?
              </Text>
              <Text 
                className={styles.subHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View className="flex-2 px-8 pb-12 items-center">
            <View className={styles.sliderContainer}>
              <Text 
                className={styles.sliderValueText}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                {sliderValue === 0 ? "Never" : 
                  sliderValue === 100 ? "Very Often" : 
                  sliderValue <= 25 ? "Rarely" : 
                  sliderValue <= 50 ? "Sometimes" : 
                  sliderValue <= 75 ? "Often" : "Very Often"}
              </Text>
              
              <View className="w-full h-30 p-4 bg-black rounded-[10px] justify-center mb-2">
                <Slider
                  style={{ width: "100%", height: 40 }}
                  minimumValue={0}
                  maximumValue={100}
                  step={1}
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#444444"
                  thumbTintColor="#FFFFFF"
                />
              </View>
              
              <View className="w-full flex-row justify-between px-1">
                <Text 
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: FONTS.SATOSHI }}
                >
                  Never
                </Text>
                <Text 
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: FONTS.SATOSHI }}
                >
                  Very Often
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
                className={styles.sliderContinueButton}
                onPress={() => handleSelection("clothing_purchase_regrets", sliderValue, 3, setClothingPurchaseRegrets)}
            >
              <Text 
                className={styles.continueButtonText}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {(step === 3) && (
        <View className="flex-1">
          <View className={`flex-1 items-center ${styles.container}`}>
            {renderBackButton(step)}
            <View className={styles.stepContainer}>
              <Text 
                className={styles.mainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Please give us a rating
              </Text>
              <Text 
                className={styles.subHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Your feedback helps us improve!
              </Text>
            </View>
          </View>

          <View className={styles.step3ButtonsGroup}>
            <Pressable 
              className={styles.selectButton}
              onPress={() => {
                if (InAppReview.isAvailable()) {
                  InAppReview.RequestInAppReview()
                    .then(() => {
                      handleSelection(null, null, 4);
                    })
                    .catch(() => {
                      handleSelection(null, null, 4);
                    });
                } else {
                  handleSelection(null, null, 4);
                }
              }}
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
              onPress={() => handleSelection(null, null, 4)}
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
      )}

      {(step === 4) && (
        <View className="flex-1">
          <View className={`flex-1 items-center ${styles.container}`}>
            {renderBackButton(step)}
            <View className={styles.stepContainer}>
              <Text 
                className={styles.mainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Have you ever kept an item of clothing you didn"t like just because returning it felt like too much of a hassle?
              </Text>
              <Text 
                className={styles.subHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View className={styles.step4ButtonsGroup}>
            <Pressable 
              className={styles.selectButton}
              onPress={() => handleSelection("return_hesitation", "yes", 5, setReturnHesitation)}
            >
              <Text 
                className={`${styles.buttonText} ${returnHesitation === "yes" ? "text-[#7A8BFF] font-bold" : "text-white"}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Yes
              </Text>
            </Pressable>
            
            <Pressable 
              className={styles.selectButton}
              onPress={() => handleSelection("return_hesitation", "no", 5, setReturnHesitation)}
            >
              <Text 
                className={`${styles.buttonText} ${returnHesitation === "no" ? "text-[#7A8BFF] font-bold" : "text-white"}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                No
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      
    </View>
  );
}