import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, AppState, Share, Alert, ActivityIndicator } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';
import { supabase } from '../App';
import mixpanel from '../utils/mixpanel';

const APP_STORE_URL = 'https://apps.apple.com/us/app/my-fitting-room/id6743954773';
const FRIENDS_GOAL = 3;

const OnboardingScreenReferral = ({ navigation }) => {
    const [referralCode, setReferralCode] = useState(null);
    const [loadingCode, setLoadingCode] = useState(true);

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreenReferral' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreenReferral' });
            }
        });

        const fetchReferralCode = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) { setLoadingCode(false); return; }

                const { data, error } = await supabase
                    .from('profiles')
                    .select('referral_code')
                    .eq('id', session.user.id)
                    .maybeSingle();

                if (error) throw error;
                setReferralCode(data?.referral_code ?? null);
            } catch (error) {
                mixpanel.track('Onboarding Error', { screen: 'OnboardingScreenReferral', action: 'fetchReferralCode', error: error?.message || error });
            } finally {
                setLoadingCode(false);
            }
        };

        fetchReferralCode();

        return () => subscription.remove();
    }, []);

    const handleShare = async () => {
        try {
            const codeLine = referralCode ? ` and use my referral code: ${referralCode}` : '';
            await Share.share({
                message: `Try on clothes online for free when you sign up${codeLine} ${APP_STORE_URL}`,
                url: APP_STORE_URL,
            });
            mixpanel.track('Referral code shared', { screen: 'OnboardingScreenReferral' });
        } catch (error) {
            Alert.alert('Error', 'Please try again later!', [{ text: 'OK' }]);
        }
    };

    const handleContinue = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreenReferral' });
        navigation.navigate('OnboardingScreen24');
    };

    return (
        <Container
            enableScroll={true}
            footer={
                <View style={{ width: '100%', gap: 12 }}>
                    <OnboardingButton
                        type="fill"
                        title="Share your code"
                        style={{ width: '100%' }}
                        onPress={handleShare}
                    />
                    <OnboardingButton
                        type="outline"
                        title="Continue"
                        style={{ width: '100%' }}
                        onPress={handleContinue}
                    />
                </View>
            }
        >
            <OnboardingHeader
                progress={0.99} initialProgress={0.979} nextProgress={1.0}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
                textAlign="center"
                showSkip={false}
                title={`Invite ${FRIENDS_GOAL} friends,\nget free try-ons`}
            />

            <View style={styles.content}>
                <Text style={styles.subtitle}>
                    Share your code below. When {FRIENDS_GOAL} friends sign up and use it,
                    you'll unlock free try-ons.
                </Text>

                <View style={styles.codeBox}>
                    <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
                    {loadingCode ? (
                        <ActivityIndicator color="#000000" style={{ marginTop: 8 }} />
                    ) : (
                        <Text style={styles.codeValue}>{referralCode ?? '—'}</Text>
                    )}
                </View>

                <View style={styles.friendsRow}>
                    {Array.from({ length: FRIENDS_GOAL }).map((_, i) => (
                        <View key={i} style={styles.friendSlot}>
                            <View style={styles.friendCircle}>
                                <Text style={styles.friendCircleText}>{i + 1}</Text>
                            </View>
                            <Text style={styles.friendLabel}>Friend</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.footnote}>
                    Track your progress anytime under Referral Code in Settings.
                </Text>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    subtitle: {
        fontFamily: Fonts.Regular,
        fontSize: 15,
        lineHeight: 22,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 28,
        paddingHorizontal: 8,
    },
    codeBox: {
        width: '100%',
        borderWidth: 2,
        borderColor: '#000000',
        borderStyle: 'dashed',
        borderRadius: 16,
        paddingVertical: 24,
        alignItems: 'center',
        marginBottom: 32,
    },
    codeLabel: {
        fontFamily: Fonts.SemiBold,
        fontSize: 12,
        letterSpacing: 2,
        color: '#9CA3AF',
        marginBottom: 10,
    },
    codeValue: {
        fontFamily: Fonts.Bold,
        fontSize: 34,
        letterSpacing: 4,
        color: '#000000',
    },
    friendsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 28,
    },
    friendSlot: {
        alignItems: 'center',
        gap: 8,
    },
    friendCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    friendCircleText: {
        fontFamily: Fonts.Bold,
        fontSize: 20,
        color: '#9CA3AF',
    },
    friendLabel: {
        fontFamily: Fonts.Regular,
        fontSize: 12,
        color: '#9CA3AF',
    },
    footnote: {
        fontFamily: Fonts.Regular,
        fontSize: 13,
        lineHeight: 18,
        color: '#9CA3AF',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
});

export default OnboardingScreenReferral;
