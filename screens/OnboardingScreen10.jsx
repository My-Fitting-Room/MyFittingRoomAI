import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, AppState } from 'react-native';
import mixpanel from '../utils/mixpanel';
import LinearGradient from 'react-native-linear-gradient';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import ScaleButton from '../components/ScaleButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';

const ISSUE_OPTIONS = [
    { id: 'size', label: 'Finding the right size' },
    { id: 'styling', label: 'Styling the clothes' },
    { id: 'indecisiveness', label: 'Indecisiveness' },
    { id: 'imagined', label: 'Item isn’t how imagined' },
];

const IssueOption = ({ label, isSelected, onPress }) => {
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

const OnboardingScreen10 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [selectedIssue, setSelectedIssue] = useState(onboardingData.biggestIssue || null);

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen10' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen10' });
            }
        });

        return () => subscription.remove();
    }, []);

    const handleContinue = () => {
        if (selectedIssue) {
            mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen10' });
            updateOnboardingData({ biggestIssue: selectedIssue });
            navigation.navigate('OnboardingScreen11', { selectedIssue });
        }
    };

    return (
        <Container
            enableScroll={true}
            footer={
                <OnboardingButton
                    type="fill"
                    title="Continue"
                    style={{ width: '100%', opacity: selectedIssue ? 1 : 0.5 }}
                    onPress={handleContinue}
                    disabled={!selectedIssue}
                />
            }
        >
            <OnboardingHeader
                progress={0.417} initialProgress={0.375} nextProgress={0.458}
                title="What’s your biggest issue shopping online?"
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.headerContent}>
                <Text style={styles.subtitle}>
                    These frustrations cost shoppers thousands per year.{'\n'} {'\n'}
                    Let’s fix that.
                </Text>
            </View>

            <View style={styles.content}>
                {ISSUE_OPTIONS.map((option) => (
                    <IssueOption
                        key={option.id}
                        label={option.label}
                        isSelected={selectedIssue === option.id}
                        onPress={() => setSelectedIssue(option.id)}
                    />
                ))}
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    headerContent: {
        marginTop: 10,
        marginBottom: 30,
    },
    title: {
        fontFamily: Fonts.Bold,
        fontSize: 28,
        color: '#000000',
        lineHeight: 34,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: Fonts.Regular,
        fontSize: 12,
        color: '#000000',
        marginTop: -10,
    },
    content: {
        flex: 1,
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
        fontSize: 16,
        color: '#000000',
        textAlign: 'center',
    },
});

export default OnboardingScreen10;
