import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
    runOnJS
} from 'react-native-reanimated';
import { triggerHaptic } from '../utils/haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ScaleButton = ({
    onPress,
    style,
    children,
    pressedScale = 0.95,
    activeOpacity = 1,
    ...props
}: {
    onPress?: () => void;
    style?: any;
    children?: React.ReactNode;
    pressedScale?: number;
    activeOpacity?: number;
    [key: string]: any;
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    const handlePressIn = () => {
        scale.value = withTiming(pressedScale, {
            duration: 80,
            easing: Easing.out(Easing.quad)
        });
    };

    const handlePressOut = () => {
        scale.value = withTiming(1, {
            duration: 120,
            easing: Easing.out(Easing.back(1.5))
        });
    };

    const handlePress = () => {
        triggerHaptic();
        if (onPress) onPress();
    };

    return (
        <AnimatedPressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[style, animatedStyle]}
            {...props}
        >
            {children}
        </AnimatedPressable>
    );
};

export default ScaleButton;
