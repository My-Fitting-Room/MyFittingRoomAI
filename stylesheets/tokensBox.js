import { FONTS } from "../constants/fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 10,
  },
  contentContainer: {
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tokenText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
    textAlign: "center",
    fontFamily: FONTS.SATOSHI,
    marginBottom:6
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginTop: 16,
    width: "100%",
  },
});