import { StyleSheet, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

// Phone fractions were tuned for narrow screens; on the much wider iPad they
// produce oversized tiles, so use a smaller fraction there (same aspect ratio).
const TILE_W = width * (Platform.isPad ? 0.2 : 0.31);
const TILE_H = width * (Platform.isPad ? 0.226 : 0.35);

export const styles = StyleSheet.create({
  tileWrapper: {
    width: TILE_W,
    height: TILE_H,
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
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardShadowLift: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
});
