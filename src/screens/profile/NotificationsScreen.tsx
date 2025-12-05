import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';

const NotificationsScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [bookingUpdates, setBookingUpdates] = useState(true);
    const [rideReminders, setRideReminders] = useState(true);
    const [messages, setMessages] = useState(true);

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
        headerTitle: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text },
        backButton: { fontSize: 24, color: theme.colors.primary },
        content: { flex: 1 },
        section: { marginTop: 20, paddingVertical: 8 },
        sectionTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.textTertiary, paddingHorizontal: 20, paddingVertical: 8 },
        settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
        settingInfo: { flex: 1, marginRight: 16 },
        settingLabel: { fontSize: 16, color: theme.colors.text, marginBottom: 2 },
        settingDesc: { fontSize: 13, color: theme.colors.textSecondary },
    });

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
                <GlassCard style={styles.section} intensity="light">
                    <Text style={styles.sectionTitle}>Notification Channels</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Email Notifications</Text>
                            <Text style={styles.settingDesc}>Receive updates via email</Text>
                        </View>
                        <Switch
                            value={emailNotifications}
                            onValueChange={setEmailNotifications}
                            trackColor={{ false: theme.colors.borderLight, true: theme.colors.primary }}
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
                            trackColor={{ false: theme.colors.borderLight, true: theme.colors.primary }}
                        />
                    </View>
                </GlassCard>

                <GlassCard style={styles.section} intensity="light">
                    <Text style={styles.sectionTitle}>Notification Types</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingLabel}>Booking Updates</Text>
                            <Text style={styles.settingDesc}>Status changes, confirmations</Text>
                        </View>
                        <Switch
                            value={bookingUpdates}
                            onValueChange={setBookingUpdates}
                            trackColor={{ false: theme.colors.borderLight, true: theme.colors.primary }}
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
                            trackColor={{ false: theme.colors.borderLight, true: theme.colors.primary }}
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
                            trackColor={{ false: theme.colors.borderLight, true: theme.colors.primary }}
                        />
                    </View>
                </GlassCard>
            </ScrollView>
        </View>
    );
};

export default NotificationsScreen;
