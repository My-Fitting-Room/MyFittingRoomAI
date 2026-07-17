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
  tileWrapper: {
    width: width * 0.31,
    height: width * 0.35,
    marginRight: 10,
  },
  tileScaler: {
    flex: 1,
  },
  cardShadowRest: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardShadowLift: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#fff",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  hintText: {
    fontSize: 13,
    color: "#6B6B6B",
    marginLeft: 16,
    fontFamily: FONTS.SATOSHI,
  },
});
