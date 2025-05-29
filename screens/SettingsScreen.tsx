import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Platform, Alert, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feathericons from "react-native-vector-icons/Feather";
import { supabase } from "../App";
import { FONTS } from "../constants/fonts";
import { getStyles } from "../stylesheets/settingsScreen";

export default function SettingsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width, height);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        return;
      }
      
      if (data.session) {
        setUser(data.session.user);
      } else {
        navigation.navigate("First");
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        Alert.alert("Error", "Failed to sign out. Please try again.");
        setLoading(false);
        return;
      }
      
      navigation.navigate("SignIn");
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView className={styles.container} style={{ 
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 
    }}>
      <View className={styles.header}>
        <TouchableOpacity onPress={handleBackPress} className={styles.backButton}>
          <Ionicons name="chevron-back" size={styles.iconSize} color="black" />
        </TouchableOpacity>
      </View>
      <View className={styles.profileSection}>
        <View className={styles.profileImageContainer}>
          <Feathericons name="user" size={styles.userIconSize} color="#555" />
        </View>
        {user && (
          <>
            <Text 
              className={styles.profileName}
              style={{ fontFamily: FONTS.SWITZER, fontWeight: "400" }}
            >
              {user.user_metadata?.name || "User"}
            </Text>
            <Text 
              className={styles.profileEmail}
              style={{ fontFamily: FONTS.SWITZER, fontWeight: "400" }}
            >
              {user.email}
            </Text>
          </>
        )}
      </View>
      <View className={styles.settingsContainer}>
        <TouchableOpacity 
          className={`${styles.logoutButton} ${loading ? "opacity-60" : ""}`}
          onPress={handleLogOut}
          disabled={loading}
        >
          <Text 
            className={styles.logoutButtonText}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}