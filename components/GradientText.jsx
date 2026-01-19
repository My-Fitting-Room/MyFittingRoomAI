import React from 'react';
import { Text } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const GradientText = ({ colors, style, children, start = { x: 0, y: 0 }, end = { x: 1, y: 0 } }) => {
    return (
        <MaskedView
            maskElement={
                <Text style={[style, { backgroundColor: 'transparent' }]}>
                    {children}
                </Text>
            }
        >
            <LinearGradient
                colors={colors}
                start={start}
                end={end}
            >
                <Text style={[style, { opacity: 0 }]}>
                    {children}
                </Text>
            </LinearGradient>
        </MaskedView>
    );
};

export default GradientText;
