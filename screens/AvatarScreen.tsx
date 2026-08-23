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

// Shown over the blurred avatar while a try-on generates; one picked at random per run.
const GENERATING_TIPS = [
  "Your try-on is generating — we'll update it here once it's done. Feel free to explore the Calendar in the meantime.",
  "Tip: you can generate multiple try-ons at once.",
  "Tip: use the Calendar to plan your outfits for months ahead.",
  "Tip: try our clothing size calculator to find your best fit for your favorite brands.",
];

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
  const [generating, setGenerating] = useState(false);
  const [activeTip, setActiveTip] = useState("");
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width, height);
  const isIPad  = Platform.isPad;
  const isSmall = !isIPad && height < 700;
  const headerHeight = IS_IOS26 ? (isIPad ? 67 : isSmall ? 77 : 99) : 0;

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

  // Lightweight token/profile refresh that avoids the old navigation.replace remount
  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();
    if (data) {
      setProfile(data);
      setExtraTokensTotal(data.referral_tokens ?? 0);
    }
  };

  // Called by the try-on button on a successful request: blur the avatar in place,
  // show a random tip, and let the poll below swap in the result when ready.
  const handleTryOnStarted = () => {
    setResultImageUrl(null);
    setActiveTip(GENERATING_TIPS[Math.floor(Math.random() * GENERATING_TIPS.length)]);
    setGenerating(true);
    refreshProfile();
  };

  useEffect(() => {
    if (!generating || !profile?.id) return;

    let cancelled = false;
    // Snapshot of the newest row at start; the target is either a newer row or
    // this same row transitioning out of "pending".
    let initial: { id: any; status: string } | null = null;

    const check = async () => {
      const { data } = await supabase
        .from("avatar_tryon_images")
        .select("id,url,status,created_at")
        .eq("profiles_id", profile.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (cancelled) return;
      const newest = data?.[0];
      if (!newest) return;

      if (initial === null) {
        initial = { id: newest.id, status: newest.status };
      }

      const isTarget = newest.id !== initial.id || initial.status === "pending";
      if (!isTarget) return;

      if (newest.status === "success") {
        setResultImageUrl(newest.url);
        setGenerating(false);
      } else if (newest.status === "failed") {
        setGenerating(false);
        Alert.alert("Try-on Failed", "That item didn't generate. Try a different one.");
      }
    };

    check();
    const interval = setInterval(check, 4000);
    // Safety valve so the blur never gets stuck if the server stalls
    const timeout = setTimeout(() => {
      cancelled = true;
      clearInterval(interval);
      setGenerating(false);
    }, 180000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [generating, profile?.id]);

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
            generating={generating}
            activeTip={activeTip}
            resultImageUrl={resultImageUrl}
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
              onTryOnStarted={handleTryOnStarted}
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
