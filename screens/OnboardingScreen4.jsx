import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';

import { useOnboarding } from '../context/OnboardingContext';

const OnboardingScreen4 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();

    // Initialize date, converting string from context back to Date object if needed
    const [date, setDate] = useState(() => {
        if (onboardingData.birthday instanceof Date) return onboardingData.birthday;
        if (typeof onboardingData.birthday === 'string') return new Date(onboardingData.birthday);
        return new Date();
    });

    const calculateAge = (birthDate) => {
        if (!birthDate || !(birthDate instanceof Date)) return 0;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const isAgeValid = calculateAge(date) >= 10;

    const handleContinue = () => {
        if (isAgeValid) {
            // Store as ISO string date part (YYYY-MM-DD)
            const formattedDate = date.toISOString().split('T')[0];
            updateOnboardingData({ birthday: formattedDate });
            navigation.navigate('OnboardingScreen5');
        }
    };

    return (
        <Container
            footer={
                <OnboardingButton
                    type="fill"
                    title="Continue"
                    style={{ width: '100%', opacity: isAgeValid ? 1 : 0.5 }}
                    onPress={handleContinue}
                    disabled={!isAgeValid}
                />
            }
        >
            <OnboardingHeader
                progress={0.167} initialProgress={0.125} nextProgress={0.208}
                title="What's your birthday?"
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="spinner"
                    themeVariant="light"
                    textColor="#000000"
                    onChange={(event, selectedDate) => {
                        if (selectedDate) {
                            setDate(selectedDate);
                        }
                    }}
                />
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OnboardingScreen4;
