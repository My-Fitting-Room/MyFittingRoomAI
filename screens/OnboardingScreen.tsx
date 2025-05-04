import { View, StyleSheet, TouchableOpacity, Text, Alert, Image, Pressable, Linking, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { FONTS } from "../constants/fonts";
import { supabase } from "../App";
import InAppReview from "react-native-in-app-review";
import Slider from "@react-native-community/slider"; 

export default function OnboardingScreen({ navigation }) {
  const [subscribePressed, setSubscribePressed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [step, setStep] = useState(0);
  const [gender, setGender] = useState(null);
  const [bodyType, setBodyType] = useState(null);
  const [referralSource, setReferralSource] = useState(null);
  const [clothesBoughtFrequency, setClothesBoughtFrequency] = useState(null);
  const [mostShoppedClothingType, setMostShoppedClothingType] = useState(null);
  const [outfitVisualizeFrequency, setOutfitVisualizeFrequency] = useState(null);
  const [sizePickingConfidence, setSizePickingConfidence] = useState(null);
  const [biggestIssueShoppingOnline, setBiggestIssueShoppingOnline] = useState(null);
  const [orderMisfitHandling, setOrderMisfitHandling] = useState(null);
  const [clothingPurchaseRegrets, setClothingPurchaseRegrets] = useState(null);
  const [returnHesitation, setReturnHesitation] = useState(null);
  const [sliderValue, setSliderValue] = useState(50); 

  const handleSubscribe = () => {
    Linking.openURL("http://eepurl.com/i5TN6-/");
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
        onboarding_wizard_step: nextStep
      };
    }
    
    const { data: updateData, error: updateError } = await supabase
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

    setStep(nextStep);
  };

  const handleBackNavigation = async (prevStep) => {
    const { data: updateData, error: updateError } = await supabase
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
  
  const handleTryOnNavigate = async () => {
    const { data: updateData, error: updateError } = await supabase
      .from("profiles")
      .update({ 
        onboarding_complete: true, 
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
    navigation.navigate("TryOn");
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigation.navigate("First");
          return;
        }

        const { data: profileData, error:error } = await supabase
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
        
        if (profileData.gender) setGender(profileData.gender);
        if (profileData.body_type) setBodyType(profileData.body_type);
        if (profileData.referral_source) setReferralSource(profileData.referral_source);
        if (profileData.clothes_bought_frequency) setClothesBoughtFrequency(profileData.clothes_bought_frequency);
        if (profileData.most_shopped_clothing_type) setMostShoppedClothingType(profileData.most_shopped_clothing_type);
        if (profileData.outfit_visualize_frequency) setOutfitVisualizeFrequency(profileData.outfit_visualize_frequency);
        if (profileData.size_picking_confidence) setSizePickingConfidence(profileData.size_picking_confidence);
        if (profileData.biggest_issue_shopping_online) setBiggestIssueShoppingOnline(profileData.biggest_issue_shopping_online);
        if (profileData.order_misfit_handling) setOrderMisfitHandling(profileData.order_misfit_handling);
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4052FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderBackButton = (currentStep) => {
    if (currentStep === 0) return null;
    
    return (
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => handleBackNavigation(currentStep - 1)}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.subscribeBar,
          subscribePressed && styles.subscribeBarPressed
        ]}
        onPress={handleSubscribe}
        onPressIn={() => setSubscribePressed(true)}
        onPressOut={() => setSubscribePressed(false)}
        activeOpacity={0.9}
      >
        <Text style={styles.subscribeText}>Welcome To Your Fitting Room</Text>
      </TouchableOpacity>
      
      {(step === 0) && (
        <>
          <View style={styles.topSection}>
            <View style={styles.contentWrapper}>
              {renderBackButton(step)}
              <Text style={styles.mainHeader}>Choose Your Gender</Text>
              <Text style={styles.subHeader}>
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("gender", "female", 1, setGender)}
            >
              <Text style={[styles.selectButtonText, gender === "female" && styles.selectedButtonText]}>Female</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("gender", "male", 1, setGender)}
            >
              <Text style={[styles.selectButtonText, gender === "male" && styles.selectedButtonText]}>Male</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("gender", "other", 1, setGender)}
            >
              <Text style={[styles.selectButtonText, gender === "other" && styles.selectedButtonText]}>Other</Text>
            </Pressable>
          </View>
        </>
      )} 

      {(step === 1) && (
        <>
          <View style={styles.step1TopSection}>
            {renderBackButton(step)}
            <View style={styles.step1ContentWrapper}>
              <Text style={styles.step1MainHeader}>What Is Your Body Type?</Text>
              <Text style={styles.step1SubHeader}>
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View style={styles.step1BottomSection}>
            <View style={styles.step1ButtonRow}>
              <Pressable 
                style={[styles.step1Button, styles.selectedButton]}
                onPress={() => handleSelection("body_type", "ectomorph", 2, setBodyType)}
              >
                <Text style={[styles.step1ButtonText, bodyType === "ectomorph" && styles.selectedButtonText]}>Ectomorph</Text>
              </Pressable>

              <Pressable 
                style={[styles.step1Button, styles.selectedButton]}
                onPress={() => handleSelection("body_type", "mesomorph", 2, setBodyType)}
              >
                <Text style={[styles.step1ButtonText, bodyType === "mesomorph" && styles.selectedButtonText]}>Mesomorph</Text>
              </Pressable>

              <Pressable 
                style={[styles.step1Button, styles.selectedButton]}
                onPress={() => handleSelection("body_type", "endomorph", 2, setBodyType)}
              >
                <Text style={[styles.step1ButtonText, bodyType === "endomorph" && styles.selectedButtonText]}>Endomorph</Text>
              </Pressable>
            </View>

            <View style={styles.bodyTypeImageContainer}>
              <Image source={require("../assets/body-types.png")} style={styles.bodyTypeImage} />
            </View>
          </View>
        </>
      )} 

      {(step === 2) && (
        <>
          <View style={styles.step2TopSection}>
            {renderBackButton(step)}
            <View style={styles.step2ContentWrapper}>
              <Text style={styles.step2MainHeader}>Where Did You Hear About Us?</Text>
            </View>
          </View>

          <View style={styles.step2BottomSection}>
            <Pressable 
              style={styles.socialButton}
              onPress={() => handleSelection("referral_source", "instagram", 3, setReferralSource)}
            >
              <Image source={require("../assets/InstagramLogo.png")} style={styles.socialIcon} />
              <Text style={[styles.socialButtonText, referralSource === "instagram" && styles.selectedButtonText]}>Instagram</Text>
            </Pressable>

            <Pressable 
              style={styles.socialButton}
              onPress={() => handleSelection("referral_source", "facebook", 3, setReferralSource)}
            >
              <Image source={require("../assets/FacebookLogo.png")} style={styles.socialIcon} />
              <Text style={[styles.socialButtonText, referralSource === "facebook" && styles.selectedButtonText]}>Facebook</Text>
            </Pressable>

            <Pressable 
              style={styles.socialButton}
              onPress={() => handleSelection("referral_source", "tiktok", 3, setReferralSource)}
            >
              <Image source={require("../assets/TikTokLogo.png")} style={styles.socialIcon} />
              <Text style={[styles.socialButtonText, referralSource === "tiktok" && styles.selectedButtonText]}>TikTok</Text>
            </Pressable>

            <Pressable 
              style={styles.socialButton}
              onPress={() => handleSelection("referral_source", "youtube", 3, setReferralSource)}
            >
              <Image source={require("../assets/YoutubeLogo.png")} style={styles.socialIcon} />
              <Text style={[styles.socialButtonText, referralSource === "youtube" && styles.selectedButtonText]}>Youtube</Text>
            </Pressable>

            <Pressable 
              style={styles.socialButton}
              onPress={() => handleSelection("referral_source", "friends_or_family", 3, setReferralSource)}
            >
              <Image source={require("../assets/PersonIcon.png")} style={styles.socialIcon} />
              <Text style={[styles.socialButtonText, referralSource === "friends_or_family" && styles.selectedButtonText]}>Friends or Family</Text>
            </Pressable>
          </View>
        </>
      )}

      {(step === 3) && (
        <>
          <View style={styles.step3TopSection}>
            {renderBackButton(step)}
            <View style={styles.step3ContentWrapper}>
              <Text style={styles.step3MainHeader}>How Often Do You Buy Clothes Online?</Text>
              <Text style={styles.step3SubHeader}>
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View style={styles.step3BottomSection}>
            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("clothes_bought_frequency", "frequently", 4, setClothesBoughtFrequency)}
            >
              <Text style={[styles.selectButtonText, clothesBoughtFrequency === "frequently" && styles.selectedButtonText]}>Frequently</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("clothes_bought_frequency", "occasionally", 4, setClothesBoughtFrequency)}
            >
              <Text style={[styles.selectButtonText, clothesBoughtFrequency === "occasionally" && styles.selectedButtonText]}>Occasionally</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("clothes_bought_frequency", "rarely", 4, setClothesBoughtFrequency)}
            >
              <Text style={[styles.selectButtonText, clothesBoughtFrequency === "rarely" && styles.selectedButtonText]}>Rarely</Text>
            </Pressable>
            <View style={styles.mobilePhoneImageContainer}>
              <Image source={require("../assets/mobile-phone.png")} style={styles.mobilePhoneImage} />
            </View>
          </View>
        </>
      )} 

      {(step === 4) && (
        <>
          <View style={styles.step4TopSection}>
            {renderBackButton(step)}
            <View style={styles.step4ContentWrapper}>
              <Text style={styles.step4MainHeader}>What Type of Clothes Do You Shop For Most Often?</Text>
              <Text style={styles.step4SubHeader}>
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View style={styles.step4BottomSection}>
            <View style={styles.clothingTypeGrid}>
              <View style={styles.clothingTypeRow}>
                <Pressable 
                  style={styles.clothingTypeItem}
                  onPress={() => handleSelection("most_shopped_clothing_type", "streetwear", 5, setMostShoppedClothingType)}
                >
                  <Image source={require("../assets/streetwear.png")} style={styles.clothingTypeImage} />
                  <Text style={[styles.clothingTypeLabel, mostShoppedClothingType === "streetwear" && styles.selectedButtonText]}>Streetwear</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.clothingTypeItem}
                  onPress={() => handleSelection("most_shopped_clothing_type", "casual", 5, setMostShoppedClothingType)}
                >
                  <Image source={require("../assets/casual.png")} style={styles.clothingTypeImage} />
                  <Text style={[styles.clothingTypeLabel, mostShoppedClothingType === "casual" && styles.selectedButtonText]}>Casual</Text>
                </Pressable>
              </View>
              
              <View style={styles.clothingTypeRow}>
                <Pressable 
                  style={styles.clothingTypeItem}
                  onPress={() => handleSelection("most_shopped_clothing_type", "classic", 5, setMostShoppedClothingType)}
                >
                  <Image source={require("../assets/classic.png")} style={styles.clothingTypeImage} />
                  <Text style={[styles.clothingTypeLabel, mostShoppedClothingType === "classic" && styles.selectedButtonText]}>Classic</Text>
                </Pressable>
                
                <Pressable 
                  style={styles.clothingTypeItem}
                  onPress={() => handleSelection("most_shopped_clothing_type", "unorthodox", 5, setMostShoppedClothingType)}
                >
                  <Image source={require("../assets/unorthodox.png")} style={styles.clothingTypeImage} />
                  <Text style={[styles.clothingTypeLabel, mostShoppedClothingType === "unorthodox" && styles.selectedButtonText]}>Unorthodox</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </>
      )}

      {(step === 5) && (
        <>
          <View style={styles.topSection}>
            {renderBackButton(step)}
            <View style={styles.contentWrapper}>
              <Text style={styles.mainHeader}>Please give us a rating </Text>
              <Text style={styles.subHeader}>
                Your feedback helps us improve!
              </Text>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => {
                if (InAppReview.isAvailable()) {
                  InAppReview.RequestInAppReview()
                    .then((hasFlowFinishedSuccessfully) => {
                      handleSelection(null, null, 6);
                    })
                    .catch((error) => {
                      handleSelection(null, null, 6);
                    });
                } else {
                  handleSelection(null, null, 6);
                }
              }}
            >
              <Text style={styles.selectButtonText}>Rate & Continue</Text>
            </Pressable>
            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => {
                
                  handleSelection(null, null, 6);
                
              }}
            >
              <Text style={styles.selectButtonText}>Continue</Text>
            </Pressable>
          </View>
        </>
      )}

      {(step === 6) && (
        <>
          <View style={styles.step6TopSection}>
            {renderBackButton(step)}
            <View style={styles.step6ContentWrapper}>
              <Text style={styles.step6MainHeader}>How often do you try to visualize what an outfit looks like on you before buying?</Text>
              <Text style={styles.step6SubHeader}>
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View style={styles.step6BottomSection}>
            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("outfit_visualize_frequency", "always", 7, setOutfitVisualizeFrequency)}
            >
              <Text style={[styles.selectButtonText, outfitVisualizeFrequency === "always" && styles.selectedButtonText]}>Always</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("outfit_visualize_frequency", "never", 7, setOutfitVisualizeFrequency)}
            >
              <Text style={[styles.selectButtonText, outfitVisualizeFrequency === "never" && styles.selectedButtonText]}>Never</Text>
            </Pressable>
          </View>
        </>
      )} 

      {(step === 7) && (
        <>
          <View style={styles.step7TopSection}>
            {renderBackButton(step)}
            <View style={styles.step7ContentWrapper}>
              <Text style={styles.step7MainHeader}>How confident are you when picking your size online?</Text>
              <Text style={styles.step7SubHeader}>
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View style={styles.step7BottomSection}>
            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("size_picking_confidence", "very", 8, setSizePickingConfidence)}
            >
              <Text style={[styles.selectButtonText, sizePickingConfidence === "very" && styles.selectedButtonText]}>Very confident - I rarely get it wrong</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("size_picking_confidence", "somewhat", 8, setSizePickingConfidence)}
            >
              <Text style={[styles.selectButtonText, sizePickingConfidence === "somewhat" && styles.selectedButtonText]}>Somewhat confident - I guess and hope</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("size_picking_confidence", "not", 8, setSizePickingConfidence)}
            >
              <Text style={[styles.selectButtonText, sizePickingConfidence === "not" && styles.selectedButtonText]}>Not confident - its always a gamble</Text>
            </Pressable>
          </View>
        </>
      )} 

      {(step === 8) && (
        <>
          <View style={styles.step8TopSection}>
            {renderBackButton(step)}
            <View style={styles.step8ContentWrapper}>
              <Text style={styles.step8MainHeader}>What's Your Biggest Issue Shopping Online?</Text>
              <Text style={styles.step8SubHeader}>
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View style={styles.step8BottomSection}>
            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("biggest_issue_shopping_online", "Finding the right size", 9, setBiggestIssueShoppingOnline)}
            >
              <Text style={[styles.selectButtonText, biggestIssueShoppingOnline === "Finding the right size" && styles.selectedButtonText]}>Finding the right size</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("biggest_issue_shopping_online", "Styling the clothes", 9, setBiggestIssueShoppingOnline)}
            >
              <Text style={[styles.selectButtonText, biggestIssueShoppingOnline === "Styling the clothes" && styles.selectedButtonText]}>Styling the clothes</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("biggest_issue_shopping_online", "Indecisiveness", 9, setBiggestIssueShoppingOnline)}
            >
              <Text style={[styles.selectButtonText, biggestIssueShoppingOnline === "Indecisiveness" && styles.selectedButtonText]}>Indecisiveness</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("biggest_issue_shopping_online", "Item isnt how I imagined", 9, setBiggestIssueShoppingOnline)}
            >
              <Text style={[styles.selectButtonText, biggestIssueShoppingOnline === "Item isnt how I imagined" && styles.selectedButtonText]}>Item isn't how I imagined</Text>
            </Pressable>
          </View>
        </>
      )} 

      {(step === 9) && (
        <>
          <View style={styles.step9TopSection}>
            {renderBackButton(step)}
            <View style={styles.step9ContentWrapper}>
              <Text style={styles.step9MainHeader}>What Do You Do When An Online Order Doesn't Fit?</Text>
              <Text style={styles.step9SubHeader}>
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View style={styles.step9BottomSection}>
            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("order_misfit_handling", "return it", 10, setOrderMisfitHandling)}
            >
              <Text style={[styles.selectButtonText, orderMisfitHandling === "return it" && styles.selectedButtonText]}>Return It</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("order_misfit_handling", "gift it", 10, setOrderMisfitHandling)}
            >
              <Text style={[styles.selectButtonText, orderMisfitHandling === "gift it" && styles.selectedButtonText]}>Gift It</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("order_misfit_handling", "resell it", 10, setOrderMisfitHandling)}
            >
              <Text style={[styles.selectButtonText, orderMisfitHandling === "resell it" && styles.selectedButtonText]}>Resell It</Text>
            </Pressable>

            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("order_misfit_handling", "nothing", 10, setOrderMisfitHandling)}
            >
              <Text style={[styles.selectButtonText, orderMisfitHandling === "nothing" && styles.selectedButtonText]}>Nothing</Text>
            </Pressable>
          </View>
        </>
      )} 

      {(step === 10) && (
        <>
          <View style={styles.step10TopSection}>
            {renderBackButton(step)}
            <View style={styles.step10ContentWrapper}>
              <Text style={styles.step10MainHeader}>How Often Do You Regret Clothing Purchases Online?</Text>
              <Text style={styles.step10SubHeader}>
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View style={styles.step10BottomSection}>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderValueText}>{sliderValue === 0 ? "Never" : sliderValue === 100 ? "Very Often" : 
                sliderValue <= 25 ? "Rarely" : 
                sliderValue <= 50 ? "Sometimes" : 
                sliderValue <= 75 ? "Often" : "Very Often"}</Text>
              
              <View style={styles.sliderTrack}>
                <Slider
                  style={styles.slider}
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
              
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>Never</Text>
                <Text style={styles.sliderLabelText}>Very Often</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.step10ContinueButton}
              onPress={() => handleSelection("clothing_purchase_regrets", sliderValue, 11, setClothingPurchaseRegrets)}
            >
              <Text style={styles.step10ContinueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {(step === 11) && (
        <>
          <View style={styles.step11TopSection}>
            {renderBackButton(step)}
            <View style={styles.step11ContentWrapper}>
              <Text style={styles.step11MainHeader}>Have you ever kept an item you did't love just because returning it felt like too much of a hassle?</Text>
              <Text style={styles.step11SubHeader}>
                Helps make more accurate generations
              </Text>
            </View>
          </View>

          <View style={styles.step11BottomSection}>
            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("return_hesitation", "yes", 12, setReturnHesitation)}
            >
              <Text style={[styles.selectButtonText, returnHesitation === "yes" && styles.selectedButtonText]}>Yes</Text>
            </Pressable>
            <Pressable 
              style={[styles.selectButton, styles.selectedButton]}
              onPress={() => handleSelection("return_hesitation", "no", 12, setReturnHesitation)}
            >
              <Text style={[styles.selectButtonText, returnHesitation === "no" && styles.selectedButtonText]}>No</Text>
            </Pressable>
          </View>
        </>
      )} 

      {(step === 12) && (
        <View style={styles.thankyouContainer}>
          <View style={styles.thankyouContentWrapper}>
            <Image source={require("../assets/Helix.png")} style={styles.helixImage} />
            
            <Text style={styles.thankyouHeader}>Thank You for trusting us</Text>
            
            <Text style={styles.thankyouSubHeader}>
              We promise to always keep your personal information private and secure.
            </Text>
            
            <Pressable 
              style={styles.continueButton}
              onPress={() => handleTryOnNavigate()}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  subscribeBar: {
    paddingTop: 56,
    backgroundColor: "black",
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, 
    position: "absolute", 
    zIndex: 10,
  },
  subscribeText: {
    color: "white",
    fontSize: 14,
    fontFamily: FONTS.SATOSHI,
    fontWeight: "400",
  },
  subscribeBarPressed: {
    backgroundColor: "#333333",
    transform: [{ scale: 0.98 }],
  },
  topSection: {
    flex: 1.2,
    paddingHorizontal: 30,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 90,
  },
  contentWrapper: {
    width: "100%",
  },
  bottomSection: {
    flex: 2,
    paddingHorizontal: 60,
    justifyContent: "flex-start", 
    paddingTop: 0,
    marginBottom: 28,
  },
  mainHeader: {
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: FONTS.SATOSHI,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  backButton: {
    position: "absolute",
    top: 80, 
    left: 20,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  backButtonText: {
    fontSize: 28,
    fontWeight: "300", 
    color: "#000",
  },
  onboardingImage: {
    width: "100%",
    height: 280,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    padding: 16,
    marginBottom: 35,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 35,
  },
  step1Button: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  bodyTypeImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  bodyTypeImage: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
  },
  buttonPressed: {
    backgroundColor: "#333333",
    transform: [{ scale: 0.98 }],
  },
  selectedButton: {
    backgroundColor: "#000",
  },
  buttonIcon: {
    marginRight: 10,
  },
  selectedButtonText: {
    color: "#7A8BFF", 
    fontWeight: "700",  
  },
  selectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  regularText: {
    fontSize: 16,
    color: "#000",
    fontFamily: FONTS.SATOSHI,
  },
  signInText: {
    fontSize: 16,
    color: "#4051FF", 
    fontFamily: FONTS.SATOSHI,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4052FF",
  },
  step1TopSection : {
    flex: 1.2,
    paddingHorizontal: 30,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 50,
  },
  step1ContentWrapper: {
    width: "100%",
  },
  step1MainHeader: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },
  step1SubHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: FONTS.SATOSHI,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  step1BottomSection: {
    flex: 2,
    paddingHorizontal: 30,
    justifyContent: "flex-start", 
    paddingTop: 0,
    marginBottom: 300,
  },
  step1ButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 45,
  },
  step1ButtonText: {
    color: "white",
    fontSize: 10,
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI,
  },
  referralImage: {
    height: 30,
    width:30,
  },
  step2ContentWrapper: {
    width: "100%",
  },
  step2TopSection : {
    flex: 1.2,
    paddingHorizontal: 30,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 50,
  },
  step2MainHeader: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 30,
    width: "100%",
    justifyContent: "flex-start", 
  },
  socialIcon: {
    width: 36,
    height: 36,
    marginLeft:20,
    resizeMode: "contain",
  },
  socialButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI,
    flex: 1,      
    textAlign: "center", 
    marginRight: 50, 
  },
  step2BottomSection: {
    flex: 2,
    paddingHorizontal: 30,
    justifyContent: "flex-start", 
    paddingTop: 20,
    marginBottom: 350,
  },
  step3TopSection : {
    flex: 1.2,
    paddingHorizontal: 30,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 50,
  },
  step3ContentWrapper: {
    width: "100%",
  },
  step3MainHeader: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },
  step3SubHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: FONTS.SATOSHI,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  step3BottomSection: {
    flex: 2,
    paddingHorizontal: 30,
    justifyContent: "flex-start", 
    paddingTop: 0,
    marginBottom: 180,
  },
  mobilePhoneImageContainer : {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  mobilePhoneImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  step4TopSection: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 50,
  },
  step4ContentWrapper: {
    width: "100%",
  },
  step4MainHeader: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },
  step4SubHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: FONTS.SATOSHI,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  step4BottomSection: {
    flex: 2,
    paddingHorizontal: 50,
    justifyContent: "flex-start",
    paddingTop: 0,
    marginBottom:140,
  },
  clothingTypeGrid: {
    width: "100%",
  },
  clothingTypeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  clothingTypeItem: {
    width: "48%",
    alignItems: "center",
  },
  clothingTypeImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    marginBottom: 10,
  },
  clothingTypeLabel: {
    fontSize: 18,
    color: "#000",
    fontFamily: FONTS.SATOSHI,
    fontWeight: "500",
    textAlign: "center",
  },
  step6ContentWrapper: {
    width: "100%",
  },
  step6TopSection : {
    flex: 1.2,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 50,
  },
  step6MainHeader: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },
  step6BottomSection: {
    flex: 2,
    paddingHorizontal: 30,
    justifyContent: "flex-start", 
    paddingTop: 55,
  },
  step6SubHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: FONTS.SATOSHI,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  step7ContentWrapper: {
    width: "100%",
  },
  step7TopSection : {
    flex: 1.2,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 50,
  },
  step7MainHeader: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },
  step7BottomSection: {
    flex: 2,
    paddingHorizontal: 30,
    justifyContent: "flex-start", 
  },
  step7SubHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: FONTS.SATOSHI,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  step8ContentWrapper: {
    width: "100%",
  },
  step8TopSection : {
    flex: 1.2,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 50,
  },
  step8MainHeader: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },
  step8BottomSection: {
    flex: 2,
    paddingHorizontal: 30,
    justifyContent: "flex-start", 
    marginBottom: 140
  },
  step8SubHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: FONTS.SATOSHI,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  step9ContentWrapper: {
    width: "100%",
  },
  step9TopSection : {
    flex: 1.2,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 50,
  },
  step9MainHeader: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },  
  step9BottomSection: {
    flex: 2,
    paddingHorizontal: 30,
    justifyContent: "flex-start", 
    marginBottom: 140
  },
  step9SubHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: FONTS.SATOSHI,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  step10ContentWrapper: {
    width: "100%",
  },
  step10TopSection: {
    flex: 1.2,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 50,
  },
  step10MainHeader: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },
  step10SubHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: FONTS.SATOSHI,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  step10BottomSection: {
    flex: 2,
    paddingHorizontal: 30,
    marginBottom: 230,
    alignItems: "center",
  },
  sliderContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
  },
  sliderValueText: {
    fontSize: 24,
    color: "#000",
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI,
    marginBottom: 40,
  },
  sliderTrack: {
    width: "100%",
    height: 120,
    padding: 15,
    backgroundColor: "#000",
    borderRadius: 18,
    justifyContent: "center",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  sliderLabelText: {
    color: "#666",
    fontSize: 14,
    fontFamily: FONTS.SATOSHI,
  },
  continueButton: {
    backgroundColor: "#000",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 30,
    alignItems: "center",
    width: "80%",
    marginTop: 20,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI,
  },
  step10ContinueButton: {
    backgroundColor: "#000",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  step10ContinueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI,
  },
  step11ContentWrapper: {
    width: "100%",
  },
  step11TopSection : {
    flex: 1.2,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 50,
  },
  step11MainHeader: {
    marginTop: 30,
    fontSize: 30,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },
  step11BottomSection: {
    flex: 2,
    paddingHorizontal: 30,
    justifyContent: "flex-start", 
    marginTop: 45,
    marginBottom: 0
  },
  step11SubHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
    fontFamily: FONTS.SATOSHI,
    lineHeight: 22,
    paddingHorizontal: 10,
  },   
  thankyouContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 200,
    alignItems: "center",
  },
  thankyouContentWrapper: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  helixImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 30,
  },
  thankyouHeader: {
    fontSize: 34,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: FONTS.SWITZER,
    paddingHorizontal:20
  },
  thankyouSubHeader: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 10,
    lineHeight: 28,
    fontFamily: FONTS.SATOSHI,
    marginBottom: 40, 
  },
});