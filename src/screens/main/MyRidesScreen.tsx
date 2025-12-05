import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Alert,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
    fetchPassengerBookings,
    fetchDriverBookings,
    fetchDriverRides,
    updateBookingStatus,
    restoreRideSeats,
    Booking,
    Ride,
} from '../../services/database';
import { sendBookingConfirmationNotification, sendBookingRejectedNotification } from '../../services/notifications';
import GlassCard from '../../components/GlassCard';

const MyRidesScreen = () => {
    const { session } = useAuth();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<'bookings' | 'rides' | 'requests'>('bookings');
    const [passengerBookings, setPassengerBookings] = useState<Booking[]>([]);
    const [driverBookings, setDriverBookings] = useState<Booking[]>([]);
    const [driverRides, setDriverRides] = useState<Ride[]>([]); // Published rides
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        if (!session?.user?.id) {
            console.log('❌ No user session found in MyRidesScreen');
            return;
        }

        console.log('📋 Loading MyRides data...');
        console.log('User ID:', session.user.id);
        console.log('Active tab:', activeTab);

        try {
            if (activeTab === 'bookings') {
                console.log('Fetching passenger bookings...');
                const bookings = await fetchPassengerBookings(session.user.id);
                console.log('Passenger bookings received:', bookings.length);
                setPassengerBookings(bookings);
            } else if (activeTab === 'rides') {
                console.log('Fetching driver published rides...');
                const rides = await fetchDriverRides(session.user.id);
                console.log('Driver rides received:', rides.length);
                setDriverRides(rides);
            } else {
                console.log('Fetching driver booking requests...');
                const bookings = await fetchDriverBookings(session.user.id);
                console.log('Driver booking requests received:', bookings.length);
                setDriverBookings(bookings);
            }
        } catch (error) {
            console.error('💥 Error loading MyRides data:', error);
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
                    style: 'default',
                    onPress: async () => {
                        try {
                            const result = await updateBookingStatus(booking.id, 'confirmed');

                            if (result) {
                                const ride = booking.ride as any;

                                try {
                                    await sendBookingConfirmationNotification({
                                        from: ride?.from_location || '',
                                        to: ride?.to_location || '',
                                        date: ride?.departure_date || '',
                                        time: ride?.departure_time || '',
                                    });
                                } catch (notifError) {
                                    console.log('Notification error:', notifError);
                                }

                                Alert.alert('Success', 'Booking accepted successfully!');
                                loadData();
                            } else {
                                Alert.alert('Error', 'Failed to accept booking.');
                            }
                        } catch (error) {
                            console.error('Error:', error);
                            Alert.alert('Error', 'An error occurred.');
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
            <GlassCard key={booking.id} style={styles.bookingCard} intensity="light">
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
            </GlassCard>
        );
    };

    const renderDriverBooking = (booking: Booking) => {
        const badge = getStatusBadge(booking.status);
        const ride = booking.ride as any;

        return (
            <GlassCard key={booking.id} style={styles.bookingCard} intensity="light">
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
                            style={styles.acceptButtonWrapper}
                            onPress={() => {
                                console.log('🔴 ACCEPT BUTTON CLICKED!');
                                handleAcceptBooking(booking);
                            }}
                        >
                            <LinearGradient
                                colors={theme.gradients.primary as any}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.acceptButton}
                            >
                                <Text style={styles.acceptButtonText}>Accept</Text>
                            </LinearGradient>
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
                        <LinearGradient
                            colors={theme.gradients.primary as any}
                            style={styles.messageButton}
                        >
                            <Text style={styles.messageButtonText}>💬 Message Passenger</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </GlassCard>
        );
    };

    const renderPublishedRide = (ride: Ride) => {
        return (
            <GlassCard key={ride.id} style={styles.bookingCard} intensity="light">
                <View style={styles.cardHeader}>
                    <View style={styles.routeInfo}>
                        <Text style={styles.route}>
                            {ride.from_location} → {ride.to_location}
                        </Text>
                        <Text style={styles.dateTime}>
                            {new Date(ride.departure_date).toLocaleDateString()} • {ride.departure_time}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: ride.status === 'active' ? '#34C759' : '#999' }]}>
                        <Text style={styles.statusText}>
                            {ride.status === 'active' ? '✓ Active' : '⊘ Inactive'}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardDetails}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Available Seats</Text>
                        <Text style={styles.detailValue}>{ride.available_seats}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Price per Seat</Text>
                        <Text style={styles.priceValue}>₹{ride.price_per_seat}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Booking Type</Text>
                        <Text style={styles.detailValue}>
                            {ride.instant_booking ? '⚡ Instant' : '📨 Request'}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => (navigation as any).navigate('RideDetails', {
                        rideId: ride.id,
                        from: ride.from_location,
                        to: ride.to_location,
                        date: new Date(ride.departure_date).toLocaleDateString(),
                        departureTime: ride.departure_time,
                        price: ride.price_per_seat,
                        seats: ride.available_seats,
                        instant: ride.instant_booking,
                    })}
                >
                    <Text style={styles.viewDetailsButtonText}>View Details</Text>
                </TouchableOpacity>
            </GlassCard>
        );
    };


    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        header: { padding: 20, paddingTop: 60, paddingBottom: 20 },
        headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
        tabContainer: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
        tab: { flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
        activeTab: { borderBottomColor: theme.colors.primary },
        tabText: { fontSize: 16, color: theme.colors.textSecondary, fontWeight: '500' },
        activeTabText: { color: theme.colors.primary, fontWeight: 'bold' },
        content: { flex: 1, padding: 16 },
        bookingCard: { marginBottom: 16 },
        cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
        routeInfo: { flex: 1 },
        route: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 4 },
        dateTime: { fontSize: 13, color: theme.colors.textSecondary },
        statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
        statusText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
        cardDetails: { marginBottom: 12, padding: 16 },
        detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
        detailLabel: { fontSize: 14, color: theme.colors.textSecondary },
        detailValue: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
        priceValue: { fontSize: 16, fontWeight: 'bold', color: theme.colors.primary },
        actionButtons: { flexDirection: 'row', gap: 12, padding: 16, paddingTop: 0 },
        rejectButton: { flex: 1, padding: 12, borderRadius: 8, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center' },
        rejectButtonText: { fontSize: 14, fontWeight: '600', color: theme.colors.error },
        acceptButtonWrapper: { flex: 1, borderRadius: 8, overflow: 'hidden' },
        acceptButton: { padding: 12, alignItems: 'center' },
        acceptButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
        cancelButton: { padding: 12, borderRadius: 8, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center', margin: 16, marginTop: 0 },
        cancelButtonText: { fontSize: 14, fontWeight: '600', color: theme.colors.error },
        messageButton: { padding: 12, borderRadius: 8, alignItems: 'center', margin: 16, marginTop: 0 },
        messageButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
        emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
        emptyIcon: { fontSize: 64, marginBottom: 16 },
        emptyTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
        emptyText: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', paddingHorizontal: 40 },
        viewDetailsButton: { padding: 12, borderRadius: 8, backgroundColor: theme.colors.primary, alignItems: 'center', margin: 16, marginTop: 0 },
        viewDetailsButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={theme.gradients.primary as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>My Rides</Text>
            </LinearGradient>

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
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'requests' && styles.activeTab]}
                    onPress={() => setActiveTab('requests')}
                >
                    <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>
                        Requests
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
                ) : activeTab === 'rides' ? (
                    driverRides.length > 0 ? (
                        driverRides.map(renderPublishedRide)
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>🚗</Text>
                            <Text style={styles.emptyTitle}>No Published Rides</Text>
                            <Text style={styles.emptyText}>
                                Rides you publish will appear here
                            </Text>
                        </View>
                    )
                ) : (
                    driverBookings.length > 0 ? (
                        driverBookings.map(renderDriverBooking)
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>📨</Text>
                            <Text style={styles.emptyTitle}>No Booking Requests</Text>
                            <Text style={styles.emptyText}>
                                Booking requests from passengers will appear here
                            </Text>
                        </View>
                    )
                )}
            </ScrollView>
        </View>
    );
};


export default MyRidesScreen;
