import { FONTS } from "../constants/fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 36,
  },
  loadingContainer: {
    marginTop: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 16,
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  hintText: {
    fontSize: 13,
    color: "#6B6B6B",
    marginLeft: 16,
    fontFamily: FONTS.SATOSHI,
  },
});
