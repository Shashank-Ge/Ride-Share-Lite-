import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MyRidesScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Rides</Text>
            <Text style={styles.subtitle}>Manage your bookings and offers</Text>
            <Text style={styles.placeholder}>My rides functionality coming soon...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    placeholder: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
});

export default MyRidesScreen;
