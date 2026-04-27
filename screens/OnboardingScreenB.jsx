import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import mixpanel from '../utils/mixpanel';
import { Fonts } from '../utils/fonts';
import { FONTS } from '../constants/fonts';

const OnboardingScreenB = ({ navigation }) => {
    React.useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreenB' });
    }, []);

    const handleNext = () => {
        navigation.navigate('TryOn');
    };

    return (
        <Container
            footer={
                <View style={{ width: '100%' }}>
                    <Text style={styles.footerText}>NO PAYMENT DUE NOW</Text>
                    <OnboardingButton
                        type="fill"
                        title="Continue"
                        onPress={handleNext}
                        style={{ width: '100%' }}
                    />
                </View>
            }
        >
            <OnboardingHeader
                progress={0.02}
                initialProgress={0}
                nextProgress={0.04}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
                textAlign="center"
                title={
                    <View style={{ alignItems: 'center' }}>
                        <Text style={styles.titleText}>
                            We’ll send you a reminder{"\n"}before your trial ends
                        </Text>
                        <Text style={styles.subTitleText}>
                            Cancel Anytime
                        </Text>
                    </View>
                }
            />

            <View style={styles.content}>
                <Image
                    source={require('../assets/yellow-bell.png')}
                    style={styles.heroImage}
                    resizeMode="contain"
                />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
    },
    titleText: {
        fontFamily: Fonts.Bold,
        fontSize: 26,
        color: '#000',
        letterSpacing: -1,
        textAlign: 'center',
    },
    subTitleText: {
        fontFamily: Fonts.SemiBold,
        fontSize: 20,
        color: '#000',
        marginTop: 30,
        textAlign: 'center',
    },
    heroImage: {
        width: '100%',
        height: '70%',
    },
    footerText: {
        fontFamily: FONTS.SATOSHI,
        fontSize: 12,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
        letterSpacing: 2,
    }
});

export default OnboardingScreenB;
