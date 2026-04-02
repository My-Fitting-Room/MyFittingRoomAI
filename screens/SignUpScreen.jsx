import { View, TouchableOpacity, Text, Alert, Image, Pressable, Linking, Dimensions, ScrollView } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { supabase } from "../App";
import React from "react";
import { FONTS } from "../constants/fonts";
import Config from "react-native-config";
import Video from "react-native-video";
import { getStyles } from "../stylesheets/signupScreen";
import { triggerHaptic } from "../utils/haptics";
import { logAppsFlyerEvent } from "../utils/appsflyer";

export default function SignUpScreen({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width, height);

  GoogleSignin.configure({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
  });

  const handleTermsPress = () => {
    triggerHaptic();
    Linking.openURL("https://www.apple.com/legal/internet-services/itunes/dev/stdeula/");
  };

  const handlePrivacyPress = () => {
    triggerHaptic();
    Linking.openURL("https://myfittingroom.ai/other-pages/privacy-policy");
  };

  const handleGoogleSignUp = async () => {
    try {
      triggerHaptic();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.data.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });

        if (error) {
          Alert.alert("Sign Up Error", "Please Try Again Later!", [{ text: "OK" }]);
          return;
        }

        if (data) {
          if (data.user) {
            const userCreatedTime = new Date(data.user.created_at);
            const now = new Date();
            const timeDiff = now.getTime() - userCreatedTime.getTime();
            if (timeDiff < 5 * 60 * 1000) {
              await logAppsFlyerEvent("af_complete_registration");
            } else {
              await logAppsFlyerEvent("af_login");
            }
          }
          navigation.navigate("OnboardingScreen1");
        }
      } else {
        Alert.alert("Sign Up Error", "Please Try Again Later!", [{ text: "OK" }]);
        return;
      }
    } catch (error) {
      Alert.alert("Sign Up Error", "Please Try Again Later!", [{ text: "OK" }]);
      return;
    }
  };

  const handleAppleSignUp = async () => {
    try {
      triggerHaptic();
      const nonce = Math.random().toString(36).substring(2, 10);

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        nonce: nonce
      });

      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

      if (credentialState === appleAuth.State.AUTHORIZED) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "apple",
          token: appleAuthRequestResponse.identityToken,
          nonce: nonce
        });

        if (error) {
          Alert.alert("Sign Up Error", "Authentication failed. Please try again.", [{ text: "OK" }]);
          return;
        }

        if (data.user) {
          const userCreatedTime = new Date(data.user.created_at);
          const now = new Date();
          const timeDiff = now.getTime() - userCreatedTime.getTime();
          if (timeDiff < 5 * 60 * 1000) {
            await logAppsFlyerEvent("af_complete_registration");
          } else {
            await logAppsFlyerEvent("af_login");
          }
        }

        navigation.navigate("OnboardingScreen1");
      } else {
        Alert.alert("Sign Up Error", "Apple authentication not authorized. Please try again.", [{ text: "OK" }]);
      }
    } catch (error) {
      Alert.alert("Sign Up Error", "Failed to authenticate with Apple. Please try again.", [{ text: "OK" }]);
    }
  };

  // NEW: handle guest continue — creates anonymous session and skips sign up
  const handleContinueAsGuest = async () => {
    try {
      triggerHaptic();
      const { data, error } = await supabase.auth.signInAnonymously();

      if (error) {
        console.log('err1', error);

        Alert.alert("Error", "Please Try Again Later!", [{ text: "OK" }]);
        return;
      }

      navigation.navigate("OnboardingScreen1");
    } catch (error) {
      console.log('err2', error);
      Alert.alert("Error", "Please Try Again Later!", [{ text: "OK" }]);
    }
  };

  return (
    <View className={styles.screen}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", alignItems: "center", paddingTop: 120, paddingBottom: 48, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className={styles.headerText}
          style={{ fontFamily: FONTS.SWITZER, fontWeight: "500", color: "black", fontSize: 36, marginBottom: 40 }}
        >
          Sign Up
        </Text>

        <View className={styles.buttonsWrapper}>
          <Pressable
            className={`${styles.authButtonActive} ${styles.authButton}`}
            onPress={handleAppleSignUp}
            style={{ backgroundColor: "black" }}
          >
            <MaterialIcon name="apple" size={24} color="white" className={styles.iconMaterial} />
            <Text
              className={`${styles.authButtonTextColor} ${styles.authButtonText}`}
              style={{ fontFamily: FONTS.SATOSHI, color: "white" }}
            >
              Continue with Apple
            </Text>
          </Pressable>

          <Pressable
            className={`${styles.authButtonActive} ${styles.authButton}`}
            onPress={handleGoogleSignUp}
            style={{ backgroundColor: "black" }}
          >
            <Image
              source={require("../assets/google-logo.png")}
              className={styles.icon}
              style={{ tintColor: "white", width: 20, height: 20 }}
            />
            <Text
              className={`${styles.authButtonTextColor} ${styles.authButtonText}`}
              style={{ fontFamily: FONTS.SATOSHI, color: "white" }}
            >
              Continue with Google
            </Text>
          </Pressable>
        </View>

        <TouchableOpacity onPress={handleContinueAsGuest} className={styles.guestButton}>
          <Text style={{ fontFamily: FONTS.SATOSHI, fontSize: 16, color: "#333", marginBottom: 32 }}>
            Would you like to continue as{" "}
            <Text style={{ fontWeight: "700", color: "#000", textDecorationLine: "underline" }}>
              Guest?
            </Text>
          </Text>
        </TouchableOpacity>

        <View className={`${styles.videoViewContainer} ${styles.videoView}`}>
          <Video
            source={require("../assets/herovideo.mp4")}
            style={{
              width: styles.videoWidth,
              height: styles.videoHeight,
              borderRadius: 12,
            }}
            resizeMode="contain"
            repeat={true}
            muted={true}
            playInBackground={true}
            playWhenInactive={true}
            ignoreSilentSwitch="ignore"
          />
        </View>

        <View className={styles.termsContainer} style={{ marginTop: 24, paddingBottom: 24 }}>
          <Text className={styles.termsText} style={{ fontFamily: FONTS.SATOSHI, color: "#666", textAlign: 'center' }}>
            By continuing, you agree to our{"\n"}
            <Text onPress={handleTermsPress} style={{ color: "#4051FF" }}>Terms And Services</Text>
            {" "}and{" "}
            <Text onPress={handlePrivacyPress} style={{ color: "#4051FF" }}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}