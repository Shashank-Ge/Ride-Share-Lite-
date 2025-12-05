import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';
import AnimatedBackground from '../../components/AnimatedBackground';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const { theme } = useTheme();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
            // Navigation will be handled automatically by auth state change
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            padding: 20,
            paddingTop: 80,
            justifyContent: 'center',
        },
        header: {
            alignItems: 'center',
            marginBottom: 40,
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
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Login to continue your journey</Text>
                    </View>

                    <GlassCard style={styles.formCard} intensity="strong">
                        <View style={styles.formContent}>
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

                            <View style={styles.buttonContainer}>
                                <GradientButton
                                    title={loading ? 'Logging in...' : 'Login'}
                                    onPress={handleLogin}
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

export default LoginScreen;
