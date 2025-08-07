import { View, TouchableOpacity, Text, Alert, Image, Pressable, ActivityIndicator, Dimensions, TextInput, Share, AppState } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { FONTS } from "../constants/fonts";
import { supabase } from "../App";
import InAppReview from "react-native-in-app-review";
import Slider from "@react-native-community/slider";
import { getStyles } from "../stylesheets/onboardingScreen";
import mixpanel from "../utils/mixpanel";

export default function OnboardingScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [step, setStep] = useState(0);
  const [referralSource, setReferralSource] = useState(null);
  const [sizePickingConfidence, setSizePickingConfidence] = useState(null);
  const [clothingPurchaseRegrets, setClothingPurchaseRegrets] = useState(null);
  const [returnHesitation, setReturnHesitation] = useState(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [referralCode, setReferralCode] = useState("");
  const [referralCodeBoxDisabled, setReferralCodeBoxDisabled] = useState(false);
  const hasCompleted = useRef(false);
  const currentStepRef = useRef(0); // Use ref to track current step without dependency

  const { width, height } = Dimensions.get("window");

  const styles = getStyles(width, height);

  // Update the ref whenever step changes
  useEffect(() => {
    currentStepRef.current = step;
  }, [step]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if ((nextAppState === 'background' || nextAppState === 'inactive') && !hasCompleted.current) {
        mixpanel.track('Onboarding Screen Drop Off', {
          'Dropped Off At Step': currentStepRef.current,
          'Dropped Off At Step Name': getStepName(currentStepRef.current)
        });
      }
    };
  
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
      if (!hasCompleted.current) {
        mixpanel.track('Onboarding Screen Drop Off', {
          'Dropped Off At Step': currentStepRef.current,
          'Dropped Off At Step Name': getStepName(currentStepRef.current)
        });
      }
    };
  }, []); // No dependencies - this effect only runs once

  const getStepName = (stepNumber) => {
    const stepNames = {
      0: 'Referral Source',
      1: 'Size Confidence', 
      2: 'Purchase Regrets',
      3: 'App Rating',
      4: 'Return Hesitation',
      5: 'Enter Referral Code',
      6: 'Share Referral Code'
    };
    return stepNames[stepNumber] || `Step ${stepNumber}`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Try on clothes online for free when you sign up and use my referral code: ${profile?.referral_code} https://apps.apple.com/us/app/my-fitting-room/id6743954773`,
        url: 'https://apps.apple.com/us/app/my-fitting-room/id6743954773',
      });
  
      handleSelection(null, null, 7);
      return;
    } catch (error) {
    
      Alert.alert(
        "Error",
        "Please Try Again Later!",
        [{ 
          text: "OK", 
          onPress: () => handleSelection(null, null, 7)
        }]
      );
      return;
    }
  };

  const handleSelection = async (field, value, nextStep, setStateFunction = null) => {
    if (setStateFunction) {
      setStateFunction(value);
    }

    if (field || step > 0) {
      mixpanel.track('Onboarding Step Completed', {
        'Completed Step': step,
        'Completed Step Name': getStepName(step),
        'Value Selected': value,
      });
    }

    let updateObj = {
      onboarding_wizard_step: nextStep,
      onboarding_complete: nextStep === 7
    };
    if(field) {
      updateObj = {
        [field]: value,
        onboarding_wizard_step: nextStep,
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

    if(nextStep === 7) {
      hasCompleted.current = true;
      
      mixpanel.track('Onboarding Completed', {
        'Referral Source': referralSource,
        'Size Confidence': sizePickingConfidence,
        'Purchase Regrets Score': clothingPurchaseRegrets,
        'Return Hesitation': returnHesitation,
        'Used Referral Code': referralCodeBoxDisabled
      });
      
      navigation.navigate("TryOn");
    } else {
      setStep(nextStep);
      
      
    }
  };

  const handleReferralCodeSubmit = async () => {

    if (referralCodeBoxDisabled) {
      setStep(6);
      return;
    }

    if (!referralCode.trim()) {
      

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ onboarding_wizard_step: 6 })
        .eq("id", profile.id);

      if (updateError) {
        Alert.alert(
          "Error",
          "Please Try Again Later!",
          [{ text: "OK" }]
        );
        return;
      }

      setStep(6);
      
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        Alert.alert(
          "Error",
          "Please log in again",
          [{ text: "OK" }]
        );
        return;
      }

      const requestBody = {
        referral_code: referralCode.trim()
      };

      const response = await fetch("https://my-fitting-room-server.onrender.com/api/referral/use-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        mixpanel.track('Referral Code Submission Failed', {
          'Referral Code': referralCode.trim(),
          'Error': 'Referral Code Submission Failed'
        });

        Alert.alert(
          "Invalid Code",
          "Please try a different referral code",
          [{ text: "OK" }]
        );
        return;
      }

      mixpanel.track('Referral Code Submitted', {
        'Referral Code': referralCode.trim(),
        'Success': true
      });
      
      Alert.alert(
        "Success!",
        "Referral added successfully",
        [{ 
          text: "OK", 
          onPress: async () => {
            
            const { error: updateError } = await supabase
              .from("profiles")
              .update({ 
                onboarding_wizard_step: 6,
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
            
            setStep(6);
            setReferralCodeBoxDisabled(true);
            
          }
        }]
      );

    } catch (error) {

      Alert.alert(
        "Error",
        "Please try again later!",
        [{ text: "OK" }]
      );
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

        const { data: referralData, error : referralError } = await supabase
          .from("referrals")
          .select("*")
          .eq("referee_id", session?.user?.id)
          .maybeSingle();

        if (referralError) {
          Alert.alert(
            "Error",
            "Please Try Again Later!",
            [{ text: "OK" }]
          );
          return;
        }

        if(referralData) {
          setReferralCode(referralData?.code_used);
        }
        
        setReferralCodeBoxDisabled(referralData !== null);

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

  const renderBackButton = (currentStep) => {
    if (currentStep === 0) return null;
    
    return (
      <TouchableOpacity 
      className={styles.backButton}
        onPress={() => handleBackNavigation(currentStep - 1)}
      >
        <Text className={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View className="flex-1 bg-white">
      
      {(step === 0) && (
        <View className="flex-1">
          <View className={styles.container}>
            {renderBackButton(step)}
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step1MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Where Did You Hear About Us?
              </Text>
            </View>
          </View>
          <View className={styles.step1ButtonsGroup}>
            <Pressable 
              className={styles.socialButton}
              onPress={() => handleSelection("referral_source", "instagram", 1, setReferralSource)}
            >
              <Image source={require("../assets/InstagramLogo.png")} className={styles.socialLogo} />
              <Text 
                className={`flex-1 text-center text-white text-lg font-medium mr-12 ${referralSource === "instagram" ? "text-[#7A8BFF] font-bold" : ""}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Instagram
              </Text>
            </Pressable>
            <Pressable 
              className={styles.socialButton}
              onPress={() => handleSelection("referral_source", "facebook", 1, setReferralSource)}
            >
              <Image source={require("../assets/FacebookLogo.png")} className={styles.socialLogo} />
              <Text 
                className={`flex-1 text-center text-white text-lg font-medium mr-12 ${referralSource === "facebook" ? "text-[#7A8BFF] font-bold" : ""}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Facebook
              </Text>
            </Pressable>
            <Pressable 
              className={styles.socialButton}
              onPress={() => handleSelection("referral_source", "tiktok", 1, setReferralSource)}
            >
              <Image source={require("../assets/TikTokLogo.png")} className={styles.socialLogo} />
              <Text 
                className={`flex-1 text-center text-white text-lg font-medium mr-12 ${referralSource === "tiktok" ? "text-[#7A8BFF] font-bold" : ""}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                TikTok
              </Text>
            </Pressable>
            <Pressable 
              className={styles.socialButton}
              onPress={() => handleSelection("referral_source", "youtube", 1, setReferralSource)}
            >
              <Image source={require("../assets/YoutubeLogo.png")} className={styles.socialLogo} />
              <Text 
                className={`flex-1 text-center text-white text-lg font-medium mr-12 ${referralSource === "youtube" ? "text-[#7A8BFF] font-bold" : ""}`}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Youtube
              </Text>
            </Pressable>
            <Pressable 
              className={styles.socialButton}
              onPress={() => handleSelection("referral_source", "friends_or_family", 1, setReferralSource)}
            >
              <Image source={require("../assets/PersonIcon.png")} className={styles.socialLogo} />
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
          <View className={styles.container}>
            {renderBackButton(step)}
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step2MainHeader}
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
          <View className={styles.step2ButtonsGroup}>
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
          <View className={styles.container}>
            {renderBackButton(step)}
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step3MainHeader}
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
          <View className={styles.container}>
            {renderBackButton(step)}
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step4MainHeader}
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
              <Image source={require("../assets/review.png")} className={styles.reviewImage} />
            </View>
          </View>
          <View className={styles.step4ButtonsGroup}>
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
              onPress={() => {
               
                handleSelection(null, null, 4);
              }}
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
          <View className={styles.container}>
            {renderBackButton(step)}
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step5MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Have you ever kept an item of clothing you didn't like just because returning it felt like too much of a hassle?
              </Text>
              <Text 
                className={styles.subHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Helps make more accurate generations
              </Text>
            </View>
          </View>
          <View className={styles.step5ButtonsGroup}>
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

      {(step === 5) && (
        <View className="flex-1">
          <View className={styles.container}>
            {renderBackButton(step)}
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step0MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Enter Referral Code
              </Text>
            </View>
          </View>
          <View className={styles.step0ButtonsGroup}>
            <View className={`${styles.step0InputContainer} ${styles.step0Input}`}>
              <TextInput
                className={styles.step0InputText}
                style={{ fontFamily: FONTS.SATOSHI }}
                placeholder="Enter friends referral code here"
                placeholderTextColor="#6B7280"
                value={referralCode}
                onChangeText={setReferralCode}
                readOnly={referralCodeBoxDisabled}
              />
            </View>

            <TouchableOpacity 
              className={styles.selectButton}
              onPress={handleReferralCodeSubmit}
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

      {(step === 6) && (
        <View className="flex-1">
          <View className={styles.container}>
            {renderBackButton(step)}
            <View className={styles.stepContainer}>
              <Text 
                className={styles.step0MainHeader}
                style={{ fontFamily: FONTS.SWITZER }}
              >
                Get Complete Access
              </Text>
              <Text 
                className={styles.step0SubHeader}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Share your code below with friends and get free try ons when they download the app and use it.
              </Text>
            </View>
          </View>
          <View className={styles.step0ButtonsGroup}>

            <View className={`${styles.step0InputContainer} ${styles.step0Input}`}>
              <TextInput
                className={styles.step0InputText}
                style={{ fontFamily: FONTS.SATOSHI }}
                  value={profile?.referral_code || ""}
                  editable={false}
              />
            </View>
            
            <TouchableOpacity 
              className={styles.selectButton}
              onPress={handleShare}
            >
              <Text 
                className={styles.continueButtonText}
                style={{ fontFamily: FONTS.SATOSHI }}
              >
                Share Code
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={styles.selectButton}
              onPress={() => {
                handleSelection(null, null, 7);
              }}
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

    </View>
  );
}