import React, { useState, useEffect } from "react";
import { View, Text, Alert, SafeAreaView, ScrollView, StatusBar, Platform, ActivityIndicator, Dimensions } from "react-native";
import { supabase } from "../App";
import HeaderNav from "../components/HeaderNav";
import BottomNav from "../components/BottomNav";
import ModelImages from "../components/ModelImages";
import ClothesImages from "../components/ClothesImages";
import TryOnButton from "../components/TryOnButton";
import TryOnImages from "../components/TryOnImages";
import TokensBox from "../components/TokensBox";
import { FONTS } from "../constants/fonts";
import { getStyles } from "../stylesheets/tryonScreen";

export default function TryOnScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [inputClothImage, setInputClothImage] = useState(null);
  const [inputModelImage, setInputModelImage] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tokensTotal, setTokensTotal] = useState(0);

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

        const { data: profileData, error:error } = await supabase
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

        if (profileData.onboarding_complete === false) {
          navigation.navigate("Onboarding");
          return;
        }

        const { data: planData, error: planError } = await supabase
          .from("plans")
          .select("*")
          .eq("price_id",profileData.price_id)
          .maybeSingle();
        
        if (planError) {
          Alert.alert(
            "Error",
            "Please try again later",
            [{ text: "OK" }]
          );
          return;
        }
        
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
        <TryOnImages profile={profile} navigation={navigation} />
        <ModelImages setInputModelImage={setInputModelImage} profile={profile} navigation={navigation} />
        <ClothesImages setInputClothImage={setInputClothImage} profile={profile} navigation={navigation}/>
        <TryOnButton 
          disabled={false} 
          inputClothImage={inputClothImage} 
          inputModelImage={inputModelImage} 
          tokensUsed={profile.tokens_used} 
          tokensTotal={tokensTotal} 
          profile={profile} 
          plan={plan} 
          navigation={navigation} 
        />
        <TokensBox 
          tokensUsed={profile.tokens_used} 
          tokensTotal={tokensTotal} 
          plan={plan} 
        />
        <View className={styles.bottomPadding} />
      </ScrollView>
      <BottomNav navigation={navigation} activeTab="TryOn" />
    </SafeAreaView>
  );
}