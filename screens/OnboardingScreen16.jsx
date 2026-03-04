import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, AppState } from 'react-native';
import mixpanel from '../utils/mixpanel';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // For chart line
import Animated, { FadeIn } from 'react-native-reanimated';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';

import { useOnboarding } from '../context/OnboardingContext';

const OnboardingScreen16 = ({ navigation }) => {
    const { onboardingData } = useOnboarding();
    const name = onboardingData.name || "Guest";
    const confidence = onboardingData.confidence || "somewhat_confident";
    const regretFrequency = onboardingData.regretFrequency || 0.5;

    const displayConfidence = {
        'very_confident': 'Accuracy',
        'somewhat_confident': 'Sizing',
        'not_confident': 'Fitting'
    }[confidence] || "Styling";

    const regretLevel = regretFrequency > 0.6 ? "High" : regretFrequency > 0.3 ? "Medium" : "Low";

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen16' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen16' });
            }
        });

        return () => subscription.remove();
    }, []);

    const handleContinue = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen16' });
        navigation.navigate('OnboardingScreen17');
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
                progress={0.667} initialProgress={0.625} nextProgress={0.708}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <Animated.View
                    entering={FadeIn.duration(1000).delay(200)}
                    style={styles.summaryCard}
                >
                    <LinearGradient
                        colors={['#6665FF', '#6665FF']} // Approximate blue gradient
                        style={{ borderRadius: 24 }}
                    >
                        <Text style={styles.nameText}>{name}</Text>

                        {/* Comparison Bars */}
                        <View style={styles.comparisonContainer}>
                            {/* Others Bar */}
                            <View style={styles.barWrapper}>
                                <View style={[styles.barTrack, { backgroundColor: '#C1EAC5' }]}>
                                    <LinearGradient
                                        colors={['#57C293', '#84DFA8']}
                                        start={{ x: 0, y: 0.5 }}
                                        end={{ x: 1, y: 0.5 }}
                                        style={[styles.barFill, { width: '45%' }]}
                                    >
                                        <Text style={styles.barLabelInside} numberOfLines={1}>Others</Text>
                                    </LinearGradient>
                                </View>
                            </View>

                            {/* You Bar */}
                            <View style={styles.barWrapper}>
                                <View style={[styles.barTrack, { backgroundColor: '#FCCBCB' }]}>
                                    <LinearGradient
                                        colors={['#FF4B4B', '#FF7676']}
                                        start={{ x: 0, y: 0.5 }}
                                        end={{ x: 1, y: 0.5 }}
                                        style={[styles.barFill, { width: '85%' }]}
                                    >
                                        <Text style={styles.barLabelInside} numberOfLines={1}>You</Text>
                                    </LinearGradient>
                                </View>
                            </View>
                        </View>

                        {/* Stat Cards */}
                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Biggest Issue</Text>
                                <View style={styles.statValueRow}>
                                    <Ionicons name="shirt" size={24} color="#7BAAF9" />
                                    {/* <Text style={styles.statValueText}>{displayConfidence}</Text> */}
                                    <Text style={styles.statValueText}>Styling</Text>
                                </View>
                            </View>

                            <View style={styles.statCard}>
                                <Text style={styles.statLabel}>Clothing Regrets</Text>
                                <View style={styles.statValueRow}>
                                    <FontAwesome5 name="chart-line" size={20} color="#FF6B6B" />
                                    {/* <Text style={styles.statValueText}>{regretLevel}</Text> */}
                                    <Text style={styles.statValueText}>High</Text>
                                </View>
                            </View>
                        </View>

                        {/* Impact Section */}
                        <View style={styles.impactCard}>
                            <Text style={styles.impactLabel}>Impact</Text>
                            <View style={styles.impactContent}>
                                <Text style={styles.emoji}>😬</Text>
                                <Text style={styles.impactText}>
                                    You end up wasting money, constant regret, and time returning clothes.
                                </Text>
                            </View>
                        </View>

                    </LinearGradient>
                </Animated.View>
            </View>
        </Container >
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    summaryCard: {
        borderRadius: 24,
        // paddingVertical: 20,
        width: '100%',
        backgroundColor: '#6665FF', // Add background color for when gradient is inside
    },
    nameText: {
        fontFamily: Fonts.Bold,
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 20,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    comparisonContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        marginHorizontal: 20,
    },
    barWrapper: {
        height: 30,
        marginBottom: 12,
        borderRadius: 18,
        overflow: 'hidden',
    },
    barTrack: {
        flex: 1,
        borderRadius: 18,
        justifyContent: 'center',
    },
    barFill: {
        height: '100%',
        borderRadius: 18,
        justifyContent: 'center',

    },
    barLabelInside: {
        fontFamily: Fonts.Bold,
        fontSize: 12,
        color: '#FFFFFF',
        paddingHorizontal: 16,
    },
    statLabel: {
        fontFamily: Fonts.Regular,
        fontSize: 12,
        color: '#000000',
        marginBottom: 8,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        gap: 12,
        marginHorizontal: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statValueText: {
        fontFamily: Fonts.Bold,
        fontSize: 12,
        color: '#000',
    },
    impactCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    impactLabel: {
        fontFamily: Fonts.Regular,
        fontSize: 12,
        color: '#000',
        marginBottom: 8,
    },
    impactContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    emoji: {
        fontSize: 24,
    },
    impactText: {
        fontFamily: Fonts.Medium,
        fontSize: 12,
        color: '#000',
        flex: 1,
        lineHeight: 18,
    },
});

export default OnboardingScreen16;
