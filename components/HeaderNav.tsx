import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, StatusBar, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FONTS } from "../constants/fonts";

export default function HeaderNav({navigation}) {
  const { width } = Dimensions.get("window");
  const deviceType = width <= 375 ? "small" : width <= 390 ? "regular" : "proMax";
  
  const handleLogoPress = () => {
    navigation.navigate("TryOn");
  };

  const handleProfilePress = () => {
    navigation.navigate("Settings");
  };

  if(deviceType === "small") {
    return (
      <>
        <View style={styles.smallHeader}>
          <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
            <Image source={require("../assets/mfr-logo2.png")} style={styles.logoImage} />
            <Text style={styles.logoText}>My Fitting Room</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
            <Ionicons name="person-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
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
          <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
            <Ionicons name="person-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  smallHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 8,
    backgroundColor: "white", 
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2, 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "white", 
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2, 
    ...Platform.select({
      ios: {
        paddingTop: 50, 
      },
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginLeft: 12,
    fontFamily: FONTS.SWITZER,
  },
  profileIcon: {
    paddingTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});