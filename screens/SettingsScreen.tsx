import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Platform, Alert, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feathericons from "react-native-vector-icons/Feather";
import { supabase } from "../App";
import { FONTS } from "../constants/fonts";

export default function SettingsScreen({ navigation }) {
  const { width } = Dimensions.get("window");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const deviceType = width <= 375 ? "small" : width <= 390 ? "regular" : "proMax";

  const deviceStyles = {
    small: {
      container: "flex-1 bg-white",
      header: "flex-row items-center px-4 py-2",
      backButton: "p-1",
      profileSection: "items-center mt-2 mb-10",
      profileImageContainer: "w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-4",
      profileName: "text-lg mb-1",
      profileEmail: "text-sm text-gray-600",
      settingsContainer: "px-5 flex-1 justify-end mb-8",
      logoutButton: "bg-black rounded-lg py-3 items-center my-2",
      logoutButtonText: "text-white text-base font-semibold",
      iconSize: 24,
      userIconSize: 42
    },
    regular: {
      container: "flex-1 bg-white",
      header: "flex-row items-center px-4 py-3",
      backButton: "p-1.5",
      profileSection: "items-center mt-4 mb-12",
      profileImageContainer: "w-24 h-24 rounded-full bg-gray-100 justify-center items-center mb-5",
      profileName: "text-xl mb-1",
      profileEmail: "text-base text-gray-600",
      settingsContainer: "px-6 flex-1 justify-end mb-10",
      logoutButton: "bg-black rounded-lg py-4 items-center my-2",
      logoutButtonText: "text-white text-lg font-semibold",
      iconSize: 28,
      userIconSize: 50
    },
    proMax: {
      container: "flex-1 bg-white",
      header: "flex-row items-center px-5 py-3",
      backButton: "p-2",
      profileSection: "items-center mt-6 mb-16",
      profileImageContainer: "w-28 h-28 rounded-full bg-gray-100 justify-center items-center mb-6",
      profileName: "text-2xl mb-1",
      profileEmail: "text-lg text-gray-600",
      settingsContainer: "px-8 flex-1 justify-end mb-12",
      logoutButton: "bg-black rounded-xl py-4 items-center my-2",
      logoutButtonText: "text-white text-xl font-semibold",
      iconSize: 32,
      userIconSize: 56
    }
  };

  const styles = deviceStyles[deviceType];

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