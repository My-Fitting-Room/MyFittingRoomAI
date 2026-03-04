import { View, StyleSheet, Text, TouchableOpacity, AppState } from 'react-native';
import InAppReview from 'react-native-in-app-review';
import React, { useEffect } from 'react';
import mixpanel from '../utils/mixpanel';
import Icon from 'react-native-vector-icons/FontAwesome';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';

import { useOnboarding } from '../context/OnboardingContext';

const OnboardingScreen23 = ({ navigation }) => {
    const { onboardingData } = useOnboarding();

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen23' });
        mixpanel.track('Onboarding Review');

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen23' });
            }
        });

        return () => subscription.remove();
    }, []);

    const handleReview = () => {
        mixpanel.track('Onboarding step completed With Review Prompted', { screen: 'OnboardingScreen23' });

        if (InAppReview.isAvailable()) {
            InAppReview.RequestInAppReview()
                .then(() => {
                    navigation.navigate('OnboardingScreen23b');
                })
                .catch((error) => {
                    mixpanel.track('Onboarding Error', {
                        screen: 'OnboardingScreen23',
                        action: 'RequestInAppReview',
                        error: error?.message || error
                    });
                    navigation.navigate('OnboardingScreen23b');
                });
        } else {
            mixpanel.track('Onboarding Review Not Available', { screen: 'OnboardingScreen23' });
            navigation.navigate('OnboardingScreen23b');
        }
    };

    const handleContinue = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen23' });
        navigation.navigate('OnboardingScreen23b');
    };

    return (
        <Container
            backgroundColor="#F9F8FD"
            enableScroll={true}
            footer={
                <OnboardingButton
                    type="outline"
                    title="Continue"
                    style={{ width: '100%' }}
                    onPress={handleContinue}
                />
            }
        >
            <OnboardingHeader
                progress={0.958} initialProgress={0.917} nextProgress={1.0}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                {/* User Count */}
                <View style={styles.userCountContainer}>
                    <Text style={styles.userCountLabel}>{onboardingData.name},</Text>
                    <Text style={styles.userCountNumber}>20,985</Text>
                    <Text style={styles.userCountDescription}>
                        People just like you use My Fitting Room to shop smarter
                    </Text>
                </View>

                {/* Statistics Row */}
                <View style={styles.statsRow}>
                    {/* Money Saved Stat */}
                    <View style={styles.statCard}>
                        <Text style={styles.statPercentage}>90%</Text>
                        <View style={styles.statLabelContainer}>
                            <Icon name="arrow-up" size={14} color="#000" style={styles.statIcon} />
                            <Text style={styles.statLabel}>Money Saved</Text>
                        </View>
                        <Text style={styles.statSubtext}>On purchases after using MYF</Text>
                    </View>

                    {/* Buyers Remorse Stat */}
                    <View style={styles.statCard}>
                        <Text style={styles.statPercentage}>90%</Text>
                        <View style={styles.statLabelContainer}>
                            <Icon name="arrow-down" size={14} color="#000" style={styles.statIcon} />
                            <Text style={styles.statLabel}>Buyers Remorse</Text>
                        </View>
                        <Text style={styles.statSubtext}>On purchases after using MYF</Text>
                    </View>
                </View>

                {/* Review Section */}
                <View style={styles.reviewSection}>
                    <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={handleReview}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.reviewHeading}>Leave Us A Review!</Text>
                    </TouchableOpacity>

                    <View style={styles.reviewCard}>
                        <Text style={styles.reviewTitle}>Saves So Much Money!</Text>

                        {/* Star Rating */}
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Icon key={star} name="star" size={16} color="#FFA500" style={styles.star} />
                            ))}
                        </View>

                        <Text style={styles.reviewText}>
                            I no longer worry about buyers regret when shopping for clothes online.
                        </Text>
                    </View>
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center'
    },
    userCountContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    userCountLabel: {
        fontFamily: Fonts.Regular,
        fontSize: 12,
        color: '#000',
        marginBottom: 5,
    },
    userCountNumber: {
        fontFamily: Fonts.Bold,
        fontSize: 26,
        color: '#000',
        marginBottom: 8,
    },
    userCountDescription: {
        fontFamily: Fonts.Regular,
        fontSize: 12,
        color: '#000000',
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 40
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        gap: 15,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    statPercentage: {
        fontFamily: Fonts.Bold,
        fontSize: 26,
        color: '#000',
        marginBottom: 8,
    },
    statLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    statIcon: {
        marginRight: 4,
    },
    statLabel: {
        fontFamily: Fonts.Medium,
        fontSize: 16,
        color: '#000',
    },
    statSubtext: {
        fontFamily: Fonts.Regular,
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
        lineHeight: 14,
    },
    reviewSection: {
        alignItems: 'center',
    },
    reviewButton: {
        backgroundColor: '#000',
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 40,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    reviewHeading: {
        fontFamily: Fonts.Bold,
        fontSize: 24,
        color: '#FFF',
        textAlign: 'center',
    },
    reviewCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    reviewTitle: {
        fontFamily: Fonts.Bold,
        fontSize: 24,
        color: '#000',
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    star: {
        marginRight: 4,
    },
    reviewText: {
        fontFamily: Fonts.Regular,
        fontSize: 16,
        color: '#000',
        lineHeight: 20,
    },
});

export default OnboardingScreen23;
