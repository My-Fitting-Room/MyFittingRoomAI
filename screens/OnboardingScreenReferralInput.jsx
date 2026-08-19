import React, { useState } from 'react';
import { View, StyleSheet, Text, AppState } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import OnboardingInput from '../components/OnboardingInput';
import Container from '../components/Container';
import { useOnboarding } from '../context/OnboardingContext';
import { Fonts } from '../utils/fonts';
import mixpanel from '../utils/mixpanel';
import { redeemReferralCode } from '../utils/referral';

const ERROR_MESSAGES = {
    invalid_code: "That code isn't valid. Double-check it and try again.",
    self_referral: "You can't use your own referral code.",
    unauthenticated: 'Please sign in again to use a referral code.',
    network: "Couldn't reach the server. Check your connection and try again.",
    unknown: 'Something went wrong. Please try again.',
};

const OnboardingScreenReferralInput = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [code, setCode] = useState(onboardingData.referredByCode || '');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    React.useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreenReferralInput' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreenReferralInput' });
            }
        });

        return () => subscription.remove();
    }, []);

    const goToReferral = () => {
        navigation.navigate('OnboardingScreenReferral');
    };

    const handleContinue = async () => {
        const trimmed = code.trim();
        if (!trimmed) { handleSkip(); return; }

        setErrorMsg('');
        setSubmitting(true);
        try {
            await redeemReferralCode(trimmed);
            updateOnboardingData({ referredByCode: trimmed });
            mixpanel.track('Referral code entered', { screen: 'OnboardingScreenReferralInput' });
            mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreenReferralInput' });
            goToReferral();
        } catch (err) {
            // Already redeemed a code before — the choice is locked server-side,
            // so there's nothing to fix; just move the user along.
            if (err.code === 'already_redeemed') {
                mixpanel.track('Referral code already redeemed', { screen: 'OnboardingScreenReferralInput' });
                goToReferral();
                return;
            }
            setErrorMsg(ERROR_MESSAGES[err.code] || ERROR_MESSAGES.unknown);
            mixpanel.track('Referral code error', { screen: 'OnboardingScreenReferralInput', error: err.code });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSkip = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreenReferralInput', skipped: true });
        goToReferral();
    };

    return (
        <Container
            footer={
                <View style={{ width: '100%', gap: 12 }}>
                    <OnboardingButton
                        type="fill"
                        title="Continue"
                        style={{ width: '100%' }}
                        onPress={handleContinue}
                        loading={submitting}
                    />
                    <OnboardingButton
                        type="outline"
                        title="I don't have a code"
                        style={{ width: '100%' }}
                        onPress={handleSkip}
                        disabled={submitting}
                    />
                </View>
            }
        >
            <OnboardingHeader
                progress={0.985} initialProgress={0.979} nextProgress={0.99}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
                textAlign="center"
                showSkip={false}
                topText="Got invited by a friend?"
                title="Enter their referral code"
            />

            <View style={styles.content}>
                <Text style={styles.subtitle}>
                    Add a friend's code so they get credit for inviting you. No code? Just tap
                    "I don't have a code".
                </Text>

                <OnboardingInput
                    placeholder="Referral code"
                    value={code}
                    onChangeText={(text) => { setCode(text); if (errorMsg) setErrorMsg(''); }}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    returnKeyType="done"
                    editable={!submitting}
                    onSubmitEditing={handleContinue}
                />

                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    subtitle: {
        fontFamily: Fonts.Regular,
        fontSize: 15,
        lineHeight: 22,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    errorText: {
        fontFamily: Fonts.Medium,
        fontSize: 14,
        color: '#E4483B',
        textAlign: 'center',
        marginTop: 4,
        paddingHorizontal: 8,
    },
});

export default OnboardingScreenReferralInput;
