import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const VerificationScreen = () => {
    const navigation = useNavigation();

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
                <View style={styles.statusCard}>
                    <Text style={styles.statusIcon}>⏳</Text>
                    <Text style={styles.statusTitle}>Not Verified</Text>
                    <Text style={styles.statusText}>
                        Complete verification to build trust with other users
                    </Text>
                </View>

                <View style={styles.section}>
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
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Required Documents</Text>
                    <Text style={styles.infoText}>
                        • Government-issued ID (Driver's License, Passport, etc.){'\n'}
                        • Clear photo of your face{'\n'}
                        • Proof of address (optional)
                    </Text>
                </View>

                <TouchableOpacity style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>📤 Upload Documents</Text>
                    <Text style={styles.uploadSubtext}>Coming soon</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    backButton: { fontSize: 24, color: '#007AFF' },
    content: { flex: 1, padding: 16 },
    statusCard: { backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center', marginBottom: 24 },
    statusIcon: { fontSize: 48, marginBottom: 12 },
    statusTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    statusText: { fontSize: 14, color: '#666', textAlign: 'center' },
    section: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
    benefitItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    benefitIcon: { fontSize: 18, color: '#34C759', marginRight: 12 },
    benefitText: { fontSize: 14, color: '#333', flex: 1 },
    infoText: { fontSize: 14, color: '#666', lineHeight: 22 },
    uploadButton: { backgroundColor: '#007AFF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
    uploadButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
    uploadSubtext: { fontSize: 12, color: '#fff', opacity: 0.8 },
});

export default VerificationScreen;
