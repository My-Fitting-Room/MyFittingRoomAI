import { FONTS } from "../constants/fonts";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    paddingTop: 30,
    paddingHorizontal: 30,
    marginTop: 15,
    marginHorizontal: Platform.isPad ? "12%" : 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  containerGlass: {
    backgroundColor: "transparent",
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
  selectedImageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20, 
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 8,
  },
  actionButtonText: {
    fontSize: 16,
    marginLeft: 5,
    color: "#4052FF",
  },
  uploadSection: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  uploadButton: {
    alignItems: "center",
  },
  uploadText: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: FONTS.SWITZER
  },
  tip: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: FONTS.SATOSHI
  },
  // Vertical padding keeps the cards' shadows and the 1.04 selected-state
  // scale inside the horizontal ScrollView's clip bounds
  horizontalScrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
});