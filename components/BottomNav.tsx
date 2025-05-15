import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import Feathericons from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient"; 

export default function BottomNav({ navigation, activeTab }) {
  
  const handleTryOnPress = () => {
    navigation.navigate("TryOn");
  };

  const handleSizingPress = () => {
    navigation.navigate("Sizing");
  };

  const handleSettingsPress = () => {
    navigation.navigate("Settings");
  };

  return (
    <>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0)","rgba(255, 255, 255, 0.5)","rgba(255, 255, 255, 0.6)","rgba(255, 255, 255, 0.8)","rgba(255, 255, 255, 0.9)","rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)"]}
        style={styles.gradient}
        pointerEvents="none"
      />
      
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={handleTryOnPress} style={styles.navItem}>
            <Feathericons 
              name="home" 
              size={24} 
              color={activeTab === "TryOn" ? "#4052FF" : "#000"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleSizingPress} style={styles.navItem}>
            <Feathericons 
              name="sliders" 
              size={24} 
              color={activeTab === "Sizing" ? "#4052FF" : "#000"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleSettingsPress} style={styles.navItem}>
            <Feathericons 
              name="settings" 
              size={24} 
              color={activeTab === "Settings" ? "#4052FF" : "#000"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 1, 
  },
  container: {
    position: "absolute",
    bottom: 25,
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
    width: "65%", 
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