import React, { useRef, useEffect, useState } from "react";
import { View, TouchableOpacity, Animated, Platform, StyleSheet } from "react-native";
import Feathericons from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { GlassEffectView } from "react-native-glass-effect-view";
import { styles } from "../stylesheets/bottomNav";
import { triggerHaptic } from "../utils/haptics";

const IS_IOS26 = Platform.OS === "ios" && parseInt(Platform.Version as string, 10) >= 26;

// Mirror of the header's glass fade, running upward from the screen
// bottom: solid glass behind the pill + home-indicator zone (bottom
// 100pt of the 160pt panel), then the same eased dissolve across the
// top 60pt. Same curve as HeaderNav, reversed.
const NAV_FADE_F = 60 / 160;
const NAV_GLASS_MASK_COLORS = [0, 0.04, 0.12, 0.3, 0.6, 1, 1].map(a => `rgba(0,0,0,${a})`);
const NAV_GLASS_MASK_LOCATIONS = [
  0,
  0.15 * NAV_FADE_F,
  0.35 * NAV_FADE_F,
  0.55 * NAV_FADE_F,
  0.8 * NAV_FADE_F,
  NAV_FADE_F,
  1,
];

const TABS = [
  { name: "TryOn",         icon: "home" },
  { name: "Avatar",        icon: "user" },
  { name: "Sizing",        icon: "sliders" },
  { name: "OutfitPlanner", icon: "calendar" },
  { name: "Settings",      icon: "settings" },
] as const;

const BUBBLE_SIZE = 44;
const NAVBAR_PH = 25;
const NAV_ITEM_W = 40; // icon 24 + padding 8×2

function calcBubbleX(index: number, navbarWidth: number): number {
  const gap = (navbarWidth - NAVBAR_PH * 2 - TABS.length * NAV_ITEM_W) / (TABS.length - 1);
  const itemCenter = NAVBAR_PH + NAV_ITEM_W / 2 + index * (NAV_ITEM_W + gap);
  return itemCenter - BUBBLE_SIZE / 2;
}

export default function BottomNav({ navigation, activeTab }) {
  const navbarWidthRef = useRef(0);
  const bubbleAnim = useRef(new Animated.Value(0)).current;
  const [ready, setReady] = useState(false);

  const activeIndex = TABS.findIndex(t => t.name === activeTab);

  const onNavbarLayout = (e: any) => {
    navbarWidthRef.current = e.nativeEvent.layout.width;
    bubbleAnim.setValue(calcBubbleX(activeIndex, navbarWidthRef.current));
    setReady(true);
  };

  useEffect(() => {
    if (!ready) return;
    Animated.spring(bubbleAnim, {
      toValue: calcBubbleX(activeIndex, navbarWidthRef.current),
      useNativeDriver: true,
      tension: 300,
      friction: 25,
    }).start();
  }, [activeTab, ready]);

  return (
    <>
      {IS_IOS26 ? (
        <MaskedView
          style={styles.glassScrim}
          pointerEvents="none"
          maskElement={
            <LinearGradient
              colors={NAV_GLASS_MASK_COLORS}
              locations={NAV_GLASS_MASK_LOCATIONS}
              style={StyleSheet.absoluteFillObject}
            />
          }
        >
          <GlassEffectView style={StyleSheet.absoluteFillObject} />
        </MaskedView>
      ) : (
        <LinearGradient
          colors={["rgba(255,255,255,0)", "rgba(255,255,255,0.5)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.8)", "rgba(255,255,255,0.9)", "rgba(255,255,255,0.9)", "rgba(255,255,255,0.9)"]}
          style={styles.gradient}
          pointerEvents="none"
        />
      )}
      <View style={styles.container}>
        <View style={styles.navbar} onLayout={onNavbarLayout}>
          {ready && (
            // Outer view carries the shadow (not clipped), inner clips to circle
            <Animated.View
              pointerEvents="none"
              style={[styles.bubbleShadow, { transform: [{ translateX: bubbleAnim }] }]}
            >
              <View style={styles.bubbleClip}>
                {IS_IOS26
                  ? <GlassEffectView style={StyleSheet.absoluteFillObject} />
                  : <View style={styles.bubbleFallback} />
                }
              </View>
            </Animated.View>
          )}
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.name}
              onPress={() => { triggerHaptic(); navigation.navigate(tab.name); }}
              style={styles.navItem}
            >
              <Feathericons
                name={tab.icon}
                size={24}
                color={activeTab === tab.name ? "#4052FF" : "#000"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
}
