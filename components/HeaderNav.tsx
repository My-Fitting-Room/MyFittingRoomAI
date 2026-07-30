import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { styles } from "../stylesheets/headerNav";
import { triggerHaptic } from "../utils/haptics";

// Eased multi-stop fade so the falloff is curved, not linear.
// Starts at full opacity so there's no jump from the solid white header.
const GRADIENT_COLORS = [
  "rgba(255,255,255,1)",
  "rgba(255,255,255,0.7)",
  "rgba(255,255,255,0.4)",
  "rgba(255,255,255,0.15)",
  "rgba(255,255,255,0)",
];
const GRADIENT_LOCATIONS = [0, 0.4, 0.65, 0.85, 1.0];

export default function HeaderNav({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const isSmall = width === 375 && height === 667;

  const handleLogoPress = () => {
    triggerHaptic();
    navigation.navigate("TryOn");
  };

  return (
    <>
      <View style={isSmall ? styles.smallHeader : styles.header}>
        <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
          <Image source={require("../assets/mfr-logo2.png")} style={styles.logoImage} />
          <Text style={styles.logoText}>My Fitting Room</Text>
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={GRADIENT_COLORS}
        locations={GRADIENT_LOCATIONS}
        style={[styles.gradient, isSmall ? styles.smallGradient : styles.regularGradient]}
        pointerEvents="none"
      />
    </>
  );
}
