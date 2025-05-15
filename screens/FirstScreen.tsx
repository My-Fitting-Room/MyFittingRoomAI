import { View, TouchableOpacity, Text, Pressable, Linking, Dimensions } from "react-native";
import React from "react";
import { FONTS } from "../constants/fonts";
import Video from "react-native-video";

export default function FirstScreen({ navigation }) {
  const { width, height } = Dimensions.get("window");

  const deviceType = width <= 375 ? "small" : width <= 390 ? "regular" : "proMax";

  const deviceStyles = {
    small: {
      mainWrapper: "flex-[2] px-10 pt-40 items-center justify-center pb-0.5",
      contentWrapper: "w-full ",
      headerText: "text-3xl text-center mb-4 font-bold text-black",
      subHeader: "px-10 text-sm mb-6",
      videoHeight: 200, 
      videoWidth: width * 0.95, 
      bottomWrapper: "flex-1 px-16 pt-10 justify-start ",
      signInContainer: "mt-2 mb-10",
      videoView : " "
    },
    regular: {
      mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center ",
      contentWrapper: "w-full",
      headerText: "text-4xl text-center mb-6 font-bold text-black",
      subHeader: "px-2 text-lg mb-6",
      videoHeight: 240, 
      videoWidth: width * 0.95,
      bottomWrapper: "flex-1 px-16 justify-start pt-5 mb-4",
      signInContainer: "mt-6",
      videoView: "mt-2"
    },
    proMax: {
      mainWrapper: "flex-[2] px-12 pt-44 items-center justify-center",
      contentWrapper: "w-full",
      headerText: "text-4xl text-center mb-6 font-bold text-black",
      subHeader: "px-6 text-lg mb-6",
      videoHeight: 260, 
      videoWidth: width * 0.95, 
      bottomWrapper: "flex-1 px-16 justify-start pt-8 ",
      signInContainer: "mt-2",
      videoView:"mt-4"
    }
  };

  const styles = deviceStyles[deviceType];

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
          className="bg-black rounded-[10px] p-3 mb-5 flex-row items-center justify-center active:bg-neutral-800 active:scale-[0.98]"
          onPress={handleSignUpRedirect}
        >
          <Text 
            className="text-white text-lg font-medium"
            style={{ fontFamily: FONTS.SATOSHI }}
          >
            Continue
          </Text>
        </Pressable>
        
        <View className={`flex-row justify-center font-bold items-center ${styles.signInContainer}`}>
          <Text 
            className="text-lg text-black"
            style={{ fontFamily: FONTS.SATOSHI, fontWeight: "600" }}
          >
            Purchased on the web?{" "}
          </Text>
          <Text 
            className="text-lg text-[#4051FF]"
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