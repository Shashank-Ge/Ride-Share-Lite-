import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabsNavigationProp } from '../../types/navigation';
import CalendarPicker from '../../components/CalendarPicker';

const SearchScreen = () => {
    const navigation = useNavigation<MainTabsNavigationProp>();
    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [passengers, setPassengers] = useState(1);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSearch = () => {
        // Validate inputs
        if (!fromLocation.trim()) {
            Alert.alert('Error', 'Please enter departure location');
            return;
        }
        if (!toLocation.trim()) {
            Alert.alert('Error', 'Please enter destination');
            return;
        }
        if (fromLocation.toLowerCase() === toLocation.toLowerCase()) {
            Alert.alert('Error', 'Departure and destination cannot be the same');
            return;
        }

        // Navigate to search results
        navigation.navigate('SearchResults', {
            from: fromLocation,
            to: toLocation,
            date: selectedDate.toISOString().split('T')[0],
            passengers: passengers,
        });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Search Rides</Text>
                <Text style={styles.headerSubtitle}>Find your perfect ride</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search Form */}
                <View style={styles.searchForm}>
                    {/* From Location */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>From</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputIcon}>📍</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Departure location"
                                value={fromLocation}
                                onChangeText={setFromLocation}
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    {/* To Location */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>To</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputIcon}>🎯</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Destination"
                                value={toLocation}
                                onChangeText={setToLocation}
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    {/* Date Picker */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Date</Text>
                        <TouchableOpacity
                            style={styles.inputContainer}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.inputIcon}>📅</Text>
                            <Text style={styles.dateText}>
                                {selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <CalendarPicker
                        visible={showDatePicker}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        onClose={() => setShowDatePicker(false)}
                        minimumDate={new Date()}
                    />

                    {/* Passengers */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Passengers</Text>
                        <View style={styles.passengerSelector}>
                            <TouchableOpacity
                                style={styles.passengerButton}
                                onPress={() => setPassengers(Math.max(1, passengers - 1))}
                            >
                                <Text style={styles.passengerButtonText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.passengerCount}>{passengers}</Text>
                            <TouchableOpacity
                                style={styles.passengerButton}
                                onPress={() => setPassengers(Math.min(8, passengers + 1))}
                            >
                                <Text style={styles.passengerButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Search Button */}
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>🔍 Search Rides</Text>
                    </TouchableOpacity>
                </View>

                {/* Quick Tips */}
                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
                    <View style={styles.tipItem}>
                        <Text style={styles.tipIcon}>✓</Text>
                        <Text style={styles.tipText}>Be specific with city names for better results</Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text style={styles.tipIcon}>✓</Text>
                        <Text style={styles.tipText}>Book early to get the best prices</Text>
                    </View>
                    <View style={styles.tipItem}>
                        <Text style={styles.tipIcon}>✓</Text>
                        <Text style={styles.tipText}>Look for instant booking rides for quick confirmation</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: { backgroundColor: '#007AFF', padding: 20, paddingTop: 60, paddingBottom: 24 },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
    headerSubtitle: { fontSize: 14, color: '#fff', opacity: 0.9 },
    content: { flex: 1 },
    searchForm: { backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 12, backgroundColor: '#fafafa' },
    inputIcon: { fontSize: 20, marginRight: 12 },
    input: { flex: 1, fontSize: 16, color: '#333' },
    dateText: { flex: 1, fontSize: 16, color: '#333' },
    passengerSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
    passengerButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
    passengerButtonText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
    passengerCount: { fontSize: 24, fontWeight: 'bold', color: '#333', minWidth: 40, textAlign: 'center' },
    searchButton: { backgroundColor: '#007AFF', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    searchButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    tipsContainer: { backgroundColor: '#fff', margin: 16, marginTop: 0, borderRadius: 16, padding: 20 },
    tipsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
    tipItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    tipIcon: { fontSize: 16, color: '#34C759', marginRight: 12, marginTop: 2 },
    tipText: { flex: 1, fontSize: 14, color: '#666', lineHeight: 20 },
});

export default SearchScreen;
