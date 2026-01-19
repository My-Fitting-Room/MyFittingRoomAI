import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import ScaleButton from '../components/ScaleButton';
import { Fonts } from '../utils/fonts';

const GENDER_OPTIONS = [
    { id: 'male', label: 'Male', icon: 'male', color: '#000000' },
    { id: 'female', label: 'Female', icon: 'female', color: '#000000' },
    { id: 'other', label: 'Prefer not to say', icon: 'ellipse-outline', color: '#000000' }, // Using circle/ellipse for neutral
];

const GenderOption = ({ label, icon, iconColor, isSelected, onPress }) => {
    const content = (
        <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
                <Icon name={icon} size={24} color={iconColor} />
            </View>
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

const OnboardingScreen3 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [selectedId, setSelectedId] = useState(onboardingData.gender || null);

    const handleContinue = () => {
        if (selectedId) {
            updateOnboardingData({ gender: selectedId });
            navigation.navigate('OnboardingScreen4');
        }
    };

    return (
        <Container
            enableScroll={true}
            footer={
                <OnboardingButton
                    type="fill"
                    title="Continue"
                    style={{ width: '100%', opacity: selectedId ? 1 : 0.5 }}
                    onPress={handleContinue}
                    disabled={!selectedId}
                />
            }
        >
            <OnboardingHeader
                progress={0.125} initialProgress={0.083} nextProgress={0.167}
                title="What’s your gender?"
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                {GENDER_OPTIONS.map((option) => (
                    <GenderOption
                        key={option.id}
                        label={option.label}
                        icon={option.icon}
                        iconColor={option.color}
                        isSelected={selectedId === option.id}
                        onPress={() => setSelectedId(option.id)}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center Text
        paddingVertical: 18,
        paddingHorizontal: 24,
        position: 'relative',
    },
    iconContainer: {
        position: 'absolute',
        left: 24,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionLabel: {
        fontFamily: Fonts.Regular,
        fontSize: 16,
        color: '#000000',
        textAlign: 'center',
    },
});

export default OnboardingScreen3;
