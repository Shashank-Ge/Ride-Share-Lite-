import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: 'light' | 'medium' | 'strong';
    borderRadius?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    style,
    intensity = 'medium',
    borderRadius,
}) => {
    const { theme } = useTheme();
    const glassStyle = theme.glass[intensity];

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: glassStyle.backgroundColor,
                    borderColor: glassStyle.borderColor,
                    borderRadius: borderRadius || theme.borderRadius.lg,
                    borderWidth: 1,
                    ...theme.shadows.medium,
                },
                Platform.OS === 'web' && {
                    backdropFilter: `blur(${glassStyle.blur}px)`,
                    WebkitBackdropFilter: `blur(${glassStyle.blur}px)`,
                } as any,
                style,
            ]}
        >
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
});

export default GlassCard;
