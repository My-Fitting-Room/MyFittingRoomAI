import React from 'react';
import { View, StyleSheet } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import OnboardingInput from '../components/OnboardingInput';
import Container from '../components/Container';
import { useOnboarding } from '../context/OnboardingContext';

const OnboardingScreen1 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [name, setName] = React.useState(onboardingData.name || '');

    const handleNext = () => {
        if (name.trim()) {
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
                progress={0.042} initialProgress={0} nextProgress={0.083}
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
