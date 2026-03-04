import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image, AppState } from 'react-native';
import mixpanel from '../utils/mixpanel';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import GradientText from '../components/GradientText';
import { Fonts } from '../utils/fonts';
import OnboardingScreen11Image from '../assets/images/OnboardingScreen11.png';

const GRADIENT_COLORS = [
    '#B0F491',
    '#4CE6D0'
];

const CONTENT_MAP = {
    size: {
        titleParts: [
            { text: "Finding your", isGradient: false },
            { text: "perfect fit", isGradient: true },
            { text: "is easy. Use our size calculator!", isGradient: false },
        ],
        showSubtitle: false,
    },
    styling: {
        titleParts: [
            { text: "Upgrading your", isGradient: false },
            { text: "style", isGradient: true },
            { text: "is a realistic goal and way easier than you think.", isGradient: false },
        ],
        subtitle: "Most users see the difference in their first week. 85% say their friends noticed their new look.",
        showSubtitle: true,
    },
    indecisiveness: {
        titleParts: [
            { text: "Feeling confident in your outfits is", isGradient: false },
            { text: "100% achievable.", isGradient: true },
        ],
        subtitle: "9 out of 10 users say they felt a boost of confidence after their first try-on — and that feeling sticks.",
        showSubtitle: true,
    },
    imagined: {
        titleParts: [
            { text: "Cutting", isGradient: false },
            { text: "returns", isGradient: true },
            { text: "and wasted purchases is simple with MyFittingRoom.", isGradient: false },
        ],
        subtitle: "On average, users cut returns by 90% saving time, money, and frustration right away.",
        showSubtitle: true,
    }
};

const OnboardingScreen11 = ({ navigation, route }) => {
    const { selectedIssue } = route.params || { selectedIssue: 'size' }; // Default fallback
    const content = CONTENT_MAP[selectedIssue] || CONTENT_MAP['size'];

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen11' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen11' });
            }
        });

        return () => subscription.remove();
    }, []);

    const handleContinue = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen11' });
        navigation.navigate('OnboardingScreen12');
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
                progress={0.458} initialProgress={0.417} nextProgress={0.5}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <View style={styles.titleWrapper}>
                        {content.titleParts.flatMap((part, index) => {
                            if (part.isGradient) {
                                return (
                                    <GradientText
                                        key={`grad-${index}`}
                                        colors={GRADIENT_COLORS}
                                        style={styles.gradientText}
                                    >
                                        {part.text}
                                    </GradientText>
                                );
                            }
                            // Split non-gradient text into words to allow proper wrapping
                            return part.text.split(' ').map((word, wIndex) => {
                                if (!word) return null; // Handle potential empty strings from split
                                return (
                                    <Text key={`text-${index}-${wIndex}`} style={styles.titleText}>
                                        {word}{' '}
                                    </Text>
                                );
                            });
                        })}
                    </View>

                    {content.showSubtitle && (
                        <Text style={styles.subtitle}>
                            {content.subtitle}
                        </Text>
                    )}
                </View>

                <View style={styles.imageContainer}>
                    <Image
                        source={OnboardingScreen11Image}
                        style={styles.image}
                        resizeMode="contain"
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
        paddingTop: 20,
    },
    textContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 30,
    },
    titleWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontFamily: Fonts.Bold,
        fontSize: 26,
        color: '#000',
        textAlign: 'center',
        lineHeight: -1,
    },
    gradientText: {
        fontFamily: Fonts.Bold,
        fontSize: 26,
        marginHorizontal: 4,
    },
    subtitle: {
        fontFamily: Fonts.Regular,
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
        marginTop: 30,
        lineHeight: 20,
        paddingHorizontal: 20,
    },
    imageContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});

export default OnboardingScreen11;
