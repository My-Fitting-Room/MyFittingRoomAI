import { View, StyleSheet, Text, Image } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';
import OnBoardingImage from '../assets/images/OnboardingScreen21.png';
import { useOnboarding } from '../context/OnboardingContext';
import { supabase } from '../App';
import React, { useState } from 'react';
import FastImage from 'react-native-fast-image';


const OnboardingScreen24 = ({ navigation }) => {
    const { onboardingData } = useOnboarding();
    const [isSaving, setIsSaving] = useState(false);

    const handleContinue = async () => {
        setIsSaving(true);
        console.log("=======>>>", onboardingData);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            console.log("=======>>>", session);

            if (!session) {
                navigation.navigate('First');
                return;
            }

            const { error } = await supabase
                .from('user_onboarding_details')
                .upsert({
                    id: session.user.id,
                    name: onboardingData.name,
                    gender: onboardingData.gender,
                    birthday: onboardingData.birthday,
                    brands: onboardingData.brands,
                    hear_about_us: onboardingData.hearAboutUs,
                    confidence_level: onboardingData.confidence,
                    goals: onboardingData.goals,
                    styles: onboardingData.styles,
                    biggest_issue: onboardingData.biggestIssue,
                    order_action: onboardingData.orderAction,
                    regret_frequency: onboardingData.regretFrequency,
                    shirt_size: onboardingData.shirtSize,
                    pants_size: onboardingData.pantsSize,
                    user_image_uri: onboardingData.userImage,
                    onboarding_complete: true,
                    onboarding_wizard_step: 25,
                    metadata: JSON.stringify(onboardingData)
                });

            if (error) throw error;

            navigation.navigate('TryOn');
        } catch (error) {
            console.error('Error saving onboarding data:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
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
                    loading={isSaving}
                />
            }
        >
            <OnboardingHeader
                progress={1.0} initialProgress={0.958} nextProgress={1.0}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
                title={"✨ Your Custom Fit Profile is Ready!"}
            />

            <View style={styles.content}>
                {/* Profile Summary Card */}
                <View style={styles.profileCard}>
                    <Text style={styles.profileTitle}>Your Profile</Text>

                    <View style={styles.profileItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.profileText}>
                            <Text style={styles.profileLabel}>Your sizes: </Text>
                            <Text style={styles.profileValue}>
                                {onboardingData.shirtSize?.join(', ') || 'N/A'} (Shirt), {onboardingData.pantsSize ? `${onboardingData.pantsSize.waist}x${onboardingData.pantsSize.length}` : 'N/A'} (Pants)
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.profileItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.profileText}>
                            <Text style={styles.profileLabel}>Your Style: </Text>
                            <Text style={styles.profileValue}>
                                {onboardingData.brands?.join(', ') || 'N/A'}
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.profileItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.profileText}>
                            <Text style={styles.profileLabel}>Your shopping frustrations: </Text>
                            <Text style={styles.profileValue}>
                                {onboardingData.biggestIssue || 'N/A'}
                            </Text>
                        </Text>
                    </View>

                    <View style={styles.profileItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.profileText}>
                            <Text style={styles.profileLabel}>Your shopping confidence level: </Text>
                            <Text style={styles.profileValue}>
                                {onboardingData.confidence || 'N/A'}
                            </Text>
                        </Text>
                    </View>
                </View>

                {/* Ready Message */}
                <Text style={styles.readyMessage}>
                    🎉 Your ready for your first try-on!
                </Text>

                {/* User Image */}
                <View style={styles.imageContainer}>
                    <FastImage
                        source={onboardingData.userImage ? { uri: onboardingData.userImage.uri || onboardingData.userImage } : OnBoardingImage}
                        style={styles.userImage}
                        resizeMode="cover"
                    />
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    profileCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 20,
        width: '90%',
        marginBottom: 20,
    },
    profileTitle: {
        fontFamily: Fonts.Bold,
        fontSize: 20,
        color: '#000',
        marginBottom: 15,
    },
    profileItem: {
        flexDirection: 'row',
        marginBottom: 2,
        alignItems: 'flex-start',
    },
    bullet: {
        fontFamily: Fonts.Bold,
        fontSize: 16,
        color: '#000',
        marginRight: 8,
        lineHeight: 20,
    },
    profileText: {
        flex: 1,
        lineHeight: 20,
    },
    profileLabel: {
        fontFamily: Fonts.Bold,
        fontSize: 12,
        color: '#000',
    },
    profileValue: {
        fontFamily: Fonts.Regular,
        fontSize: 14,
        color: '#000',
    },
    readyMessage: {
        fontFamily: Fonts.Bold,
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
    },
    imageContainer: {
        width: 200,
        height: 280,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    userImage: {
        width: '100%',
        height: '100%',
    },
});

export default OnboardingScreen24;
