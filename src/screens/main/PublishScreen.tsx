import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MainTabsNavigationProp } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { createRide, searchRides } from '../../services/database';
import { fetchRoute, geocodePlace } from '../../services/routing';
import CalendarPicker from '../../components/CalendarPicker';

interface PublishRideForm {
    fromLocation: string;
    toLocation: string;
    stopovers: string[];
    departureDate: Date;
    departureTime: string;
    availableSeats: number;
    pricePerSeat: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleColor: string;
    instantBooking: boolean;
    termsAccepted: boolean;
}

const PublishScreen = () => {
    const navigation = useNavigation<MainTabsNavigationProp>();
    const { session } = useAuth();
    const { theme } = useTheme();
    const [currentStep, setCurrentStep] = useState(1);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [ridePublished, setRidePublished] = useState(false);

    const [formData, setFormData] = useState<PublishRideForm>({
        fromLocation: '',
        toLocation: '',
        stopovers: [],
        departureDate: new Date(),
        departureTime: '10:00',
        availableSeats: 3,
        pricePerSeat: '',
        vehicleMake: '',
        vehicleModel: '',
        vehicleColor: '',
        instantBooking: true,
        termsAccepted: false,
    });

    const updateFormData = (field: keyof PublishRideForm, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!formData.fromLocation.trim()) {
                    Alert.alert('Error', 'Please enter departure location');
                    return false;
                }
                if (!formData.toLocation.trim()) {
                    Alert.alert('Error', 'Please enter destination');
                    return false;
                }
                if (formData.fromLocation.toLowerCase() === formData.toLocation.toLowerCase()) {
                    Alert.alert('Error', 'Departure and destination cannot be the same');
                    return false;
                }
                return true;

            case 2:
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (formData.departureDate < today) {
                    Alert.alert('Error', 'Departure date cannot be in the past');
                    return false;
                }
                if (!formData.departureTime) {
                    Alert.alert('Error', 'Please select departure time');
                    return false;
                }
                return true;

            case 3:
                const price = parseFloat(formData.pricePerSeat);
                if (!formData.pricePerSeat || isNaN(price) || price <= 0) {
                    Alert.alert('Error', 'Please enter a valid price per seat');
                    return false;
                }
                if (!formData.vehicleMake.trim()) {
                    Alert.alert('Error', 'Please enter vehicle make');
                    return false;
                }
                if (!formData.vehicleModel.trim()) {
                    Alert.alert('Error', 'Please enter vehicle model');
                    return false;
                }
                if (!formData.vehicleColor.trim()) {
                    Alert.alert('Error', 'Please enter vehicle color');
                    return false;
                }
                return true;

            case 4:
                if (!formData.termsAccepted) {
                    Alert.alert('Error', 'Please accept the terms and conditions');
                    return false;
                }
                return true;

            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handlePublish = async () => {
        if (!validateStep(4)) return;

        // Prevent multiple clicks
        if (isPublishing || ridePublished) {
            console.log('⚠️ Already publishing or published, ignoring click');
            return;
        }

        setIsPublishing(true);
        try {
            console.log('📤 Starting ride publication...');

            // Check for duplicate rides
            const formattedDate = formData.departureDate.toISOString().split('T')[0];
            const existingRides = await searchRides({
                from: formData.fromLocation,
                to: formData.toLocation,
                date: formattedDate,
                passengers: 1,
            });

            // Check if there's an identical ride from the same driver
            const duplicate = existingRides.find(
                (ride: any) =>
                    ride.driver_id === session?.user?.id &&
                    ride.departure_time === formData.departureTime &&
                    ride.from_location.toLowerCase() === formData.fromLocation.toLowerCase() &&
                    ride.to_location.toLowerCase() === formData.toLocation.toLowerCase() &&
                    ride.departure_date === formattedDate
            );

            if (duplicate) {
                console.log('⚠️ Duplicate ride detected:', duplicate);
                Alert.alert(
                    'Duplicate Ride',
                    'You already have a ride with the same route, date, and time. Please change the time or date to create a new ride.',
                    [{ text: 'OK' }]
                );
                setIsPublishing(false);
                return;
            }

            // Fetch route data from OpenRouteService
            console.log('🗺️ Fetching route data...');
            let routeGeometry = null;
            let routeDistance = null;
            let routeDuration = null;
            let dynamicStopovers: string[] = [];

            try {
                // Geocode locations
                const fromCoords = await geocodePlace(formData.fromLocation);
                const toCoords = await geocodePlace(formData.toLocation);

                if (fromCoords && toCoords) {
                    // Fetch route
                    const routeData = await fetchRoute(fromCoords, toCoords);

                    if (routeData) {
                        routeGeometry = routeData.geometry;
                        routeDistance = routeData.distance;
                        routeDuration = routeData.duration;
                        dynamicStopovers = routeData.stopovers;
                        console.log('✅ Route fetched:', {
                            distance: `${(routeDistance / 1000).toFixed(1)} km`,
                            duration: `${Math.round(routeDuration / 60)} min`,
                            stopovers: dynamicStopovers,
                        });
                    }
                } else {
                    console.warn('⚠️ Could not geocode locations, proceeding without route data');
                }
            } catch (error) {
                console.error('❌ Error fetching route:', error);
                // Continue without route data - not critical
            }

            const rideData = {
                driver_id: session?.user?.id || '',
                from_location: formData.fromLocation,
                to_location: formData.toLocation,
                departure_date: formattedDate,
                departure_time: formData.departureTime,
                available_seats: formData.availableSeats,
                price_per_seat: parseFloat(formData.pricePerSeat),
                instant_booking: formData.instantBooking,
                vehicle_make: formData.vehicleMake,
                vehicle_model: formData.vehicleModel,
                vehicle_color: formData.vehicleColor,
                route_geometry: routeGeometry,
                route_distance: routeDistance,
                route_duration: routeDuration,
                stopovers: dynamicStopovers.length > 0 ? dynamicStopovers : formData.stopovers,
            };

            console.log('💾 Creating ride:', rideData);
            const result = await createRide(rideData);

            if (result) {
                console.log('✅ Ride published successfully!');
                setRidePublished(true); // Mark as published
                Alert.alert(
                    'Success! 🎉',
                    `Your ride has been published!\n\n📍 ${formData.fromLocation} → ${formData.toLocation}\n📅 ${formData.departureDate.toLocaleDateString()}\n⏰ ${formData.departureTime}\n💺 ${formData.availableSeats} seats\n💰 ₹${formData.pricePerSeat}/seat`,
                    [
                        {
                            text: 'View My Rides',
                            onPress: () => navigation.navigate('MyRides'),
                        },
                        {
                            text: 'Publish Another',
                            onPress: () => {
                                setCurrentStep(1);
                                setRidePublished(false); // Reset published state
                                setFormData({
                                    fromLocation: '',
                                    toLocation: '',
                                    stopovers: [],
                                    departureDate: new Date(),
                                    departureTime: '10:00',
                                    availableSeats: 3,
                                    pricePerSeat: '',
                                    vehicleMake: '',
                                    vehicleModel: '',
                                    vehicleColor: '',
                                    instantBooking: true,
                                    termsAccepted: false,
                                });
                            },
                        },
                    ]
                );
            } else {
                console.error('❌ Failed to publish ride');
                Alert.alert('Error', 'Failed to publish ride. Please try again.');
            }
        } catch (error) {
            console.error('💥 Error publishing ride:', error);
            Alert.alert('Error', 'An error occurred while publishing your ride. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    const styles = StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.colors.background },
        header: { padding: 20, paddingTop: 60, paddingBottom: 20 },
        headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
        headerSubtitle: { fontSize: 14, color: '#fff', opacity: 0.9 },
        progressContainer: { flexDirection: 'row', backgroundColor: theme.colors.surface, paddingVertical: 20, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
        progressStepContainer: { flexDirection: 'row', alignItems: 'center' },
        progressDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.borderLight, justifyContent: 'center', alignItems: 'center' },
        progressDotActive: { backgroundColor: theme.colors.primary },
        progressNumber: { fontSize: 14, fontWeight: 'bold', color: theme.colors.textTertiary },
        progressNumberActive: { color: '#fff' },
        progressLine: { width: 40, height: 2, backgroundColor: theme.colors.borderLight, marginHorizontal: 8 },
        progressLineActive: { backgroundColor: theme.colors.primary },
        content: { flex: 1, padding: 16 },
        stepContainer: { backgroundColor: theme.colors.surface, borderRadius: 12, padding: 20, marginBottom: 16 },
        stepTitle: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, marginBottom: 4 },
        stepSubtitle: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 24 },
        inputGroup: { marginBottom: 20 },
        label: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: 8 },
        input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: theme.colors.surface, color: theme.colors.text },
        inputText: { fontSize: 16, color: theme.colors.text },
        infoBox: { backgroundColor: theme.colors.info + '20', padding: 12, borderRadius: 8, marginTop: 8 },
        infoText: { fontSize: 13, color: theme.colors.info },
        seatsSelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
        seatButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
        seatButtonText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
        seatsCount: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, minWidth: 40, textAlign: 'center' },
        earningsBox: { backgroundColor: theme.colors.success + '20', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
        earningsLabel: { fontSize: 12, color: theme.colors.success, marginBottom: 4 },
        earningsAmount: { fontSize: 32, fontWeight: 'bold', color: theme.colors.success },
        earningsSubtext: { fontSize: 12, color: theme.colors.success, marginTop: 4 },
        reviewCard: { backgroundColor: theme.colors.surfaceVariant, borderRadius: 8, padding: 16, marginBottom: 20 },
        reviewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
        reviewLabel: { fontSize: 14, color: theme.colors.textSecondary, fontWeight: '500' },
        reviewValue: { fontSize: 14, color: theme.colors.text, fontWeight: '600', flex: 1, textAlign: 'right' },
        toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border, marginBottom: 20 },
        toggleInfo: { flex: 1 },
        toggleLabel: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: 2 },
        toggleSubtext: { fontSize: 12, color: theme.colors.textSecondary },
        toggle: { width: 50, height: 30, borderRadius: 15, backgroundColor: theme.colors.borderLight, padding: 2, justifyContent: 'center' },
        toggleActive: { backgroundColor: theme.colors.success },
        toggleThumb: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff' },
        toggleThumbActive: { alignSelf: 'flex-end' },
        termsRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
        checkbox: { width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
        checkboxActive: { backgroundColor: theme.colors.primary },
        checkmark: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
        termsText: { fontSize: 14, color: theme.colors.text, flex: 1 },
        footer: { flexDirection: 'row', padding: 16, backgroundColor: theme.colors.surface, borderTopWidth: 1, borderTopColor: theme.colors.border, gap: 12 },
        backButton: { flex: 1, padding: 16, borderRadius: 8, backgroundColor: theme.colors.surfaceVariant, alignItems: 'center' },
        backButtonText: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
        nextButton: { flex: 2, padding: 16, borderRadius: 8, alignItems: 'center' },
        nextButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
        publishButton: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center' },
        publishButtonDisabled: { opacity: 0.6 },
        publishButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
    });

    const renderProgressBar = () => (
        <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map((step) => (
                <View key={step} style={styles.progressStepContainer}>
                    <View style={[styles.progressDot, currentStep >= step && styles.progressDotActive]}>
                        <Text style={[styles.progressNumber, currentStep >= step && styles.progressNumberActive]}>
                            {step}
                        </Text>
                    </View>
                    {step < 4 && <View style={[styles.progressLine, currentStep > step && styles.progressLineActive]} />}
                </View>
            ))}
        </View>
    );

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>📍 Where are you going?</Text>
            <Text style={styles.stepSubtitle}>Enter your route details</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>From</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Mumbai"
                    value={formData.fromLocation}
                    onChangeText={(text) => updateFormData('fromLocation', text)}
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>To</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., Pune"
                    value={formData.toLocation}
                    onChangeText={(text) => updateFormData('toLocation', text)}
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>💡 Tip: Be specific with city names for better matches</Text>
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>📅 When are you leaving?</Text>
            <Text style={styles.stepSubtitle}>Set your departure details</Text>

            <TouchableOpacity style={styles.inputGroup} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.label}>Departure Date</Text>
                <View style={styles.input}>
                    <Text style={styles.inputText}>
                        {formData.departureDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </Text>
                </View>
            </TouchableOpacity>

            <CalendarPicker
                visible={showDatePicker}
                selectedDate={formData.departureDate}
                onSelectDate={(date) => updateFormData('departureDate', date)}
                onClose={() => setShowDatePicker(false)}
                minimumDate={new Date()}
            />

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Departure Time</Text>
                <TextInput
                    style={styles.input}
                    placeholder="10:00"
                    value={formData.departureTime}
                    onChangeText={(text) => updateFormData('departureTime', text)}
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Available Seats</Text>
                <View style={styles.seatsSelector}>
                    <TouchableOpacity
                        style={styles.seatButton}
                        onPress={() => updateFormData('availableSeats', Math.max(1, formData.availableSeats - 1))}
                    >
                        <Text style={styles.seatButtonText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.seatsCount}>{formData.availableSeats}</Text>
                    <TouchableOpacity
                        style={styles.seatButton}
                        onPress={() => updateFormData('availableSeats', Math.min(8, formData.availableSeats + 1))}
                    >
                        <Text style={styles.seatButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    const renderStep3 = () => {
        const price = parseFloat(formData.pricePerSeat) || 0;
        const totalEarnings = price * formData.availableSeats;

        return (
            <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>💰 Pricing & Vehicle</Text>
                <Text style={styles.stepSubtitle}>Set your price and vehicle details</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Price per Seat (₹)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., 300"
                        value={formData.pricePerSeat}
                        onChangeText={(text) => updateFormData('pricePerSeat', text)}
                        keyboardType="numeric"
                        placeholderTextColor="#999"
                    />
                </View>

                {price > 0 && (
                    <View style={styles.earningsBox}>
                        <Text style={styles.earningsLabel}>Estimated Earnings</Text>
                        <Text style={styles.earningsAmount}>₹{totalEarnings}</Text>
                        <Text style={styles.earningsSubtext}>
                            ({formData.availableSeats} seats × ₹{price})
                        </Text>
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Vehicle Make</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Honda"
                        value={formData.vehicleMake}
                        onChangeText={(text) => updateFormData('vehicleMake', text)}
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Vehicle Model</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., City"
                        value={formData.vehicleModel}
                        onChangeText={(text) => updateFormData('vehicleModel', text)}
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Vehicle Color</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., White"
                        value={formData.vehicleColor}
                        onChangeText={(text) => updateFormData('vehicleColor', text)}
                        placeholderTextColor="#999"
                    />
                </View>
            </View>
        );
    };

    const renderStep4 = () => (
        <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>✨ Review & Publish</Text>
            <Text style={styles.stepSubtitle}>Confirm your ride details</Text>

            <View style={styles.reviewCard}>
                <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Route</Text>
                    <Text style={styles.reviewValue}>
                        {formData.fromLocation} → {formData.toLocation}
                    </Text>
                </View>
                <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Date & Time</Text>
                    <Text style={styles.reviewValue}>
                        {formData.departureDate.toLocaleDateString()} at {formData.departureTime}
                    </Text>
                </View>
                <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Seats</Text>
                    <Text style={styles.reviewValue}>{formData.availableSeats} available</Text>
                </View>
                <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Price</Text>
                    <Text style={styles.reviewValue}>₹{formData.pricePerSeat} per seat</Text>
                </View>
                <View style={styles.reviewRow}>
                    <Text style={styles.reviewLabel}>Vehicle</Text>
                    <Text style={styles.reviewValue}>
                        {formData.vehicleMake} {formData.vehicleModel} ({formData.vehicleColor})
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => updateFormData('instantBooking', !formData.instantBooking)}
            >
                <View style={styles.toggleInfo}>
                    <Text style={styles.toggleLabel}>⚡ Instant Booking</Text>
                    <Text style={styles.toggleSubtext}>Passengers can book without approval</Text>
                </View>
                <View style={[styles.toggle, formData.instantBooking && styles.toggleActive]}>
                    <View style={[styles.toggleThumb, formData.instantBooking && styles.toggleThumbActive]} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.termsRow}
                onPress={() => updateFormData('termsAccepted', !formData.termsAccepted)}
            >
                <View style={[styles.checkbox, formData.termsAccepted && styles.checkboxActive]}>
                    {formData.termsAccepted && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>I accept the terms and conditions</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={theme.gradients.primary as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>Publish a Ride</Text>
                <Text style={styles.headerSubtitle}>Step {currentStep} of 4</Text>
            </LinearGradient>

            {renderProgressBar()}

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
            </ScrollView>

            <View style={styles.footer}>
                {currentStep > 1 && (
                    <TouchableOpacity style={styles.backButton} onPress={handleBack} disabled={ridePublished}>
                        <Text style={styles.backButtonText}>← Back</Text>
                    </TouchableOpacity>
                )}
                {currentStep < 4 ? (
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <Text style={styles.nextButtonText}>Next →</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[
                            styles.publishButton,
                            (isPublishing || ridePublished) && styles.publishButtonDisabled
                        ]}
                        onPress={handlePublish}
                        disabled={isPublishing || ridePublished}
                    >
                        <Text style={styles.publishButtonText}>
                            {ridePublished ? '✓ Ride Published' : isPublishing ? 'Publishing...' : '🚀 Publish Ride'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default PublishScreen;
