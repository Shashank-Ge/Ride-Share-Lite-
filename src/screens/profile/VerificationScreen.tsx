import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';

const VerificationScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
        headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
        backButton: { fontSize: 24, color: theme.colors.primary },
        content: { flex: 1, padding: 16 },
        statusCard: { padding: 24, alignItems: 'center', marginBottom: 24 },
        statusIcon: { fontSize: 48, marginBottom: 12 },
        statusTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
        statusText: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center' },
        section: { padding: 16, marginBottom: 16 },
        sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 12 },
        benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
        benefitIcon: { fontSize: 18, color: theme.colors.success, marginRight: 12 },
        benefitText: { fontSize: 14, color: theme.colors.text, flex: 1 },
        infoText: { fontSize: 14, color: theme.colors.textSecondary, lineHeight: 22 },
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Verification</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView style={styles.content}>
                <GlassCard style={styles.statusCard} intensity="light">
                    <Text style={styles.statusIcon}>⏳</Text>
                    <Text style={styles.statusTitle}>Not Verified</Text>
                    <Text style={styles.statusText}>
                        Complete verification to build trust with other users
                    </Text>
                </GlassCard>

                <GlassCard style={styles.section} intensity="light">
                    <Text style={styles.sectionTitle}>Verification Benefits</Text>
                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>✓</Text>
                        <Text style={styles.benefitText}>Verified badge on your profile</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>✓</Text>
                        <Text style={styles.benefitText}>Increased trust from other users</Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>✓</Text>
                        <Text style={styles.benefitText}>Higher booking acceptance rate</Text>
                    </View>
                </GlassCard>

                <GlassCard style={styles.section} intensity="light">
                    <Text style={styles.sectionTitle}>Required Documents</Text>
                    <Text style={styles.infoText}>
                        • Government-issued ID (Driver's License, Passport, etc.){'\n'}
                        • Clear photo of your face{'\n'}
                        • Proof of address (optional)
                    </Text>
                </GlassCard>

                <GradientButton
                    title="📤 Upload Documents"
                    onPress={() => { }}
                    disabled={true}
                    size="large"
                    style={{ margin: 16, marginTop: 8 }}
                />
            </ScrollView>
        </View>
    );
};

export default VerificationScreen;
