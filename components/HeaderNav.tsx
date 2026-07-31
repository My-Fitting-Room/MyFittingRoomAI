import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions, Platform, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { GlassEffectView } from "react-native-glass-effect-view";
import { styles } from "../stylesheets/headerNav";
import { triggerHaptic } from "../utils/haptics";

// The header background extends FADE_EXT below the logo row; that whole
// extension is the fade zone. Overlay only — screens inset content by the
// logo-row height (107/79), so content scrolls underneath the fade.
//
// Single glass layer with one continuous eased fade starting at the very
// bottom of the logo/text (padBottom above the row's edge). Softened
// mid-curve so the dissolve stays perceptible across most of the 60pt
// zone even over flat backgrounds (gray-100 pages), where the glass is
// only visible through its light tint.
const FADE_EXT = 180;

function headerFade(logoRowH, padBottom, tint) {
  const total = logoRowH + FADE_EXT;
  const start = (logoRowH - padBottom) / total;
  const ext = 1 - start;
  return {
    colors: [1, 1, 0.6, 0.3, 0.12, 0.04, 0].map(a => `rgba(${tint},${a})`),
    locations: [
      0,
      start,
      start + ext * 0.2,
      start + ext * 0.45,
      start + ext * 0.65,
      start + ext * 0.85,
      1,
    ],
  };
}
// padBottom mirrors headerGlass/smallHeaderGlass paddingBottom (12/8).
const GLASS_MASK_REGULAR = headerFade(107, 12, "0,0,0");
const GLASS_MASK_SMALL   = headerFade(79,  8,  "0,0,0");
const GLASS_MASK_IPAD    = headerFade(82,  12, "0,0,0");

const FALLBACK_FADE_REGULAR = headerFade(107, 12, "255,255,255");
const FALLBACK_FADE_SMALL   = headerFade(79,  8,  "255,255,255");
const FALLBACK_FADE_IPAD    = headerFade(82,  12, "255,255,255");

// Absolute background layer extending past the header's bottom edge.
const bgFill = { position: "absolute", top: 0, left: 0, right: 0, bottom: -FADE_EXT } as const;

const isIOS26 = Platform.OS === "ios" && parseInt(Platform.Version as string, 10) >= 26;

export default function HeaderNav({ navigation }) {
  const { height } = Dimensions.get("window");
  const isIPad  = Platform.isPad;
  const isSmall = !isIPad && height < 700;

  const handleLogoPress = () => {
    triggerHaptic();
    navigation.navigate("TryOn");
  };

  const logoContent = (
    <TouchableOpacity style={styles.logoContainer} onPress={handleLogoPress}>
      <Image source={require("../assets/mfr-logo2.png")} style={styles.logoImage} />
      <Text style={styles.logoText}>My Fitting Room</Text>
    </TouchableOpacity>
  );

  const layoutStyle = [
    styles.headerBase,
    isIPad  ? styles.ipadHeaderGlass  :
    isSmall ? styles.smallHeaderGlass :
              styles.headerGlass,
  ];

  if (isIOS26) {
    const mask = isIPad  ? GLASS_MASK_IPAD  :
                 isSmall ? GLASS_MASK_SMALL :
                           GLASS_MASK_REGULAR;
    return (
      <View style={layoutStyle} pointerEvents="box-none">
        <MaskedView
          style={bgFill}
          pointerEvents="none"
          maskElement={
            <LinearGradient
              colors={mask.colors}
              locations={mask.locations}
              style={StyleSheet.absoluteFillObject}
            />
          }
        >
          <GlassEffectView style={StyleSheet.absoluteFillObject} />
        </MaskedView>
        {logoContent}
      </View>
    );
  }

  const fallback = isIPad  ? FALLBACK_FADE_IPAD  :
                   isSmall ? FALLBACK_FADE_SMALL :
                             FALLBACK_FADE_REGULAR;
  return (
    <View style={layoutStyle} pointerEvents="box-none">
      <LinearGradient
        colors={fallback.colors}
        locations={fallback.locations}
        style={bgFill}
        pointerEvents="none"
      />
      {logoContent}
    </View>
  );
}
