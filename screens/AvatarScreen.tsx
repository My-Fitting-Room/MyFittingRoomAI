import React, { useState, useEffect } from "react";
import { View, Text, Alert, SafeAreaView, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { supabase } from "../App";
import HeaderNav from "../components/HeaderNav";
import BottomNav from "../components/BottomNav";
import Avatars from "../components/Avatars";
import ClothesImages from "../components/ClothesImages";
import AvatarTryOnButton from "../components/AvatarTryOnButton";
import AvatarTryOnImages from "../components/AvatarTryOnImages";
import TokensBox from "../components/TokensBox";
import { FONTS } from "../constants/fonts";
import { getStyles } from "../stylesheets/avatarScreen";

export default function AvatarScreen({ navigation, route }: { navigation: any, route: any }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [inputClothImage, setInputClothImage] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tokensTotal, setTokensTotal] = useState(0);
  const [extraTokensTotal, setExtraTokensTotal] = useState(0);

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
      <ScrollView
        className={styles.content}
        contentContainerStyle={{ paddingHorizontal: 5 }}
      >
        <AvatarTryOnImages profile={profile} navigation={navigation} />
        <Avatars setSelectedAvatar={setSelectedAvatar} profile={profile} navigation={navigation} />
        <ClothesImages setInputClothImage={setInputClothImage} profile={profile} navigation={navigation} returnScreen="Avatar" />
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
        <TokensBox
          tokensUsed={profile.tokens_used}
          tokensTotal={tokensTotal}
          plan={plan}
          extraTokensTotal={extraTokensTotal}
          referralCode={profile.referral_code}
        />
        <View className={styles.bottomPadding} />
      </ScrollView>
      <BottomNav navigation={navigation} activeTab="Avatar" />
    </SafeAreaView>
  );
}
