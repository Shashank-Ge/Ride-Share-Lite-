import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen = () => {
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        console.log('Logout button pressed');

        // Use native confirm for web, which works better than Alert.alert
        const confirmed = Platform.OS === 'web'
            ? window.confirm('Are you sure you want to logout?')
            : true; // On mobile, we'll handle this differently if needed

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

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                    <Text style={styles.email}>{user?.email || 'No email'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Verification</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Payment Methods</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Notifications</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>Privacy</Text>
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
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 60,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 20,
        paddingVertical: 8,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    menuItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        backgroundColor: '#fff',
        marginTop: 20,
        padding: 16,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 16,
        color: '#FF3B30',
        fontWeight: '600',
    },
});

export default ProfileScreen;
