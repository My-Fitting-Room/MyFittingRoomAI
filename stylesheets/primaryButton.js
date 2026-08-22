import { FONTS } from "../constants/fonts";
import { StyleSheet } from "react-native";

// Shared primary action button (TryOnButton + AvatarTryOnButton):
// full-width rounded black pill
export const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 28,
  },
  buttonContainer: {
    width: "100%",
    height: 52,
    backgroundColor: "#000",
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingButton: {
    backgroundColor: "#333",
  },
  // Mirrors the onboarding Continue button's tap feedback
  // (active:bg-neutral-800 + active:scale-[0.98]).
  buttonPressed: {
    backgroundColor: "#262626",
    transform: [{ scale: 0.98 }],
  }
});
