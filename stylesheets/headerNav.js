import { FONTS } from "../constants/fonts";
import {  StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
      paddingTop: 55,
      paddingBottom: 12,
      backgroundColor: "white",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2,
    },
    gradient: {
      position: "absolute",
      left: 0,
      right: 0,
      height: 100,
      zIndex: 1,
    },
    smallGradient: {
      top: 10, // Positioned right below the small header (30 + 8 + padding/margins)
    },
    regularGradient: {
      top: 70, // Positioned right below the regular header (55 + 12 + padding/margins)
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
  });