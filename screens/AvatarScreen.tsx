import React, { useState, useEffect } from "react";
import { View, Text, Alert, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../App";
import HeaderNav from "../components/HeaderNav";
import BottomNav from "../components/BottomNav";
import Avatars from "../components/Avatars";
import AvatarClothesCarousel from "../components/AvatarClothesCarousel";
import AvatarTryOnButton from "../components/AvatarTryOnButton";
import AvatarTryOnImages from "../components/AvatarTryOnImages";
import Feathericons from "react-native-vector-icons/Feather";
import { FONTS } from "../constants/fonts";
import { getStyles, tabStyles } from "../stylesheets/avatarScreen";
import { triggerHaptic } from "../utils/haptics";

const IS_IOS26 = Platform.OS === "ios" && parseInt(Platform.Version as string, 10) >= 26;

export default function AvatarScreen({ navigation, route }: { navigation: any, route: any }) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [selectedOutfit, setSelectedOutfit] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tokensTotal, setTokensTotal] = useState(0);
  const [extraTokensTotal, setExtraTokensTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("avatar");
  const [showCreatePicker, setShowCreatePicker] = useState(false);

  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width, height);
  const isSmall = width === 375 && height === 667;
  const headerHeight = IS_IOS26 ? (isSmall ? 79 : 107) : 0;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigation.navigate("First");
          return;
        }

        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session?.user?.id)
          .single();

        if (error) {
          Alert.alert(
            "Error",
            "Please Try Again Later!",
            [{ text: "OK" }]
          );
          return;
        }

        const { data: planData, error: planError } = await supabase
          .from("plans")
          .select("*")
          .eq("price_id", profileData.price_id)
          .maybeSingle();

        if (planError) {
          Alert.alert(
            "Error",
            "Please try again later",
            [{ text: "OK" }]
          );
          return;
        }

        const extraTokens = profileData.referral_tokens ?? 0;

        setExtraTokensTotal(extraTokens);
        setTokensTotal(planData?.token_allowance ?? 0);
        setPlan(planData);
        setProfile(profileData);
        setLoading(false);

      } catch (error) {
        navigation.navigate("SignIn");
      }
    };

    checkSession();
  }, [supabase]);

  const handleTabPress = (tab) => {
    triggerHaptic();
    setActiveTab(tab);
  };

  const handleNewAvatarPress = () => {
    triggerHaptic();
    setActiveTab("avatar");
    setShowCreatePicker(true);
  };

  if (loading) {
    return (
      <View className={styles.loadingContainer}>
        <ActivityIndicator size={"large"} color="black" />
        <Text
          className={styles.loadingText}
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View className={styles.container} style={{ paddingTop: IS_IOS26 ? 0 : insets.top, paddingBottom: insets.bottom }}>
      <HeaderNav navigation={navigation} />

      <View style={[tabStyles.tabsRow, { marginTop: headerHeight }]}>
        <TouchableOpacity style={tabStyles.tab} onPress={() => handleTabPress("avatar")}>
          <Text style={[tabStyles.tabText, activeTab === "avatar" && tabStyles.tabTextActive]}>
            Avatar
          </Text>
          {activeTab === "avatar" && <View style={tabStyles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity style={tabStyles.tab} onPress={() => handleTabPress("tryons")}>
          <Text style={[tabStyles.tabText, activeTab === "tryons" && tabStyles.tabTextActive]}>
            Try-Ons
          </Text>
          {activeTab === "tryons" && <View style={tabStyles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      <View style={tabStyles.contentArea}>
        {/* Both panes stay mounted so the try-on results polling and
            failure alerts keep running while the Avatar tab is active */}
        <ScrollView
          style={{ flex: 1, display: activeTab === "avatar" ? "flex" : "none" }}
        >
          <Avatars
            setSelectedAvatar={setSelectedAvatar}
            profile={profile}
            navigation={navigation}
            showPicker={showCreatePicker}
            setShowPicker={setShowCreatePicker}
          />
          {/* No button until the first avatar exists; selectedAvatar is only
              set once a success avatar loads */}
          {selectedAvatar && (
            <AvatarTryOnButton
              disabled={false}
              selectedOutfit={selectedOutfit}
              selectedAvatar={selectedAvatar}
              tokensUsed={profile.tokens_used}
              tokensTotal={tokensTotal}
              profile={profile}
              plan={plan}
              navigation={navigation}
              extraTokensTotal={extraTokensTotal}
            />
          )}
          <AvatarClothesCarousel
            profile={profile}
            setSelectedOutfit={setSelectedOutfit}
          />
          <View className={styles.bottomPadding} />
        </ScrollView>

        <ScrollView
          style={{ flex: 1, display: activeTab === "tryons" ? "flex" : "none" }}
        >
          <AvatarTryOnImages profile={profile} navigation={navigation} />
          <View className={styles.bottomPadding} />
        </ScrollView>

        <TouchableOpacity
          style={[tabStyles.newAvatarButton, tabStyles.newAvatarAnchor]}
          onPress={handleNewAvatarPress}
        >
          <Feathericons name="user-plus" size={14} color="#000" />
          <Text style={tabStyles.newAvatarButtonText}>New avatar</Text>
        </TouchableOpacity>
      </View>

      <BottomNav navigation={navigation} activeTab="Avatar" />
    </View>
  );
}
