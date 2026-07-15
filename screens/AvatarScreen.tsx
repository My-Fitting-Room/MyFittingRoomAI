import React, { useState, useEffect } from "react";
import { View, Text, Alert, SafeAreaView, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import { supabase } from "../App";
import HeaderNav from "../components/HeaderNav";
import AvatarBottomNav from "../components/AvatarBottomNav";
import Avatars from "../components/Avatars";
import AvatarClothesCarousel from "../components/AvatarClothesCarousel";
import AvatarTryOnButton from "../components/AvatarTryOnButton";
import AvatarTryOnImages from "../components/AvatarTryOnImages";
import { FONTS } from "../constants/fonts";
import { getStyles, tabStyles } from "../stylesheets/avatarScreen";
import { triggerHaptic } from "../utils/haptics";

export default function AvatarScreen({ navigation, route }: { navigation: any, route: any }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [inputClothImage, setInputClothImage] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tokensTotal, setTokensTotal] = useState(0);
  const [extraTokensTotal, setExtraTokensTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("avatar");
  const [showCreatePicker, setShowCreatePicker] = useState(false);

  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width, height);

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

  const handlePlusPress = () => {
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
    <SafeAreaView className={styles.container}>
      <HeaderNav navigation={navigation} />

      <View style={tabStyles.tabsRow}>
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
        <AvatarTryOnButton
          disabled={false}
          inputClothImage={inputClothImage}
          selectedAvatar={selectedAvatar}
          tokensUsed={profile.tokens_used}
          tokensTotal={tokensTotal}
          profile={profile}
          plan={plan}
          navigation={navigation}
          extraTokensTotal={extraTokensTotal}
        />
        <AvatarClothesCarousel
          profile={profile}
          setInputClothImage={setInputClothImage}
        />
        <View className={styles.bottomPadding} />
      </ScrollView>

      <ScrollView
        style={{ flex: 1, display: activeTab === "tryons" ? "flex" : "none" }}
      >
        <AvatarTryOnImages profile={profile} navigation={navigation} />
        <View className={styles.bottomPadding} />
      </ScrollView>

      <AvatarBottomNav navigation={navigation} onPlusPress={handlePlusPress} />
    </SafeAreaView>
  );
}
