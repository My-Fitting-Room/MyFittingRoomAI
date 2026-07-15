import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 8,
  },
  navItem: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  plusButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});
