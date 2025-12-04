import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../../types/navigation';

const LandingScreen = () => {
    const navigation = useNavigation<AuthStackNavigationProp>();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to RideShare Lite</Text>
                <Text style={styles.subtitle}>Share rides, save money, reduce carbon footprint</Text>

                <View style={styles.features}>
                    <Text style={styles.feature}>🚗 Find rides near you</Text>
                    <Text style={styles.feature}>💰 Save on travel costs</Text>
                    <Text style={styles.feature}>🌱 Eco-friendly travel</Text>
                    <Text style={styles.feature}>👥 Meet new people</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={styles.primaryButtonText}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.secondaryButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007AFF',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    features: {
        alignItems: 'flex-start',
    },
    feature: {
        fontSize: 18,
        color: '#333',
        marginBottom: 16,
    },
    buttonContainer: {
        width: '100%',
        paddingBottom: 20,
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    secondaryButtonText: {
        color: '#007AFF',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default LandingScreen;
