import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions, View, Alert } from "react-native";
import { supabase } from "../App";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { styles } from "../stylesheets/primaryButton";
import mixpanel from "../utils/mixpanel";
import { trackAppsFlyerPurchase } from "../utils/appsflyer";
import { triggerHaptic } from "../utils/haptics";
import Purchases from "react-native-purchases";

export default function TryOnButton({ disabled = false, inputClothImage, inputModelImage, tokensUsed, tokensTotal, profile, plan, navigation, extraTokensTotal }) {
  const [loading, setLoading] = useState(false);

  const presentPaywallIfNeeded = async (): Promise<boolean> => {
    if (profile.price_id === null && !profile.all_access && plan === null && extraTokensTotal < 1) {
      const offerings = await Purchases.getOfferings();

      const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "Unlimited",
        offering: offerings.all["Plans Vibe"]
      });

      mixpanel.track("Paywall Displayed On Try On Screen");
      switch (paywallResult) {
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          navigation.replace("TryOn");
          return false;
        case PAYWALL_RESULT.PURCHASED:
          await trackAppsFlyerPurchase();
          mixpanel.track("Paywall CTA Clicked On Try On Screen");
          break;
        case PAYWALL_RESULT.RESTORED:
          // Don't track restores - not a new purchase
          break;
      }
    }
    return true;
  }

  const handleTryOn = async () => {
    triggerHaptic();
    if (!inputClothImage || !inputModelImage || !inputClothImage.slug || !inputModelImage.slug) {
      Alert.alert("Error", "Please select both model and clothing images");
      return;
    }

    const allowed = await presentPaywallIfNeeded();
    if (!allowed) return;

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || !session.access_token) {
        Alert.alert("Error", "Authentication required");
        setLoading(false);
        return;
      }

      if (plan?.unlimited_tokens === false && !profile.all_access && extraTokensTotal < 1) {
        if (tokensUsed + 1 > tokensTotal) {
          Alert.alert("Error", "Monthly Token Limit Reached");
          setLoading(false);
          return;
        }
      }

      const requestBody = {
        model_image_slug: inputModelImage.slug,
        clothes_image_slug: inputClothImage.slug
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

      navigation.replace("TryOn");

    } catch (error) {
      Alert.alert("Try-on Failed", "Failed to process your request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.buttonContainer,
          disabled && styles.disabledButton,
          loading && styles.loadingButton
        ]}
        disabled={disabled || loading}
        onPress={handleTryOn}
      >
        <Text style={styles.buttonText}>
          {loading ? "Processing..." : "Try On"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}