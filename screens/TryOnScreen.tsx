import React, { useState, useEffect } from "react";
import { View, Text, Alert, SafeAreaView, ScrollView, StatusBar, Platform, ActivityIndicator, Dimensions } from "react-native";
import { supabase } from "../App";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import HeaderNav from "../components/HeaderNav";
import BottomNav from "../components/BottomNav";
import ModelImages from "../components/ModelImages";
import ClothesImages from "../components/ClothesImages";
import TryOnButton from "../components/TryOnButton";
import TryOnImages from "../components/TryOnImages";
import TokensBox from "../components/TokensBox";
import { FONTS } from "../constants/fonts";
import { getStyles } from "../stylesheets/tryonScreen";
import mixpanel from "../utils/mixpanel";

export default function TryOnScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [inputClothImage, setInputClothImage] = useState(null);
  const [inputModelImage, setInputModelImage] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tokensTotal, setTokensTotal] = useState(0);
  const [extraTokensTotal, setExtraTokensTotal] = useState(0);
  const [paywallDismissed, setPaywallDismissed] = useState(false);

  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width, height);

  // Helper function to check if user needs to see paywall
  const shouldShowPaywall = (profileData, planData, extraTokens) => {
    return profileData.price_id === null && 
           !profileData.all_access && 
           planData === null && 
           extraTokens < 1;
  };

  // Function to present initial paywall
  const presentInitialPaywall = async () => {
    try {
      const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "Unlimited"
      });

      mixpanel.track("Paywall Displayed On Try On Screen Entry");
      
      switch (paywallResult) {
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          // User dismissed paywall - allow them to continue
          setPaywallDismissed(true);
          break;
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          mixpanel.track("Paywall CTA Clicked On Try On Screen Entry");
          // Refresh the screen to update user data
          navigation.replace("TryOn");
          break;
      }
    } catch (error) {
      // console.error("Error presenting paywall:", error);
      setPaywallDismissed(true); // Allow user to continue on error
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
          Alert.alert(
            "Error",
            "Please Try Again Later!",
            [{ text: "OK" }]
          );
          return;
        }

        // if (profileData.onboarding_complete === false) {
        //   navigation.navigate("Onboarding");
        //   return;
        // }

        const { data: planData, error: planError } = await supabase
          .from("plans")
          .select("*")
          .eq("price_id", profileData.price_id)
          .maybeSingle();
        
        if (planError) {
          Alert.alert(
            "Error",
            "Please try again later",
            [{ text: "OK" }]
          );
          return;
        }

        const extraTokens = profileData.referral_tokens ?? 0;
        
        setExtraTokensTotal(extraTokens);
        setTokensTotal(planData?.token_allowance ?? 0);
        setPlan(planData);
        setProfile(profileData);
        setLoading(false);

        // Show paywall for non-paying users
        if (shouldShowPaywall(profileData, planData, extraTokens) && !paywallDismissed) {
          // Small delay to ensure UI is ready
          setTimeout(() => {
            presentInitialPaywall();
          }, 500);
        }

      } catch (error) {
        navigation.navigate("SignIn");
      }
    };

    checkSession();
  }, [supabase, paywallDismissed]);

  if (loading) {
    return (
      <View className={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color="black" />
        <Text 
          className={styles.loadingText}
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className={styles.container}>
      <HeaderNav navigation={navigation} />
      <ScrollView 
        className={styles.content} 
        contentContainerStyle={{ paddingHorizontal: 5 }}
      >
        <TryOnImages profile={profile} navigation={navigation} />
        <ModelImages setInputModelImage={setInputModelImage} profile={profile} navigation={navigation} />
        <ClothesImages setInputClothImage={setInputClothImage} profile={profile} navigation={navigation}/>
        <TryOnButton 
          disabled={false} 
          inputClothImage={inputClothImage} 
          inputModelImage={inputModelImage} 
          tokensUsed={profile.tokens_used} 
          tokensTotal={tokensTotal} 
          profile={profile} 
          plan={plan} 
          navigation={navigation} 
          extraTokensTotal={extraTokensTotal}
        />
        <TokensBox 
          tokensUsed={profile.tokens_used} 
          tokensTotal={tokensTotal} 
          plan={plan} 
          extraTokensTotal={extraTokensTotal}
          referralCode={profile.referral_code}
        />
        <View className={styles.bottomPadding} />
      </ScrollView>
      <BottomNav navigation={navigation} activeTab="TryOn" />
    </SafeAreaView>
  );
}