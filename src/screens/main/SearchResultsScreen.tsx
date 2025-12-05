import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MainTabsNavigationProp } from '../../types/navigation';
import { searchRides, Ride as DBRide } from '../../services/database';
import { useTheme } from '../../context/ThemeContext';
import GlassCard from '../../components/GlassCard';

interface Ride {
    id: string;
    from: string;
    to: string;
    date: string;
    departureTime: string;
    price: number;
    driver: string;
    rating: number;
    seats: number;
    vehicle: string;
    instant: boolean;
}

const SearchResultsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation<MainTabsNavigationProp>();
    const { theme } = useTheme();

    // Get search params from navigation
    const searchParams = route.params as any || {};

    const [sortBy, setSortBy] = useState<'price' | 'time' | 'rating'>('price');
    const [filterInstant, setFilterInstant] = useState(false);
    const [rides, setRides] = useState<Ride[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch rides from Supabase
    useEffect(() => {
        loadRides();
    }, [searchParams, sortBy, filterInstant]);

    const loadRides = async () => {
        setLoading(true);
        try {
            // Convert date string to YYYY-MM-DD format for Supabase
            let formattedDate: string | undefined;
            if (searchParams.date) {
                try {
                    const dateObj = new Date(searchParams.date);
                    formattedDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
                    console.log('📅 Converted date:', searchParams.date, '→', formattedDate);
                } catch (e) {
                    console.warn('Could not parse date:', searchParams.date);
                }
            }

            const dbRides = await searchRides({
                from: searchParams.from || 'Delhi',
                to: searchParams.to || 'Agra',
                date: formattedDate,
                passengers: searchParams.passengers || 1,
                sortBy: sortBy,
                instantOnly: filterInstant,
            });

            console.log('🔍 Database returned', dbRides.length, 'rides');
            console.log('📊 Rides data:', JSON.stringify(dbRides, null, 2));

            // Transform database rides to UI format
            const transformedRides: Ride[] = dbRides.map((ride: DBRide) => ({
                id: ride.id,
                from: ride.from_location,
                to: ride.to_location,
                date: new Date(ride.departure_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                }),
                departureTime: ride.departure_time,
                price: ride.price_per_seat,
                driver: ride.driver?.full_name || 'Unknown Driver',
                rating: 4.5, // TODO: Calculate from reviews
                seats: ride.available_seats,
                vehicle: ride.vehicle_make && ride.vehicle_model
                    ? `${ride.vehicle_make} ${ride.vehicle_model}`
                    : 'Vehicle',
                instant: ride.instant_booking || false,
            }));

            console.log('✅ Transformed to', transformedRides.length, 'UI rides');

            setRides(transformedRides);
        } catch (error) {
            console.error('Error loading rides:', error);
            // Fallback to sample data if database fails
            setRides(getSampleRides());
        } finally {
            setLoading(false);
        }
    };

    // Fallback sample data
    const getSampleRides = (): Ride[] => [
        {
            id: '1',
            from: searchParams.from || 'Delhi',
            to: searchParams.to || 'Agra',
            date: 'Tomorrow',
            departureTime: '09:00 AM',
            price: 500,
            driver: 'Rahul Sharma',
            rating: 4.8,
            seats: 3,
            vehicle: 'Honda City',
            instant: true,
        },
        {
            id: '2',
            from: searchParams.from || 'Delhi',
            to: searchParams.to || 'Agra',
            date: 'Tomorrow',
            departureTime: '02:00 PM',
            price: 450,
            driver: 'Priya Malhotra',
            rating: 4.9,
            seats: 2,
            vehicle: 'Maruti Swift',
            instant: false,
        },
    ];

    const handleRidePress = (ride: Ride) => {
        console.log('Ride selected:', ride);
        navigation.navigate('RideDetails', {
            rideId: ride.id, // Pass UUID string directly, don't parse!
            from: ride.from,
            to: ride.to,
            date: ride.date,
            departureTime: ride.departureTime,
            price: ride.price,
            driver: ride.driver,
            rating: ride.rating,
            seats: ride.seats,
            vehicle: ride.vehicle,
            instant: ride.instant,
        });
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        header: { padding: 20, paddingTop: 60, paddingBottom: 20 },
        headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
        headerSubtitle: { fontSize: 14, color: '#fff', opacity: 0.9 },
        filterBar: { backgroundColor: theme.colors.surface, paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
        filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: theme.colors.surfaceVariant, marginRight: 8 },
        filterChipActive: { backgroundColor: theme.colors.primary },
        filterText: { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '500' },
        filterTextActive: { color: '#fff' },
        resultsCount: { padding: 16, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
        resultsText: { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '500' },
        ridesList: { flex: 1, padding: 16 },
        loadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
        loadingText: { marginTop: 12, fontSize: 16, color: theme.colors.textSecondary },
        rideCard: { marginBottom: 12 },
        rideCardContent: { padding: 16 },
        instantBadge: { backgroundColor: theme.colors.warning, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginTop: 6, alignSelf: 'flex-end' },
        instantText: { fontSize: 12, fontWeight: 'bold', color: '#fff' },
        rideHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
        departureTime: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text },
        rideDate: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 2 },
        priceContainer: { alignItems: 'flex-end' },
        price: { fontSize: 24, fontWeight: 'bold', color: theme.colors.primary },
        perPerson: { fontSize: 12, color: theme.colors.textSecondary },
        routeContainer: { flexDirection: 'row', marginBottom: 16, paddingLeft: 4 },
        routeDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: theme.colors.primary, marginTop: 4 },
        routeDotEnd: { backgroundColor: theme.colors.success },
        routeLine: { position: 'absolute', left: 5, top: 16, width: 2, height: 24, backgroundColor: theme.colors.border },
        routeDetails: { flex: 1, marginLeft: 12 },
        routeLocation: { fontSize: 16, color: theme.colors.text, marginBottom: 8 },
        driverSection: { flexDirection: 'row', alignItems: 'flex-start', borderTopWidth: 1, borderTopColor: theme.colors.borderLight, paddingTop: 12, justifyContent: 'space-between' },
        driverAvatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
        driverInitial: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
        driverInfo: { flex: 1, marginLeft: 12 },
        driverName: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 4 },
        driverMeta: { flexDirection: 'row', gap: 12 },
        rating: { fontSize: 14, color: theme.colors.textSecondary },
        vehicle: { fontSize: 14, color: theme.colors.textSecondary },
        seatsInfo: { alignItems: 'center', paddingLeft: 12, minWidth: 60 },
        seatsText: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
        seatsLabel: { fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 },
        emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
        emptyIcon: { fontSize: 64, marginBottom: 16 },
        emptyTitle: { fontSize: 20, fontWeight: 'bold', color: theme.colors.text, marginBottom: 8 },
        emptyText: { fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center' },
    });

    return (
        <View style={styles.container}>
            {/* Header with gradient */}
            <LinearGradient
                colors={theme.gradients.primary as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>
                    {searchParams.from || 'Delhi'} → {searchParams.to || 'Agra'}
                </Text>
                <Text style={styles.headerSubtitle}>
                    {searchParams.date || 'Tomorrow'} • {searchParams.passengers || 1} passenger(s)
                </Text>
            </LinearGradient>

            {/* Filters and Sort */}
            <View style={styles.filterBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[styles.filterChip, sortBy === 'price' && styles.filterChipActive]}
                        onPress={() => setSortBy('price')}
                    >
                        <Text style={[styles.filterText, sortBy === 'price' && styles.filterTextActive]}>
                            💰 Lowest Price
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterChip, sortBy === 'time' && styles.filterChipActive]}
                        onPress={() => setSortBy('time')}
                    >
                        <Text style={[styles.filterText, sortBy === 'time' && styles.filterTextActive]}>
                            ⏰ Earliest
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterChip, sortBy === 'rating' && styles.filterChipActive]}
                        onPress={() => setSortBy('rating')}
                    >
                        <Text style={[styles.filterText, sortBy === 'rating' && styles.filterTextActive]}>
                            ⭐ Top Rated
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.filterChip, filterInstant && styles.filterChipActive]}
                        onPress={() => setFilterInstant(!filterInstant)}
                    >
                        <Text style={[styles.filterText, filterInstant && styles.filterTextActive]}>
                            ⚡ Instant Booking
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Results count */}
            <View style={styles.resultsCount}>
                <Text style={styles.resultsText}>
                    {loading ? 'Searching...' : `${rides.length} ride${rides.length !== 1 ? 's' : ''} found`}
                </Text>
            </View>

            {/* Rides List */}
            <ScrollView style={styles.ridesList}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Finding rides...</Text>
                    </View>
                ) : (
                    <>
                        {rides.map((ride) => (
                            <GlassCard key={ride.id} style={styles.rideCard} intensity="medium">
                                <TouchableOpacity
                                    style={styles.rideCardContent}
                                    onPress={() => handleRidePress(ride)}
                                >


                                    <View style={styles.rideHeader}>
                                        <View>
                                            <Text style={styles.departureTime}>{ride.departureTime}</Text>
                                            <Text style={styles.rideDate}>{ride.date}</Text>
                                        </View>
                                        <View style={styles.priceContainer}>
                                            <Text style={styles.price}>₹{ride.price}</Text>
                                            <Text style={styles.perPerson}>per person</Text>
                                            {ride.instant && (
                                                <View style={styles.instantBadge}>
                                                    <Text style={styles.instantText}>⚡ Instant</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.routeContainer}>
                                        <View style={styles.routeDot} />
                                        <View style={styles.routeLine} />
                                        <View style={[styles.routeDot, styles.routeDotEnd]} />
                                        <View style={styles.routeDetails}>
                                            <Text style={styles.routeLocation}>{ride.from}</Text>
                                            <Text style={styles.routeLocation}>{ride.to}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.driverSection}>
                                        <LinearGradient
                                            colors={theme.gradients.accent as any}
                                            style={styles.driverAvatar}
                                        >
                                            <Text style={styles.driverInitial}>{ride.driver.charAt(0)}</Text>
                                        </LinearGradient>
                                        <View style={styles.driverInfo}>
                                            <Text style={styles.driverName}>{ride.driver}</Text>
                                            <View style={styles.driverMeta}>
                                                <Text style={styles.rating}>⭐ {ride.rating}</Text>
                                                <Text style={styles.vehicle}>🚗 {ride.vehicle}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.seatsInfo}>
                                            <Text style={styles.seatsText}>💺 {ride.seats}</Text>
                                            <Text style={styles.seatsLabel}>seats</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </GlassCard>
                        ))}

                        {rides.length === 0 && !loading && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyIcon}>🔍</Text>
                                <Text style={styles.emptyTitle}>No rides found</Text>
                                <Text style={styles.emptyText}>
                                    Try adjusting your filters or search criteria
                                </Text>
                            </View>
                        )}
                    </>
                )}

                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
};


export default SearchResultsScreen;
