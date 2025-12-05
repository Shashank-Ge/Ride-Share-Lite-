import React from 'react';
import { View, StyleSheet } from 'react-native';
import RNMapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { useTheme } from '../../context/ThemeContext';

interface MapViewProps {
    fromLocation: string;
    toLocation: string;
    fromCoords?: { latitude: number; longitude: number };
    toCoords?: { latitude: number; longitude: number };
    routeGeometry?: any; // GeoJSON geometry
    stopovers?: Array<{ name: string; coords: { latitude: number; longitude: number } }>;
}

const MapView: React.FC<MapViewProps> = ({
    fromLocation,
    toLocation,
    fromCoords,
    toCoords,
    routeGeometry,
    stopovers = [],
}) => {
    const { theme } = useTheme();

    // Default coordinates
    const defaultFrom = fromCoords || { latitude: 28.6139, longitude: 77.2090 }; // Delhi
    const defaultTo = toCoords || { latitude: 19.0760, longitude: 72.8777 }; // Mumbai

    // Calculate region
    const midLatitude = (defaultFrom.latitude + defaultTo.latitude) / 2;
    const midLongitude = (defaultFrom.longitude + defaultTo.longitude) / 2;
    const latDelta = Math.abs(defaultFrom.latitude - defaultTo.latitude) * 1.5;
    const lonDelta = Math.abs(defaultFrom.longitude - defaultTo.longitude) * 1.5;

    const region = {
        latitude: midLatitude,
        longitude: midLongitude,
        latitudeDelta: Math.max(latDelta, 0.5),
        longitudeDelta: Math.max(lonDelta, 0.5),
    };

    // Convert route geometry to react-native-maps format
    const routeCoordinates = routeGeometry
        ? routeGeometry.coordinates.map((coord: number[]) => ({
            latitude: coord[1],
            longitude: coord[0],
        }))
        : [defaultFrom, defaultTo];

    return (
        <View style={styles.container}>
            <RNMapView
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={region}
                showsUserLocation={false}
                showsMyLocationButton={false}
            >
                {/* Start Marker */}
                <Marker
                    coordinate={defaultFrom}
                    title={fromLocation}
                    description="Pickup Location"
                    pinColor="green"
                />

                {/* End Marker */}
                <Marker
                    coordinate={defaultTo}
                    title={toLocation}
                    description="Dropoff Location"
                    pinColor="red"
                />

                {/* Stopover Markers */}
                {stopovers.map((stopover, index) => (
                    <Marker
                        key={index}
                        coordinate={stopover.coords}
                        title={stopover.name}
                        description="Stopover"
                        pinColor="orange"
                    />
                ))}

                {/* Route Line */}
                <Polyline
                    coordinates={routeCoordinates}
                    strokeColor={theme.colors.primary}
                    strokeWidth={4}
                />
            </RNMapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 300,
        borderRadius: 12,
        overflow: 'hidden',
        marginVertical: 16,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MapView;
