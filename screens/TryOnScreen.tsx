import React, { useState, useEffect } from "react";
import { View, Text, Alert, ScrollView, StatusBar, Platform, ActivityIndicator, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { trackAppsFlyerPurchase } from "../utils/appsflyer";
import Purchases from "react-native-purchases";

const IS_IOS26 = Platform.OS === "ios" && parseInt(Platform.Version as string, 10) >= 26;

export default function TryOnScreen({ navigation, route }: { navigation: any, route: any }) {
  const insets = useSafeAreaInsets();
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
  const isSmall = width === 375 && height === 667;
  const headerHeight = IS_IOS26 ? (isSmall ? 79 : 107) : 0;

  const shouldShowPaywall = (profileData, planData, extraTokens) => {
    return profileData.price_id === null &&
      !profileData.all_access &&
      planData === null &&
      extraTokens < 1;
  };

  const presentInitialPaywall = async () => {
    try {
      const offerings = await Purchases.getOfferings();

      const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "Unlimited",
        offering: offerings.all["Plans Vibe"]
      });

      const fromOnboarding = route.params?.fromOnboarding;

      mixpanel.track(fromOnboarding ? "Paywall displayed on onboarding" : "Paywall displayed on Try-On screen", {
        source: 'try_on_entry',
        user_id: profile?.id
      });
      mixpanel.track("Paywall viewed");

      switch (paywallResult) {
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          mixpanel.track(fromOnboarding ? "Paywalls dismissed on onboarding" : "Paywall Dismissed On Try On Screen", {
            reason: paywallResult
          });
          setPaywallDismissed(true);
          break;
        case PAYWALL_RESULT.PURCHASED:
          await trackAppsFlyerPurchase();
          mixpanel.track(fromOnboarding ? "Paywall CTA clicked on onboarding" : "Paywall CTA Clicked On Try On Screen", {
            result: 'purchased'
          });
          navigation.replace("TryOn");
          break;
        case PAYWALL_RESULT.RESTORED:
          // Don't track restores - not a new purchase
          navigation.replace("TryOn");
          break;
      }
    } catch (error) {

      console.log('err', error)
      mixpanel.track('Try On Screen Error', {
        error_type: 'paywall_error',
        error_message: (error as Error).message
      });
      setPaywallDismissed(true);
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

        if (shouldShowPaywall(profileData, planData, extraTokens) && !paywallDismissed) {
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
    <View className={styles.container} style={{ paddingTop: IS_IOS26 ? 0 : insets.top, paddingBottom: insets.bottom }}>
      <HeaderNav navigation={navigation} />
      <ScrollView
        className={styles.content}
        contentContainerStyle={{ paddingHorizontal: 5, paddingTop: headerHeight }}
      >
        <TryOnImages profile={profile} navigation={navigation} />
        <ModelImages setInputModelImage={setInputModelImage} profile={profile} navigation={navigation} />
        <ClothesImages setInputClothImage={setInputClothImage} profile={profile} navigation={navigation} />
        {/* Cancel the ScrollView's 5pt content padding so the button's
            insets match the Avatar screen's exactly */}
        <View style={{ marginHorizontal: -5 }}>
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
        </View>
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
    </View>
  );
}


