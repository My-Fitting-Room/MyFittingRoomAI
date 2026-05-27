import React from 'react';
import { View, StyleSheet } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import OnboardingInput from '../components/OnboardingInput';
import Container from '../components/Container';
import { useOnboarding } from '../context/OnboardingContext';
import mixpanel from '../utils/mixpanel';
import { AppState } from 'react-native';
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { trackAppsFlyerPurchase } from "../utils/appsflyer";
import Purchases from "react-native-purchases";

const OnboardingScreen1 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [name, setName] = React.useState(onboardingData.name || '');

    React.useEffect(() => {
        const checkPaywall = async () => {
            try {
                const offerings = await Purchases.getOfferings();

                const paywallResult = await RevenueCatUI.presentPaywallIfNeeded({
                    requiredEntitlementIdentifier: "Unlimited",
                    offering: offerings.all["Plans Vibe"]
                });

                mixpanel.track("Paywall Displayed On Onboarding 1");

                switch (paywallResult) {
                    case PAYWALL_RESULT.PURCHASED:
                        await trackAppsFlyerPurchase();
                        mixpanel.track("Paywall CTA Clicked On Onboarding 1");
                        break;
                    case PAYWALL_RESULT.RESTORED:
                        break;
                    case PAYWALL_RESULT.NOT_PRESENTED:
                    case PAYWALL_RESULT.ERROR:
                    case PAYWALL_RESULT.CANCELLED:
                        mixpanel.track("Paywall Dismissed On Onboarding 1");
                        break;
                }
            } catch (error) {
                console.error("Error presenting paywall:", error);
            }
        };

        checkPaywall();

        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen1' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen1' });
            }
        });

        return () => subscription.remove();
    }, []);

    const handleNext = () => {
        if (name.trim()) {
            mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen1' });
            mixpanel.track('Onboarding name submitted', { name: name.trim() });
            updateOnboardingData({ name: name.trim() });
            navigation.navigate('OnboardingScreen2');
        }
    };

    return (
        <Container
            footer={
                <OnboardingButton
                    type="fill"
                    title="Next"
                    onPress={handleNext}
                    style={{ width: '100%', opacity: name.trim() ? 1 : 0.5 }}
                    disabled={!name.trim()}
                />
            }
        >
            <OnboardingHeader
                progress={0.042} initialProgress={0.04} nextProgress={0.083}
                topText="We’d love to personalize your experience"
                title="What should we call you?"
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <OnboardingInput
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
    },
});

export default OnboardingScreen1;
