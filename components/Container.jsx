import React from 'react';
import {
    KeyboardAvoidingView,
    ScrollView,
    View,
    StyleSheet,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Container = ({
    children,
    footer,
    style,
    contentContainerStyle,
    backgroundColor = '#fff',
    enableScroll = true,
    showTooltip = false
}) => {
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={[styles.innerContainer, style]}>
                    {/* Tooltip Placeholder (As requested) */}
                    {showTooltip && (
                        <View style={styles.tooltipPlaceholder} testID="tooltip-placeholder">
                            {/* Tooltip content will go here */}
                        </View>
                    )}

                    {enableScroll ? (
                        <ScrollView
                            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
                            showsVerticalScrollIndicator={false}
                        >
                            {children}
                        </ScrollView>
                    ) : (
                        <View style={[styles.scrollContent, contentContainerStyle]}>
                            {children}
                        </View>
                    )}

                    {/* Footer Section */}
                    {footer && (
                        <View style={styles.footer}>
                            {footer}
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 30, // Standard Padding as requested
        paddingTop: 10,
        paddingBottom: 20,
    },
    footer: {
        paddingHorizontal: 30,
        paddingBottom: 40,
        paddingTop: 10,
    },
    tooltipPlaceholder: {
        // Placeholder style logic
        zIndex: 100,
    }
});

export default Container;
