import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, StatusBar } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { FONTS } from "../constants/fonts";

export default function HeaderNav({navigation}) {

  const handleLogoPress = () => {
    navigation.navigate("TryOn");
  };

  const handleProfilePress = () => {
    navigation.navigate("Settings");
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
        <Image source={require("../assets/mfr-logo2.png")} style={styles.logoImage} />
        <Text style={styles.logoText}>My Fitting Room</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileIcon} onPress={handleProfilePress}>
        <Ionicons name="person-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
    fontSize: 22,
    fontWeight: "600",
    color: "#000000",
    marginLeft: 12,
    fontFamily: FONTS.SWITZER,
  },
  profileIcon: {
    padding: 8,
  },
});