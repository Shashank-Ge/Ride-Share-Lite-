import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';
import AnimatedBackground from '../../components/AnimatedBackground';

const SignupScreen = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const { theme } = useTheme();

    const handleSignup = async () => {
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

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            padding: 20,
            paddingTop: 60,
            justifyContent: 'center',
        },
        header: {
            alignItems: 'center',
            marginBottom: 32,
        },
        title: {
            fontSize: 36,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 8,
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 10,
        },
        subtitle: {
            fontSize: 16,
            color: '#fff',
            opacity: 0.9,
        },
        formCard: {
            marginTop: 20,
        },
        formContent: {
            padding: 24,
        },
        inputContainer: {
            marginBottom: 16,
        },
        label: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
        },
        input: {
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.md,
            padding: 16,
            fontSize: 16,
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
        },
        buttonContainer: {
            marginTop: 24,
        },
    });

    return (
        <AnimatedBackground gradient={theme.gradients.hero}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join RideShare Lite today</Text>
                    </View>

                    <GlassCard style={styles.formCard} intensity="strong">
                        <View style={styles.formContent}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                    editable={!loading}
                                    placeholderTextColor={theme.colors.textTertiary}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    editable={!loading}
                                    placeholderTextColor={theme.colors.textTertiary}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    editable={!loading}
                                    placeholderTextColor={theme.colors.textTertiary}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Confirm Password</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    editable={!loading}
                                    placeholderTextColor={theme.colors.textTertiary}
                                />
                            </View>

                            <View style={styles.buttonContainer}>
                                <GradientButton
                                    title={loading ? 'Creating Account...' : 'Sign Up'}
                                    onPress={handleSignup}
                                    loading={loading}
                                    disabled={loading}
                                    size="large"
                                />
                            </View>
                        </View>
                    </GlassCard>
                </ScrollView>
            </KeyboardAvoidingView>
        </AnimatedBackground>
    );
};

export default SignupScreen;
