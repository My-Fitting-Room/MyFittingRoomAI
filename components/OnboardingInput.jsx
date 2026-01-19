import React from 'react';
import { TextInput, StyleSheet, View, Platform } from 'react-native';
import { Fonts } from '../utils/fonts';

const OnboardingInput = ({
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    keyboardType,
    style,
    ...props
}) => {
    return (
        <View style={[styles.container, style]}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#999" // Fallback placeholder color
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // Slightly rounded, can increase if pill shape desired (User img looks pill-ish but not full circle)
        // Box Shadow: 0px 0px 10px rgba(0, 0, 0, 0.14)
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.14,
        shadowRadius: 10,
        elevation: 4, // Android equivalent
        marginVertical: 10,
    },
    input: {
        fontFamily: Fonts.Regular,
        fontSize: 16,
        color: 'rgba(113, 113, 113, 1)', // #717171 as requested
        paddingHorizontal: 20,
        paddingVertical: 16,
        width: '100%',
    },
});

export default OnboardingInput;
