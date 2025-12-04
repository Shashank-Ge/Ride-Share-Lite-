import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const SignupScreen = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();

    const handleSignup = async () => {
        // Debug: Show alert to confirm button is working
        console.log('Signup button pressed!');

        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (fullName.trim().length < 2) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        console.log('Starting signup process for:', email);
        setLoading(true);

        try {
            console.log('Calling signUp function...');
            await signUp(email, password, fullName);
            console.log('SignUp successful!');
            Alert.alert('Success', 'Account created! You can now login.');
        } catch (error: any) {
            console.error('Signup error:', error);
            console.error('Error message:', error.message);
            Alert.alert('Signup Failed', error.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
            console.log('Signup process completed');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join RideShare Lite today</Text>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="words"
                        editable={!loading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!loading}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        editable={!loading}
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
        marginTop: 60,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
    },
    form: {
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default SignupScreen;
