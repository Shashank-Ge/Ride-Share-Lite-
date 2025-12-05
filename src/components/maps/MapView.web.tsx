import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';

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
    useEffect(() => {
        // Load Leaflet CSS dynamically
        if (typeof document !== 'undefined') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
            link.crossOrigin = '';
            document.head.appendChild(link);

            // Fix default marker icons
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });
        }
    }, []);

    // Default coordinates
    const defaultFrom = fromCoords || { latitude: 28.6139, longitude: 77.2090 }; // Delhi
    const defaultTo = toCoords || { latitude: 19.0760, longitude: 72.8777 }; // Mumbai

    // Calculate center and zoom
    const center: [number, number] = [
        (defaultFrom.latitude + defaultTo.latitude) / 2,
        (defaultFrom.longitude + defaultTo.longitude) / 2,
    ];

    // Convert route geometry to Leaflet format
    const routeCoordinates: [number, number][] = routeGeometry
        ? routeGeometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number])
        : [[defaultFrom.latitude, defaultFrom.longitude], [defaultTo.latitude, defaultTo.longitude]];

    return (
        <View style={styles.container}>
            <MapContainer
                center={center}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Start Marker */}
                <Marker position={[defaultFrom.latitude, defaultFrom.longitude]}>
                    <Popup>{fromLocation}</Popup>
                </Marker>

                {/* End Marker */}
                <Marker position={[defaultTo.latitude, defaultTo.longitude]}>
                    <Popup>{toLocation}</Popup>
                </Marker>

                {/* Stopover Markers */}
                {stopovers.map((stopover, index) => (
                    <Marker
                        key={index}
                        position={[stopover.coords.latitude, stopover.coords.longitude]}
                    >
                        <Popup>{stopover.name}</Popup>
                    </Marker>
                ))}

                {/* Route Line */}
                <Polyline
                    positions={routeCoordinates}
                    color="#007AFF"
                    weight={4}
                    opacity={0.7}
                />
            </MapContainer>
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
});

export default MapView;
