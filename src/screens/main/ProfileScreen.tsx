import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { fetchProfile, Profile } from '../../services/database';
import ReviewCard from '../../components/ReviewCard';
import GlassCard from '../../components/GlassCard';

// Hardcoded reviews for demonstration
const MOCK_REVIEWS = [
    {
        id: '1',
        reviewer_name: 'John Doe',
        rating: 5,
        review_text: 'Great driver! Very punctual and friendly. Smooth ride all the way.',
        created_at: '2024-12-01',
    },
    {
        id: '2',
        reviewer_name: 'Jane Smith',
        rating: 4,
        review_text: 'Good experience overall. Would ride again!',
        created_at: '2024-11-28',
    },
    {
        id: '3',
        reviewer_name: 'Mike Johnson',
        rating: 5,
        review_text: 'Excellent! Clean car and safe driving.',
        created_at: '2024-11-25',
    },
];

const ProfileScreen = () => {
    const { user, signOut } = useAuth();
    const { theme, isDark, toggleTheme } = useTheme();
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

        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('User confirmed logout, calling signOut...');
                            await signOut();
                            console.log('SignOut completed successfully');
                        } catch (error: any) {
                            console.error('Logout error:', error);
                            Alert.alert('Error', error.message || 'Failed to logout');
                        }
                    },
                },
            ]
        );
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

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        scrollContent: { paddingBottom: 20 },
        header: {
            padding: 20,
            paddingTop: 60,
            alignItems: 'center',
            paddingBottom: 30,
        },
        avatarContainer: {
            marginBottom: 16,
        },
        avatar: {
            width: 90,
            height: 90,
            borderRadius: 45,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: theme.colors.primary,
        },
        avatarText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
        name: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: 4 },
        email: { fontSize: 14, color: theme.colors.textSecondary },
        section: { marginTop: 20, paddingHorizontal: 16 },
        sectionTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.textTertiary,
            paddingHorizontal: 4,
            paddingVertical: 12,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        glassCard: {
            marginBottom: 12,
            overflow: 'hidden',
        },
        menuItem: {
            paddingVertical: 16,
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        menuItemWithBorder: {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.borderLight,
        },
        menuText: { fontSize: 16, color: theme.colors.text, fontWeight: '500' },
        menuArrow: { fontSize: 24, color: theme.colors.textTertiary },
        menuSubtext: { fontSize: 12, color: theme.colors.textTertiary, fontStyle: 'italic' },
        themeToggleContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        themeToggleLabel: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        themeIcon: {
            fontSize: 20,
            marginRight: 8,
        },
        ratingOverview: {
            alignItems: 'center',
            marginBottom: 16,
            paddingVertical: 20,
            borderRadius: theme.borderRadius.lg,
        },
        averageRating: { fontSize: 36, fontWeight: 'bold', color: theme.colors.text, marginBottom: 4 },
        ratingSubtext: { fontSize: 14, color: theme.colors.textSecondary },
        logoutButton: {
            marginHorizontal: 16,
            marginTop: 20,
            borderRadius: theme.borderRadius.lg,
            overflow: 'hidden',
        },
        logoutGradient: {
            padding: 18,
            alignItems: 'center',
            ...theme.shadows.medium,
        },
        logoutText: { fontSize: 16, color: '#fff', fontWeight: '600' },
    });

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header with Gradient */}
                <LinearGradient
                    colors={theme.gradients.primary as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <View style={styles.avatarContainer}>
                        <LinearGradient
                            colors={theme.gradients.accent as any}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.avatar}
                        >
                            <Text style={styles.avatarText}>{getInitials()}</Text>
                        </LinearGradient>
                    </View>
                    <Text style={styles.name}>{profile?.full_name || 'User'}</Text>
                    <Text style={styles.email}>{user?.email || 'No email'}</Text>
                </LinearGradient>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <GlassCard style={styles.glassCard} intensity="medium">
                        <TouchableOpacity
                            style={[styles.menuItem, styles.menuItemWithBorder]}
                            onPress={() => (navigation as any).navigate('EditProfile')}
                        >
                            <Text style={styles.menuText}>Edit Profile</Text>
                            <Text style={styles.menuArrow}>›</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.menuItem, styles.menuItemWithBorder]}
                            onPress={() => (navigation as any).navigate('Verification')}
                        >
                            <Text style={styles.menuText}>Verification</Text>
                            <Text style={styles.menuArrow}>›</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem}>
                            <Text style={styles.menuText}>Payment Methods</Text>
                            <Text style={styles.menuSubtext}>Coming soon</Text>
                        </TouchableOpacity>
                    </GlassCard>
                </View>

                {/* Preferences Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <GlassCard style={styles.glassCard} intensity="medium">
                        {/* Theme Toggle */}
                        <View style={[styles.menuItem, styles.menuItemWithBorder]}>
                            <View style={styles.themeToggleContainer}>
                                <View style={styles.themeToggleLabel}>
                                    <Text style={styles.themeIcon}>{isDark ? '🌙' : '☀️'}</Text>
                                    <Text style={styles.menuText}>
                                        {isDark ? 'Dark Mode' : 'Light Mode'}
                                    </Text>
                                </View>
                                <Switch
                                    value={isDark}
                                    onValueChange={toggleTheme}
                                    trackColor={{ false: theme.colors.borderLight, true: theme.colors.primary }}
                                    thumbColor={isDark ? theme.colors.primaryLight : '#f4f3f4'}
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[styles.menuItem, styles.menuItemWithBorder]}
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
                    </GlassCard>
                </View>

                {/* Reviews Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Reviews ({MOCK_REVIEWS.length})</Text>
                    <GlassCard style={styles.glassCard} intensity="medium">
                        <View style={styles.ratingOverview}>
                            <Text style={styles.averageRating}>4.7 ⭐</Text>
                            <Text style={styles.ratingSubtext}>Based on {MOCK_REVIEWS.length} reviews</Text>
                        </View>
                    </GlassCard>
                    {MOCK_REVIEWS.map(review => (
                        <ReviewCard key={review.id} {...review} />
                    ))}
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <LinearGradient
                        colors={['#FF3B30', '#FF6B6B'] as any}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.logoutGradient}
                    >
                        <Text style={styles.logoutText}>Logout</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;
