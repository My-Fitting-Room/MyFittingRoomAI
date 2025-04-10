import { View, StyleSheet, TouchableOpacity, Text, Alert, Image, TextInput } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { supabase } from "../App";
import React, { useState } from "react";
import { FONTS } from "../constants/fonts";
import Config from "react-native-config";


export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleEmailSignUp = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return;
    }
    
    if (!password) {
      Alert.alert("Error", "Please enter a password");
      return;
    }

    if (password.length < 8) {
        Alert.alert("Error", "Password must be at least 8 characters long");
        return;
      }
    
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          }
        }
      });

      if (error) {
        Alert.alert(
          "Sign Up Error",
          error.message,
          [{ text: "OK" }]
        );
        return;
      }

      Alert.alert(
        "Success",
        "Your account has been created. Please sign in.",
        [
          { 
            text: "OK",
            onPress: () => navigation.navigate("SignIn")
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        "Sign Up Error",
        "Please Try Again Later!",
        [{ text: "OK" }]
      );
    }
  };

  const handleSignIn = () => {
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text> 

      <TouchableOpacity style={styles.appleButton} onPress={handleAppleSignUp}>
        <MaterialIcon name="apple" size={24} color="black" style={styles.buttonIcon} />
        <Text style={styles.appleButtonText}>Apple</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
        <Image source={require("../assets/google-logo.png")} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Google</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or</Text>
        <View style={styles.divider} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
        placeholderTextColor="#666"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          placeholderTextColor="#666"
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
          <MaterialIcon name={showConfirmPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createAccountButton} onPress={handleEmailSignUp}>
        <Text style={styles.createAccountButtonText}>Create Account</Text>
      </TouchableOpacity>

      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Do you have account? </Text>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={styles.signInLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "center",
  },
  header: {
    fontSize: 40,
    color: "#4052FF",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "400",
    fontFamily: FONTS.SWITZER
  },
  appleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  appleButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: FONTS.SATOSHI
  },
  buttonIcon: {
    marginRight: 10,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: FONTS.SATOSHI
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
    borderRadius: 6,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f7fb",
    borderRadius: 6,
    marginBottom: 30,
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  createAccountButton: {
    backgroundColor: "#4052FF",
    borderRadius: 6,
    padding: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  createAccountButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: FONTS.SATOSHI
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signInText: {
    color: "gray",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: FONTS.SATOSHI
  },
  signInLink: {
    color: "#4052FF",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: FONTS.SATOSHI  },
});