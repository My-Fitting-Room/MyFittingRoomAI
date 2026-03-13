import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import LogoAnimation from '../assets/JSON/LOGO.json';
import { supabase } from '../App';

const SplashScreen = ({ navigation }) => {
    const animationRef = useRef(null);

    useEffect(() => {
        if (animationRef.current) {
            animationRef.current.play();
        }

        const timer = setTimeout(async () => {

            // Check if there's an existing session
            const { data: { session } } = await supabase.auth.getSession();

            console.log('session', session);

            if (!session) {
                // No session at all — go to First
                navigation.replace('First');
                return;
            }

            // Session exists — check if onboarding is complete
            const { data: onboarding } = await supabase
                .from('user_onboarding_details')
                .select('*')
                .eq('id', session.user.id)
                .single();

            console.log('onboarding', onboarding);

            if (onboarding?.onboarding_complete === true) {
                // Onboarding done — go straight to TryOn
                navigation.replace('TryOn');
            } else {
                // No onboarding record yet — go to First
                navigation.replace('First');
            }

        }, 3000);

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