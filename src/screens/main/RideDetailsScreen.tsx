import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { createBooking, updateRideSeats, fetchRideById, Ride } from '../../services/database';
import MapView from '../../components/maps/MapView';
import { sendBookingConfirmationNotification, scheduleRideReminder } from '../../services/notifications';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';
import { getCityCoordinates, extractCityName } from '../../utils/cityCoordinates';

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
    const { theme } = useTheme();
    const params = route.params as RouteParams || {};

    // State
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedSeats, setSelectedSeats] = useState(1);
    const [isBooking, setIsBooking] = useState(false);
    const [rideData, setRideData] = useState<Ride | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch ride data from database
    useEffect(() => {
        const loadRideData = async () => {
            if (params.rideId) {
                setLoading(true);
                const data = await fetchRideById(params.rideId.toString());
                setRideData(data);
                setLoading(false);
            } else {
                setLoading(false);
            }
        };
        loadRideData();
    }, [params.rideId]);

    // Show loading state
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={{ marginTop: 16, color: theme.colors.text }}>Loading ride details...</Text>
            </View>
        );
    }

    // Prepare ride details from fetched data or params
    const rideDetails = rideData ? {
        id: rideData.id,
        from: rideData.from_location,
        to: rideData.to_location,
        date: new Date(rideData.departure_date).toLocaleDateString(),
        departureTime: rideData.departure_time,
        arrivalTime: '12:30 PM', // Calculate from duration if available
        duration: rideData.route_duration ? `${Math.floor(rideData.route_duration / 60)}h ${rideData.route_duration % 60}m` : 'N/A',
        distance: rideData.route_distance ? `${rideData.route_distance.toFixed(0)} km` : 'N/A',
        price: rideData.price_per_seat,
        seats: rideData.available_seats,
        instant: rideData.instant_booking,
        routeGeometry: rideData.route_geometry,
        stopovers: rideData.stopovers || [],

        // Driver info
        driver: {
            name: rideData.driver?.full_name || 'Unknown',
            rating: 4.8, // TODO: Fetch from reviews
            totalRides: 156, // TODO: Fetch from database
            verified: true,
            joinedDate: 'Member since 2022',
            bio: rideData.driver?.bio || 'Experienced driver',
            preferences: {
                music: 'Yes',
                smoking: 'No',
                pets: 'Yes',
                chatty: 'Moderate',
            },
        },

        // Vehicle info
        vehicle: {
            make: rideData.vehicle_make || 'Car',
            model: rideData.vehicle_model || '',
            color: rideData.vehicle_color || 'White',
            year: 2020,
            ac: true,
            luggage: 'Medium',
        },

        // Route details
        route: {
            pickup: rideData.from_location,
            dropoff: rideData.to_location,
            stopovers: rideData.stopovers || [],
        },

        // Booking info
        bookingType: rideData.instant_booking ? 'Instant Booking' : 'Request to Book',
        cancellationPolicy: 'Free cancellation up to 24 hours before departure',
    } : {
        // Fallback to params if no data fetched
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
        routeGeometry: null,
        stopovers: [],
        driver: {
            name: params.driver || 'Rahul Sharma',
            rating: params.rating || 4.8,
            totalRides: 156,
            verified: true,
            joinedDate: 'Member since 2022',
            bio: 'Experienced driver',
            preferences: { music: 'Yes', smoking: 'No', pets: 'Yes', chatty: 'Moderate' },
        },
        vehicle: {
            make: params.vehicle || 'Honda City',
            model: '',
            color: 'White',
            year: 2020,
            ac: true,
            luggage: 'Medium',
        },
        route: {
            pickup: params.from || 'Delhi',
            dropoff: params.to || 'Agra',
            stopovers: [],
        },
        bookingType: params.instant ? 'Instant Booking' : 'Request to Book',
        cancellationPolicy: 'Free cancellation up to 24 hours before departure',
    };

    // Get coordinates for map
    const fromCoords = getCityCoordinates(extractCityName(rideDetails.from));
    const toCoords = getCityCoordinates(extractCityName(rideDetails.to));
    const stopoverCoords = rideDetails.stopovers.map(city => ({
        name: city,
        coords: getCityCoordinates(extractCityName(city)) || { latitude: 0, longitude: 0 },
    })).filter(stop => stop.coords.latitude !== 0);

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
            console.log('🎫 Starting booking process...');
            console.log('Ride ID:', rideDetails.id);
            console.log('User ID:', session?.user?.id);
            console.log('Selected seats:', selectedSeats);

            const totalPrice = rideDetails.price * selectedSeats;
            const bookingStatus = rideDetails.instant ? 'confirmed' : 'pending';

            // Validate ride ID
            if (!rideDetails.id || rideDetails.id === 1) {
                Alert.alert(
                    'Invalid Ride',
                    'This ride cannot be booked. Please select a ride from the search results.'
                );
                return;
            }

            // Create booking
            console.log('📝 Creating booking in database...');
            const booking = await createBooking({
                ride_id: String(rideDetails.id),
                passenger_id: session?.user?.id || '',
                seats_booked: selectedSeats,
                total_price: totalPrice,
                status: bookingStatus,
            });

            console.log('Booking result:', booking);

            if (booking) {
                // Update available seats for ALL bookings
                console.log('🪑 Updating available seats...');
                const seatsUpdated = await updateRideSeats(String(rideDetails.id), selectedSeats);
                console.log('Seats updated:', seatsUpdated);

                // Send notifications
                try {
                    await sendBookingConfirmationNotification({
                        from: rideDetails.from,
                        to: rideDetails.to,
                        date: rideDetails.date,
                        time: rideDetails.departureTime,
                    });
                } catch (notifError) {
                    console.log('Notification error (non-critical):', notifError);
                }

                // Schedule ride reminder (1 hour before departure)
                if (bookingStatus === 'confirmed') {
                    try {
                        // Create a Date object for the ride (simplified - using today's date with departure time)
                        const rideDateObj = new Date();
                        await scheduleRideReminder(
                            {
                                from: rideDetails.from,
                                to: rideDetails.to,
                                departureTime: rideDetails.departureTime,
                            },
                            rideDateObj
                        );
                    } catch (reminderError) {
                        console.log('Reminder scheduling error (non-critical):', reminderError);
                    }
                }

                setShowBookingModal(false);
                console.log('✅ Booking successful!');
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
                console.error('❌ Booking creation failed - no booking returned');
                Alert.alert('Error', 'Failed to create booking. Please try again.');
            }
        } catch (error) {
            console.error('💥 Error creating booking:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            Alert.alert('Error', `An error occurred while booking the ride. Check console for details.`);
        } finally {
            setIsBooking(false);
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        scrollView: { flex: 1 },
        headerCard: { padding: 20, marginBottom: 16 },
        routeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
        routeInfo: { flex: 1 },
        location: { fontSize: 18, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
        routeLine: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
        routeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary },
        routeDotEnd: { backgroundColor: theme.colors.success },
        line: { flex: 1, height: 2, backgroundColor: theme.colors.border, marginHorizontal: 8 },
        timeInfo: { alignItems: 'flex-end' },
        time: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
        duration: { fontSize: 12, color: theme.colors.textSecondary, marginVertical: 4 },
        dateDistance: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
        date: { fontSize: 14, color: theme.colors.textSecondary },
        distance: { fontSize: 14, color: theme.colors.textSecondary },
        instantBadge: { backgroundColor: theme.colors.success + '20', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
        instantText: { color: theme.colors.success, fontSize: 12, fontWeight: '600' },
        priceSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border },
        priceLabel: { fontSize: 14, color: theme.colors.textSecondary },
        price: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary },
        pricePerSeat: { fontSize: 12, color: theme.colors.textSecondary },
        driverCard: { padding: 16, marginBottom: 16 },
        sectionTitle: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 12 },
        driverInfo: { flexDirection: 'row', alignItems: 'center' },
        driverAvatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
        avatarText: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
        driverDetails: { flex: 1 },
        driverName: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 4 },
        driverRating: { flexDirection: 'row', alignItems: 'center' },
        ratingText: { fontSize: 14, color: theme.colors.textSecondary, marginLeft: 4 },
        verifiedBadge: { backgroundColor: theme.colors.success + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 4 },
        verifiedText: { color: theme.colors.success, fontSize: 12, fontWeight: '600' },
        vehicleCard: { padding: 16, marginBottom: 16 },
        vehicleInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
        vehicleDetail: { flex: 1 },
        vehicleLabel: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 },
        vehicleValue: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
        locationCard: { padding: 16, marginBottom: 16 },
        locationItem: { flexDirection: 'row', marginBottom: 12 },
        locationIcon: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
        pickupIcon: { backgroundColor: theme.colors.primary + '20' },
        dropoffIcon: { backgroundColor: theme.colors.success + '20' },
        iconText: { fontSize: 12, fontWeight: 'bold' },
        pickupText: { color: theme.colors.primary },
        dropoffText: { color: theme.colors.success },
        locationDetails: { flex: 1 },
        locationLabel: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 2 },
        locationAddress: { fontSize: 14, color: theme.colors.text },
        mapContainer: { height: 200, marginVertical: 16, borderRadius: 12, overflow: 'hidden' },
        infoCard: { padding: 16, marginBottom: 16 },
        infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
        infoItem: { flex: 1 },
        infoLabel: { fontSize: 12, color: theme.colors.textSecondary, marginBottom: 4 },
        infoValue: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
        bookingSection: { padding: 16, paddingBottom: 32 },
        seatsSelector: { marginBottom: 16 },
        seatsLabel: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
        seatsButtons: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
        seatButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
        seatButtonText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
        seatsCount: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, minWidth: 40, textAlign: 'center' },
        totalPrice: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: theme.colors.border },
        totalLabel: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
        totalAmount: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary },
        modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
        modalContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
        modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
        modalTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
        closeButton: { padding: 8 },
        closeButtonText: { fontSize: 24, color: theme.colors.textSecondary },
        modalSection: { marginBottom: 20 },
        modalSectionTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 12 },
        summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
        summaryLabel: { fontSize: 14, color: theme.colors.textSecondary },
        summaryValue: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
        totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: theme.colors.border },
        totalLabelModal: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
        totalAmountModal: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primary },
        modalButtons: { flexDirection: 'row', gap: 12 },
        cancelButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
        cancelButtonText: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
        confirmButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center' },
        confirmButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
        // Additional missing styles
        section: { marginTop: 16, paddingHorizontal: 16 },
        driverHeader: { flexDirection: 'row', marginBottom: 12 },
        driverInitial: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
        driverNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
        driverMeta: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 2 },
        driverJoined: { fontSize: 12, color: theme.colors.textTertiary },
        driverBio: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 12, fontStyle: 'italic' },
        preferences: { borderTopWidth: 1, borderTopColor: theme.colors.borderLight, paddingTop: 12 },
        preferencesTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
        preferencesList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
        preferenceItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginRight: 8, marginBottom: 8 },
        preferenceIcon: { fontSize: 16, marginRight: 6 },
        preferenceText: { fontSize: 13, color: theme.colors.textSecondary },
        vehicleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
        vehicleText: { fontSize: 14, color: theme.colors.text, marginBottom: 4 },
        locationDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.primary, marginTop: 4, marginRight: 12 },
        locationDotEnd: { backgroundColor: theme.colors.success },
        stopovers: { marginLeft: 24, marginBottom: 16, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: theme.colors.border },
        stopoverLabel: { fontSize: 12, color: theme.colors.textTertiary, marginBottom: 4 },
        stopoverText: { fontSize: 13, color: theme.colors.textSecondary, marginBottom: 2 },
        priceText: { fontSize: 16, color: theme.colors.primary },
        cancellationPolicy: { fontSize: 12, color: theme.colors.success, marginTop: 8, fontStyle: 'italic' },
        bottomBar: { flexDirection: 'row', backgroundColor: theme.colors.surface, padding: 16, borderTopWidth: 1, borderTopColor: theme.colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 5 },
        priceContainer: { flex: 1, justifyContent: 'center' },
        bookButton: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
        bookButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
        modalSubtitle: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 24 },
        seatSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 12 },
        seatCount: { fontSize: 32, fontWeight: 'bold', color: theme.colors.text, minWidth: 60, textAlign: 'center' },
        availableSeats: { fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 24 },
        priceSummary: { marginBottom: 24 },
        priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
        priceRowLabel: { fontSize: 14, color: theme.colors.textSecondary },
        priceRowValue: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
        totalValue: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primary },
        bookingTypeInfo: { backgroundColor: theme.colors.primary + '10', padding: 12, borderRadius: 8, marginBottom: 24 },
        bookingTypeText: { fontSize: 13, color: theme.colors.text, textAlign: 'center' },
        modalActions: { flexDirection: 'row', gap: 12 },
        cancelButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface },
        cancelButtonText: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
        confirmButton: { flex: 1, padding: 16, borderRadius: 12, alignItems: 'center', backgroundColor: theme.colors.primary },
        confirmButtonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
        confirmButtonDisabled: { opacity: 0.5 },
        modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
        modalContent: { backgroundColor: theme.colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
        modalTitle: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8, textAlign: 'center' },
        seatButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
        seatButtonText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
        totalRow: { borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 12, marginTop: 4 },
        totalLabel: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text },
    });

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

                {/* Route Map */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Route</Text>
                    <MapView
                        fromLocation={rideDetails.from}
                        toLocation={rideDetails.to}
                        fromCoords={fromCoords || undefined}
                        toCoords={toCoords || undefined}
                        routeGeometry={rideDetails.routeGeometry}
                        stopovers={stopoverCoords}
                    />
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
                            <Text style={styles.vehicleText}>🚗 {rideDetails.vehicle.make}</Text>
                            <Text style={styles.vehicleText}>🎨 {rideDetails.vehicle.color}</Text>
                        </View>
                        <View style={styles.vehicleRow}>
                            <Text style={styles.vehicleText}>📅 {rideDetails.vehicle.year}</Text>
                            <Text style={styles.vehicleText}>
                                {rideDetails.vehicle.ac ? '❄️ AC' : '🌡️ Non-AC'}
                            </Text>
                        </View>
                        <Text style={styles.vehicleText}>🧳 Luggage: {rideDetails.vehicle.luggage}</Text>
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

export default RideDetailsScreen;
