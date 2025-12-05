import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface GradientButtonProps {
    title: string;
    onPress: () => void;
    gradient?: string[];
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    size?: 'small' | 'medium' | 'large';
    icon?: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({
    title,
    onPress,
    gradient,
    disabled = false,
    loading = false,
    style,
    textStyle,
    size = 'medium',
    icon,
}) => {
    const { theme } = useTheme();
    const scaleAnim = new Animated.Value(1);

    const defaultGradient = gradient || theme.gradients.primary;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const sizeStyles = {
        small: {
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: theme.borderRadius.md,
        },
        medium: {
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: theme.borderRadius.lg,
        },
        large: {
            paddingVertical: 20,
            paddingHorizontal: 40,
            borderRadius: theme.borderRadius.xl,
        },
    };

    const textSizeStyles = {
        small: { fontSize: 14 },
        medium: { fontSize: 16 },
        large: { fontSize: 18 },
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                activeOpacity={0.8}
                style={[styles.container, style]}
            >
                <LinearGradient
                    colors={disabled ? ['#CCCCCC', '#999999'] : (defaultGradient as any)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.gradient,
                        sizeStyles[size],
                        theme.shadows.medium,
                    ]}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <>
                            {icon}
                            <Text
                                style={[
                                    styles.text,
                                    textSizeStyles[size],
                                    textStyle,
                                    icon ? { marginLeft: 8 } : undefined,
                                ]}
                            >
                                {title}
                            </Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'stretch',
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default GradientButton;
