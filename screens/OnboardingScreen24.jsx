import { View, StyleSheet, Text, Image, AppState, Animated, Dimensions } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';
import OnBoardingImage from '../assets/images/OnboardingScreen21.png';
import { useOnboarding } from '../context/OnboardingContext';
import { supabase } from '../App';
import React, { useState, useEffect, useRef } from 'react';
import FastImage from 'react-native-fast-image';
import mixpanel from '../utils/mixpanel';

const PILL_WIDTH = 130;

// Pill fades in — NO scale animation (scale on Animated.View causes RN transparency bug)
const Pill = ({ text, delay, color, isRedIcon, style }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay]);

    return (
        <Animated.View style={[{ opacity, position: 'absolute' }, style]}>
            <View style={styles.pill}>
                {isRedIcon ? (
                    <View style={styles.redIcon}>
                        <View style={styles.dollarCircle}>
                            <Text style={styles.dollarSign}>$</Text>
                            <View style={styles.arrowDown} />
                        </View>
                    </View>
                ) : (
                    <View style={[styles.dot, { backgroundColor: color || '#9CA3AF' }]} />
                )}
                <Text style={styles.pillText} numberOfLines={1} ellipsizeMode="tail">
                    {text}
                </Text>
            </View>
        </Animated.View>
    );
};

const OnboardingScreen24 = ({ navigation }) => {
    const { onboardingData } = useOnboarding();
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen24' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen24' });
            }
        });

        return () => subscription.remove();
    }, []);

    const handleContinue = async () => {
        setIsSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { navigation.navigate('First'); return; }

            const { error } = await supabase
                .from('user_onboarding_details')
                .upsert({
                    id: session.user.id,
                    name: onboardingData.name,
                    gender: onboardingData.gender,
                    birthday: onboardingData.birthday,
                    brands: onboardingData.brands,
                    hear_about_us: onboardingData.hearAboutUs,
                    confidence_level: onboardingData.confidence,
                    goals: onboardingData.goals,
                    styles: onboardingData.styles,
                    biggest_issue: onboardingData.biggestIssue,
                    order_action: onboardingData.orderAction,
                    regret_frequency: onboardingData.regretFrequency,
                    shirt_size: onboardingData.shirtSize,
                    pants_size: onboardingData.pantsSize,
                    user_image_uri: onboardingData.userImage,
                    onboarding_complete: true,
                    onboarding_wizard_step: 25,
                    metadata: JSON.stringify(onboardingData)
                });

            if (error) throw error;
            mixpanel.track('onboarding Completed');
            mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen24' });
            navigation.navigate('TryOn', { fromOnboarding: true });
        } catch (error) {
            console.error('Error saving onboarding data:', error);
            mixpanel.track('Onboarding Error', { screen: 'OnboardingScreen24', action: 'handleContinue', error: error?.message || error });
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Format texts
    // Format texts to match image "vibe"
    const sizesText = onboardingData.shirtSize?.join(' & ') || 'Medium & Large';
    const pantsText = onboardingData.pantsSize ? `${onboardingData.pantsSize.waist}x${onboardingData.pantsSize.length}` : '';
    const fullSizeText = pantsText ? `${sizesText}, ${pantsText}` : sizesText;

    const styleText = (onboardingData.styles && onboardingData.styles.length > 0)
        ? onboardingData.styles.join(', ')
        : 'Streetwear, Y2K, GRUNGE';

    const rawConfidence = onboardingData.confidence || 'Low';
    const confidenceText = rawConfidence.includes('Confidence')
        ? rawConfidence.replace(/_/g, ' ')
        : `${rawConfidence.replace(/_/g, ' ')} Shopping Confidence`;

    const biggestIssueText = onboardingData.biggestIssue
        ? `Biggest Issue: ${onboardingData.biggestIssue}`
        : 'Biggest Issue: Styling';

    return (
        <Container
            enableScroll={true}
            footer={
                <OnboardingButton
                    type="fill"
                    title="Continue"
                    style={{ width: '100%' }}
                    onPress={handleContinue}
                    loading={isSaving}
                />
            }
        >
            <OnboardingHeader
                progress={1.0} initialProgress={0.958} nextProgress={1.0}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
                title="Your Fit Profile is Ready"
                textAlign="center"
            />

            <View style={styles.content}>

                {/*
                  3-column row: [left pills] [logo] [right pills]
                  Pill columns are fixed PILL_WIDTH — pills never overflow or get crushed
                */}
                <View style={styles.heroRow}>
                    <View style={styles.logoStackContainer}>
                        {/* THE LOGO */}
                        <View style={styles.logoShadowWrapper}>
                            <Image
                                source={require('../assets/myflogo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        {/* PILLS OVER LOGO */}
                        {/* Top-Left: Sizes (Purple) */}
                        <Pill
                            text={fullSizeText}
                            delay={300}
                            color="#8338EC"
                            style={{ top: 0, left: -60 }}
                        />

                        {/* Top-Right: Styles (Green) */}
                        <Pill
                            text={styleText}
                            delay={600}
                            color="#70E000"
                            style={{ top: 50, right: -85 }}
                        />

                        {/* Middle-Left: Confidence (Red Icon) */}
                        <Pill
                            text={confidenceText}
                            delay={900}
                            isRedIcon={true}
                            style={{ top: 115, left: -85 }}
                        />

                        {/* Bottom-Right: Biggest Issue (Red Icon) */}
                        <Pill
                            text={biggestIssueText}
                            delay={1200}
                            isRedIcon={true}
                            style={{ top: 175, right: -60 }}
                        />
                    </View>
                </View>

                <View style={styles.messageBox}>
                    <Text style={styles.readyTitle}>🎉 You're ready for your first try-on!</Text>
                    <Text style={styles.readySubTitle}>MYF will help you ascend your fashion and wardrobe with ease.</Text>
                </View>

                <View style={styles.imageContainer}>
                    <FastImage
                        source={onboardingData.userImage ? { uri: onboardingData.userImage.uri || onboardingData.userImage } : OnBoardingImage}
                        style={styles.userImage}
                        resizeMode="cover"
                    />
                </View>

            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    heroRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
    },
    logoStackContainer: {
        width: 180,
        height: 240,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoShadowWrapper: {
        width: 180,
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 8,
    },
    logo: {
        width: 180,
        height: 180,
    },
    redIcon: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#FF4D4D',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        overflow: 'hidden',
    },
    dollarCircle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dollarSign: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
        lineHeight: 12,
    },
    arrowDown: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderTopWidth: 3,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FFFFFF',
        marginTop: -1,
    },
    pill: {
        minWidth: 120,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
        flexShrink: 0,
    },
    pillText: {
        fontFamily: Fonts.Bold,
        fontSize: 12,
        color: '#000000',
        flexShrink: 1,
    },
    messageBox: {
        alignItems: 'center',
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    readyTitle: {
        fontFamily: Fonts.Bold,
        fontWeight: 700,
        fontSize: 16,
        lineHeight: 22,
        color: '#9CA3AF',
        marginBottom: 4,
        textAlign: 'center',
    },
    readySubTitle: {
        fontFamily: Fonts.Bold,
        fontSize: 16,
        lineHeight: 22,
        fontWeight: 700,

        color: '#9CA3AF',
        textAlign: 'center',
    },
    imageContainer: {
        width: 150,
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        alignSelf: 'center',
        marginBottom: 30,
    },
    userImage: {
        width: '100%',
        height: '100%',
    },
});

export default OnboardingScreen24;