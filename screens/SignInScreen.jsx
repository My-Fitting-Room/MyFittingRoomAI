import { View, TouchableOpacity, Text, Alert, Image, TextInput, Linking, Pressable, Dimensions } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { supabase } from "../App";
import React, { useState } from "react";
import { FONTS } from "../constants/fonts";
import Config from "react-native-config";
import { getStyles } from "../stylesheets/signinScreen";
import { logAppsFlyerEvent } from "../utils/appsflyer";
import { triggerHaptic } from "../utils/haptics";


export default function SignInScreen({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width, height);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  GoogleSignin.configure({
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID?.trim(),
  });

  const handleForgotPassword = () => {
    triggerHaptic();
    Linking.openURL("https://app.myfittingroom.ai/signin");
  };

  const handleTermsPress = () => {
    triggerHaptic();
    Linking.openURL("https://www.apple.com/legal/internet-services/itunes/dev/stdeula/");
  };

  const handlePrivacyPress = () => {
    triggerHaptic();
    Linking.openURL("https://myfittingroom.ai/other-pages/privacy-policy");
  };

  const handleGoogleSignIn = async () => {
    try {
      triggerHaptic();
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("[sign-in] Google result type:", userInfo?.type, "idToken present:", !!userInfo?.data?.idToken);
      if (userInfo.data.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: userInfo.data.idToken,
        });
        console.log("[sign-in] signInWithIdToken error:", error ? `${error.name}: ${error.message} (status ${error.status})` : "none");

        if (error) {
          Alert.alert(
            "Sign In Error ",
            "Please Try Again Later!",
            [{ text: "OK" }]
          );
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
          navigation.navigate("TryOn");
        }

      } else {
        Alert.alert(
          "Sign In Error",
          "Please Try Again Later!",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.log("[sign-in] Google flow threw:", error?.message, error);
      Alert.alert(
        "Sign In Error",
        "Please Try Again Later!",
        [{ text: "OK" }]
      );
    }
  };

  const handleAppleSignIn = async () => {
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
          Alert.alert(
            "Sign In Error",
            "Authentication failed with Supabase. Please try again.",
            [{ text: "OK" }]
          );
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

        navigation.navigate("TryOn");
      } else {
        Alert.alert(
          "Sign In Error",
          "Apple authentication not authorized. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Sign In Error",
        "Failed to authenticate with Apple. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleEmailSignIn = async () => {
    try {
      triggerHaptic();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert(
          "Sign In Error",
          error.message,
          [{ text: "OK" }]
        );
        return;
      }

      navigation.navigate("TryOn");
    } catch (error) {
      Alert.alert(
        "Sign In Error",
        "Please Try Again Later!",
        [{ text: "OK" }]
      );
    }
  };

  const handleSignUp = () => {
    triggerHaptic();
    navigation.navigate("SignUp");
  };

  const handleSubscribe = () => {
    Linking.openURL("http://eepurl.com/i5TN6-/");
  };

  return (
    <View className={styles.screen}>
      {/* <TouchableOpacity 
        className={styles.subscribeBanner}
        style={{ elevation: 5 }}
        onPress={handleSubscribe}
        activeOpacity={0.9}
      >
        <Text 
          className={styles.subscribeBannerText}
          style={{ fontFamily: FONTS.SATOSHI, fontWeight: "400" }}
        >
          Subscribe to our email list
        </Text>
      </TouchableOpacity> */}
      <View className={styles.container}>
        <Text
          className={styles.header}
          style={{ fontFamily: FONTS.SWITZER }}
        >
          Sign In
        </Text>
        <Pressable
          className={`${styles.authButtonActive} ${styles.authButton}`}
          onPress={handleAppleSignIn}
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
          onPress={handleGoogleSignIn}
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
        <View className={`${styles.dividerContainer} ${styles.dividerMargin}`}>
          <View className={styles.dividerLine} />
          <Text
            className={`${styles.dividerTextColor} ${styles.dividerText}`}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Or
          </Text>
          <View className={styles.dividerLine} />
        </View>
        <View className={`${styles.inputContainer} ${styles.input}`}>
          <TextInput
            className={styles.inputText}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
            style={{ fontFamily: FONTS.SATOSHI }}
          />
        </View>
        <View className={`${styles.inputContainer} ${styles.input}`}>
          <TextInput
            className={styles.inputText}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            style={{ fontFamily: FONTS.SATOSHI }}
          />
          <TouchableOpacity onPress={() => {
            triggerHaptic();
            setShowPassword(!showPassword);
          }}>
            <MaterialIcon name={showPassword ? "visibility" : "visibility-off"} size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className={`${styles.forgotPasswordContainer} ${styles.forgotPassword}`}
          onPress={handleForgotPassword}
        >
          <Text
            className={`${styles.forgotPasswordTextColor} ${styles.forgotPasswordText}`}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Forget Password?
          </Text>
        </TouchableOpacity>
        <Pressable
          className={`${styles.authButtonActive} ${styles.signInButton}`}
          onPress={handleEmailSignIn}
        >
          <Text
            className={`${styles.authButtonTextColor} ${styles.signInText}`}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Log In
          </Text>
        </Pressable>
        <View className={`${styles.signUpLinkContainer} ${styles.signUpContainer}`}>
          <Text
            className={`${styles.signUpTextColor} ${styles.signUpText}`}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text
              className={`${styles.signUpLinkColor} ${styles.signUpLink}`}
              style={{ fontFamily: FONTS.SATOSHI }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <View className={styles.termsContainer}>
          <Text
            className={styles.termsText}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            By signing in, you agree to our{" "}
          </Text>
          <TouchableOpacity onPress={handleTermsPress}>
            <Text
              className={styles.termsLink}
              style={{ fontFamily: FONTS.SATOSHI }}
            >
              Terms Of Service
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