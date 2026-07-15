import { FONTS } from "../constants/fonts";
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "black",
  },
  heroContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  heroImage: {
    width: width * 0.62,
    height: 280,
  },
  heroActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  heroActionButton: {
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  emptyHeroCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 60,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
    marginTop: 28,
    fontFamily: FONTS.SWITZER,
  },
  subtext: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 10,
    paddingHorizontal: 40,
    fontFamily: FONTS.SATOSHI,
  },
  pendingItem: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingBar: {
    width: "100%",
    height: 14,
    backgroundColor: "#000",
    opacity: 0.12,
    borderRadius: 7,
  },
  pendingText: {
    fontSize: 13,
    color: "#000",
    marginTop: 8,
    textAlign: "center",
    fontFamily: FONTS.SATOSHI,
  },
  switcherContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    alignSelf: "center",
  },
  switcherThumbnail: {
    width: 48,
    height: 60,
    marginHorizontal: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
  switcherThumbnailSelected: {
    borderWidth: 1.5,
    borderColor: "#000",
  },
  switcherThumbnailImage: {
    width: "100%",
    height: "100%",
  },
  pickerHeading: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 12,
    fontFamily: FONTS.SWITZER,
  },
  pickerScrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  pickerThumbnail: {
    width: 110,
    height: 140,
    marginRight: 10,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#F4F4F4",
  },
  pickerThumbnailImage: {
    width: "100%",
    height: "100%",
  },
  hintText: {
    fontSize: 13,
    color: "#6B6B6B",
    textAlign: "center",
    marginTop: 20,
    fontFamily: FONTS.SATOSHI,
  },
});
