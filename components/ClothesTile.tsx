import { View, TouchableOpacity, Image, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import Feathericons from "react-native-vector-icons/Feather";
import { styles } from "../stylesheets/clothesTile";

export default function ClothesTile({ image, selected, onPress }) {
  // 0 = resting, 1 = selected (lifted)
  const lift = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(lift, {
      toValue: selected ? 1 : 0,
      friction: 5,
      tension: 140,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  const scale = lift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] });
  const restOpacity = lift.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const badgeScale = lift.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <TouchableOpacity style={styles.tileWrapper} onPress={onPress} activeOpacity={0.85}>
      <Animated.View style={[styles.tileScaler, { transform: [{ scale }] }]}>
        {/* shadow props can't animate on the native driver, so cross-fade
            a resting and a lifted shadow layer instead */}
        <Animated.View style={[styles.cardShadowRest, { opacity: restOpacity }]} />
        <Animated.View style={[styles.cardShadowLift, { opacity: lift }]} />
        <View style={styles.card}>
          <Image
            source={{ uri: image.url }}
            style={styles.tileImage}
            resizeMode="contain"
          />
        </View>
        <Animated.View style={[styles.badge, { opacity: lift, transform: [{ scale: badgeScale }] }]}>
          <Feathericons name="check" size={14} color="#fff" />
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}
