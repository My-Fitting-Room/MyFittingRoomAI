import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Dimensions, View, Alert } from "react-native";
import { supabase } from "../App";
import { useNavigation } from "@react-navigation/native";
import { FONTS } from "../constants/fonts";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

const { width } = Dimensions.get("window");

export default function TryOnButton({ disabled = false, inputClothImage, inputModelImage, tokensUsed, tokensTotal,plan }) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const presentPaywallIfNeeded = async () => {
    // Present paywall for current offering:
  if(plan === null) {
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywallIfNeeded({
      requiredEntitlementIdentifier: "Unlimited"
  });
  }
   
    // If you need to present a specific offering:
    
  }

  const handleTryOn = async () => {
    if (!inputClothImage || !inputModelImage || !inputClothImage.slug || !inputModelImage.slug) {
      Alert.alert("Error", "Please select both model and clothing images");
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

      if (tokensUsed +1 > tokensTotal) {
        Alert.alert("Error", "Monthly Token Limit Reached");
        setLoading(false);
        return;
      }

      const requestBody = {
        model_image_slug: inputModelImage.slug,
        clothes_image_slug: inputClothImage.slug
      };

      const response = await fetch("https://my-fitting-room-server.onrender.com/api/kling/vton2", {
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
      
      navigation.navigate("TryOn", { result });
      
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
          {loading ? "Processing..." : "Try-on/Generate"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: 15,
  },
  buttonContainer: {
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 50,
    paddingVertical: 16,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d3d3d3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 20,
    color: "#666",
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingButton: {
    backgroundColor: "#f5f5f5",
  }
});