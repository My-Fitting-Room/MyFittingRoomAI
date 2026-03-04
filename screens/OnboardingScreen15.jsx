import { View, StyleSheet, Text, AppState } from 'react-native';
import React, { useEffect } from 'react';
import mixpanel from '../utils/mixpanel';
import Animated, { FadeIn } from 'react-native-reanimated';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';



import { useOnboarding } from '../context/OnboardingContext';

const OnboardingScreen15 = ({ navigation }) => {
    const { onboardingData } = useOnboarding();
    const name = onboardingData.name || "Guest";

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen15' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen15' });
            }
        });

        return () => subscription.remove();
    }, []);

    const handleContinue = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen15' });
        navigation.navigate('OnboardingScreen16');
    };

    return (
        <Container
            enableScroll={true}
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
                progress={0.625} initialProgress={0.583} nextProgress={0.667}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <Animated.View entering={FadeIn.duration(1000).delay(200)}>
                    <Text style={styles.title}>Thanks {name}!</Text>
                    <Text style={styles.subtitle}>Based on data from millions of others here’s where you’re at</Text>
                </Animated.View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        fontFamily: Fonts.Regular,
        color: "#000000"
    },
    subtitle: {
        fontSize: 26,
        fontFamily: Fonts.Bold,
        color: "#6665FF"
    },
});

export default OnboardingScreen15;
