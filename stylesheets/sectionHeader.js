import { FONTS } from "../constants/fonts";
import { StyleSheet } from "react-native";

// Canonical section heading style (taken from the original "Your models"
// heading) — every section title in the app renders through SectionHeader
// so font and spacing can't drift apart per screen
export const styles = StyleSheet.create({
  container: {
    marginLeft: 15,
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 20,
    fontFamily: FONTS.SWITZER,
  },
  titleWithSubtitle: {
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "400",
    color: "#868686",
    marginBottom: 20,
    fontFamily: FONTS.SATOSHI,
  },
});
