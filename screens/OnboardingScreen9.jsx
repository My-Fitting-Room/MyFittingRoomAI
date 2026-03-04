import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Text, AppState } from 'react-native';
import mixpanel from '../utils/mixpanel';
import LottieView from 'lottie-react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';


const OnboardingScreen9 = ({ navigation }) => {
    const animationRef = useRef(null);

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen9' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen9' });
            }
        });

        return () => subscription.remove();
    }, []);

    const handleContinue = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen9' });
        navigation.navigate('OnboardingScreen10');
    };

    return (
        <Container
            footer={
                <OnboardingButton
                    type="fill"
                    title="Continue"
                    style={{ width: '100%' }}
                    onPress={handleContinue}
                />
            }
        >
            <OnboardingHeader
                progress={0.375} initialProgress={0.333} nextProgress={0.417}
                title="You’re not alone — 70% of shoppers feel the same. MYF eliminates these regrets instantly."
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>

                <View style={styles.lottieContainer}>
                    <LottieView
                        source={require('../assets/JSON/BarGraphAnimation.json')}
                        autoPlay
                        loop={false}
                        style={styles.lottie}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
    },
    lottieContainer: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: '100%',
        height: '100%',
        transform: [{ scale: 1.2 }],
    },
});

export default OnboardingScreen9;
