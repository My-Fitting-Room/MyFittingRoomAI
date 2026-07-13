import { FONTS } from "../constants/fonts";
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginVertical: 15,
  },
  buttonContainer: {
    width: width * 0.8,
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "300",
    fontFamily: FONTS.SATOSHI,
  },
  disabledButton: {
    opacity: 0.5,
  },
  loadingButton: {
    backgroundColor: "#333",
  }
});
