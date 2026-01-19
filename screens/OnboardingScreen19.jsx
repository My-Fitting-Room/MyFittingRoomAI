import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { RulerPicker } from 'react-native-ruler-picker';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';
import { triggerHaptic } from '../utils/haptics';

import { useOnboarding } from '../context/OnboardingContext';

const OnboardingScreen19 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [waist, setWaist] = useState(onboardingData.pantsSize?.waist || 33);
    const [length, setLength] = useState(onboardingData.pantsSize?.length || 34);

    const handleContinue = () => {
        updateOnboardingData({ pantsSize: { waist: Math.round(waist), length: Math.round(length) } });
        navigation.navigate('OnboardingScreen20');
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
                progress={0.792} initialProgress={0.75} nextProgress={0.833}
                title={"What size pants do you wear?"}
                topText={"FYI - You can change this later at anytime"}
                bottomText={"This helps us tailor your perfect fit profile."}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>

                {/* Waist Selection */}
                <View style={styles.pickerSection}>
                    <Text style={styles.label}>Waist</Text>
                    <Text style={styles.valueText}>{Math.round(waist)} in</Text>
                    <RulerPicker
                        min={20}
                        max={60}
                        step={0.1}
                        fractionDigits={1}
                        initialValue={33}
                        onValueChange={(number) => {
                            setWaist(number);
                            triggerHaptic("selection");
                        }}
                        onValueChangeEnd={(number) => setWaist(number)}
                        unit="in"
                        height={80}
                        indicatorColor="#000"
                        textColor="#888"
                        valueTextStyle={{ opacity: 0 }} // Hide default value
                        unitTextStyle={{ opacity: 0 }} // Hide default unit
                    />
                </View>

                {/* Length Selection */}
                <View style={styles.pickerSection}>
                    <Text style={styles.label}>Length</Text>
                    <Text style={styles.valueText}>{Math.round(length)} in</Text>
                    <RulerPicker
                        min={20}
                        max={60}
                        step={0.1}
                        fractionDigits={1}
                        initialValue={34}
                        onValueChange={(number) => {
                            setLength(number);
                            triggerHaptic();
                        }}
                        onValueChangeEnd={(number) => setLength(number)}
                        unit="in"
                        height={80}
                        indicatorColor="#000"
                        textColor="#888"
                        valueTextStyle={{ opacity: 0 }}
                        unitTextStyle={{ opacity: 0 }}
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
    pickerSection: {
        marginBottom: 40,
        alignItems: 'center',
    },
    label: {
        fontFamily: Fonts.Medium,
        fontSize: 16,
        color: '#000000',
        marginBottom: 5,
    },
    valueText: {
        fontFamily: Fonts.Medium,
        fontSize: 36,
        color: '#000000',
        marginBottom: 10,
    }
});

export default OnboardingScreen19;
