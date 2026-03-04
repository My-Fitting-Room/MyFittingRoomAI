import { View, StyleSheet, Image, AppState } from 'react-native';
import React, { useEffect } from 'react';
import mixpanel from '../utils/mixpanel';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import OnboardingScreen14Image from "../assets/images/OnboardingScreen14.png"



const OnboardingScreen14 = ({ navigation }) => {

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen14' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen14' });
            }
        });

        return () => subscription.remove();
    }, []);

    const handleContinue = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen14' });
        navigation.navigate('OnboardingScreen15');
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
                progress={0.583} initialProgress={0.542} nextProgress={0.625}
                title="We’ll eliminate the confusion using AI measurements."
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image
                        source={OnboardingScreen14Image}
                        style={styles.image}
                    />
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '80%',
        resizeMode: 'contain',
    },
});

export default OnboardingScreen14;
