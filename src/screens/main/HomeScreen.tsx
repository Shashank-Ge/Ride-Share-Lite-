import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
} from 'react-native';
import CalendarPicker from '../../components/CalendarPicker';

const HomeScreen = () => {
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
        // TODO: Navigate to search results screen
        alert(`Searching rides from ${fromLocation} to ${toLocation} on ${formatDate(date)} for ${passengers} passenger(s)`);
    };

    // Sample popular rides data
    const popularRides = [
        {
            id: 1,
            from: 'Delhi',
            to: 'Agra',
            date: 'Tomorrow',
            price: 500,
            driver: 'Rahul S.',
            rating: 4.8,
            seats: 3
        },
        {
            id: 2,
            from: 'Mumbai',
            to: 'Pune',
            date: 'Dec 6',
            price: 300,
            driver: 'Priya M.',
            rating: 4.9,
            seats: 2
        },
        {
            id: 3,
            from: 'Bangalore',
            to: 'Mysore',
            date: 'Dec 7',
            price: 400,
            driver: 'Amit K.',
            rating: 4.7,
            seats: 4
        }
    ];

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Find a Ride</Text>
                <Text style={styles.headerSubtitle}>Where are you going today?</Text>
            </View>

            {/* Search Card */}
            <View style={styles.searchCard}>
                {/* From Location */}
                <View style={styles.inputGroup}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>📍</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Leaving from..."
                        value={fromLocation}
                        onChangeText={setFromLocation}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* To Location */}
                <View style={styles.inputGroup}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>🎯</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Going to..."
                        value={toLocation}
                        onChangeText={setToLocation}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Date Picker */}
                <TouchableOpacity
                    style={styles.inputGroup}
                    onPress={() => setShowDatePicker(true)}
                >
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

                {/* Passenger Selector */}
                <View style={styles.inputGroup}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.icon}>👥</Text>
                    </View>
                    <View style={styles.passengerSelector}>
                        <TouchableOpacity
                            style={styles.passengerButton}
                            onPress={() => setPassengers(Math.max(1, passengers - 1))}
                        >
                            <Text style={styles.passengerButtonText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.passengerCount}>
                            {passengers} {passengers === 1 ? 'passenger' : 'passengers'}
                        </Text>
                        <TouchableOpacity
                            style={styles.passengerButton}
                            onPress={() => setPassengers(Math.min(8, passengers + 1))}
                        >
                            <Text style={styles.passengerButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Button */}
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={handleSearch}
                >
                    <Text style={styles.searchButtonText}>🔍 Search Rides</Text>
                </TouchableOpacity>
            </View>

            {/* Popular Rides Section */}
            <View style={styles.popularSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>🔥 Popular Rides</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                {popularRides.map((ride) => (
                    <TouchableOpacity
                        key={ride.id}
                        style={styles.rideCard}
                        onPress={() => alert(`View details for ride to ${ride.to}`)}
                    >
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
                    </TouchableOpacity>
                ))}
            </View>

            {/* Bottom Spacing */}
            <View style={{ height: 20 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#007AFF',
        padding: 20,
        paddingTop: 60,
        paddingBottom: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    searchCard: {
        backgroundColor: '#fff',
        margin: 16,
        marginTop: -20,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        backgroundColor: '#fafafa',
    },
    iconContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 24,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
        justifyContent: 'center',
    },
    inputText: {
        fontSize: 16,
        color: '#333',
    },
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
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    passengerButtonText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    passengerCount: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    searchButton: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    searchButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    popularSection: {
        padding: 16,
        paddingTop: 0,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    seeAll: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    rideCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    rideHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    rideRoute: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rideFrom: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    rideArrow: {
        fontSize: 18,
        color: '#007AFF',
        marginHorizontal: 8,
    },
    rideTo: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    ridePrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    rideDetails: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    rideInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    rideDate: {
        fontSize: 14,
        color: '#666',
    },
    rideSeats: {
        fontSize: 14,
        color: '#666',
    },
    driverInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    driverName: {
        fontSize: 14,
        color: '#666',
    },
    driverRating: {
        fontSize: 14,
        color: '#666',
    },
});

export default HomeScreen;
