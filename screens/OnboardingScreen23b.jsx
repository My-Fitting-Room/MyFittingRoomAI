import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';
import BasicLoadingAnimation from '../assets/JSON/basic-loading-animation.json';
import SuccessCheckAnimation from '../assets/JSON/success-b.json';
import { triggerHaptic } from '../utils/haptics';

const OnboardingScreen23b = ({ navigation }) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const loadingAnimationRef = useRef(null);

    useEffect(() => {
        // Play the loading animation first
        if (loadingAnimationRef.current && !showSuccess) {
            loadingAnimationRef.current.play();
        }

        if (showSuccess) {
            const timer = setTimeout(() => {
                triggerHaptic('notificationSuccess');
            }, 1100);

            return () => clearTimeout(timer);
        }
    }, [showSuccess]);

    const handleLoadingAnimationFinish = () => {
        // When loading animation finishes, show success animation
        setShowSuccess(true);
    };

    const handleContinue = () => {
        navigation.navigate('OnboardingScreen24');
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
                progress={0.979} initialProgress={0.958} nextProgress={1.0}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                {!showSuccess ? (
                    <>
                        <LottieView
                            ref={loadingAnimationRef}
                            source={BasicLoadingAnimation}
                            autoPlay
                            loop={false}
                            style={styles.lottie}
                            onAnimationFinish={handleLoadingAnimationFinish}
                        />

                        <Text style={styles.smallText}>Processing...</Text>

                        <Text style={styles.largeText}>
                            Perfect one moment while we generate your try-on profile
                        </Text>
                    </>
                ) : (
                    <>
                        <LottieView
                            source={SuccessCheckAnimation}
                            autoPlay
                            loop={false}
                            style={styles.lottie}
                        />

                        <Text style={styles.smallText}>All done!</Text>

                        <Text style={styles.largeText}>
                            Your fit profile is ready
                        </Text>
                    </>
                )}
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
        paddingHorizontal: 40,
    },
});

export default OnboardingScreen23b;
