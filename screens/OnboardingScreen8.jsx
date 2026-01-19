import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import GradientSlider from '../components/GradientSlider';
import { Fonts } from '../utils/fonts';

import { useOnboarding } from '../context/OnboardingContext';

const OnboardingScreen8 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [sliderValue, setSliderValue] = useState(onboardingData.regretFrequency || 0.5);

    const getLabel = (value) => {
        if (value < 0.2) return 'Never';
        if (value < 0.4) return 'Rarely';
        if (value < 0.6) return 'Sometimes';
        if (value < 0.8) return 'Often';
        return 'Very Often';
    };

    const handleContinue = () => {
        const label = getLabel(sliderValue);
        updateOnboardingData({ regretFrequency: label });
        navigation.navigate('OnboardingScreen9');
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
                progress={0.333} initialProgress={0.292} nextProgress={0.375}
                title="How often do you regret clothes you buy online?"
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <View style={styles.sliderWrapper}>
                    <Text style={styles.sliderLabel}>{getLabel(sliderValue)}</Text>
                    <GradientSlider
                        initialValue={0.5}
                        onValueChange={(val) => setSliderValue(val)}
                    />
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    sliderWrapper: {
        width: '100%',
        alignItems: 'center',
        gap: 20,
    },
    sliderLabel: {
        fontFamily: Fonts.Medium, // Bold/Semibold match
        fontSize: 20, // Larger size
        color: '#000',
        marginBottom: 20,
    },
});

export default OnboardingScreen8;
