import { View, StyleSheet, Text, TouchableOpacity, AppState, Image } from 'react-native';
import InAppReview from 'react-native-in-app-review';
import React, { useEffect } from 'react';
import mixpanel from '../utils/mixpanel';
import Icon from 'react-native-vector-icons/FontAwesome';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';

import avatarsRow from '../assets/avatars_row.png';
import angelaAvatar from '../assets/Avatar.png';
import goldWreath from '../assets/gold_wreath.png';

const OnboardingScreen23 = ({ navigation }) => {

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

    const handleContinue = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen23' });

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

    return (
        <Container
            backgroundColor="#F9F8FD"
            enableScroll={true}
            footer={
                <OnboardingButton
                    type="fill"
                    title="Continue"
                    style={{ width: '100%', backgroundColor: '#000' }}
                    onPress={handleContinue}
                />
            }
        >
            <OnboardingHeader
                progress={0.958} initialProgress={0.917} nextProgress={1.0}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0, paddingBottom: 0 }}
                topRowStyle={{ marginBottom: 20 }}
            />

            <View style={styles.content}>
                <Text style={styles.mainTitle}>Give us a rating</Text>

                <View style={styles.ratingPill}>
                    <Image source={goldWreath} style={[styles.wreath, { transform: [{ scaleX: -1 }] }]} resizeMode="contain" />
                    <View style={styles.pillCenterContent}>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Icon key={s} name="star" size={26} color="#FFB800" style={styles.starIcon} />
                            ))}
                        </View>
                        <Text style={styles.shoppersText}>Over 30k+ Shoppers</Text>
                    </View>
                    <Image source={goldWreath} style={styles.wreath} resizeMode="contain" />
                </View>

                <View style={styles.avatarsWrapper}>
                    <View style={styles.avatarsImageContainer}>
                        <Image source={avatarsRow} style={styles.avatarsImage} resizeMode="contain" />
                    </View>
                </View>

                <Text style={styles.descriptionText}>
                    MYF was made to help people avoid making mistakes.
                </Text>

                <View style={styles.reviewCard}>
                    <View style={styles.reviewerInfo}>
                        <Image source={angelaAvatar} style={styles.reviewerAvatar} />
                        <Text style={styles.reviewerName}>Angela Moreno</Text>
                    </View>
                    <Text style={styles.reviewTitle}>Saves So Much Money!</Text>
                    <View style={styles.cardStarsRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Icon key={s} name="star" size={14} color="#FFD700" style={styles.smallStarIcon} />
                        ))}
                    </View>
                    <Text style={styles.reviewText}>
                        I no longer worry about buyers regret when shopping for clothes online.
                    </Text>
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 5,
    },
    mainTitle: {
        fontFamily: Fonts.Bold,
        fontSize: 34,
        color: '#000',
        marginBottom: 30,
        textAlign: 'center',
    },
    ratingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginBottom: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    pillCenterContent: {
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    wreath: {
        width: 70,
        height: 70,
    },
    starsRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    starIcon: {
        marginHorizontal: 3,
    },
    shoppersText: {
        fontFamily: Fonts.Bold,
        fontSize: 16,
        color: '#888',
    },
    avatarsWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 35,
    },
    avatarsImageContainer: {
        width: '100%',
        height: 75,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarsImage: {
        width: '100%',
        height: '100%',
    },
    descriptionText: {
        fontFamily: Fonts.Regular,
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
        paddingHorizontal: 50,
        marginBottom: 40,
        lineHeight: 20,
    },
    reviewCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        width: '95%',
        borderWidth: 1,
        borderColor: '#EEE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    reviewerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    reviewerName: {
        fontFamily: Fonts.Medium,
        fontSize: 16,
        color: '#000',
    },
    reviewTitle: {
        fontFamily: Fonts.Bold,
        fontSize: 20,
        color: '#000',
        marginBottom: 6,
    },
    cardStarsRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    smallStarIcon: {
        marginRight: 2,
    },
    reviewText: {
        fontFamily: Fonts.Regular,
        fontSize: 15,
        color: '#333',
        lineHeight: 20,
    },
});

export default OnboardingScreen23;
