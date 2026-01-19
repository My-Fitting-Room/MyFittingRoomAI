import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import { Fonts } from '../utils/fonts';

const BRAND_OPTIONS = [
    'Y2k', 'Streetwear', 'Preppy',
    'Boho', 'Minimalist', 'Vintage',
    'Chic', 'Casual', 'Sporty',
    'Punk', 'Corporate', 'Grunge',
    'Futuristic', 'Thrifted', 'Retro',
    'Edgy', 'Tomboy', 'Trendy',
    'Elegant', 'Old Money', 'Flashy',
    'Clean girl', 'Maximalist', 'Coquette',
];

const BrandOption = ({ label, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.brandBrand,
                isSelected ? styles.selectedBrand : styles.unselectedBrand
            ]}
        >
            <Text style={[
                styles.brandText,
                isSelected ? styles.selectedBrandText : styles.unselectedBrandText
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

import { useOnboarding } from '../context/OnboardingContext';

const OnboardingScreen5 = ({ navigation }) => {
    const { onboardingData, updateOnboardingData } = useOnboarding();
    const [selectedBrands, setSelectedBrands] = useState(onboardingData.brands || []);

    const handleContinue = () => {
        if (selectedBrands.length >= 3) {
            updateOnboardingData({ brands: selectedBrands });
            navigation.navigate('OnboardingScreen6');
        }
    };

    const toggleBrand = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter(b => b !== brand));
        } else {
            if (selectedBrands.length < 6) {
                setSelectedBrands([...selectedBrands, brand]);
            }
        }
    };

    return (
        <Container
            enableScroll={true}
            footer={
                <OnboardingButton
                    type="fill"
                    title="Continue"
                    style={{ width: '100%', opacity: selectedBrands.length >= 3 ? 1 : 0.5 }}
                    onPress={handleContinue}
                    disabled={selectedBrands.length < 3}
                />
            }
        >
            <OnboardingHeader
                progress={0.208} initialProgress={0.167} nextProgress={0.25}
                topText="Select at least 3 brands that you shop or wear"
                title="Choose Your Style"
                bottomText="This helps us tailor your perfect fit profile."
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <View style={styles.gridContainer}>
                    {BRAND_OPTIONS.map((brand, index) => (
                        <BrandOption
                            key={`${brand}-${index}`} // Composite key for safety
                            label={brand}
                            isSelected={selectedBrands.includes(brand)}
                            onPress={() => toggleBrand(brand)}
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
        justifyContent: 'center'
        // paddingVertical: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', // Center cloud
        gap: 12, // Native gap spacing
    },
    brandBrand: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 24, // Pill shape
        borderWidth: 1,
        marginBottom: 4, // Fallback for gap if needed on old RN, but gap covers most
    },
    unselectedBrand: {
        borderColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
    },
    selectedBrand: {
        borderColor: 'rgba(102, 101, 255, 1)',
        backgroundColor: 'rgba(102, 101, 255, 1)',
    },
    brandText: {
        fontFamily: Fonts.Bold, // FF Semibold as requested
        fontSize: 14,
    },
    unselectedBrandText: {
        color: '#333333',
    },
    selectedBrandText: {
        color: '#FFFFFF',
    },
});

export default OnboardingScreen5;
