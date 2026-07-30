import { StyleSheet } from "react-native";
import { FONTS } from "../constants/fonts";

export const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 0.55,
    backgroundColor: "transparent",
    padding: 3,
  },
  cellLast: {},
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
  plusWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  plusMark: {
    fontSize: 24,
    lineHeight: 24,
    color: "#D0D0D0",
    fontFamily: FONTS.SATOSHI,
  },
  thumb: {
    flex: 1,
  },
});
