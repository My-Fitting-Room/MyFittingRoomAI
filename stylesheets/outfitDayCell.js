import { StyleSheet } from "react-native";
import { FONTS } from "../constants/fonts";

export const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 0.7,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#D0D0D0",
    backgroundColor: "#fff",
    padding: 3,
  },
  cellToday: {
    backgroundColor: "#F0F3FF",
  },
  cellMoveSource: {
    backgroundColor: "rgba(64, 82, 255, 0.08)",
  },
  dayNumber: {
    fontSize: 10,
    color: "#000",
    marginBottom: 2,
    fontFamily: FONTS.SATOSHI,
  },
  dayNumberOutside: {
    color: "#C9C9C9",
  },
  dayNumberToday: {
    color: "#4052FF",
    fontWeight: "700",
  },
  thumb: {
    flex: 1,
  },
});
