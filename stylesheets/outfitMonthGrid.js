import { StyleSheet } from "react-native";
import { FONTS } from "../constants/fonts";

export const styles = StyleSheet.create({
  container: {},
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 15,
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
  },
  weekdayCell: {
    flex: 1,
    paddingVertical: 5,
    alignItems: "center",
  },
  weekdayCellLast: {},
  weekdayLabel: {
    fontSize: 11,
    color: "#9A9A9A",
    fontFamily: FONTS.SATOSHI,
  },
  gridContainer: {},
  weekRow: {
    flexDirection: "row",
  },
});
