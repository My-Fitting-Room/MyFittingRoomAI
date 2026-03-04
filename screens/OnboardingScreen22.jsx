import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, AppState } from 'react-native';
import mixpanel from '../utils/mixpanel';
import LottieView from 'lottie-react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';
import ProgressAnimation from '../assets/JSON/progress.json';
import { triggerHaptic } from '../utils/haptics';

const OnboardingScreen22 = ({ navigation }) => {

    const handleContinue = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen22' });
        navigation.navigate('OnboardingScreen23');
    };

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen22' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen22' });
            }
        });

        const timer = setTimeout(() => {
            triggerHaptic('notificationSuccess');
        }, 1700);

        return () => {
            subscription.remove();
            clearTimeout(timer);
        }
    }, []);

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
                progress={0.917} initialProgress={0.875} nextProgress={0.958}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <LottieView
                    source={ProgressAnimation}
                    autoPlay
                    loop={false}
                    style={styles.lottie}
                />

                <Text style={styles.smallText}>All done!</Text>

                <Text style={styles.largeText}>
                    {/* Perfect one moment while we generate your try-on profile */}
                    Perfect your upload was successful
                </Text>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    smallText: {
        fontFamily: Fonts.Regular,
        fontSize: 12,
        color: '#666666',
        marginBottom: 10,
        textAlign: 'center',
    },
    largeText: {
        fontFamily: Fonts.Bold,
        fontSize: 26,
        color: '#000000',
        textAlign: 'center',
    },
});

export default OnboardingScreen22;
