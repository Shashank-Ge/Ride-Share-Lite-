import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MainTabsNavigationProp } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import CalendarPicker from '../../components/CalendarPicker';
import GlassCard from '../../components/GlassCard';
import GradientButton from '../../components/GradientButton';

const HomeScreen = () => {
    const navigation = useNavigation<MainTabsNavigationProp>();
    const { theme } = useTheme();
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [passengers, setPassengers] = useState(1);

    const handleDateChange = (selectedDate: Date) => {
        setDate(selectedDate);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleSearch = () => {
        console.log('Searching rides:', { fromLocation, toLocation, date, passengers });
        navigation.navigate('SearchResults', {
            from: fromLocation || 'Delhi',
            to: toLocation || 'Agra',
            date: formatDate(date),
            passengers: passengers,
        });
    };

    const popularRides = [
        { id: 1, from: 'Delhi', to: 'Agra', date: 'Tomorrow', price: 500, driver: 'Rahul S.', rating: 4.8, seats: 3 },
        { id: 2, from: 'Mumbai', to: 'Pune', date: 'Dec 6', price: 300, driver: 'Priya M.', rating: 4.9, seats: 2 },
        { id: 3, from: 'Bangalore', to: 'Mysore', date: 'Dec 7', price: 400, driver: 'Amit K.', rating: 4.7, seats: 4 }
    ];

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        header: {
            padding: 20,
            paddingTop: 60,
            paddingBottom: 40,
        },
        headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
        headerSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9 },
        searchCard: {
            margin: 16,
            marginTop: -30,
        },
        searchCardContent: {
            padding: 20,
        },
        inputGroup: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.surface,
        },
        iconContainer: {
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
        },
        icon: { fontSize: 24 },
        input: {
            flex: 1,
            height: 50,
            fontSize: 16,
            color: theme.colors.text,
            justifyContent: 'center',
        },
        inputText: { fontSize: 16, color: theme.colors.text },
        passengerSelector: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 12,
        },
        passengerButton: {
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
        },
        passengerButtonText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
        passengerCount: { fontSize: 16, color: theme.colors.text, fontWeight: '500' },
        searchButtonContainer: {
            marginTop: 8,
        },
        popularSection: { padding: 16, paddingTop: 0 },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        sectionTitle: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text },
        seeAll: { fontSize: 14, color: theme.colors.primary, fontWeight: '600' },
        rideCard: {
            marginBottom: 12,
        },
        rideCardContent: {
            padding: 16,
        },
        rideHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        rideRoute: { flexDirection: 'row', alignItems: 'center', flex: 1 },
        rideFrom: { fontSize: 18, fontWeight: '600', color: theme.colors.text },
        rideArrow: { fontSize: 18, color: theme.colors.primary, marginHorizontal: 8 },
        rideTo: { fontSize: 18, fontWeight: '600', color: theme.colors.text },
        ridePrice: { fontSize: 20, fontWeight: 'bold', color: theme.colors.primary },
        rideDetails: {
            borderTopWidth: 1,
            borderTopColor: theme.colors.borderLight,
            paddingTop: 12,
        },
        rideInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
        rideDate: { fontSize: 14, color: theme.colors.textSecondary },
        rideSeats: { fontSize: 14, color: theme.colors.textSecondary },
        driverInfo: { flexDirection: 'row', justifyContent: 'space-between' },
        driverName: { fontSize: 14, color: theme.colors.textSecondary },
        driverRating: { fontSize: 14, color: theme.colors.textSecondary },
    });

    return (
        <ScrollView style={styles.container}>
            {/* Gradient Header */}
            <LinearGradient
                colors={theme.gradients.hero as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Find a Ride</Text>
                <Text style={styles.headerSubtitle}>Where are you going today?</Text>
            </LinearGradient>

            {/* Glassmorphic Search Card */}
            <GlassCard style={styles.searchCard} intensity="strong">
                <View style={styles.searchCardContent}>
                    <View style={styles.inputGroup}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>📍</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Leaving from..."
                            value={fromLocation}
                            onChangeText={setFromLocation}
                            placeholderTextColor={theme.colors.textTertiary}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>🎯</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Going to..."
                            value={toLocation}
                            onChangeText={setToLocation}
                            placeholderTextColor={theme.colors.textTertiary}
                        />
                    </View>

                    <TouchableOpacity style={styles.inputGroup} onPress={() => setShowDatePicker(true)}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>📅</Text>
                        </View>
                        <View style={styles.input}>
                            <Text style={styles.inputText}>{formatDate(date)}</Text>
                        </View>
                    </TouchableOpacity>

                    <CalendarPicker
                        visible={showDatePicker}
                        selectedDate={date}
                        onSelectDate={handleDateChange}
                        onClose={() => setShowDatePicker(false)}
                        minimumDate={new Date()}
                    />

                    <View style={styles.inputGroup}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>👥</Text>
                        </View>
                        <View style={styles.passengerSelector}>
                            <TouchableOpacity onPress={() => setPassengers(Math.max(1, passengers - 1))}>
                                <LinearGradient
                                    colors={theme.gradients.primary as any}
                                    style={styles.passengerButton}
                                >
                                    <Text style={styles.passengerButtonText}>−</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <Text style={styles.passengerCount}>{passengers} {passengers === 1 ? 'passenger' : 'passengers'}</Text>
                            <TouchableOpacity onPress={() => setPassengers(Math.min(8, passengers + 1))}>
                                <LinearGradient
                                    colors={theme.gradients.primary as any}
                                    style={styles.passengerButton}
                                >
                                    <Text style={styles.passengerButtonText}>+</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.searchButtonContainer}>
                        <GradientButton
                            title="🔍 Search Rides"
                            onPress={handleSearch}
                            size="large"
                        />
                    </View>
                </View>
            </GlassCard>

            {/* Popular Rides */}
            <View style={styles.popularSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>🔥 Popular Rides</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                {popularRides.map((ride) => (
                    <TouchableOpacity
                        key={ride.id}
                        onPress={() => navigation.navigate('RideDetails', {
                            rideId: ride.id,
                            from: ride.from,
                            to: ride.to,
                            date: ride.date,
                            departureTime: '10:00 AM',
                            price: ride.price,
                            driver: ride.driver,
                            rating: ride.rating,
                            seats: ride.seats,
                            vehicle: 'Honda City',
                            instant: true,
                        })}
                    >
                        <GlassCard style={styles.rideCard} intensity="medium">
                            <View style={styles.rideCardContent}>
                                <View style={styles.rideHeader}>
                                    <View style={styles.rideRoute}>
                                        <Text style={styles.rideFrom}>{ride.from}</Text>
                                        <Text style={styles.rideArrow}>→</Text>
                                        <Text style={styles.rideTo}>{ride.to}</Text>
                                    </View>
                                    <Text style={styles.ridePrice}>₹{ride.price}</Text>
                                </View>
                                <View style={styles.rideDetails}>
                                    <View style={styles.rideInfo}>
                                        <Text style={styles.rideDate}>📅 {ride.date}</Text>
                                        <Text style={styles.rideSeats}>💺 {ride.seats} seats</Text>
                                    </View>
                                    <View style={styles.driverInfo}>
                                        <Text style={styles.driverName}>👤 {ride.driver}</Text>
                                        <Text style={styles.driverRating}>⭐ {ride.rating}</Text>
                                    </View>
                                </View>
                            </View>
                        </GlassCard>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ height: 20 }} />
        </ScrollView>
    );
};

export default HomeScreen;
