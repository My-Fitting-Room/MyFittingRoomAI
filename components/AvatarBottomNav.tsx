import React from "react";
import { View, TouchableOpacity } from "react-native";
import Feathericons from "react-native-vector-icons/Feather";
import { styles } from "../stylesheets/avatarBottomNav";
import { triggerHaptic } from "../utils/haptics";

export default function AvatarBottomNav({ navigation, onPlusPress }) {

  const handleTryOnPress = () => {
    triggerHaptic();
    navigation.navigate("TryOn");
  };

  const handleAvatarPress = () => {
    triggerHaptic();
    navigation.navigate("Avatar");
  };

  const handlePlusPress = () => {
    triggerHaptic();
    onPlusPress();
  };

  const handleSizingPress = () => {
    triggerHaptic();
    navigation.navigate("Sizing");
  };

  const handleSettingsPress = () => {
    triggerHaptic();
    navigation.navigate("Settings");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleTryOnPress} style={styles.navItem}>
        <Feathericons name="home" size={24} color="#8E8E8E" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAvatarPress} style={styles.navItem}>
        <Feathericons name="user" size={24} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePlusPress} style={styles.plusButton}>
        <Feathericons name="plus" size={26} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSizingPress} style={styles.navItem}>
        <Feathericons name="sliders" size={24} color="#8E8E8E" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSettingsPress} style={styles.navItem}>
        <Feathericons name="settings" size={24} color="#8E8E8E" />
      </TouchableOpacity>
    </View>
  );
}
