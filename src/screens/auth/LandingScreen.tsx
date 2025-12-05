import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthStackNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';
import AnimatedBackground from '../../components/AnimatedBackground';

const LandingScreen = () => {
    const navigation = useNavigation<AuthStackNavigationProp>();
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: { flex: 1 },
        scrollContent: { flexGrow: 1 },
        hero: {
            padding: 40,
            paddingTop: 100,
            paddingBottom: 80,
            alignItems: 'center',
        },
        logo: { fontSize: 52, fontWeight: 'bold', color: '#fff', marginBottom: 16, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 10 },
        tagline: { fontSize: 18, color: '#fff', opacity: 0.95, marginBottom: 40, textAlign: 'center', paddingHorizontal: 20 },
        ctaButtons: { width: '100%', paddingHorizontal: 20, gap: 16 },
        secondaryButton: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: theme.borderRadius.lg,
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.5)',
        },
        secondaryButtonContent: {
            paddingVertical: 16,
            paddingHorizontal: 32,
            alignItems: 'center',
        },
        secondaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
        section: {
            padding: 24,
            marginTop: 2,
        },
        glassSection: {
            marginHorizontal: 16,
            marginVertical: 12,
        },
        glassSectionContent: {
            padding: 24,
        },
        sectionTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginBottom: 24, textAlign: 'center' },
        stepsContainer: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' },
        step: { alignItems: 'center', width: '30%', minWidth: 100, marginBottom: 16 },
        stepIcon: { fontSize: 52, marginBottom: 12 },
        stepTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
        stepText: { fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center' },
        features: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
        feature: {
            width: '48%',
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: theme.borderRadius.md,
        },
        featureIcon: { fontSize: 24, marginRight: 12 },
        featureText: { fontSize: 14, fontWeight: '600', color: theme.colors.text, flex: 1 },
        statsSection: {
            marginHorizontal: 16,
            marginVertical: 12,
        },
        statsSectionContent: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            padding: 32,
        },
        stat: { alignItems: 'center' },
        statNumber: { fontSize: 36, fontWeight: 'bold', marginBottom: 4 },
        statNumberGradient: {
            paddingHorizontal: 8,
        },
        statLabel: { fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center' },
        footer: { padding: 24, alignItems: 'center', paddingBottom: 40 },
        footerText: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 12 },
        footerLinks: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
        footerLink: { fontSize: 12, color: theme.colors.primary },
        footerDivider: { fontSize: 12, color: theme.colors.textTertiary },
    });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Hero Section with Animated Gradient Background */}
                <AnimatedBackground gradient={theme.gradients.hero}>
                    <View style={styles.hero}>
                        <Text style={styles.logo}>🚗 RideShare Lite</Text>
                        <Text style={styles.tagline}>Share rides, Save money, Make friends</Text>

                        <View style={styles.ctaButtons}>
                            <GradientButton
                                title="Get Started"
                                onPress={() => navigation.push('Signup')}
                                gradient={['#FFFFFF', '#F0F0F0']}
                                textStyle={{ color: theme.colors.primary }}
                                size="large"
                            />
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => navigation.push('Login')}
                            >
                                <View style={styles.secondaryButtonContent}>
                                    <Text style={styles.secondaryButtonText}>Login</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </AnimatedBackground>

                {/* How It Works */}
                <GlassCard style={styles.glassSection} intensity="medium">
                    <View style={styles.glassSectionContent}>
                        <Text style={styles.sectionTitle}>How It Works</Text>
                        <View style={styles.stepsContainer}>
                            <View style={styles.step}>
                                <Text style={styles.stepIcon}>🔍</Text>
                                <Text style={styles.stepTitle}>Search</Text>
                                <Text style={styles.stepText}>Find rides going your way</Text>
                            </View>
                            <View style={styles.step}>
                                <Text style={styles.stepIcon}>📱</Text>
                                <Text style={styles.stepTitle}>Book</Text>
                                <Text style={styles.stepText}>Reserve your seat instantly</Text>
                            </View>
                            <View style={styles.step}>
                                <Text style={styles.stepIcon}>🚗</Text>
                                <Text style={styles.stepTitle}>Ride</Text>
                                <Text style={styles.stepText}>Enjoy your journey!</Text>
                            </View>
                        </View>
                    </View>
                </GlassCard>

                {/* Features */}
                <GlassCard style={styles.glassSection} intensity="medium">
                    <View style={styles.glassSectionContent}>
                        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
                        <View style={styles.features}>
                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>✅</Text>
                                <Text style={styles.featureText}>Verified Drivers</Text>
                            </View>
                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>💬</Text>
                                <Text style={styles.featureText}>Real-time Chat</Text>
                            </View>
                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>🔔</Text>
                                <Text style={styles.featureText}>Instant Notifications</Text>
                            </View>
                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>⚡</Text>
                                <Text style={styles.featureText}>Instant Booking</Text>
                            </View>
                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>🗺️</Text>
                                <Text style={styles.featureText}>Route Maps</Text>
                            </View>
                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>⭐</Text>
                                <Text style={styles.featureText}>Rating System</Text>
                            </View>
                        </View>
                    </View>
                </GlassCard>

                {/* Stats */}
                <GlassCard style={styles.statsSection} intensity="strong">
                    <View style={styles.statsSectionContent}>
                        <View style={styles.stat}>
                            <LinearGradient
                                colors={theme.gradients.primary as any}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.statNumberGradient}
                            >
                                <Text style={[styles.statNumber, { color: '#fff' }]}>1000+</Text>
                            </LinearGradient>
                            <Text style={styles.statLabel}>Active Users</Text>
                        </View>
                        <View style={styles.stat}>
                            <LinearGradient
                                colors={theme.gradients.secondary as any}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.statNumberGradient}
                            >
                                <Text style={[styles.statNumber, { color: '#fff' }]}>500+</Text>
                            </LinearGradient>
                            <Text style={styles.statLabel}>Rides Shared</Text>
                        </View>
                        <View style={styles.stat}>
                            <LinearGradient
                                colors={theme.gradients.accent as any}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.statNumberGradient}
                            >
                                <Text style={[styles.statNumber, { color: '#fff' }]}>4.7⭐</Text>
                            </LinearGradient>
                            <Text style={styles.statLabel}>Average Rating</Text>
                        </View>
                    </View>
                </GlassCard>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2024 RideShare Lite. All rights reserved.</Text>
                    <View style={styles.footerLinks}>
                        <Text style={styles.footerLink}>About Us</Text>
                        <Text style={styles.footerDivider}>•</Text>
                        <Text style={styles.footerLink}>Contact</Text>
                        <Text style={styles.footerDivider}>•</Text>
                        <Text style={styles.footerLink}>Privacy</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default LandingScreen;
