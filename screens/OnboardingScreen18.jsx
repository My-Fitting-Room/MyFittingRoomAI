import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';

const SIZES = ['S', 'M', 'L', 'XL', '2XL', '4XL'];

const SizeOption = ({ label, isSelected, onPress }) => {
    if (isSelected) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.optionWrapper, styles.selectedShadow]}>
                <LinearGradient
                    colors={['#000000', 'rgba(0, 0, 0, 0.62)']}
                    locations={[0.75, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.optionContent}
                >
                    <Text style={styles.selectedLabel}>{label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.optionWrapper, styles.unselectedStyle]}>
            <View style={styles.optionContent}>
                <Text style={styles.unselectedLabel}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
};

import { useOnboarding } from '../context/OnboardingContext';

const OnboardingScreen18 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [selectedSizes, setSelectedSizes] = useState(onboardingData.shirtSize || []);

    const toggleSize = (size) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size));
        } else {
            if (selectedSizes.length < 2) {
                setSelectedSizes([...selectedSizes, size]);
            }
        }
    };

    const handleContinue = () => {
        if (selectedSizes.length > 0) {
            updateOnboardingData({ shirtSize: selectedSizes });
            navigation.navigate('OnboardingScreen19');
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
                    disabled={selectedSizes.length === 0}
                />
            }
        >
            <OnboardingHeader
                progress={0.75} initialProgress={0.708} nextProgress={0.792}
                title={"What size shirt do you commonly wear?"}
                topText={"FYI - You can change this later at anytime"}
                bottomText={"Select up to 2."}
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <View style={styles.grid}>
                    {SIZES.map((size) => (
                        <SizeOption
                            key={size}
                            label={size}
                            isSelected={selectedSizes.includes(size)}
                            onPress={() => toggleSize(size)}
                        />
                    ))}
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 40,
    },
    optionWrapper: {
        width: '45%', // Approximate for 2 columns with spacing
        aspectRatio: 1, // Square
        marginBottom: 20,
        borderRadius: 16,
    },
    optionContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
    },
    unselectedStyle: {
        backgroundColor: '#F5F5F5', // Light grey placeholder
        // Using shadow for unselected? Screenshot shows white/grey cards.
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    selectedShadow: {
        shadowColor: '#24262B',
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.2, // Approx for 33 hex alpha
        shadowRadius: 24,
        elevation: 10,
    },
    selectedLabel: {
        fontFamily: Fonts.Bold,
        fontSize: 24,
        color: '#FFFFFF',
    },
    unselectedLabel: {
        fontFamily: Fonts.Medium,
        fontSize: 24,
        color: '#000000',
    },
});

export default OnboardingScreen18;
