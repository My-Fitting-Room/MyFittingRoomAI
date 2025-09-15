import { View, TouchableOpacity, Text, Alert, Image, Pressable, ActivityIndicator, Dimensions } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { FONTS } from "../constants/fonts";
import { supabase } from "../App";
import InAppReview from "react-native-in-app-review";
import { getStyles } from "../stylesheets/onboardingScreen";
import mixpanel from "../utils/mixpanel";

export default function OnboardingScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const hasCompleted = useRef(false);

  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width, height);

  const completeOnboarding = async () => {
    try {
      if (!profile?.id) {
        Alert.alert("Error", "Please try again later!", [{ text: "OK" }]);
        return;
      }

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          onboarding_complete: true
        })
        .eq("id", profile.id);

      if (updateError) {
        Alert.alert(
          "Error",
          "Please Try Again Later!",
          [{ text: "OK" }]
        );
        return;
      }

      hasCompleted.current = true;
      mixpanel.track('Onboarding Completed');
      navigation.navigate("TryOn");
    } catch (error) {
      Alert.alert(
        "Error",
        error.message,
        [{ text: "OK" }]
      );
    }
  };

  const handleRateAndContinue = () => {
    if (InAppReview.isAvailable()) {
      InAppReview.RequestInAppReview()
        .then(() => {
          completeOnboarding();
        })
        .catch(() => {
          completeOnboarding();
        });
    } else {
      completeOnboarding();
    }
  };

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

        if (profileData.onboarding_complete === true) {
          navigation.navigate("TryOn");
          return;
        }

        setProfile(profileData);
        setLoading(false);

        mixpanel.track('Onboarding Screen Viewed');

      } catch (error) {
        navigation.navigate("First");
      }
    };

    checkSession();
  }, [supabase]);

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
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <View className={styles.container}>
          <View className={styles.stepContainer}>
            <Text 
              className={styles.step4MainHeader}
              style={{ fontFamily: FONTS.SWITZER }}
            >
              Please give us a rating
            </Text>
            <Text 
              className={styles.subHeader}
              style={{ fontFamily: FONTS.SATOSHI }}
            >
              Your feedback helps us improve!
            </Text>
            <Image source={require("../assets/review.png")} className={styles.reviewImage} />
          </View>
        </View>
        <View className={styles.step4ButtonsGroup}>
          <Pressable 
            className={styles.selectButton}
            onPress={handleRateAndContinue}
          >
            <Text 
              className={styles.continueButtonText}
              style={{ fontFamily: FONTS.SATOSHI }}
            >
              Rate & Continue
            </Text>
          </Pressable>
          <Pressable 
            className={styles.selectButton}
            onPress={completeOnboarding}
          >
            <Text 
              className={styles.continueButtonText}
              style={{ fontFamily: FONTS.SATOSHI }}
            >
              Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}