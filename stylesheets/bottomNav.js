import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 130,
    zIndex: 1,
  },
  // iOS 26 glass scrim: solid over the pill + home-indicator zone,
  // fading out across the top 60pt (mirrors the header's fade).
  glassScrim: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    zIndex: 1,
  },
  container: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2, 
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    paddingHorizontal: 25, 
    width: "78%",
    height: 60,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navItem: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleShadow: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    top: 8, // (navbarHeight 60 - bubbleSize 44) / 2
    left: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 6,
  },
  bubbleClip: {
    flex: 1,
    borderRadius: 22,
    overflow: "hidden",
  },
  bubbleFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(64, 82, 255, 0.08)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(64, 82, 255, 0.18)",
  },
});