import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import Feathericons from "react-native-vector-icons/Feather";
import { supabase } from "../App";
import { FONTS } from "../constants/fonts";
import { triggerHaptic } from "../utils/haptics";
import HeaderNav from "../components/HeaderNav";
import BottomNav from "../components/BottomNav";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const IS_IOS26 = Platform.OS === "ios" && parseInt(Platform.Version as string, 10) >= 26;

export default function SettingsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const headerHeight = IS_IOS26 ? 80 : 0;

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) return;
      if (data.session) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.session?.user?.id)
          .single();
        if (profileError) {
          Alert.alert("Error", "Please Try Again Later!", [{ text: "OK" }]);
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
    triggerHaptic();
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
      setLoading(false);
      return;
    }
    navigation.navigate("SignIn");
  };

  const handleDeleteAccount = () => {
    triggerHaptic();
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
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
              const response = await fetch("https://my-fitting-room-server.onrender.com/api/user/delete", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${sessionData.session.access_token}`,
                },
              });
              const result = await response.json();
              if (result.success) {
                await supabase.auth.signOut();
                navigation.navigate("SignIn");
              } else {
                Alert.alert("Error", "Failed to delete account");
                setLoading(false);
              }
            } catch {
              Alert.alert("Error", "Failed to delete account");
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const openTermsOfService = () => {
    triggerHaptic();
    Linking.openURL("https://www.apple.com/legal/internet-services/itunes/dev/stdeula/");
  };

  const openPrivacyPolicy = () => {
    triggerHaptic();
    Linking.openURL("https://myfittingroom.ai/other-pages/privacy-policy");
  };

  if (loading) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
        <Text style={[s.loadingText, { fontFamily: FONTS.SATOSHI }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[s.container, { paddingBottom: insets.bottom }]}>
      <HeaderNav navigation={navigation} />
      <ScrollView
        contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View style={s.profileCard}>
          <View style={s.avatarCircle}>
            <Feathericons name="user" size={32} color="#555" />
          </View>
          <Text style={[s.profileName, { fontFamily: FONTS.SWITZER }]}>
            {user?.user_metadata?.name || "User"}
          </Text>
          <Text style={[s.profileEmail, { fontFamily: FONTS.SATOSHI }]}>
            {user?.email}
          </Text>
        </View>

        {/* Info section */}
        <View style={s.section}>
          <View style={s.row}>
            <View style={[s.iconWrap, { backgroundColor: "#EEF2FF" }]}>
              <Feathericons name="mail" size={17} color="#4052FF" />
            </View>
            <View style={s.rowBody}>
              <Text style={[s.rowLabel, { fontFamily: FONTS.SATOSHI }]}>Support</Text>
              <Text style={[s.rowSub, { fontFamily: FONTS.SATOSHI }]}>info@myfittingroom.ai</Text>
            </View>
          </View>

          <View style={s.divider} />

          <View style={s.row}>
            <View style={[s.iconWrap, { backgroundColor: "#F5F0FF" }]}>
              <Feathericons name="gift" size={17} color="#8B5CF6" />
            </View>
            <View style={s.rowBody}>
              <Text style={[s.rowLabel, { fontFamily: FONTS.SATOSHI }]}>Referral Code</Text>
              <Text style={[s.rowSub, { fontFamily: FONTS.SATOSHI }]}>
                {profile?.referral_code ?? "—"}
              </Text>
            </View>
          </View>
        </View>

        {/* Legal section */}
        <View style={s.section}>
          <TouchableOpacity style={s.row} onPress={openTermsOfService} activeOpacity={0.7}>
            <View style={[s.iconWrap, { backgroundColor: "#F3F4F6" }]}>
              <Feathericons name="file-text" size={17} color="#6B7280" />
            </View>
            <Text style={[s.rowLabel, s.rowFlex, { fontFamily: FONTS.SATOSHI }]}>
              Terms of Service
            </Text>
            <Feathericons name="chevron-right" size={16} color="#C0C0C0" />
          </TouchableOpacity>

          <View style={s.divider} />

          <TouchableOpacity style={s.row} onPress={openPrivacyPolicy} activeOpacity={0.7}>
            <View style={[s.iconWrap, { backgroundColor: "#ECFDF5" }]}>
              <Feathericons name="shield" size={17} color="#10B981" />
            </View>
            <Text style={[s.rowLabel, s.rowFlex, { fontFamily: FONTS.SATOSHI }]}>
              Privacy Policy
            </Text>
            <Feathericons name="chevron-right" size={16} color="#C0C0C0" />
          </TouchableOpacity>
        </View>

        {/* Account actions section */}
        <View style={s.section}>
          <TouchableOpacity style={s.row} onPress={handleLogOut} disabled={loading} activeOpacity={0.7}>
            <View style={[s.iconWrap, { backgroundColor: "#F3F4F6" }]}>
              <Feathericons name="log-out" size={17} color="#374151" />
            </View>
            <Text style={[s.rowLabel, s.rowFlex, { fontFamily: FONTS.SATOSHI }]}>Log Out</Text>
          </TouchableOpacity>

          <View style={s.divider} />

          <TouchableOpacity style={s.row} onPress={handleDeleteAccount} activeOpacity={0.7}>
            <View style={[s.iconWrap, { backgroundColor: "#FEF2F2" }]}>
              <Feathericons name="trash-2" size={17} color="#EF4444" />
            </View>
            <Text style={[s.rowLabel, s.rowFlex, s.destructive, { fontFamily: FONTS.SATOSHI }]}>
              Delete Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} activeTab="Settings" />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#000",
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  profileName: {
    fontSize: 19,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  rowBody: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    color: "#111",
  },
  rowFlex: {
    flex: 1,
  },
  rowSub: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E7EB",
    marginLeft: 66,
  },
  destructive: {
    color: "#EF4444",
  },
});
