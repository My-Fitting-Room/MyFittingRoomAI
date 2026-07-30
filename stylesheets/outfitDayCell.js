import { StyleSheet } from "react-native";
import { FONTS } from "../constants/fonts";

export const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 0.55,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#D0D0D0",
    backgroundColor: "transparent",
    padding: 3,
  },
  cellLast: {
    borderRightWidth: 0,
  },
  cellToday: {
    backgroundColor: "#F0F3FF",
  },
  cellMoveSource: {
    backgroundColor: "rgba(64, 82, 255, 0.08)",
  },
  dayNumber: {
    fontSize: 10,
    color: "#9A9A9A",
    marginBottom: 2,
    fontFamily: FONTS.SATOSHI,
  },
  dayNumberOutside: {
    color: "#D0D0D0",
  },
  dayNumberToday: {
    color: "#4052FF",
    fontWeight: "700",
  },
  plusMark: {
    position: "absolute",
    bottom: 4,
    right: 4,
    fontSize: 14,
    lineHeight: 14,
    color: "#D0D0D0",
    fontFamily: FONTS.SATOSHI,
  },
  thumb: {
    flex: 1,
  },
});
