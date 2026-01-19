import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import ScaleButton from '../components/ScaleButton';
import { Fonts } from '../utils/fonts';

const GOAL_OPTIONS = [
    { id: 'style', label: 'Find my style' },
    { id: 'fit', label: 'Fit & Size' },
    { id: 'try_on', label: 'Try on clothes before buying them' },
    { id: 'mix_match', label: 'Mix and match outfits easily' },
    { id: 'recommendations', label: 'Get personalized recommendations' },
    { id: 'trending', label: 'Discover trending styles in your area' },
];

const GoalOption = ({ label, isSelected, onPress }) => {
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

const OnboardingScreen6 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [selectedGoals, setSelectedGoals] = useState(onboardingData.goals || []);

    const handleContinue = () => {
        if (selectedGoals.length > 0) {
            updateOnboardingData({ goals: selectedGoals });
            navigation.navigate('OnboardingScreen7');
        }
    };

    const toggleGoal = (id) => {
        if (selectedGoals.includes(id)) {
            setSelectedGoals(selectedGoals.filter(goalId => goalId !== id));
        } else {
            if (selectedGoals.length < 3) {
                setSelectedGoals([...selectedGoals, id]);
            }
        }
    };

    return (
        <Container
            enableScroll={true}
            footer={
                <OnboardingButton
                    type="fill"
                    title="Continue"
                    style={{ width: '100%', opacity: selectedGoals.length > 0 ? 1 : 0.5 }}
                    onPress={handleContinue}
                    disabled={selectedGoals.length === 0}
                />
            }
        >
            <OnboardingHeader
                progress={0.25} initialProgress={0.208} nextProgress={0.292}
                topText="So tell us name," // This seems like placeholder logic from old plan, maybe should remove TopText if not needed? keeping for consistency w/ user request unless they ask to remove. actually user image shows NO top text, wait.
                // User image in previous step S6 had "So tell us name," placeholder. Screen 6 User Request image shows NO header content visible, just buttons.
                // I will keep header as is for now based on previous instructions, can refine if asked.
                // Actually User's image "uploaded_image_1765240631622.png" ONLY shows buttons.
                // I'll stick to text inputs from Screen 6 file.
                title="What do you want to achieve with MYF?"
                bottomText="Choose up to 3."
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                {GOAL_OPTIONS.map((option) => (
                    <GoalOption
                        key={option.id}
                        label={option.label}
                        isSelected={selectedGoals.includes(option.id)}
                        onPress={() => toggleGoal(option.id)}
                    />
                ))}
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingVertical: 20,
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
        alignItems: 'flex-start', // Center Text
        paddingVertical: 18,
        paddingHorizontal: 24,
        minHeight: 60,
    },
    optionLabel: {
        fontFamily: Fonts.Regular,
        fontSize: 14,
        color: '#000000',
        textAlign: 'left',
    },
});

export default OnboardingScreen6;
