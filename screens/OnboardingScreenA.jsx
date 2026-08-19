import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import mixpanel from '../utils/mixpanel';
import { Fonts } from '../utils/fonts';
import { FONTS } from '../constants/fonts';


const OnboardingScreenA = ({ navigation }) => {
    React.useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreenA' });
    }, []);

    const handleNext = () => {
        navigation.navigate('OnboardingScreenB');
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
                progress={0}
                initialProgress={0}
                nextProgress={0.02}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
                textAlign="center"
                showSkip={false}
                title={
                    <Text style={styles.titleText}>
                        We want you to try My {"\n"}Fitting Room for <Text style={{ color: '#6ac9f1' }}>FREE</Text>
                    </Text>
                }
            />
            
            <View style={styles.content}>
                <Image
                    source={require('../assets/App-screenshot.png')}
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
    heroImage: {
        width: '140%',
        height: '90%',
        marginTop: 0,
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

export default OnboardingScreenA;
