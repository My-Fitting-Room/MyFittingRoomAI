import { FONTS } from "../constants/fonts";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 30,
    marginTop: 15,
    marginHorizontal: 15,
    marginBottom:20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heading: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 10,
    fontFamily: FONTS.SWITZER,
  },
  subheading: {
    fontSize: 10,
    marginBottom: 20,
    fontFamily: FONTS.SATOSHI,
    fontWeight: "400",
    color:"#868686"
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
  yourModelsHeading: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 15,
    marginTop: 10,
    marginBottom: 20,
    fontFamily: FONTS.SWITZER,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  thumbnailContainer: {
    width: 120,
    height: 150,
    marginRight: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  selectedThumbnail: {
    // No border or styling for selected thumbnail
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
});