import React, { useState } from "react";
import { TouchableOpacity, Text, View, Alert } from "react-native";
import { supabase } from "../App";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { styles } from "../stylesheets/primaryButton";
import mixpanel from "../utils/mixpanel";
import { trackAppsFlyerPurchase } from "../utils/appsflyer";
import { triggerHaptic } from "../utils/haptics";
import Purchases from "react-native-purchases";

export default function AvatarTryOnButton({ disabled = false, inputClothImage, selectedAvatar, tokensUsed, tokensTotal, profile, plan, navigation, extraTokensTotal }) {
  const [loading, setLoading] = useState(false);

  const presentPaywallIfNeeded = async () => {
    if (profile.price_id === null && !profile.all_access && plan === null && extraTokensTotal < 1) {
      const offerings = await Purchases.getOfferings();

      const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
        requiredEntitlementIdentifier: "Unlimited",
        offering: offerings.all["Plans Vibe"]
      });

      mixpanel.track("Paywall Displayed On Avatar Screen");
      switch (paywallResult) {
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
          navigation.replace("Avatar");
          break;
        case PAYWALL_RESULT.PURCHASED:
          await trackAppsFlyerPurchase();
          mixpanel.track("Paywall CTA Clicked On Avatar Screen");
          break;
        case PAYWALL_RESULT.RESTORED:
          // Don't track restores - not a new purchase
          break;
      }
    }
  }

  const handleTryOn = async () => {
    triggerHaptic();
    if (!selectedAvatar || !selectedAvatar.slug || selectedAvatar.status !== "success") {
      Alert.alert("Error", "Please create and select an avatar first");
      return;
    }

    if (!inputClothImage || !inputClothImage.slug) {
      Alert.alert("Error", "Please select a clothing image");
      return;
    }

    await presentPaywallIfNeeded();

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
        avatar_slug: selectedAvatar.slug,
        clothes_image_slug: inputClothImage.slug
      };

      const response = await fetch("https://my-fitting-room-server.onrender.com/api/avatar/try-on", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error("Failed to process avatar try-on request");
      }

      mixpanel.track("Avatar Try On Clicked");

      navigation.replace("Avatar");

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
          {loading ? "Processing..." : "Try It On"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
