import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PublishScreen = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Publish a Ride</Text>
            <Text style={styles.subtitle}>Offer a ride to passengers</Text>
            <Text style={styles.placeholder}>Publish ride functionality coming soon...</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
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

export default PublishScreen;
