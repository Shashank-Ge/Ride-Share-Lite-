import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { createBooking, updateRideSeats } from '../../services/database';

interface RouteParams {
    rideId: number;
    from: string;
    to: string;
    date: string;
    departureTime: string;
    price: number;
    driver: string;
    rating: number;
    seats: number;
    vehicle: string;
    instant?: boolean;
}

const RideDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { session } = useAuth();
    const params = route.params as RouteParams || {};

    // Booking state
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState(1);
    const [isBooking, setIsBooking] = useState(false);

    // Sample ride details - will be fetched from Supabase later
    const rideDetails = {
        id: params.rideId || 1,
        from: params.from || 'Delhi',
        to: params.to || 'Agra',
        date: params.date || 'Tomorrow',
        departureTime: params.departureTime || '09:00 AM',
        arrivalTime: '12:30 PM',
        duration: '3h 30m',
        distance: '230 km',
        price: params.price || 500,
        seats: params.seats || 3,
        instant: params.instant || true,

        // Driver info
        driver: {
            name: params.driver || 'Rahul Sharma',
            rating: params.rating || 4.8,
            totalRides: 156,
            verified: true,
            joinedDate: 'Member since 2022',
            bio: 'Experienced driver, love meeting new people!',
            preferences: {
                music: 'Yes',
                smoking: 'No',
                pets: 'Yes',
                chatty: 'Moderate',
            },
        },

        // Vehicle info
        vehicle: {
            make: params.vehicle || 'Honda City',
            color: 'White',
            year: 2020,
            ac: true,
            luggage: 'Medium',
        },

        // Route details
        route: {
            pickup: 'Connaught Place, Delhi',
            dropoff: 'Taj Mahal, Agra',
            stopovers: ['Faridabad', 'Mathura'],
        },

        // Booking info
        bookingType: params.instant ? 'Instant Booking' : 'Request to Book',
        cancellationPolicy: 'Free cancellation up to 24 hours before departure',
    };

    const handleBookRide = () => {
        // Check if user is logged in
        if (!session?.user?.id) {
            Alert.alert('Login Required', 'Please login to book a ride');
            return;
        }

        // Show booking modal
        setShowBookingModal(true);
    };

    const confirmBooking = async () => {
        setIsBooking(true);
        try {
            const totalPrice = rideDetails.price * selectedSeats;
            const bookingStatus = rideDetails.instant ? 'confirmed' : 'pending';

            // Create booking
            const booking = await createBooking({
                ride_id: String(rideDetails.id),
                passenger_id: session?.user?.id || '',
                seats_booked: selectedSeats,
                total_price: totalPrice,
                status: bookingStatus,
            });

            if (booking) {
                // Update available seats if instant booking
                if (rideDetails.instant) {
                    await updateRideSeats(String(rideDetails.id), selectedSeats);
                }

                setShowBookingModal(false);
                Alert.alert(
                    'Booking Successful! 🎉',
                    `Your ${bookingStatus === 'confirmed' ? 'booking is confirmed' : 'booking request has been sent'}!\n\nRoute: ${rideDetails.from} → ${rideDetails.to}\nSeats: ${selectedSeats}\nTotal: ₹${totalPrice}`,
                    [
                        {
                            text: 'View My Bookings',
                            onPress: () => navigation.navigate('MyRides'),
                        },
                        { text: 'OK' },
                    ]
                );
            } else {
                Alert.alert('Error', 'Failed to create booking. Please try again.');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            Alert.alert('Error', 'An error occurred while booking the ride.');
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                {/* Header Card */}
                <View style={styles.headerCard}>
                    <View style={styles.routeHeader}>
                        <View style={styles.routeInfo}>
                            <Text style={styles.location}>{rideDetails.from}</Text>
                            <View style={styles.routeLine}>
                                <View style={styles.routeDot} />
                                <View style={styles.line} />
                                <View style={[styles.routeDot, styles.routeDotEnd]} />
                            </View>
                            <Text style={styles.location}>{rideDetails.to}</Text>
                        </View>
                        <View style={styles.timeInfo}>
                            <Text style={styles.time}>{rideDetails.departureTime}</Text>
                            <Text style={styles.duration}>{rideDetails.duration}</Text>
                            <Text style={styles.time}>{rideDetails.arrivalTime}</Text>
                        </View>
                    </View>

                    <View style={styles.dateDistance}>
                        <Text style={styles.date}>📅 {rideDetails.date}</Text>
                        <Text style={styles.distance}>📍 {rideDetails.distance}</Text>
                    </View>

                    {rideDetails.instant && (
                        <View style={styles.instantBadge}>
                            <Text style={styles.instantText}>⚡ Instant Booking</Text>
                        </View>
                    )}
                </View>

                {/* Driver Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Driver</Text>
                    <View style={styles.driverCard}>
                        <View style={styles.driverHeader}>
                            <View style={styles.driverAvatar}>
                                <Text style={styles.driverInitial}>
                                    {rideDetails.driver.name.charAt(0)}
                                </Text>
                            </View>
                            <View style={styles.driverInfo}>
                                <View style={styles.driverNameRow}>
                                    <Text style={styles.driverName}>{rideDetails.driver.name}</Text>
                                    {rideDetails.driver.verified && (
                                        <Text style={styles.verifiedBadge}>✓ Verified</Text>
                                    )}
                                </View>
                                <Text style={styles.driverMeta}>
                                    ⭐ {rideDetails.driver.rating} • {rideDetails.driver.totalRides} rides
                                </Text>
                                <Text style={styles.driverJoined}>{rideDetails.driver.joinedDate}</Text>
                            </View>
                        </View>

                        {rideDetails.driver.bio && (
                            <Text style={styles.driverBio}>{rideDetails.driver.bio}</Text>
                        )}

                        {/* Driver Preferences */}
                        <View style={styles.preferences}>
                            <Text style={styles.preferencesTitle}>Preferences</Text>
                            <View style={styles.preferencesList}>
                                <View style={styles.preferenceItem}>
                                    <Text style={styles.preferenceIcon}>🎵</Text>
                                    <Text style={styles.preferenceText}>Music: {rideDetails.driver.preferences.music}</Text>
                                </View>
                                <View style={styles.preferenceItem}>
                                    <Text style={styles.preferenceIcon}>🚭</Text>
                                    <Text style={styles.preferenceText}>Smoking: {rideDetails.driver.preferences.smoking}</Text>
                                </View>
                                <View style={styles.preferenceItem}>
                                    <Text style={styles.preferenceIcon}>🐕</Text>
                                    <Text style={styles.preferenceText}>Pets: {rideDetails.driver.preferences.pets}</Text>
                                </View>
                                <View style={styles.preferenceItem}>
                                    <Text style={styles.preferenceIcon}>💬</Text>
                                    <Text style={styles.preferenceText}>Chatty: {rideDetails.driver.preferences.chatty}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Vehicle Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vehicle</Text>
                    <View style={styles.vehicleCard}>
                        <View style={styles.vehicleRow}>
                            <Text style={styles.vehicleInfo}>🚗 {rideDetails.vehicle.make}</Text>
                            <Text style={styles.vehicleInfo}>🎨 {rideDetails.vehicle.color}</Text>
                        </View>
                        <View style={styles.vehicleRow}>
                            <Text style={styles.vehicleInfo}>📅 {rideDetails.vehicle.year}</Text>
                            <Text style={styles.vehicleInfo}>
                                {rideDetails.vehicle.ac ? '❄️ AC' : '🌡️ Non-AC'}
                            </Text>
                        </View>
                        <Text style={styles.vehicleInfo}>🧳 Luggage: {rideDetails.vehicle.luggage}</Text>
                    </View>
                </View>

                {/* Pickup & Dropoff */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pickup & Dropoff</Text>
                    <View style={styles.locationCard}>
                        <View style={styles.locationItem}>
                            <View style={styles.locationDot} />
                            <View style={styles.locationDetails}>
                                <Text style={styles.locationLabel}>Pickup</Text>
                                <Text style={styles.locationAddress}>{rideDetails.route.pickup}</Text>
                            </View>
                        </View>

                        {rideDetails.route.stopovers.length > 0 && (
                            <View style={styles.stopovers}>
                                <Text style={styles.stopoverLabel}>Stopovers:</Text>
                                {rideDetails.route.stopovers.map((stop, index) => (
                                    <Text key={index} style={styles.stopoverText}>• {stop}</Text>
                                ))}
                            </View>
                        )}

                        <View style={styles.locationItem}>
                            <View style={[styles.locationDot, styles.locationDotEnd]} />
                            <View style={styles.locationDetails}>
                                <Text style={styles.locationLabel}>Dropoff</Text>
                                <Text style={styles.locationAddress}>{rideDetails.route.dropoff}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Booking Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Booking Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Booking Type:</Text>
                            <Text style={styles.infoValue}>{rideDetails.bookingType}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Available Seats:</Text>
                            <Text style={styles.infoValue}>{rideDetails.seats} seats</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Price per seat:</Text>
                            <Text style={[styles.infoValue, styles.priceText]}>₹{rideDetails.price}</Text>
                        </View>
                        <Text style={styles.cancellationPolicy}>{rideDetails.cancellationPolicy}</Text>
                    </View>
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Fixed Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Total Price</Text>
                    <Text style={styles.price}>₹{rideDetails.price}</Text>
                </View>
                <TouchableOpacity style={styles.bookButton} onPress={handleBookRide}>
                    <Text style={styles.bookButtonText}>
                        {rideDetails.instant ? '⚡ Book Now' : '📨 Request to Book'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Booking Modal */}
            <Modal
                visible={showBookingModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowBookingModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Seats</Text>
                        <Text style={styles.modalSubtitle}>
                            How many seats do you need?
                        </Text>

                        {/* Seat Selector */}
                        <View style={styles.seatSelector}>
                            <TouchableOpacity
                                style={styles.seatButton}
                                onPress={() => setSelectedSeats(Math.max(1, selectedSeats - 1))}
                            >
                                <Text style={styles.seatButtonText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.seatCount}>{selectedSeats}</Text>
                            <TouchableOpacity
                                style={styles.seatButton}
                                onPress={() => setSelectedSeats(Math.min(rideDetails.seats, selectedSeats + 1))}
                            >
                                <Text style={styles.seatButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.availableSeats}>
                            {rideDetails.seats} seats available
                        </Text>

                        {/* Price Summary */}
                        <View style={styles.priceSummary}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceRowLabel}>Price per seat</Text>
                                <Text style={styles.priceRowValue}>₹{rideDetails.price}</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceRowLabel}>Seats</Text>
                                <Text style={styles.priceRowValue}>× {selectedSeats}</Text>
                            </View>
                            <View style={[styles.priceRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>₹{rideDetails.price * selectedSeats}</Text>
                            </View>
                        </View>

                        {/* Booking Type Info */}
                        <View style={styles.bookingTypeInfo}>
                            <Text style={styles.bookingTypeText}>
                                {rideDetails.instant
                                    ? '⚡ Instant booking - Your seat will be confirmed immediately'
                                    : '📨 Request to book - Driver will review your request'}
                            </Text>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowBookingModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.confirmButton, isBooking && styles.confirmButtonDisabled]}
                                onPress={confirmBooking}
                                disabled={isBooking}
                            >
                                <Text style={styles.confirmButtonText}>
                                    {isBooking ? 'Booking...' : 'Confirm Booking'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    headerCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    routeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    routeInfo: {
        flex: 1,
    },
    location: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    routeLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    routeDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#007AFF',
    },
    routeDotEnd: {
        backgroundColor: '#34C759',
    },
    line: {
        flex: 1,
        height: 2,
        backgroundColor: '#ddd',
        marginHorizontal: 8,
    },
    timeInfo: {
        alignItems: 'flex-end',
    },
    time: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    duration: {
        fontSize: 14,
        color: '#666',
        marginVertical: 8,
    },
    dateDistance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    date: {
        fontSize: 14,
        color: '#666',
    },
    distance: {
        fontSize: 14,
        color: '#666',
    },
    instantBadge: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 12,
    },
    instantText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    section: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    driverCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    driverHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    driverAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    driverInitial: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    driverInfo: {
        flex: 1,
    },
    driverNameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    driverName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    verifiedBadge: {
        fontSize: 12,
        color: '#34C759',
        fontWeight: '600',
    },
    driverMeta: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    driverJoined: {
        fontSize: 12,
        color: '#999',
    },
    driverBio: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        fontStyle: 'italic',
    },
    preferences: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    preferencesTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    preferencesList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    preferenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    preferenceIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    preferenceText: {
        fontSize: 13,
        color: '#666',
    },
    vehicleCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    vehicleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    vehicleInfo: {
        fontSize: 14,
        color: '#666',
    },
    locationCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    locationItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    locationDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#007AFF',
        marginTop: 4,
        marginRight: 12,
    },
    locationDetails: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    locationAddress: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    stopovers: {
        marginLeft: 24,
        marginBottom: 16,
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: '#ddd',
    },
    stopoverLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    stopoverText: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    infoCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    priceText: {
        fontSize: 16,
        color: '#007AFF',
    },
    cancellationPolicy: {
        fontSize: 12,
        color: '#34C759',
        marginTop: 8,
        fontStyle: 'italic',
    },
    bottomBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    priceContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    priceLabel: {
        fontSize: 12,
        color: '#666',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    bookButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
        paddingBottom: 40,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
    },
    seatSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 12,
    },
    seatButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    seatButtonText: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
    },
    seatCount: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        minWidth: 60,
        textAlign: 'center',
    },
    availableSeats: {
        fontSize: 13,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    priceSummary: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priceRowLabel: {
        fontSize: 14,
        color: '#666',
    },
    priceRowValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 12,
        marginTop: 4,
        marginBottom: 0,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    bookingTypeInfo: {
        backgroundColor: '#E3F2FD',
        padding: 12,
        borderRadius: 8,
        marginBottom: 24,
    },
    bookingTypeText: {
        fontSize: 13,
        color: '#1976D2',
        textAlign: 'center',
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    confirmButton: {
        flex: 2,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#34C759',
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        backgroundColor: '#999',
        opacity: 0.6,
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    locationDotEnd: {
        backgroundColor: '#34C759',
    },
});

export default RideDetailsScreen;
