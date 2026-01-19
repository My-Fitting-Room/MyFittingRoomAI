import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import screenImage from '../assets/images/OnboardingScreen7.png';

const OnboardingScreen7 = ({ navigation }) => {
    return (
        <Container
            footer={
                <OnboardingButton
                    type="fill"
                    title="Continue"
                    style={{ width: '100%' }}
                    onPress={() => navigation.navigate('OnboardingScreen8')}
                />
            }
        >
            <OnboardingHeader
                progress={0.292} initialProgress={0.25} nextProgress={0.333}
                // showGradientProgress={true}
                title="My Fitting Room offers a total solution for shopping online."
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <Image source={screenImage} style={styles.image} resizeMode="contain" />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default OnboardingScreen7;
