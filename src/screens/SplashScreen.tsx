import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = () => {
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    console.log('💫 [SplashScreen] Rendering splash screen...');

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        gradient: {
            flex: 1,
            width: '100%',
        },
        content: {
            alignItems: 'center',
        },
        logoContainer: {
            marginBottom: 16,
        },
        logo: {
            fontSize: 72,
        },
        title: {
            fontSize: 40,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 8,
            textShadowColor: 'rgba(0,0,0,0.3)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 10,
        },
        subtitle: {
            fontSize: 18,
            color: '#fff',
            opacity: 0.9,
            marginBottom: 40,
        },
        loader: {
            marginTop: 20,
        },
    });

    return (
        <LinearGradient
            colors={['#667eea', '#764ba2', '#f093fb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
        >
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>🚗</Text>
                    </View>
                    <Text style={styles.title}>RideShare Lite</Text>
                    <Text style={styles.subtitle}>Your Carpooling Companion</Text>
                    <ActivityIndicator size="large" color="#fff" style={styles.loader} />
                </Animated.View>
            </View>
        </LinearGradient>
    );
};

export default SplashScreen;
