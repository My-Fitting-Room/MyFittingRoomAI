import { StyleSheet } from "react-native";
import { FONTS } from "../constants/fonts";

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000",
    fontFamily: FONTS.SWITZER,
  },
  chevronButton: {
    padding: 8,
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    color: "#9A9A9A",
    fontFamily: FONTS.SATOSHI,
  },
  weekRow: {
    flexDirection: "row",
  },
});
