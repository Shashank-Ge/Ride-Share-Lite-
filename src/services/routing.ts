import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENROUTE_API_KEY ||
    process.env.EXPO_PUBLIC_OPENROUTE_API_KEY;

const BASE_URL = 'https://api.openrouteservice.org/v2';

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface RouteResponse {
    geometry: any; // GeoJSON geometry
    distance: number; // in meters
    duration: number; // in seconds
    stopovers: string[]; // City names along the route
}

/**
 * Fetch route between two points using OpenRouteService
 */
export async function fetchRoute(
    start: Coordinates,
    end: Coordinates
): Promise<RouteResponse | null> {
    try {
        const url = `${BASE_URL}/directions/driving-car`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': API_KEY || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                coordinates: [
                    [start.longitude, start.latitude],
                    [end.longitude, end.latitude]
                ],
                instructions: false,
                geometry: true,
            }),
        });

        if (!response.ok) {
            console.error('OpenRouteService API error:', response.status);
            return null;
        }

        const data = await response.json();
        const route = data.features[0];

        if (!route) {
            return null;
        }

        // Extract stopovers from route (simplified - just major waypoints)
        const stopovers = await extractStopoversFromRoute(route.geometry);

        return {
            geometry: route.geometry,
            distance: route.properties.summary.distance,
            duration: route.properties.summary.duration,
            stopovers,
        };
    } catch (error) {
        console.error('Error fetching route:', error);
        return null;
    }
}

/**
 * Extract city names along the route using reverse geocoding
 */
async function extractStopoversFromRoute(geometry: any): Promise<string[]> {
    try {
        // Get coordinates along the route (sample every ~50km)
        const coordinates = geometry.coordinates;
        const totalPoints = coordinates.length;

        // Sample 3-5 points along the route
        const sampleIndices = [
            Math.floor(totalPoints * 0.25),
            Math.floor(totalPoints * 0.5),
            Math.floor(totalPoints * 0.75),
        ];

        const stopovers: string[] = [];

        for (const index of sampleIndices) {
            const [lon, lat] = coordinates[index];
            const cityName = await reverseGeocode(lat, lon);
            if (cityName && !stopovers.includes(cityName)) {
                stopovers.push(cityName);
            }
        }

        return stopovers;
    } catch (error) {
        console.error('Error extracting stopovers:', error);
        return [];
    }
}

/**
 * Reverse geocode coordinates to get city name
 */
async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
    try {
        const url = `${BASE_URL}/geocode/reverse`;

        const response = await fetch(
            `${url}?api_key=${API_KEY}&point.lon=${lon}&point.lat=${lat}&size=1`,
            {
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const feature = data.features[0];

        if (!feature) {
            return null;
        }

        // Try to get city name from properties
        const properties = feature.properties;
        return properties.locality || properties.county || properties.region || null;
    } catch (error) {
        console.error('Error reverse geocoding:', error);
        return null;
    }
}

/**
 * Geocode a place name to coordinates
 */
export async function geocodePlace(placeName: string): Promise<Coordinates | null> {
    try {
        const url = `${BASE_URL}/geocode/search`;

        const response = await fetch(
            `${url}?api_key=${API_KEY}&text=${encodeURIComponent(placeName)}&size=1`,
            {
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const feature = data.features[0];

        if (!feature) {
            return null;
        }

        const [longitude, latitude] = feature.geometry.coordinates;
        return { latitude, longitude };
    } catch (error) {
        console.error('Error geocoding place:', error);
        return null;
    }
}
