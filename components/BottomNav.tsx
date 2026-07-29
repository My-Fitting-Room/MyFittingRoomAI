import React from "react";
import { View, TouchableOpacity } from "react-native";
import Feathericons from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import { styles } from "../stylesheets/bottomNav";
import { triggerHaptic } from "../utils/haptics";

export default function BottomNav({ navigation, activeTab }) {

  const handleTryOnPress = () => {
    triggerHaptic();
    navigation.navigate("TryOn");
  };

  const handleAvatarPress = () => {
    triggerHaptic();
    navigation.navigate("Avatar");
  };

  const handleSizingPress = () => {
    triggerHaptic();
    navigation.navigate("Sizing");
  };

  const handleOutfitPlannerPress = () => {
    triggerHaptic();
    navigation.navigate("OutfitPlanner");
  };

  const handleSettingsPress = () => {
    triggerHaptic();
    navigation.navigate("Settings");
  };

  return (
    <>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)"]}
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
          <TouchableOpacity onPress={handleAvatarPress} style={styles.navItem}>
            <Feathericons
              name="user"
              size={24}
              color={activeTab === "Avatar" ? "#4052FF" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSizingPress} style={styles.navItem}>
            <Feathericons
              name="sliders"
              size={24}
              color={activeTab === "Sizing" ? "#4052FF" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOutfitPlannerPress} style={styles.navItem}>
            <Feathericons
              name="calendar"
              size={24}
              color={activeTab === "OutfitPlanner" ? "#4052FF" : "#000"}
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