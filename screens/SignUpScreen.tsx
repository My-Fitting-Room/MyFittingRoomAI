import { View, StyleSheet, TouchableOpacity, Text, Alert, Image, Pressable, Linking } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { supabase } from "../App";
import React, { useState } from "react";
import { FONTS } from "../constants/fonts";
import Config from "react-native-config";

export default function SignUpScreen({ navigation }) {
  const [applePressed, setApplePressed] = useState(false);
  const [googlePressed, setGooglePressed] = useState(false);
  const [subscribePressed, setSubscribePressed] = useState(false);

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
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.subscribeBar,
          subscribePressed && styles.subscribeBarPressed
        ]}
        onPress={handleSubscribe}
        onPressIn={() => setSubscribePressed(true)}
        onPressOut={() => setSubscribePressed(false)}
        activeOpacity={0.9}
      >
        <Text style={styles.subscribeText}>Subscribe to our email list</Text>
      </TouchableOpacity>
      
      <View style={styles.topSection}>
        <View style={styles.contentWrapper}>
          <Text style={styles.mainHeader}>Try-On Clothes From Your Phone.</Text>
          <Text style={styles.subHeader}>
            Just upload a photo of the clothing you want to try on and a photo of yourself.
          </Text>
          <Image 
            source={require("../assets/onboarding.png")} 
            style={styles.onboardingImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Pressable 
          style={[
            styles.authButton, 
            styles.appleButton,
            applePressed && styles.buttonPressed
          ]}
          onPress={handleAppleSignUp}
          onPressIn={() => setApplePressed(true)}
          onPressOut={() => setApplePressed(false)}
        >
          <MaterialIcon name="apple" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.appleButtonText}>Continue with Apple</Text>
        </Pressable>

        <Pressable 
          style={[
            styles.authButton, 
            styles.googleButton,
            googlePressed && styles.buttonPressed
          ]}
          onPress={handleGoogleSignUp}
          onPressIn={() => setGooglePressed(true)}
          onPressOut={() => setGooglePressed(false)}
        >
          <Image source={require("../assets/google-logo.png")} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  subscribeBar: {
    
    paddingTop:56,
    backgroundColor: "black",
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Android elevation
    position: "absolute", // Position it absolutely
   
  },
  subscribeText: {
    color: "white",
    fontSize: 14,
    fontFamily: FONTS.SATOSHI,
    fontWeight: "400",
  },
  subscribeBarPressed: {
    backgroundColor: "#333333",
    transform: [{ scale: 0.98 }],
  },
  topSection: {
    flex: 2,
    paddingHorizontal: 50,
    paddingTop: 40, // Added extra padding to account for the absolute positioned bar
    alignItems: "center",
    justifyContent: "flex-end", // Push content toward bottom
    paddingBottom: 2,
    marginTop: 24, // Add margin to push content below subscribe bar
  },
  contentWrapper: {
    width: "100%",
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 60,
    justifyContent: "flex-start", // Push content toward top
    paddingTop: 20,
    marginBottom: 28
  },
  mainHeader: {
    fontSize: 32,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: FONTS.SWITZER,
  },
  subHeader: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    fontFamily: FONTS.SATOSHI,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  onboardingImage: {
    width: "100%",
    height: 280,
  },
  signUpHeader: {
    fontSize: 28,
    color: "#000",
    marginBottom: 34,
    fontWeight: "400",
    fontFamily: FONTS.SWITZER,
    textAlign: "center",
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    padding: 16,
    marginBottom: 22,
  },
  buttonPressed: {
    backgroundColor: "#333333",
    transform: [{ scale: 0.98 }],
  },
  appleButton: {
    backgroundColor: "#000",
  },
  googleButton: {
    backgroundColor: "#000",
  },
  buttonIcon: {
    marginRight: 10,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: "white", // Make Google icon white
  },
  appleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI,
  },
  googleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI,
  },
});