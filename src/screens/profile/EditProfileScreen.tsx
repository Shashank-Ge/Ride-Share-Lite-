import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { fetchProfile, updateProfile, Profile } from '../../services/database';
import GradientButton from '../../components/GradientButton';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        if (!user?.id) return;

        const profile = await fetchProfile(user.id);
        if (profile) {
            setFullName(profile.full_name || '');
            setPhone(profile.phone || '');
            setBio(profile.bio || '');
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Name is required');
            return;
        }

        setSaving(true);
        try {
            const result = await updateProfile(user!.id, {
                full_name: fullName,
                phone: phone || null,
                bio: bio || null,
            });

            if (result) {
                Alert.alert('Success', 'Profile updated successfully!');
                navigation.goBack();
            } else {
                Alert.alert('Error', 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
        headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
        cancelButton: { fontSize: 16, color: theme.colors.primary },
        saveButton: { fontSize: 16, color: theme.colors.primary, fontWeight: '600' },
        saveButtonDisabled: { color: theme.colors.textTertiary },
        content: { flex: 1, padding: 16 },
        inputGroup: { marginBottom: 24 },
        label: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
        input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: theme.colors.surface, color: theme.colors.text },
        textArea: { height: 100, textAlignVertical: 'top' },
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
                        {saving ? 'Saving...' : 'Save'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter your full name"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Enter your phone number"
                        keyboardType="phone-pad"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell us about yourself"
                        multiline
                        numberOfLines={4}
                        placeholderTextColor="#999"
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default EditProfileScreen;
