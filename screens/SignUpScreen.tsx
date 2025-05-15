import { View, TouchableOpacity, Text, Alert, Image, Pressable, Linking, Dimensions } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { supabase } from "../App";
import React from "react";
import { FONTS } from "../constants/fonts";
import Config from "react-native-config";
import Video from "react-native-video";

export default function SignUpScreen({ navigation }) {
  const { width } = Dimensions.get("window");
  
  const deviceType = width <= 375 ? "small" : width <= 390 ? "regular" : "proMax";

  const deviceStyles = {
    small: {
      mainWrapper: "flex-[2] px-10 mt-40 items-center justify-center pb-0.5",
      contentWrapper: "w-full",
      headerText: "text-3xl text-center mb-4 font-bold text-black",
      subHeader: "px-10 text-sm mb-6",
      videoHeight: 200,
      videoWidth: width * 0.95,
      bottomWrapper: "flex-1 px-16 pt-10 justify-start",
      authButton: "py-3 px-4 flex-row items-center justify-center rounded-[10px] mb-5",
      authButtonText: "text-base font-medium",
      icon: "w-5 h-5 mr-3",
      videoView: ""
    },
    regular: {
      mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center ",
      contentWrapper: "w-full",
      headerText: "text-4xl text-center mb-6 font-bold text-black",
      subHeader: "px-2 text-lg mb-6",
      videoHeight: 240,
      videoWidth: width * 0.95,
      bottomWrapper: "flex-1 px-16 justify-start pt-8 mb-4",
      authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-5",
      authButtonText: "text-lg font-medium",
      icon: "w-5 h-5 mr-3",
      videoView: "mt-4"
    },
    proMax: {
      mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
      contentWrapper: "w-full",
      headerText: "text-4xl text-center mb-6 font-bold text-black",
      subHeader: "px-6 text-lg mb-6",
      videoHeight: 260,
      videoWidth: width * 0.95,
      bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-7",
      authButton: "py-4 px-4 flex-row items-center justify-center rounded-[10px] mb-6",
      authButtonText: "text-lg font-medium",
      icon: "w-5 h-5 mr-3",
      videoView: "mt-4"
    }
  };

  const styles = deviceStyles[deviceType];

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    iosClientId: Config.GOOGLE_IOS_CLIENT_ID,
  });

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
    <View className="flex-1 bg-white">
      <TouchableOpacity 
        className="absolute w-full bg-black pt-14 sm:pt-16 pb-3 items-center justify-center active:bg-neutral-800 active:scale-[0.98]"
        style={{ elevation: 5, zIndex: 10 }}
        onPress={handleSubscribe}
        activeOpacity={0.9}
      >
        <Text 
          className="text-white text-sm sm:text-base" 
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
            className={`text-gray-800 text-center ${styles.subHeader}`}
            style={{ 
              fontFamily: FONTS.SATOSHI,
              lineHeight: 22 
            }}
          >
            Just upload a photo of the clothing you want to try on and a photo of yourself.
          </Text>
          
          <View className={`items-center justify-center ${styles.videoView}`}>
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
              playInBackground={false}
            />
          </View>
        </View>
      </View>

      <View className={styles.bottomWrapper}>
        <Pressable 
          className={`bg-black ${styles.authButton} active:bg-neutral-800 active:scale-[0.98]`}
          onPress={handleAppleSignUp}
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
          onPress={handleGoogleSignUp}
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
      </View>
    </View>
  );
}