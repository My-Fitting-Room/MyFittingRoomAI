import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform, Image, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feathericons from "react-native-vector-icons/Feather";

import { supabase } from "../App";
import { FONTS } from "../constants/fonts";

export default function SettingsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Feathericons name="user" size={50} color="#555" />
        </View>
        
        {user && (
          <>
            <Text style={styles.profileName}>{user.user_metadata?.name || "User"}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </>
        )}
      </View>

      <View style={styles.settingsContainer}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogOut}
          disabled={loading}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 4,
    fontFamily: FONTS.SWITZER
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
    fontFamily: FONTS.SWITZER,
    fontWeight: "400",
  },
  settingsContainer: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 40,
  },
  settingsOptionContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  settingsOption: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#000",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginVertical: 10,
    fontWeight: "400",
    fontFamily: FONTS.SATOSHI
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});