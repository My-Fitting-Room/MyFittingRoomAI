import {  StyleSheet } from "react-native";


export const styles = StyleSheet.create({
    gradient: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 130,
      zIndex: 1, 
    },
    container: {
      position: "absolute",
      bottom: 40,
      left: 0,
      right: 0,
      alignItems: "center",
      zIndex: 2, 
    },
    navbar: {
      flexDirection: "row",
      justifyContent: "space-between", 
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 30,
      paddingHorizontal: 25, 
      width: "50%", 
      height: 60,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    navItem: {
      padding: 8, 
      alignItems: "center",
      justifyContent: "center",
    },
  });