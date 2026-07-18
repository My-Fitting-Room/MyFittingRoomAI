import { FONTS } from "../constants/fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  // Vertical padding keeps the cards' shadows and the 1.04 selected-state
  // scale inside the horizontal ScrollView's clip bounds
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  hintText: {
    fontSize: 13,
    color: "#6B6B6B",
    marginLeft: 16,
    fontFamily: FONTS.SATOSHI,
  },
});
