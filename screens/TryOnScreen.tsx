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

export default function TryOnScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [inputClothImage, setInputClothImage] = useState(null);
  const [inputModelImage, setInputModelImage] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tokensTotal, setTokensTotal] = useState(0);
  const [renewalDate, setRenewalDate] = useState(null);
  
  const { width } = Dimensions.get("window");
  const deviceType = width <= 375 ? "small" : width <= 390 ? "regular" : "proMax";

  const deviceStyles = {
    small: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-sm text-[#4052FF]",
      content: "flex-1 pt-12",
      contentContainer: "px-1",
      bottomPadding: "h-24"
    },
    regular: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-base text-[#4052FF]",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-20"
    },
    proMax: {
      container: "flex-1 bg-white",
      loadingContainer: "flex-1 justify-center items-center bg-white",
      loadingText: "mt-2.5 text-base text-[#4052FF]",
      content: "flex-1 pt-14",
      contentContainer: "px-1.5",
      bottomPadding: "h-20"
    }
  };

  const styles = deviceStyles[deviceType];

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

        if (planData) {
          const response = await fetch("https://my-fitting-room-server.onrender.com/api/tokens/renewal-date", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${session.access_token}`,
              "Content-Type": "application/json"
            }
          });
        
          if (!response.ok) {
            Alert.alert(
              "Error",
              "Please try again later",
              [{ text: "OK" }]
            );
            return;
          } else {
            const data = await response.json();
            const renewalDateData = data.current_period_end;
            setRenewalDate(renewalDateData);
          }
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
        <ActivityIndicator size="large" color="#4052FF" />
        <Text 
          className={styles.loadingText}
          style={{ fontFamily: FONTS.SATOSHI }}
        >
          Loading...
        </Text>
      </View>
    );
  }

  const contentPaddingTop = Platform.OS === "ios" ? "pt-12" : "pt-20";

  return (
    <SafeAreaView className={styles.container}>
      <HeaderNav navigation={navigation} />
      <ScrollView 
        className={`${styles.content} ${contentPaddingTop}`} 
        contentContainerStyle={{ paddingHorizontal: deviceType === "small" ? 5 : 5 }}
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
          renewalDate={renewalDate} 
          plan={plan} 
        />
        <View className={styles.bottomPadding} />
      </ScrollView>
      <BottomNav navigation={navigation} activeTab="TryOn" />
    </SafeAreaView>
  );
}