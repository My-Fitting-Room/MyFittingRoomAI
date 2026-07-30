import { StyleSheet } from "react-native";
import { FONTS } from "../constants/fonts";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#D0D0D0",
  },
  weekdayCell: {
    flex: 1,
    paddingVertical: 5,
    alignItems: "center",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: "#D0D0D0",
  },
  weekdayCellLast: {
    borderRightWidth: 0,
  },
  weekdayLabel: {
    fontSize: 11,
    color: "#9A9A9A",
    fontFamily: FONTS.SATOSHI,
  },
  gridContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#D0D0D0",
  },
  weekRow: {
    flexDirection: "row",
  },
});
