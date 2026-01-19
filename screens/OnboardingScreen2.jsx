import React, { useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import ScaleButton from '../components/ScaleButton';
import { Fonts } from '../utils/fonts';

import instagramIcon from '../assets/images/icons/Instagram.png';
import facebookIcon from '../assets/images/icons/Facebook.png';
import tiktokIcon from '../assets/images/icons/TikTok.png';
import youtubeIcon from '../assets/images/icons/Youtube.png';
import friendsIcon from '../assets/images/icons/person.png';

const SOCIAL_OPTIONS = [
    { id: 'instagram', label: 'Instagram', icon: instagramIcon, color: '#E1306C' },
    { id: 'facebook', label: 'Facebook', icon: facebookIcon, color: '#1877F2' },
    { id: 'tiktok', label: 'TikTok', icon: tiktokIcon, color: '#000000' },
    { id: 'youtube', label: 'Youtube', icon: youtubeIcon, color: '#FF0000' },
    { id: 'friends', label: 'Friends or Family', icon: friendsIcon, color: '#000000' },
];

const SocialOption = ({ label, icon, iconColor, isSelected, onPress }) => {
    const content = (
        <View style={styles.optionContent}>
            <View style={styles.iconContainer}>
                <Image source={icon} style={styles.iconImage} />
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
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
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

const OnboardingScreen2 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [selectedId, setSelectedId] = useState(onboardingData.hearAboutUs || null);

    const handleContinue = () => {
        if (selectedId) {
            updateOnboardingData({ hearAboutUs: selectedId });
            navigation.navigate('OnboardingScreen3');
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
                progress={0.083} initialProgress={0.042} nextProgress={0.125}
                title="Where did you hear about us?"
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                {SOCIAL_OPTIONS.map((option) => (
                    <SocialOption
                        key={option.id}
                        label={option.label}
                        icon={option.icon}
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
        justifyContent: 'center',
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
    iconImage: {
        width: 30,
        height: 30,
        resizeMode: "contain"
    },
    optionLabel: {
        fontFamily: Fonts.Medium,
        fontSize: 16,
        color: '#000000',
        textAlign: 'center',
    },
});

export default OnboardingScreen2;
