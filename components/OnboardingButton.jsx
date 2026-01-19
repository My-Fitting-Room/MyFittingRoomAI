import { Text, TouchableOpacity, StyleSheet, View, ActivityIndicator } from 'react-native';
import { triggerHaptic } from '../utils/haptics';
import { Fonts } from '../utils/fonts';

const OnboardingButton = ({ type = 'fill', title, onPress, style, disabled, loading }) => {
    const isOutline = type === 'outline';

    const handlePress = () => {
        triggerHaptic();
        onPress && onPress();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={disabled || loading}
            style={[
                styles.button,
                isOutline ? styles.outlineButton : styles.fillButton,
                style,
                (disabled || loading) && { opacity: 0.5 }
            ]}
        >
            {loading ? (
                <ActivityIndicator color={isOutline ? '#000000' : '#FFFFFF'} />
            ) : (
                <Text style={[styles.text, isOutline ? styles.outlineText : styles.fillText]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 50, // Approximate height based on UI
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 150,
        paddingHorizontal: 20,
    },
    fillButton: {
        backgroundColor: '#000000',
    },
    outlineButton: {
        backgroundColor: '#FFFFFF',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        // Elevation for Android
        elevation: 5,
    },
    text: {
        fontFamily: Fonts.Medium, // Assuming Medium for button text
        fontSize: 16,
    },
    fillText: {
        color: '#FFFFFF',
    },
    outlineText: {
        color: '#000000',
    },
});

export default OnboardingButton;
