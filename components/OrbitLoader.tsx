import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

// myf pastel gradient — soft pink / lilac / blue / peach (no teal).
// First color repeated at the end so the ring wraps seamlessly as it spins.
const PASTEL = ["#FCD6FF", "#E0BBE4", "#BDE0FE", "#FAD0C4", "#FCD6FF"];

// Minimal retro-futuristic loader: a thin pastel-gradient ring that slowly
// rotates, with a small static sparkle (MYF logo language) at its center.
export default function OrbitLoader({
  size = 44,
  thickness = 3,
}: {
  size?: number;
  thickness?: number;
}) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(rotation);
  }, []);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[StyleSheet.absoluteFillObject, spinStyle]}>
        <MaskedView
          style={{ width: size, height: size }}
          maskElement={
            <View
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: thickness,
                borderColor: "#000",
                backgroundColor: "transparent",
              }}
            />
          }
        >
          <LinearGradient
            colors={PASTEL}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: size, height: size }}
          />
        </MaskedView>
      </Animated.View>

      <Text style={{ fontSize: size * 0.34, color: "#C9A0E6", lineHeight: size * 0.4 }}>
        ✦
      </Text>
    </View>
  );
}
