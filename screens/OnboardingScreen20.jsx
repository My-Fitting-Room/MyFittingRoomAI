import { View, StyleSheet, Text, Image, AppState } from 'react-native';
import React, { useEffect } from 'react';
import mixpanel from '../utils/mixpanel';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';
import FullBodyImage from '../assets/images/OnboardingScreen20-A.png';
import PlainBackgroundImage from '../assets/images/OnboardingScreen20-B.png';
import GoodLightingImage from '../assets/images/OnboardingScreen20-C.png';




const OnboardingScreen20 = ({ navigation }) => {

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen20' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen20' });
            }
        });

        return () => subscription.remove();
    }, []);

    const handleContinue = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen20' });
        navigation.navigate('OnboardingScreen21');
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
                progress={0.833} initialProgress={0.792} nextProgress={0.875}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
                title={"For best results"}
                bottomText={"Tips to get the best outcomes"}
                textAlign='center'

            />

            <View style={styles.content}>

                {/* Tip 1 */}
                <View style={styles.tipRow}>
                    <View style={styles.iconContainer}>
                        <Image source={FullBodyImage} style={styles.iconImage} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.tipTitle}>Full Body Pic</Text>
                        <Text style={styles.tipDescription}>
                            Upload a photo showing your complete body from head to toe
                        </Text>
                    </View>
                </View>

                {/* Tip 2 */}
                <View style={styles.tipRow}>
                    <View style={[styles.iconContainer]}>
                        <Image source={PlainBackgroundImage} style={styles.iconImage} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.tipTitle}>Plain Background</Text>
                        <Text style={styles.tipDescription}>
                            Images with clean uncluttered background allow our AI to focus best
                        </Text>
                    </View>
                </View>

                {/* Tip 3 */}
                <View style={styles.tipRow}>
                    <View style={[styles.iconContainer]}>
                        <Image source={GoodLightingImage} style={styles.iconImage} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.tipTitle}>Good Lighting</Text>
                        <Text style={styles.tipDescription}>
                            The more light in the image the better, avoid dim images with heavy shadows
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
        justifyContent: 'center',

    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        gap: 20,
    },
    iconImage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    textContainer: {
        flex: 1,
    },
    tipTitle: {
        fontFamily: Fonts.Bold,
        fontSize: 16,
        color: '#000000',
        marginBottom: 6,
    },
    tipDescription: {
        fontFamily: Fonts.Medium,
        fontSize: 12,
        color: '#A0A0A0',
        lineHeight: 18,
        marginTop: 5,
    },
});

export default OnboardingScreen20;
