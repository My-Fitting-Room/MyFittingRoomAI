import React, { useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';


const OnboardingScreen9 = ({ navigation }) => {
    const animationRef = useRef(null);

    return (
        <Container
            footer={
                <OnboardingButton
                    type="fill"
                    title="Continue"
                    style={{ width: '100%' }}
                    onPress={() => navigation.navigate('OnboardingScreen10')}
                />
            }
        >
            <OnboardingHeader
                progress={0.375} initialProgress={0.333} nextProgress={0.417}
                title="You’re not alone — 70% of shoppers feel the same. MYF eliminates these regrets instantly."
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>

                <View style={styles.lottieContainer}>
                    <LottieView
                        source={require('../assets/JSON/BarGraphAnimation.json')}
                        autoPlay
                        loop={false}
                        style={styles.lottie}
                        resizeMode="contain"
                    />
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
    },
    lottieContainer: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: '100%',
        height: '100%',
        transform: [{ scale: 1.2 }],
    },
});

export default OnboardingScreen9;
