import { FONTS } from "../constants/fonts";
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

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
    marginTop: 80,
  },
  heroImage: {
    width: width * 0.56,
    height: 252,
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
  emptyStateContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
    paddingBottom: 12,
  },
  emptyFigureImage: {
    width: width * 0.32,
    height: height * 0.256,
  },
  // Tighter spacing than the has-avatar heading so the clothes carousel
  // fits above the fold in the empty state
  emptyHeading: {
    marginTop: 16,
  },
  uploadPillButton: {
    marginTop: 14,
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 999,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  uploadPillText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B6B6B",
    fontFamily: FONTS.SATOSHI,
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
});
