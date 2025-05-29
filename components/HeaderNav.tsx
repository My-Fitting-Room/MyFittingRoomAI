import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { styles } from "../stylesheets/headerNav";

export default function HeaderNav({navigation}) {
  const { width , height } = Dimensions.get("window");
  
  const handleLogoPress = () => {
    navigation.navigate("TryOn");
  };
  
  if(width === 375 && height === 667) {
    return (
      <>
        <View style={styles.smallHeader}>
          <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
            <Image source={require("../assets/mfr-logo2.png")} style={styles.logoImage} />
            <Text style={styles.logoText}>My Fitting Room</Text>
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0)"]}
          style={[styles.gradient, styles.smallGradient]}
          pointerEvents="none"
        />
      </>
    );
  } else {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
            <Image source={require("../assets/mfr-logo2.png")} style={styles.logoImage} />
            <Text style={styles.logoText}>My Fitting Room</Text>
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0)"]}
          style={[styles.gradient, styles.regularGradient]}
          pointerEvents="none"
        />
      </>
    );
  }
}