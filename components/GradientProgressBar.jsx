import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const GradientProgressBar = ({ progress = 0, initialProgress = 0, nextProgress = 0, useGradient = false, color = '#000' }) => {
    const widthVal = useSharedValue(initialProgress * 100);
    const isFocused = useIsFocused();
    const [hasNavigatedAway, setHasNavigatedAway] = React.useState(false);

    // Track when user leaves the screen
    useEffect(() => {
        if (!isFocused) {
            setHasNavigatedAway(true);
        }
    }, [isFocused]);

    useEffect(() => {
        if (isFocused) {
            if (!hasNavigatedAway) {
                // Initial Forward Animation
                // Ensure we start from initialProgress
                widthVal.value = initialProgress * 100;
                widthVal.value = withDelay(400, withTiming(progress * 100, { duration: 600 }));
            } else {
                // Returning (Backward Animation)
                if (nextProgress > progress) {
                    widthVal.value = nextProgress * 100;
                }
                widthVal.value = withDelay(400, withTiming(progress * 100, { duration: 600 }));
            }
        }
    }, [progress, isFocused, hasNavigatedAway, nextProgress]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            width: `${widthVal.value}%`,
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.fillContainer, animatedStyle]}>
                {useGradient ? (
                    <LinearGradient
                        colors={['#FCD6FF', '#FFFD82', '#29D8FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    />
                ) : (
                    <View style={[styles.solidFill, { backgroundColor: color }]} />
                )}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 6,
        backgroundColor: '#EAEAEA', // Light gray track
        borderRadius: 3,
        overflow: 'hidden',
        width: '100%',
    },
    fillContainer: {
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        width: SCREEN_WIDTH, // Ensure gradient covers full width relative to screen for effect, or 100% of parent
    },
    solidFill: {
        flex: 1,
    },
});

export default GradientProgressBar;
