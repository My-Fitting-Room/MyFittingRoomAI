import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import ScaleButton from '../components/ScaleButton';
import { Fonts } from '../utils/fonts';

const DISCOVER_OPTIONS = [
    { id: 'very_confident', label: 'Very confident - I never get it wrong' },
    { id: 'somewhat_confident', label: 'Somewhat confident - I guess and hope' },
    { id: 'not_confident', label: 'Not confident - it\'s always a gamble' },
];

const ConfidenceOption = ({ label, isSelected, onPress }) => {
    const content = (
        <View style={styles.optionContent}>
            <Text style={styles.optionLabel}>{label}</Text>
        </View>
    );

    if (isSelected) {
        return (
            <ScaleButton onPress={onPress} style={[styles.optionWrapper, styles.shadow]}>
                <LinearGradient
                    colors={[
                        'rgba(41, 216, 255, 0.15)',
                        'rgba(173, 255, 188, 0.15)',
                        'rgba(255, 253, 130, 0.15)',
                        'rgba(245, 105, 255, 0.15)'
                    ]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    locations={[0, 0.25, 0.76, 1]}
                    style={styles.gradientBackground}
                >
                    {content}
                </LinearGradient>
            </ScaleButton>
        );
    }

    return (
        <ScaleButton
            onPress={onPress}
            style={[styles.optionWrapper, styles.normalBackground, styles.shadow]}
        >
            {content}
        </ScaleButton>
    );
};

import { useOnboarding } from '../context/OnboardingContext';

const OnboardingScreen12 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [selectedOption, setSelectedOption] = useState(onboardingData.confidence || null);

    const handleContinue = () => {
        if (selectedOption) {
            updateOnboardingData({ confidence: selectedOption });
            navigation.navigate('OnboardingScreen13');
        }
    };

    return (
        <Container
            enableScroll={true}
            footer={
                <OnboardingButton
                    type="fill"
                    title="Continue"
                    style={{ width: '100%', opacity: selectedOption ? 1 : 0.5 }}
                    onPress={handleContinue}
                    disabled={!selectedOption}
                />
            }
        >
            <OnboardingHeader
                progress={0.5} initialProgress={0.458} nextProgress={0.542}
                title="How confident are you selecting the right size shopping online?"
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                {DISCOVER_OPTIONS.map((option) => (
                    <ConfidenceOption
                        key={option.id}
                        label={option.label}
                        isSelected={selectedOption === option.id}
                        onPress={() => setSelectedOption(option.id)}
                    />
                ))}
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        // marginTop: 20, // Add some top margin to separate options from header

    },
    optionWrapper: {
        borderRadius: 16,
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    shadow: {
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
    },
    normalBackground: {
        backgroundColor: '#FFFFFF',
    },
    gradientBackground: {
        borderRadius: 16,
    },
    optionContent: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
        minHeight: 60,
    },
    optionLabel: {
        fontFamily: Fonts.Medium,
        fontSize: 14, // Slightly smaller than Screen 10 to fit longer text if needed
        color: '#000000',
        textAlign: 'center',
    },
});

export default OnboardingScreen12;
