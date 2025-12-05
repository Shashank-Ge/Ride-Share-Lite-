import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface AnimatedBackgroundProps {
    children?: React.ReactNode;
    style?: ViewStyle;
    gradient?: string[];
    animationDuration?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
    children,
    style,
    gradient,
    animationDuration = 8000,
}) => {
    const { theme } = useTheme();
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: animationDuration,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: animationDuration,
                    useNativeDriver: false,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, [animationDuration]);

    const defaultGradient = gradient || theme.gradients.hero;

    return (
        <LinearGradient
            colors={defaultGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, style]}
        >
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default AnimatedBackground;
