import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
    withSpring,
    useDerivedValue,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { triggerHaptic } from '../utils/haptics';

const WIDTH = Dimensions.get('window').width - 60; // Container padding (30*2)
const THUMB_SIZE = 24;
const TRACK_HEIGHT = 4;

const GradientSlider = ({ onValueChange, initialValue = 0.5 }) => {
    const translateX = useSharedValue(initialValue * (WIDTH - THUMB_SIZE));
    const context = useSharedValue({ x: 0 });

    const progress = useDerivedValue(() => {
        return translateX.value / (WIDTH - THUMB_SIZE);
    });

    const gesture = Gesture.Pan()
        .onStart(() => {
            runOnJS(triggerHaptic)("impactLight");
            context.value = { x: translateX.value };
        })
        .onUpdate((event) => {
            let newValue = context.value.x + event.translationX;
            // Clamp
            if (newValue < 0) newValue = 0;
            if (newValue > WIDTH - THUMB_SIZE) newValue = WIDTH - THUMB_SIZE;
            translateX.value = newValue;
        })
        .onEnd(() => {
            runOnJS(triggerHaptic)("impactLight");
            if (onValueChange) {
                runOnJS(onValueChange)(progress.value);
            }
        });

    const thumbStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    // Track fill width
    const fillStyle = useAnimatedStyle(() => {
        return {
            width: translateX.value + THUMB_SIZE / 2,
        };
    });

    // Dynamic Label Logic
    // 0-0.2: Never, 0.2-0.4: Rarely, 0.4-0.6: Sometimes, 0.6-0.8: Often, 0.8-1: Very Often
    // Or simple continuous mapping. I'll use derived layout for labels if requested, 
    // but for now the label "Very Often" in the screenshot seems to be the CURRENT value.
    // I will make a simple text component that updates based on value if needed, 
    // but standard state update onEnd might be slow for text. 
    // For this first pass, I'll let the parent handle the text via state, 
    // or just hardcode "Very Often" as in the mock if it's static?
    // "Very Often" is centered above the slider. It likely updates.
    // I will expose onValueChange and let parent drive the label.

    return (
        <View style={styles.container}>
            <GestureDetector gesture={gesture}>
                <View style={styles.sliderContainer}>
                    {/* Track Background (Gray) */}
                    <View style={styles.trackBackground} />

                    {/* Gradient Fill Track */}
                    <Animated.View style={[styles.trackFillContainer, fillStyle]}>
                        <LinearGradient
                            colors={['#29D8FF', '#ADFFBC', '#FFFD82', '#F569FF']} // Rainbow-ish
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }} // Gradient direction is important
                            style={styles.gradientTrack}
                            useAngle={true}
                            angle={90}
                        />
                    </Animated.View>

                    {/* Thumb */}
                    <Animated.View style={[styles.thumb, thumbStyle]}>
                        {/* Inner shadow/styling if needed */}
                    </Animated.View>
                </View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 40,
        justifyContent: 'center',
        width: WIDTH,
    },
    sliderContainer: {
        height: THUMB_SIZE, // Hit slop area
        justifyContent: 'center',
    },
    trackBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: TRACK_HEIGHT,
        backgroundColor: '#F0F0F0', // Light gray unused track
        borderRadius: TRACK_HEIGHT / 2,
    },
    trackFillContainer: {
        position: 'absolute',
        left: 0,
        height: TRACK_HEIGHT,
        overflow: 'hidden', // Clip gradient
        borderRadius: TRACK_HEIGHT / 2,
    },
    gradientTrack: {
        width: WIDTH, // Full width gradient, masked by container width
        height: '100%',
    },
    thumb: {
        position: 'absolute',
        left: 0,
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        borderRadius: THUMB_SIZE / 2,
        backgroundColor: 'white',
        // Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default GradientSlider;
