import { View, StyleSheet, Image } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import OnboardingScreen14Image from "../assets/images/OnboardingScreen14.png"



const OnboardingScreen14 = ({ navigation }) => {

    const handleContinue = () => {
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
