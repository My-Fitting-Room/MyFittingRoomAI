import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import LogoAnimation from '../assets/JSON/LOGO.json';

const SplashScreen = ({ navigation }) => {
    const animationRef = useRef(null);

    useEffect(() => {
        // Play animation once
        if (animationRef.current) {
            animationRef.current.play();
        }

        // Navigate to StartScreen after 3 seconds
        const timer = setTimeout(() => {
            navigation.replace('First');
        }, 3000);

        // Cleanup timer on unmount
        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <LottieView
                ref={animationRef}
                source={LogoAnimation}
                autoPlay
                loop={false}
                style={styles.animation}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    animation: {
        width: 300,
        height: 300,
    },
});

export default SplashScreen;
