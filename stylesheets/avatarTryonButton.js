import { FONTS } from "../constants/fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 28,
  },
  buttonContainer: {
    width: "100%",
    height: 52,
    backgroundColor: "#000",
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingButton: {
    backgroundColor: "#333",
  }
});
