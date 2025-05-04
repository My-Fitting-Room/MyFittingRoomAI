import { View, StyleSheet, TouchableOpacity, Text, Alert, Image, TextInput, Linking, Pressable } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { supabase } from "../App";
import React, { useState } from "react";
import { FONTS } from "../constants/fonts";
import Config from "react-native-config";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [applePressed, setApplePressed] = useState(false);
  const [googlePressed, setGooglePressed] = useState(false);

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

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.header}>Sign In</Text>

        <Pressable 
          style={[
            styles.authButton, 
            styles.appleButton,
            applePressed && styles.buttonPressed
          ]}
          onPress={handleAppleSignIn}
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
          onPress={handleGoogleSignIn}
          onPressIn={() => setGooglePressed(true)}
          onPressOut={() => setGooglePressed(false)}
        >
          <Image 
            source={require("../assets/google-logo.png")} 
            style={styles.googleIcon} 
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.divider} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#666"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <MaterialIcon name={showPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forget Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signInButton} onPress={handleEmailSignIn}>
          <Text style={styles.signInButtonText}>Log In</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
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
  topSection: {
    flex: 1,
    padding: 40,
    paddingHorizontal: 60,
    justifyContent: "center",
  },
  header: {
    fontSize: 32,
    color: "#000",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "500",
    fontFamily: FONTS.SWITZER
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  dividerText: {
    color: "gray",
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: FONTS.SATOSHI
  },
  input: {
    backgroundColor: "#f5f7fb",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: "400",
    fontFamily: FONTS.SATOSHI
  },
  passwordContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f7fb",
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    fontFamily: FONTS.SATOSHI
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "gray",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: FONTS.SATOSHI
  },
  signInButton: {
    backgroundColor: "#000",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  signUpText: {
    color: "gray",
    fontSize: 14,
    marginRight: 5,
    fontWeight: "400",
    fontFamily: FONTS.SATOSHI
  },
  signUpLink: {
    color: "#000",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: FONTS.SATOSHI
  },
});