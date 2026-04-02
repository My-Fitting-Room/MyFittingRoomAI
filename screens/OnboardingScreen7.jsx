import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, AppState, Text, Animated, Easing } from 'react-native';
import mixpanel from '../utils/mixpanel';
import OnboardingHeader from '../components/OnboardingHeader';
import OnboardingButton from '../components/OnboardingButton';
import Container from '../components/Container';
import LinearGradient from 'react-native-linear-gradient';
import { FONTS } from '../constants/fonts';

const STEPS = [
    { title: "Upload A Full Body photo", colors: ['#FAD0C4', '#A1E6E3'] }, // Pastel pink to aqua
    { title: "Upload A Clothing photo", colors: ['#FAD0C4', '#A1E6E3'] },
    { title: "Enter Your Body Measurements", colors: ['#FAD0C4', '#A1E6E3'] },
    { title: "Shop without worry", colors: ['#000000', '#000000'], isLast: true }
];

const ROW_HEIGHT = 64;
const ROW_MARGIN = 20;
const TOTAL_DISTANCE = (ROW_HEIGHT + ROW_MARGIN) * 3;
const LINE_START = ROW_HEIGHT / 2;

const OnboardingScreen7 = ({ navigation }) => {
    const lineAnim = useRef(new Animated.Value(0)).current; 
    const popAnims = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;

    useEffect(() => {
        mixpanel.track('Onboarding screen viewed', { screen: 'OnboardingScreen7' });

        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'background') {
                mixpanel.track('Onboarding screen drop off screen', { screen: 'OnboardingScreen7' });
            }
        });

        Animated.sequence([
            Animated.delay(300),
            Animated.parallel([
                Animated.timing(lineAnim, {
                    toValue: 1,
                    duration: 1800,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: false,
                }),
                Animated.stagger(450, [
                    Animated.spring(popAnims[0], { toValue: 1, useNativeDriver: true, tension: 40, friction: 7 }),
                    Animated.spring(popAnims[1], { toValue: 1, useNativeDriver: true, tension: 40, friction: 7 }),
                    Animated.spring(popAnims[2], { toValue: 1, useNativeDriver: true, tension: 40, friction: 7 }),
                    Animated.spring(popAnims[3], { toValue: 1, useNativeDriver: true, tension: 40, friction: 7 }),
                ])
            ])
        ]).start();

        return () => subscription.remove();
    }, []);

    const handleContinue = () => {
        mixpanel.track('Onboarding step completed', { screen: 'OnboardingScreen7' });
        navigation.navigate('OnboardingScreen8');
    };

    return (
        <Container
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
                progress={0.292} initialProgress={0.25} nextProgress={0.333}
                title="My Fitting Room offers a total solution for shopping online."
                onBackPress={() => navigation.goBack()}
                containerStyle={{ paddingHorizontal: 0 }}
            />

            <View style={styles.content}>
                <View style={styles.listContainer}>
                    <View style={styles.lineTrack} />
                    
                    <Animated.View style={[
                        styles.animatedLineWrapper, 
                        { height: lineAnim.interpolate({ inputRange: [0, 1], outputRange: [0, TOTAL_DISTANCE] }) }
                    ]}>
                        <LinearGradient 
                            colors={['#00E5FF', '#FF00A8', '#FFD600', '#FF7A00', '#FFB8E0', '#FFB8E0']} 
                            style={{ width: 3, height: TOTAL_DISTANCE }} 
                        />
                    </Animated.View>

                    {STEPS.map((step, index) => {
                        const isLastItem = index === STEPS.length - 1;
                        return (
                            <View 
                                key={index} 
                                style={[
                                    styles.row, 
                                    { marginBottom: isLastItem ? 40 : ROW_MARGIN, zIndex: isLastItem ? 100 : 1 }
                                ]}
                            >
                                <View style={styles.dotContainer}>
                                    <Animated.View style={[
                                        styles.dot, 
                                        { 
                                            transform: [{ scale: popAnims[index] }],
                                            opacity: popAnims[index],
                                        }
                                    ]} />
                                </View>

                                <Animated.View style={[
                                    styles.cardContainer,
                                    {
                                        transform: [
                                            { scale: popAnims[index] },
                                            { translateY: popAnims[index].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }
                                        ],
                                        opacity: popAnims[index],
                                    }
                                ]}>
                                    {isLastItem ? (
                                        <View style={styles.blackCard}>
                                            <Text style={styles.cardText}>{step.title}</Text>
                                        </View>
                                    ) : (
                                        <LinearGradient
                                            colors={step.colors}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.gradientCard}
                                        >
                                            <View style={styles.cardInner}>
                                                <Text style={styles.cardText}>{step.title}</Text>
                                            </View>
                                        </LinearGradient>
                                    )}

                                    {isLastItem && (
                                        <Animated.View style={[
                                            styles.tooltip,
                                            {
                                                opacity: popAnims[index],
                                                transform: [
                                                    { scale: popAnims[index] },
                                                    { translateX: popAnims[index].interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }
                                                ]
                                            }
                                        ]}>
                                            <View style={styles.tooltipPill}>
                                                <Text style={styles.tooltipText}>
                                                    ✨ Time & Money Saved
                                                </Text>
                                            </View>
                                        </Animated.View>
                                    )}
                                </Animated.View>
                            </View>
                        );
                    })}
                </View>
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 10,
    },
    listContainer: {
        position: 'relative',
        width: '100%',
        paddingLeft: 10,
    },
    lineTrack: {
        position: 'absolute',
        top: LINE_START,
        left: 31,
        width: 3,
        height: TOTAL_DISTANCE,
        backgroundColor: '#F3F4F6',
    },
    animatedLineWrapper: {
        position: 'absolute',
        top: LINE_START,
        left: 31,
        width: 3,
        overflow: 'hidden',
        zIndex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: ROW_HEIGHT,
        overflow: 'visible',
    },
    dotContainer: {
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 14,
        height: 14,
        backgroundColor: '#000',
        borderRadius: 7,
    },
    cardContainer: {
        marginLeft: 12,
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'visible',
    },
    gradientCard: {
        padding: 1.5,
        borderRadius: 100,
        backgroundColor: '#FFF',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardInner: {
        backgroundColor: '#FFF',
        borderRadius: 100,
        paddingVertical: 12,
        paddingHorizontal: 24,
        minWidth: 200,
        alignItems: 'center',
    },
    blackCard: {
        backgroundColor: '#FFF',
        borderWidth: 1.5,
        borderColor: '#000',
        borderRadius: 100,
        paddingVertical: 12,
        paddingHorizontal: 24,
        minWidth: 200,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 4,
    },
    cardText: {
        fontFamily: FONTS.SATOSHI,
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
    tooltip: {
        position: 'absolute',
        right: -20,
        bottom: -25,
        zIndex: 999,
    },
    tooltipPill: {
        backgroundColor: '#000',
        borderRadius: 100,
        paddingVertical: 6,
        paddingHorizontal: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    tooltipText: {
        fontFamily: FONTS.SATOSHI,
        fontSize: 10,
        color: '#FFF',
        fontWeight: '700',
    }
});

export default OnboardingScreen7;
