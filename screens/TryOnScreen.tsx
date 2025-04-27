import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert , SafeAreaView, ScrollView, StatusBar, Platform, ActivityIndicator } from "react-native";

import { supabase } from "../App";
import HeaderNav from "../components/HeaderNav";
import BottomNav from "../components/BottomNav";
import ModelImages from "../components/ModelImages";
import ClothesImages from "../components/ClothesImages";
import TryOnButton from "../components/TryOnButton";
import TryOnImages from "../components/TryOnImages";
import TokensBox from "../components/TokensBox";

export default function TryOnScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [inputClothImage, setInputClothImage] = useState(null);
  const [inputModelImage, setInputModelImage] = useState(null);
  const [plan, setPlan] = useState(null);
  const [tokensTotal, setTokensTotal] = useState(null);
  const [renewalDate, setRenewalDate] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigation.navigate("SignIn");
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

        console.log(planData)

        if (planData) {
          const response = await fetch("https://my-fitting-room-server.onrender.com/api/tokens/renewal-date", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${session.access_token}`,
              "Content-Type": "application/json"
            }
          });
        

          if (!response.ok) {

            const errorData = await response.json();
            console.log(errorData)

            return null;
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4052FF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderNav navigation={navigation} />
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <TryOnImages profile={profile} navigation={navigation} />
        <ModelImages setInputModelImage={setInputModelImage} profile={profile} navigation={navigation} />
        <ClothesImages setInputClothImage={setInputClothImage}  profile={profile}  navigation={navigation}/>
        <TryOnButton disabled={false} inputClothImage={inputClothImage}  inputModelImage={inputModelImage} tokensUsed={profile.tokens_used} tokensTotal={tokensTotal} plan={plan} />
        <TokensBox tokensUsed={profile.tokens_used} tokensTotal={tokensTotal} renewalDate={renewalDate} />
        <View style={styles.bottomPadding} />
      </ScrollView>
      <BottomNav navigation={navigation} activeTab="TryOn" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4052FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#fff",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    ...Platform.select({
      ios: {
        paddingTop: 50, 
      },
      android: {
        paddingTop: StatusBar.currentHeight,
      },
    }),
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "500",
    color: "#4052FF",
    marginLeft: 12,
  },
  profileIcon: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 80, 
  },
  contentContainer: {
    paddingHorizontal: 5,
  },
  card: {
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
  bottomPadding: {
    height: 80, 
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingBottom: Platform.OS === "ios" ? 20 : 0, 
  },
  navItem: {
    padding: 12,
  },
});