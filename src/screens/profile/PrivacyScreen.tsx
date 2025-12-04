import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PrivacyScreen = () => {
    const navigation = useNavigation();
    const [profileVisible, setProfileVisible] = useState(true);
    const [showPhone, setShowPhone] = useState(false);
    const [showEmail, setShowEmail] = useState(true);

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Coming Soon', 'Account deletion will be available soon.');
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile Visibility</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Public Profile</Text>
                            <Text style={styles.settingDesc}>Make your profile visible to others</Text>
                        </View>
                        <Switch
                            value={profileVisible}
                            onValueChange={setProfileVisible}
                            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Show Phone Number</Text>
                            <Text style={styles.settingDesc}>Display phone to ride participants</Text>
                        </View>
                        <Switch
                            value={showPhone}
                            onValueChange={setShowPhone}
                            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Show Email</Text>
                            <Text style={styles.settingDesc}>Display email to ride participants</Text>
                        </View>
                        <Switch
                            value={showEmail}
                            onValueChange={setShowEmail}
                            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data & Privacy</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Download My Data</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Privacy Policy</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Terms of Service</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dangerSection}>
                    <Text style={styles.sectionTitle}>Danger Zone</Text>

                    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                        <Text style={styles.deleteButtonText}>Delete Account</Text>
                    </TouchableOpacity>
                    <Text style={styles.deleteWarning}>
                        This will permanently delete your account and all associated data
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    backButton: { fontSize: 24, color: '#007AFF' },
    content: { flex: 1 },
    section: { backgroundColor: '#fff', marginTop: 20, paddingVertical: 8 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: '#999', paddingHorizontal: 20, paddingVertical: 8 },
    settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    settingInfo: { flex: 1, marginRight: 16 },
    settingLabel: { fontSize: 16, color: '#333', marginBottom: 2 },
    settingDesc: { fontSize: 13, color: '#666' },
    menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    menuText: { fontSize: 16, color: '#333' },
    menuArrow: { fontSize: 24, color: '#ccc' },
    dangerSection: { backgroundColor: '#fff', marginTop: 20, marginBottom: 40, paddingVertical: 16 },
    deleteButton: { backgroundColor: '#FF3B30', marginHorizontal: 20, padding: 16, borderRadius: 8, alignItems: 'center' },
    deleteButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
    deleteWarning: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
});

export default PrivacyScreen;
