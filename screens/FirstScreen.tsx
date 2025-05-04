import { View, StyleSheet, TouchableOpacity, Text, Alert, Image, Pressable, Linking } from "react-native";
import React, { useState } from "react";
import { FONTS } from "../constants/fonts";

export default function FirstScreen({ navigation }) {
  const [buttonPressed, setButtonPressed] = useState(false);
  const [subscribePressed, setSubscribePressed] = useState(false);

  const handleSubscribe = () => {
    Linking.openURL("http://eepurl.com/i5TN6-/");
  };
  
  const handleSignInRedirect = () => {
    navigation.navigate("SignIn");
  };

  const handleSignUpRedirect = () => {
    navigation.navigate("SignUp");
  }

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
            buttonPressed && styles.buttonPressed
          ]}
          onPress={handleSignUpRedirect}
          onPressIn={() => setButtonPressed(true)}
          onPressOut={() => setButtonPressed(false)}
        >
          <Text style={styles.appleButtonText}>Continue</Text>
        </Pressable>
        
        <View style={styles.signInContainer}>
          <Text style={styles.regularText}>Purchased on the web? </Text>
          <Text style={styles.signInText} onPress={handleSignInRedirect}>Sign In</Text>
        </View>
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
    paddingTop: 56,
    backgroundColor: "black",
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, 
    position: "absolute", 
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
    paddingTop: 40, 
    alignItems: "center",
    justifyContent: "flex-end", 
    paddingBottom: 2,
    marginTop: 24, 
  },
  contentWrapper: {
    width: "100%",
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 60,
    justifyContent: "flex-start", 
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
    tintColor: "white", 
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
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  regularText: {
    fontSize: 16,
    color: "#000",
    fontFamily: FONTS.SATOSHI,
  },
  signInText: {
    fontSize: 16,
    color: "#4051FF", 
    fontFamily: FONTS.SATOSHI,
    fontWeight: "500",
  }
});