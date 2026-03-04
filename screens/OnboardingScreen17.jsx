import { View, StyleSheet, Text, Image, AppState } from 'react-native';
import React, { useEffect } from 'react';
import mixpanel from '../utils/mixpanel';
import Animated, { FadeIn } from 'react-native-reanimated';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';
import OnboardingScreen17Image from "../assets/images/OnboardingScreen17-a.png"
import OnboardingScreen17BImage from "../assets/images/OnboardingScreen17-b.png"
import { useOnboarding } from '../context/OnboardingContext';



const OnboardingScreen17 = ({ navigation }) => {
    const { onboardingData } = useOnboarding();
    const name = onboardingData.name || "Guest";

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen17' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen17' });
            }
        });

        return () => subscription.remove();
    }, []);

    const handleContinue = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen17' });
        navigation.navigate('OnboardingScreen18');
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
                progress={0.708} initialProgress={0.667} nextProgress={0.75}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <Animated.Image
                    entering={FadeIn.duration(1000)}
                    source={OnboardingScreen17Image}
                    style={styles.image}
                />
                <Text style={styles.text}>
                    Now let’s step into {name}’s fitting room!
                </Text>
                <Text style={styles.subText}>
                    Let’s personalize My Fitting Room into yours to make the most accurate try on generations
                </Text>
                <Image source={OnboardingScreen17BImage} style={styles.image2} />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        resizeMode: 'contain',
        marginVertical: 20
    },
    text: {
        fontFamily: Fonts.Bold,
        fontSize: 26,
        color: '#000000',
        textAlign: 'center',
    },
    subText: {
        fontFamily: Fonts.Regular,
        fontSize: 12,
        color: '#BBBBBB',
        textAlign: 'center',
        marginTop: 10
    },
    image2: {
        width: '100%',
        height: 170,
        resizeMode: 'contain',
    },
});

export default OnboardingScreen17;
