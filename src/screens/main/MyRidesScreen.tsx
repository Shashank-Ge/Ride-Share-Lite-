import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import {
    fetchPassengerBookings,
    fetchDriverBookings,
    updateBookingStatus,
    restoreRideSeats,
    Booking,
} from '../../services/database';
import { sendBookingConfirmationNotification, sendBookingRejectedNotification } from '../../services/notifications';

const MyRidesScreen = () => {
    const { session } = useAuth();
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<'bookings' | 'rides'>('bookings');
    const [passengerBookings, setPassengerBookings] = useState<Booking[]>([]);
    const [driverBookings, setDriverBookings] = useState<Booking[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        if (!session?.user?.id) return;

        try {
            if (activeTab === 'bookings') {
                const bookings = await fetchPassengerBookings(session.user.id);
                setPassengerBookings(bookings);
            } else {
                const bookings = await fetchDriverBookings(session.user.id);
                setDriverBookings(bookings);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const handleAcceptBooking = async (booking: Booking) => {
        Alert.alert(
            'Accept Booking',
            `Accept booking from ${booking.passenger?.full_name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Accept',
                    onPress: async () => {
                        const result = await updateBookingStatus(booking.id, 'confirmed');
                        if (result) {
                            // Send notification to passenger
                            const ride = booking.ride as any;
                            await sendBookingConfirmationNotification({
                                from: ride?.from_location || '',
                                to: ride?.to_location || '',
                                date: ride?.departure_date || '',
                                time: ride?.departure_time || '',
                            });

                            Alert.alert('Success', 'Booking accepted!');
                            loadData();
                        }
                    },
                },
            ]
        );
    };

    const handleRejectBooking = async (booking: Booking) => {
        Alert.alert(
            'Reject Booking',
            `Reject booking from ${booking.passenger?.full_name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await updateBookingStatus(booking.id, 'rejected');
                        if (result) {
                            // Send notification to passenger
                            const ride = booking.ride as any;
                            await sendBookingRejectedNotification({
                                from: ride?.from_location || '',
                                to: ride?.to_location || '',
                                date: ride?.departure_date || '',
                            });

                            Alert.alert('Booking Rejected', 'The passenger has been notified.');
                            loadData();
                        }
                    },
                },
            ]
        );
    };

    const handleCancelBooking = async (booking: Booking) => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await updateBookingStatus(booking.id, 'cancelled');
                        if (result && booking.status === 'confirmed') {
                            // Restore seats if booking was confirmed
                            await restoreRideSeats(booking.ride_id, booking.seats_booked);
                        }
                        if (result) {
                            Alert.alert('Cancelled', 'Your booking has been cancelled.');
                            loadData();
                        }
                    },
                },
            ]
        );
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: { text: '⏳ Pending', color: '#FFA500' },
            confirmed: { text: '✓ Confirmed', color: '#34C759' },
            rejected: { text: '✗ Rejected', color: '#FF3B30' },
            cancelled: { text: '⊘ Cancelled', color: '#999' },
        };
        return badges[status as keyof typeof badges] || badges.pending;
    };

    const renderPassengerBooking = (booking: Booking) => {
        const badge = getStatusBadge(booking.status);
        const ride = booking.ride as any;

        return (
            <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.routeInfo}>
                        <Text style={styles.route}>
                            {ride?.from_location} → {ride?.to_location}
                        </Text>
                        <Text style={styles.dateTime}>
                            {new Date(ride?.departure_date).toLocaleDateString()} • {ride?.departure_time}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: badge.color }]}>
                        <Text style={styles.statusText}>{badge.text}</Text>
                    </View>
                </View>

                <View style={styles.cardDetails}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Driver</Text>
                        <Text style={styles.detailValue}>{ride?.driver?.full_name || 'Unknown'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Seats</Text>
                        <Text style={styles.detailValue}>{booking.seats_booked}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Total Price</Text>
                        <Text style={styles.priceValue}>₹{booking.total_price}</Text>
                    </View>
                </View>

                {booking.status === 'pending' && (
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => handleCancelBooking(booking)}
                    >
                        <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                    </TouchableOpacity>
                )}

                {booking.status === 'confirmed' && (
                    <TouchableOpacity
                        style={styles.messageButton}
                        onPress={() => (navigation as any).navigate('Chat', {
                            bookingId: booking.id,
                            otherUser: ride?.driver,
                            ride: ride,
                        })}
                    >
                        <Text style={styles.messageButtonText}>💬 Message Driver</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderDriverBooking = (booking: Booking) => {
        const badge = getStatusBadge(booking.status);
        const ride = booking.ride as any;

        return (
            <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.routeInfo}>
                        <Text style={styles.route}>
                            {ride?.from_location} → {ride?.to_location}
                        </Text>
                        <Text style={styles.dateTime}>
                            {new Date(ride?.departure_date).toLocaleDateString()} • {ride?.departure_time}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: badge.color }]}>
                        <Text style={styles.statusText}>{badge.text}</Text>
                    </View>
                </View>

                <View style={styles.cardDetails}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Passenger</Text>
                        <Text style={styles.detailValue}>{booking.passenger?.full_name || 'Unknown'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Seats Requested</Text>
                        <Text style={styles.detailValue}>{booking.seats_booked}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Amount</Text>
                        <Text style={styles.priceValue}>₹{booking.total_price}</Text>
                    </View>
                </View>

                {booking.status === 'pending' && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={styles.rejectButton}
                            onPress={() => handleRejectBooking(booking)}
                        >
                            <Text style={styles.rejectButtonText}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.acceptButton}
                            onPress={() => handleAcceptBooking(booking)}
                        >
                            <Text style={styles.acceptButtonText}>Accept</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {booking.status === 'confirmed' && (
                    <TouchableOpacity
                        style={styles.messageButton}
                        onPress={() => (navigation as any).navigate('Chat', {
                            bookingId: booking.id,
                            otherUser: booking.passenger,
                            ride: ride,
                        })}
                    >
                        <Text style={styles.messageButtonText}>💬 Message Passenger</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Rides</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'bookings' && styles.activeTab]}
                    onPress={() => setActiveTab('bookings')}
                >
                    <Text style={[styles.tabText, activeTab === 'bookings' && styles.activeTabText]}>
                        My Bookings
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'rides' && styles.activeTab]}
                    onPress={() => setActiveTab('rides')}
                >
                    <Text style={[styles.tabText, activeTab === 'rides' && styles.activeTabText]}>
                        My Rides
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {activeTab === 'bookings' ? (
                    passengerBookings.length > 0 ? (
                        passengerBookings.map(renderPassengerBooking)
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>🎫</Text>
                            <Text style={styles.emptyTitle}>No Bookings Yet</Text>
                            <Text style={styles.emptyText}>
                                Your booked rides will appear here
                            </Text>
                        </View>
                    )
                ) : driverBookings.length > 0 ? (
                    driverBookings.map(renderDriverBooking)
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyIcon}>🚗</Text>
                        <Text style={styles.emptyTitle}>No Ride Requests</Text>
                        <Text style={styles.emptyText}>
                            Booking requests for your published rides will appear here
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { backgroundColor: '#007AFF', padding: 20, paddingTop: 60, paddingBottom: 20 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
    tabContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
    tab: { flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    activeTab: { borderBottomColor: '#007AFF' },
    tabText: { fontSize: 16, color: '#666', fontWeight: '500' },
    activeTabText: { color: '#007AFF', fontWeight: 'bold' },
    content: { flex: 1, padding: 16 },
    bookingCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    routeInfo: { flex: 1 },
    route: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    dateTime: { fontSize: 13, color: '#666' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
    statusText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
    cardDetails: { marginBottom: 12 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    detailLabel: { fontSize: 14, color: '#666' },
    detailValue: { fontSize: 14, fontWeight: '600', color: '#333' },
    priceValue: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
    actionButtons: { flexDirection: 'row', gap: 12 },
    rejectButton: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#f0f0f0', alignItems: 'center' },
    rejectButtonText: { fontSize: 14, fontWeight: '600', color: '#FF3B30' },
    acceptButton: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#34C759', alignItems: 'center' },
    acceptButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
    cancelButton: { padding: 12, borderRadius: 8, backgroundColor: '#f0f0f0', alignItems: 'center' },
    cancelButtonText: { fontSize: 14, fontWeight: '600', color: '#FF3B30' },
    messageButton: { padding: 12, borderRadius: 8, backgroundColor: '#007AFF', alignItems: 'center', marginTop: 8 },
    messageButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
    emptyIcon: { fontSize: 64, marginBottom: 16 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    emptyText: { fontSize: 14, color: '#666', textAlign: 'center', paddingHorizontal: 40 },
});

export default MyRidesScreen;
