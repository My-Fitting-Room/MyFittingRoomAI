import { View, TouchableOpacity, Text, Pressable, Linking, Dimensions } from "react-native";
import React from "react";
import { FONTS } from "../constants/fonts";
import Video from "react-native-video";
import { getStyles } from "../stylesheets/firstScreen";

export default function FirstScreen({ navigation }) {
  const { width, height } = Dimensions.get("window");
  const styles = getStyles(width,height);

  const handleSubscribe = () => {
    Linking.openURL("http://eepurl.com/i5TN6-/");
  };
  
  const handleSignInRedirect = () => {
    navigation.navigate("SignIn");
  };

  const handleSignUpRedirect = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View className="flex-1 bg-white">
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
         
          <View className={`items-center justify-center ${styles.videoView}`}>
            <Video
              source={require("../assets/firstscreen.mp4")}
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
          className={styles.continueButton}
          onPress={handleSignUpRedirect}
        >
          <Text 
            className={styles.continueButtonText}
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Continue
          </Text>
        </Pressable>
        
        <View className={styles.signInContainer}>
          <Text 
            className={styles.webPurchaseButtonText}
            style={{ fontFamily: FONTS.SATOSHI, fontWeight: "600" }}
          >
            Purchased on the web?{" "}
          </Text>
          <Text 
            className={styles.signinButtonText}
            style={{ fontFamily: FONTS.SATOSHI, fontWeight: "600" }}
            onPress={handleSignInRedirect}
          >
            Sign In
          </Text>
        </View>
      </View>
    </View>
  );
}