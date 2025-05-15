import { View, TouchableOpacity, Text, Alert, Image, TextInput, Linking, Pressable, Dimensions } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { supabase } from "../App";
import React, { useState } from "react";
import { FONTS } from "../constants/fonts";
import Config from "react-native-config";

export default function SignInScreen({ navigation }) {
  const { width } = Dimensions.get("window");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const deviceType = width <= 375 ? "small" : width <= 390 ? "regular" : "proMax";

  const deviceStyles = {
    small: {
      container: "pt-28 px-10 justify-center",
      header: "text-3xl text-center mb-8 font-medium text-black",
      authButton: "py-3 px-4 flex-row items-center justify-center rounded-[10px] mb-5",
      authButtonText: "text-base font-medium",
      icon: "w-5 h-5 mr-3",
      input: "rounded-xl p-4 mb-4 text-base bg-gray-100",
      signInButton: "rounded-[10px] py-3 px-4 items-center mb-5",
      signInText: "text-base font-medium",
      signUpContainer: "mt-3",
      signUpText: "text-lg mr-1 font-semibold",
      signUpLink: "text-lg font-semibold",
      forgotPassword: "mb-5",
      forgotPasswordText: "text-sm",
      dividerText: "text-sm px-3",
      dividerMargin: "my-5",
    },
    regular: {
      container: "pt-44 px-14 justify-center",
      header: "text-4xl text-center mb-10 font-medium text-black",
      authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-5",
      authButtonText: "text-lg font-medium",
      icon: "w-5 h-5 mr-3",
      input: "rounded-xl p-4 mb-4 text-lg bg-gray-100",
      signInButton: "rounded-[10px] py-4 px-4 items-center mb-5",
      signInText: "text-lg font-medium",
      signUpContainer: "mt-3",
      signUpText: "text-lg mr-1.5 font-semibold",
      signUpLink: "text-lg font-semibold",
      forgotPassword: "mb-6",
      forgotPasswordText: "text-base",
      dividerText: "text-base px-3",
      dividerMargin: "my-6",
    },
    proMax: {
      container: "pt-44 px-16 justify-center",
      header: "text-4xl text-center mb-12 font-medium text-black",
      authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
      authButtonText: "text-lg font-medium",
      icon: "w-5 h-5 mr-3",
      input: "rounded-xl p-4 mb-4 text-lg bg-gray-100",
      signInButton: "rounded-[10px] py-4 px-4 items-center mb-6",
      signInText: "text-lg font-medium",
      signUpContainer: "mt-4",
      signUpText: "text-lg mr-1.5 font-semibold",
      signUpLink: "text-lg font-semibold",
      forgotPassword: "mb-7",
      forgotPasswordText: "text-base",
      dividerText: "text-base px-3",
      dividerMargin: "my-7",
    }
  };

  const styles = deviceStyles[deviceType];

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
  });

  const handleForgotPassword = () => {
    Linking.openURL("https://app.myfittingroom.ai/signin");
  };

  const handleGoogleSignIn = async () => {
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
            "Sign In Error ",
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
          "Sign In Error",
          "Please Try Again Later!",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Sign In Error",
        "Please Try Again Later!",
        [{ text: "OK" }]
      );
    }
  };

  const handleAppleSignIn = async () => {
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
            "Sign In Error",
            "Authentication failed with Supabase. Please try again.",
            [{ text: "OK" }]
          );
          return;
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
    navigation.navigate("SignUp");
  };

  const handleSubscribe = () => {
    Linking.openURL("http://eepurl.com/i5TN6-/");
  };

  return (
    <View className="flex-1 bg-white">
      <TouchableOpacity 
        className="absolute w-full bg-black pt-14 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]"
        style={{ elevation: 5 }}
        onPress={handleSubscribe}
        activeOpacity={0.9}
      >
        <Text 
          className="text-white text-sm" 
          style={{ fontFamily: FONTS.SATOSHI, fontWeight: "400" }}
        >
          Subscribe to our email list
        </Text>
      </TouchableOpacity>
      <View className={styles.container}>
        <Text 
          className={styles.header}
          style={{ fontFamily: FONTS.SWITZER }}
        >
          Sign In
        </Text>

        <Pressable 
          className={`bg-black ${styles.authButton} active:bg-neutral-800 active:scale-[0.98]`}
          onPress={handleAppleSignIn}
        >
          <MaterialIcon name="apple" size={24} color="white" className="mr-3" />
          <Text 
            className={`text-white ${styles.authButtonText}`}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Continue with Apple
          </Text>
        </Pressable>

        <Pressable 
          className={`bg-black ${styles.authButton} active:bg-neutral-800 active:scale-[0.98]`}
          onPress={handleGoogleSignIn}
        >
         <Image 
            source={require("../assets/google-logo.png")} 
            className={styles.icon}
            style={{ tintColor: "white" }}
          />
          <Text 
            className={`text-white ${styles.authButtonText}`}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Continue with Google
          </Text>
        </Pressable>

        <View className={`flex-row items-center ${styles.dividerMargin}`}>
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text 
            className={`text-gray-600 ${styles.dividerText}`}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Or
          </Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        <View className={`flex-row ${styles.input} items-center`}>
          <TextInput
            className="flex-1"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
            style={{ fontFamily: FONTS.SATOSHI }}
          />
        </View>

        <View className={`flex-row ${styles.input} items-center`}>
          <TextInput
            className="flex-1"
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            style={{ fontFamily: FONTS.SATOSHI }}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="">
            <MaterialIcon name={showPassword ? "visibility" : "visibility-off"} size={20} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          className={`self-end ${styles.forgotPassword}`} 
          onPress={handleForgotPassword}
        >
          <Text 
            className={`text-gray-600 ${styles.forgotPasswordText}`}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Forget Password?
          </Text>
        </TouchableOpacity>

        <Pressable 
          className={`bg-black ${styles.signInButton} active:bg-neutral-800 active:scale-[0.98]`}
          onPress={handleEmailSignIn}
        >
          <Text 
            className={`text-white ${styles.signInText}`}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Log In
          </Text>
        </Pressable>

        <View className={`flex-row justify-center ${styles.signUpContainer}`}>
          <Text 
            className={`text-black ${styles.signUpText}`}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Don"t have an account?
          </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text 
              className={`text-[#4051FF] ${styles.signUpLink}`}
              style={{ fontFamily: FONTS.SATOSHI }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

