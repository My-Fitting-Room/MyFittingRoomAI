import React, { useEffect } from "react";
import { View } from "react-native";
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

// myf brand gradient (onboarding selected buttons / GradientSlider).
// First color repeated at the end so the ring wraps seamlessly as it spins.
const GRADIENT = ["#29D8FF", "#ADFFBC", "#FFFD82", "#F569FF", "#29D8FF"];

// Retro-futuristic loader: a brand-gradient ring rotating continuously.
export default function OrbitLoader({
  size = 84,
  thickness = 6,
}: {
  size?: number;
  thickness?: number;
}) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 2400, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(rotation);
  }, []);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, spinStyle]}>
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
          colors={GRADIENT}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: size, height: size }}
        />
      </MaskedView>
    </Animated.View>
  );
}
