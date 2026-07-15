import { FONTS } from "../constants/fonts";
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

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
  tile: {
    width: width * 0.44,
    height: width * 0.5,
    marginRight: 12,
    borderRadius: 4,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  tileSelected: {
    borderWidth: 1.5,
    borderColor: "#000",
  },
  tileImage: {
    width: "80%",
    height: "80%",
  },
  hintText: {
    fontSize: 13,
    color: "#6B6B6B",
    marginLeft: 16,
    fontFamily: FONTS.SATOSHI,
  },
});
