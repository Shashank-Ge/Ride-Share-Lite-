import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { fetchProfile, Profile } from '../../services/database';

const ProfileScreen = () => {
    const { user, signOut } = useAuth();
    const navigation = useNavigation();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, [user]);

    const loadProfile = async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        const profileData = await fetchProfile(user.id);
        setProfile(profileData);
        setLoading(false);
    };

    const handleLogout = async () => {
        console.log('Logout button pressed');

        const confirmed = Platform.OS === 'web'
            ? window.confirm('Are you sure you want to logout?')
            : true;

        if (!confirmed) {
            console.log('Logout cancelled');
            return;
        }

        try {
            console.log('User confirmed logout, calling signOut...');
            await signOut();
            console.log('SignOut completed successfully');
        } catch (error: any) {
            console.error('Logout error:', error);
            if (Platform.OS === 'web') {
                window.alert('Error: ' + (error.message || 'Failed to logout'));
            }
        }
    };

    const getInitials = () => {
        if (profile?.full_name) {
            return profile.full_name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return user?.email?.charAt(0).toUpperCase() || 'U';
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{getInitials()}</Text>
                    </View>
                    <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
                    <Text style={styles.email}>{user?.email || 'No email'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => (navigation as any).navigate('EditProfile')}
                    >
                        <Text style={styles.menuText}>Edit Profile</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => (navigation as any).navigate('Verification')}
                    >
                        <Text style={styles.menuText}>Verification</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Payment Methods</Text>
                        <Text style={styles.menuSubtext}>Coming soon</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => (navigation as any).navigate('Notifications')}
                    >
                        <Text style={styles.menuText}>Notifications</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => (navigation as any).navigate('Privacy')}
                    >
                        <Text style={styles.menuText}>Privacy</Text>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    scrollContent: { paddingBottom: 20 },
    header: { backgroundColor: '#fff', padding: 20, paddingTop: 60, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
    name: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    email: { fontSize: 14, color: '#666' },
    section: { backgroundColor: '#fff', marginTop: 20, paddingVertical: 8 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: '#999', paddingHorizontal: 20, paddingVertical: 8 },
    menuItem: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    menuText: { fontSize: 16, color: '#333' },
    menuArrow: { fontSize: 24, color: '#ccc' },
    menuSubtext: { fontSize: 12, color: '#999', fontStyle: 'italic' },
    logoutButton: { backgroundColor: '#fff', marginTop: 20, padding: 16, alignItems: 'center' },
    logoutText: { fontSize: 16, color: '#FF3B30', fontWeight: '600' },
});

export default ProfileScreen;
