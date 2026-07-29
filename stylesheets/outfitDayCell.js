import { StyleSheet } from "react-native";
import { FONTS } from "../constants/fonts";

export const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 0.66,
    margin: 1.5,
  },
  dayNumber: {
    fontSize: 10,
    textAlign: "center",
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
  thumbWrap: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F4F4F4",
  },
  thumbWrapOutside: {
    backgroundColor: "#FAFAFA",
  },
  todayRing: {
    borderWidth: 1.5,
    borderColor: "#4052FF",
  },
  moveSource: {
    borderWidth: 1.5,
    borderColor: "#4052FF",
    opacity: 0.5,
  },
  thumb: {
    flex: 1,
  },
});
