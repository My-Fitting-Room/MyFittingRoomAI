import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  Alert, 
  Dimensions,
  Linking, 
  ActivityIndicator
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feathericons from "react-native-vector-icons/Feather";
import { supabase } from "../App";
import { FONTS } from "../constants/fonts";
import { getStyles } from "../stylesheets/settingsScreen";

export default function SettingsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
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

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session?.user?.id)
          .single();
          
        if (error) {
          Alert.alert(
            "Error",
            "Please Try Again Later!",
            [{ text: "OK" }]
          );
          return;
        }

        setUser(data.session.user);
        setProfile(profileData);
        setLoading(false);
      } else {
        navigation.navigate("First");
      }
      
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

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              
              const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
              
              if (sessionError || !sessionData.session) {
                Alert.alert("Error", "Failed to delete account. Please try again.");
                setLoading(false);
                return;
              }
  
              const response = await fetch('https://my-fitting-room-server.onrender.com/api/user/delete', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${sessionData.session.access_token}`
                }
              });
  
              const result = await response.json();
  
              if (result.success) {
                navigation.navigate("SignIn");
              } else {
                Alert.alert("Error", "Failed to delete account");
                setLoading(false);
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete account");
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const openTermsOfService = () => {
    Linking.openURL("https://www.apple.com/legal/internet-services/itunes/dev/stdeula/");
  };

  const openPrivacyPolicy = () => {
    Linking.openURL("https://myfittingroom.ai/other-pages/privacy-policy");
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size={"large"} color="black" />
        <Text 
          className="mt-3 text-2xl text-black"
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          Loading...
        </Text>
      </View>
    );
  }

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
        <Text 
          className={styles.supportEmailText}
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          Email for support: info@myfittingroom.ai
        </Text>
        <Text 
          className={styles.referralInfoText}
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          Your referral code to share with others:
        </Text>
        <Text 
          className={styles.referralCodeText}
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          {profile?.referral_code}
        </Text>
        <TouchableOpacity 
          className={styles.linkButton}
          onPress={openTermsOfService}
        >
          <Text 
            className={styles.linkButtonText}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Terms of Service
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className={styles.linkButton}
          onPress={openPrivacyPolicy}
        >
          <Text 
            className={styles.linkButtonText}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Privacy Policy
          </Text>
        </TouchableOpacity>

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

        <TouchableOpacity 
          className={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Text 
            className={styles.deleteButtonText}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}