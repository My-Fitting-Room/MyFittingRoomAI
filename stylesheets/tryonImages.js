import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
    marginTop: 15,
    marginHorizontal: 15,
    elevation: 3,
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
  sectionSubheading: {
    fontSize: 14,
    color: "#000",
    marginBottom: 16,
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
    padding: 16,
    backgroundColor: "rgba(153, 27, 27, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#991B1B",
  },
  failedText: {
    fontSize: 14,
    color: "#EF4444",
  },
  carouselContainer: {
    marginBottom: 24,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  splitImageContainer: {
    flexDirection: "row",
    height: 400,
  },
  leftColumn: {
    width: "33%",
    height: "100%",
  },
  rightColumn: {
    width: "67%",
    height: "100%",
  },
  modelImage: {
    width: "100%",
    height: "50%",
    borderTopLeftRadius: 12,
  },
  clothingImage: {
    width: "100%",
    height: "50%",
    borderBottomLeftRadius: 12,
  },
  resultImage: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  fullImageContainer: {
    height: 400,
  },
  fullImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
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