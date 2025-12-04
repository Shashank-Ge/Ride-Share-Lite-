import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NotificationsScreen = () => {
    const navigation = useNavigation();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [bookingUpdates, setBookingUpdates] = useState(true);
    const [rideReminders, setRideReminders] = useState(true);
    const [messages, setMessages] = useState(true);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>‹ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notification Channels</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Email Notifications</Text>
                            <Text style={styles.settingDesc}>Receive updates via email</Text>
                        </View>
                        <Switch
                            value={emailNotifications}
                            onValueChange={setEmailNotifications}
                            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Push Notifications</Text>
                            <Text style={styles.settingDesc}>Receive push notifications</Text>
                        </View>
                        <Switch
                            value={pushNotifications}
                            onValueChange={setPushNotifications}
                            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notification Types</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Booking Updates</Text>
                            <Text style={styles.settingDesc}>Status changes, confirmations</Text>
                        </View>
                        <Switch
                            value={bookingUpdates}
                            onValueChange={setBookingUpdates}
                            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Ride Reminders</Text>
                            <Text style={styles.settingDesc}>Upcoming ride notifications</Text>
                        </View>
                        <Switch
                            value={rideReminders}
                            onValueChange={setRideReminders}
                            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Messages</Text>
                            <Text style={styles.settingDesc}>New message notifications</Text>
                        </View>
                        <Switch
                            value={messages}
                            onValueChange={setMessages}
                            trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    backButton: { fontSize: 24, color: '#007AFF' },
    content: { flex: 1 },
    section: { backgroundColor: '#fff', marginTop: 20, paddingVertical: 8 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: '#999', paddingHorizontal: 20, paddingVertical: 8 },
    settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    settingInfo: { flex: 1, marginRight: 16 },
    settingLabel: { fontSize: 16, color: '#333', marginBottom: 2 },
    settingDesc: { fontSize: 13, color: '#666' },
});

export default NotificationsScreen;
