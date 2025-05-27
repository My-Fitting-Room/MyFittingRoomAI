// import React from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, StatusBar, Dimensions } from "react-native";
// import { FONTS } from "../constants/fonts";
// import LinearGradient from "react-native-linear-gradient"; 

// export default function HeaderNav({navigation}) {
//   const { width } = Dimensions.get("window");
//   const deviceType = width <= 375 ? "small" : width <= 390 ? "regular" : "proMax";
  
//   const handleLogoPress = () => {
//     navigation.navigate("TryOn");
//   };


//   if(deviceType === "small") {
//     return (
//       <>
//         <View style={styles.smallHeader}>
//           <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
//             <Image source={require("../assets/mfr-logo2.png")} style={styles.logoImage} />
//             <Text style={styles.logoText}>My Fitting Room</Text>
//           </TouchableOpacity>
//         </View>
//         <LinearGradient
//           colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0)"]}          style={styles.gradient}
//           pointerEvents="none"
//         />
//       </>
//     );
//   } else {
//     return (
//       <>
//         <View style={styles.header}>
//           <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
//             <Image source={require("../assets/mfr-logo2.png")} style={styles.logoImage} />
//             <Text style={styles.logoText}>My Fitting Room</Text>
//           </TouchableOpacity>
//         </View>
//         <LinearGradient
//           colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0)"]}          style={styles.gradient}
//           pointerEvents="none"
//         />
//       </>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   smallHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: 30,
//     paddingBottom: 8,
//     backgroundColor: "white", 
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 2, 
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: 55,
//     paddingBottom: 12,
//     backgroundColor: "white", 
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 2, 
    
    
//   },
//   gradient: {
//     position: "absolute",
//     top: 50,
//     left: 0,
//     right: 0,
//     height: 100,
//     zIndex: 1, 
//   },
//   logoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingTop: 5,
//   },
//   logoImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//   },
//   logoText: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#000000",
//     marginLeft: 12,
//     fontFamily: FONTS.SWITZER,
//   },
// });

import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform, StatusBar, Dimensions } from "react-native";
import { FONTS } from "../constants/fonts";
import LinearGradient from "react-native-linear-gradient";
import { styles } from "../stylesheets/headerNav";

export default function HeaderNav({navigation}) {
  const { width , height } = Dimensions.get("window");
  
  const handleLogoPress = () => {
    navigation.navigate("TryOn");
  };
  
  if(width === 375 && height === 667) {
    return (
      <>
        <View style={styles.smallHeader}>
          <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
            <Image source={require("../assets/mfr-logo2.png")} style={styles.logoImage} />
            <Text style={styles.logoText}>My Fitting Room</Text>
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0)"]}
          style={[styles.gradient, styles.smallGradient]}
          pointerEvents="none"
        />
      </>
    );
  } else {
    return (
      <>
        <View style={styles.header}>
          <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
            <Image source={require("../assets/mfr-logo2.png")} style={styles.logoImage} />
            <Text style={styles.logoText}>My Fitting Room</Text>
          </TouchableOpacity>
        </View>
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.6)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0)"]}
          style={[styles.gradient, styles.regularGradient]}
          pointerEvents="none"
        />
      </>
    );
  }
}

// const styles = StyleSheet.create({
//   smallHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: 30,
//     paddingBottom: 8,
//     backgroundColor: "white",
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 2,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: 55,
//     paddingBottom: 12,
//     backgroundColor: "white",
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 2,
//   },
//   gradient: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     height: 100,
//     zIndex: 1,
//   },
//   smallGradient: {
//     top: 10, // Positioned right below the small header (30 + 8 + padding/margins)
//   },
//   regularGradient: {
//     top: 70, // Positioned right below the regular header (55 + 12 + padding/margins)
//   },
//   logoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingTop: 5,
//   },
//   logoImage: {
//     width: 40,
//     height: 40,
//     borderRadius: 8,
//   },
//   logoText: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#000000",
//     marginLeft: 12,
//     fontFamily: FONTS.SWITZER,
//   },
// });