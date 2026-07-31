import { FONTS } from "../constants/fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Shared header layout — background material (glass or white fade) is
  // rendered as an absolute-fill layer behind the logo, so no backgroundColor.
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
  ipadHeaderGlass: {
    paddingTop: 30,
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