import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Fonts } from '../utils/fonts';
import GradientProgressBar from './GradientProgressBar';
import { triggerHaptic } from '../utils/haptics';

const OnboardingHeader = ({
    progress = 0,
    initialProgress = 0,
    nextProgress = 0,
    onBackPress,
    title,
    topText,
    bottomText,
    showGradientProgress = false,
    containerStyle = {},
    topRowStyle = {},
    textColor = '#000',
    subTextColor = '#BBBBBB',
    textAlign = 'left'
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {/* Top Row: Back Button & Progress Bar */}
            <View style={[styles.topRow, topRowStyle]}>
                <TouchableOpacity onPress={() => { triggerHaptic(); onBackPress(); }} style={styles.backButton}>
                    <Icon name="chevron-back" size={24} color={textColor} />
                </TouchableOpacity>

                <View style={styles.progressContainer}>
                    <GradientProgressBar
                        progress={progress}
                        initialProgress={initialProgress}
                        nextProgress={nextProgress}
                        useGradient={showGradientProgress}
                        color={textColor}
                    />
                </View>
            </View>

            {/* Title Section */}
            <View style={styles.titleContainer}>
                {topText && <Text style={[styles.smallText, { color: subTextColor }]}>{topText}</Text>}

                <Text style={[styles.title, { color: textColor, textAlign: textAlign }]}>{title}</Text>

                {bottomText && <Text style={[styles.smallText, { color: subTextColor, textAlign: textAlign }]}>{bottomText}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingBottom: 20,
        backgroundColor: 'transparent',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    backButton: {
        marginRight: 20,
        paddingVertical: 5,
    },
    progressContainer: {
        flex: 1,
        marginRight: 10,
    },
    titleContainer: {
        gap: 8,
    },
    title: {
        fontFamily: Fonts.Bold,
        fontSize: 26,
        letterSpacing: -1,
    },
    smallText: {
        fontFamily: Fonts.Regular,
        fontSize: 12,
    },
});

export default OnboardingHeader;
