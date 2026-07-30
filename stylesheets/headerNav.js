import { FONTS } from "../constants/fonts";
import { StyleSheet } from "react-native";

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
    zIndex: 1,
  },
  // top aligned to the bottom of each header so the fade starts at
  // full opacity exactly where the solid white bar ends — no seam.
  // A few pixels of overlap (hidden by the header's zIndex: 2) ensure
  // there's zero gap on sub-pixel boundaries.
  smallGradient: {
    top: 79,
    height: 140,
  },
  regularGradient: {
    top: 107,
    height: 160,
  },
  // Glass-variant layout — same dimensions as smallHeader/header but no backgroundColor.
  // Used only on iOS 26+ where GlassEffectView provides the material background.
  headerBase: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  smallHeaderGlass: {
    paddingTop: 30,
    paddingBottom: 8,
  },
  headerGlass: {
    paddingTop: 55,
    paddingBottom: 12,
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