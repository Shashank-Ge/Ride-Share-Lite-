import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../../types/navigation';

const LandingScreen = () => {
    const navigation = useNavigation<AuthStackNavigationProp>();

    return (
        <ScrollView style={styles.container}>
            {/* Hero Section */}
            <View style={styles.hero}>
                <Text style={styles.logo}>🚗 RideShare Lite</Text>
                <Text style={styles.tagline}>Share rides, Save money, Make friends</Text>

                <View style={styles.ctaButtons}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.push('Signup')}
                    >
                        <Text style={styles.primaryButtonText}>Get Started</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.push('Login')}
                    >
                        <Text style={styles.secondaryButtonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* How It Works */}
            <View style={styles.section}>
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

            {/* Features */}
            <View style={styles.section}>
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

            {/* Stats */}
            <View style={styles.statsSection}>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>1000+</Text>
                    <Text style={styles.statLabel}>Active Users</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>500+</Text>
                    <Text style={styles.statLabel}>Rides Shared</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>4.7⭐</Text>
                    <Text style={styles.statLabel}>Average Rating</Text>
                </View>
            </View>

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
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    hero: { backgroundColor: '#007AFF', padding: 40, paddingTop: 80, paddingBottom: 60, alignItems: 'center' },
    logo: { fontSize: 48, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
    tagline: { fontSize: 18, color: '#fff', opacity: 0.9, marginBottom: 32, textAlign: 'center', paddingHorizontal: 20 },
    ctaButtons: { flexDirection: 'row', gap: 16, flexWrap: 'wrap', justifyContent: 'center' },
    primaryButton: { backgroundColor: '#fff', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 25, minWidth: 140 },
    primaryButtonText: { color: '#007AFF', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    secondaryButton: { backgroundColor: 'transparent', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 25, borderWidth: 2, borderColor: '#fff', minWidth: 140 },
    secondaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    section: { padding: 24, backgroundColor: '#fff', marginTop: 2 },
    sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 24, textAlign: 'center' },
    stepsContainer: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' },
    step: { alignItems: 'center', width: '30%', minWidth: 100, marginBottom: 16 },
    stepIcon: { fontSize: 48, marginBottom: 12 },
    stepTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    stepText: { fontSize: 13, color: '#666', textAlign: 'center' },
    features: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
    feature: { width: '48%', flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#f5f5f5', borderRadius: 12 },
    featureIcon: { fontSize: 24, marginRight: 12 },
    featureText: { fontSize: 14, fontWeight: '600', color: '#333', flex: 1 },
    statsSection: { flexDirection: 'row', justifyContent: 'space-around', padding: 32, backgroundColor: '#fff', marginTop: 2 },
    stat: { alignItems: 'center' },
    statNumber: { fontSize: 32, fontWeight: 'bold', color: '#007AFF', marginBottom: 4 },
    statLabel: { fontSize: 13, color: '#666', textAlign: 'center' },
    footer: { padding: 24, alignItems: 'center', backgroundColor: '#fff', marginTop: 2, paddingBottom: 40 },
    footerText: { fontSize: 12, color: '#666', marginBottom: 12 },
    footerLinks: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    footerLink: { fontSize: 12, color: '#007AFF' },
    footerDivider: { fontSize: 12, color: '#999' },
});

export default LandingScreen;
