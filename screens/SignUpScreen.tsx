import { View, TouchableOpacity, Text, Alert, Image, Pressable, Linking, Dimensions } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { supabase } from "../App";
import React from "react";
import { FONTS } from "../constants/fonts";
import Config from "react-native-config";
import Video from "react-native-video";
import { getStyles } from "../stylesheets/signupScreen";

export default function SignUpScreen({ navigation }) {
  const { width, height } = Dimensions.get("window");

  const styles = getStyles(width, height);

  GoogleSignin.configure({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
  });

  const handleTermsPress = () => {
    Linking.openURL("https://www.apple.com/legal/internet-services/itunes/dev/stdeula/");
  };

  const handlePrivacyPress = () => {
    Linking.openURL("https://myfittingroom.ai/other-pages/privacy-policy");
  };

  const handleGoogleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      if (userInfo.data.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });

        if(error) {
          Alert.alert(
            "Sign Up Error",
            "Please Try Again Later!",
            [{ text: "OK" }]
          );
          return;
        }

        if(data) {
          navigation.navigate("TryOn");
        }
        
      } else {
        Alert.alert(
          "Sign Up Error",
          "Please Try Again Later!",
          [{ text: "OK" }]
        );
        return;
      }
    } catch (error) {
      Alert.alert(
        "Sign Up Error",
        "Please Try Again Later!",
        [{ text: "OK" }]
      );
      return;
    }
  };

  const handleAppleSignUp = async () => {
    try {
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
          Alert.alert(
            "Sign Up Error",
            "Authentication failed. Please try again.",
            [{ text: "OK" }]
          );
          return;
        }
  
        navigation.navigate("TryOn");
      } else {
        Alert.alert(
          "Sign Up Error",
          "Apple authentication not authorized. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Sign Up Error",
        "Failed to authenticate with Apple. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleSubscribe = () => {
    Linking.openURL("http://eepurl.com/i5TN6-/");
  };

  return (
    <View className={styles.screen}>
      <TouchableOpacity 
        className={styles.subscribeBanner}
        style={{ elevation: 5, zIndex: 10 }}
        onPress={handleSubscribe}
        activeOpacity={0.9}
      >
        <Text 
          className={styles.subscribeBannerText}
          style={{ fontFamily: FONTS.SATOSHI, fontWeight: "400" }}
        >
          Subscribe to our email list
        </Text>
      </TouchableOpacity>
      <View className={styles.mainWrapper}>
        <View className={styles.contentWrapper}>
          <Text 
            className={styles.headerText}
            style={{ fontFamily: FONTS.SWITZER, fontWeight: "600" }}
          >
            Try-On Clothes From Your Phone.
          </Text>
          <Text 
            className={`${styles.subHeaderText} ${styles.subHeader}`}
            style={{ 
              fontFamily: FONTS.SATOSHI,
              lineHeight: 22 
            }}
          >
            Just upload a photo of the clothing you want to try on and a photo of yourself.
          </Text>
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
        </View>
      </View>
      <View className={styles.bottomWrapper}>
        <Pressable 
          className={`${styles.authButtonActive} ${styles.authButton}`}
          onPress={handleAppleSignUp}
        >
          <MaterialIcon name="apple" size={24} color="white" className={styles.iconMaterial} />
          <Text 
            className={`${styles.authButtonTextColor} ${styles.authButtonText}`}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Continue with Apple
          </Text>
        </Pressable>
        <Pressable 
          className={`${styles.authButtonActive} ${styles.authButton}`}
          onPress={handleGoogleSignUp}
        >
          <Image 
            source={require("../assets/google-logo.png")} 
            className={styles.icon}
            style={{ tintColor: "white" }}
          />
          <Text 
            className={`${styles.authButtonTextColor} ${styles.authButtonText}`}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Continue with Google
          </Text>
        </Pressable>
        <View className={styles.termsContainer}>
          <Text 
            className={styles.termsText}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            By continuing, you agree to our{" "}
          </Text>
          <TouchableOpacity onPress={handleTermsPress}>
            <Text 
              className={styles.termsLink}
              style={{ fontFamily: FONTS.SATOSHI }}
            >
              Terms And Services
            </Text>
          </TouchableOpacity>
          <Text 
            className={styles.termsText}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            {""}and{" "}
          </Text>
          <TouchableOpacity onPress={handlePrivacyPress}>
            <Text 
              className={styles.termsLink}
              style={{ fontFamily: FONTS.SATOSHI }}
            >
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}