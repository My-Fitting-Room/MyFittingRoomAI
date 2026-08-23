import { FONTS } from "../constants/fonts";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  filterRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    backgroundColor: "#FFF",
  },
  filterChipActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000",
    fontFamily: FONTS.SATOSHI,
  },
  filterChipTextActive: {
    color: "#FFF",
  },
  savedEmptyText: {
    fontSize: 13,
    color: "#6B6B6B",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 24,
    fontFamily: FONTS.SATOSHI,
  },
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    // Extra top space on iPad so the content clears the taller header fade
    // instead of starting underneath it.
    marginTop: Platform.isPad ? 80 : 15,
    marginHorizontal: Platform.isPad ? "12%" : 15,
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
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 8,
    color: "#000",
  },
  pendingItem: {
    padding: 16,
  },
  loadingBar: {
    width: "100%",
    height: 16,
    backgroundColor: "#6666FF",
    borderRadius: 8,
    opacity: 0.7,
  },
  pendingText: {
    fontSize: 14,
    color: "#000",
    marginTop: 8,
  },
  failedItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
  },
  failedIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  failedText: {
    flex: 1,
    fontSize: 13,
    color: "#000",
  },
  carouselContainer: {
    marginBottom: 24,
  },
  imageContainer: {
    position: "relative",
  },
  splitImageContainer: {
    flexDirection: "row",
    height: Platform.isPad ? 330 : 400,
  },
  leftColumn: {
    width: "33%",
    height: "100%",
  },
  rightColumn: {
    width: "67%",
    height: "100%",
  },
  // Splits the column evenly between however many garments went in (1-3)
  clothingImage: {
    width: "100%",
    flex: 1,
  },
  resultImage: {
    width: "100%",
    height: "100%",
  },
  fullImageContainer: {
    height: Platform.isPad ? 330 : 400,
  },
  fullImage: {
    width: "100%",
    height: "100%",
  },
  navArrow: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -25 }],
    zIndex: 10,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageCounter: {
    alignItems: "center",
    marginTop: 8,
  },
  counterText: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  viewIcon: {
    marginRight: 32,
  },
  deleteIcon: {
    marginLeft: 32,
  },
});
