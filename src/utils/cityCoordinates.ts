// City coordinates for major Indian cities
export const CITY_COORDINATES: Record<string, { latitude: number; longitude: number }> = {
    // Major metros
    'delhi': { latitude: 28.6139, longitude: 77.2090 },
    'new delhi': { latitude: 28.6139, longitude: 77.2090 },
    'mumbai': { latitude: 19.0760, longitude: 72.8777 },
    'bangalore': { latitude: 12.9716, longitude: 77.5946 },
    'bengaluru': { latitude: 12.9716, longitude: 77.5946 },
    'kolkata': { latitude: 22.5726, longitude: 88.3639 },
    'chennai': { latitude: 13.0827, longitude: 80.2707 },
    'hyderabad': { latitude: 17.3850, longitude: 78.4867 },
    'pune': { latitude: 18.5204, longitude: 73.8567 },
    'ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
    'jaipur': { latitude: 26.9124, longitude: 75.7873 },

    // Tier 2 cities
    'agra': { latitude: 27.1767, longitude: 78.0081 },
    'lucknow': { latitude: 26.8467, longitude: 80.9462 },
    'kanpur': { latitude: 26.4499, longitude: 80.3319 },
    'nagpur': { latitude: 21.1458, longitude: 79.0882 },
    'indore': { latitude: 22.7196, longitude: 75.8577 },
    'bhopal': { latitude: 23.2599, longitude: 77.4126 },
    'visakhapatnam': { latitude: 17.6868, longitude: 83.2185 },
    'patna': { latitude: 25.5941, longitude: 85.1376 },
    'vadodara': { latitude: 22.3072, longitude: 73.1812 },
    'ghaziabad': { latitude: 28.6692, longitude: 77.4538 },
    'ludhiana': { latitude: 30.9010, longitude: 75.8573 },
    'coimbatore': { latitude: 11.0168, longitude: 76.9558 },
    'kochi': { latitude: 9.9312, longitude: 76.2673 },
    'cochin': { latitude: 9.9312, longitude: 76.2673 },
    'chandigarh': { latitude: 30.7333, longitude: 76.7794 },

    // Popular tourist destinations
    'goa': { latitude: 15.2993, longitude: 74.1240 },
    'shimla': { latitude: 31.1048, longitude: 77.1734 },
    'manali': { latitude: 32.2396, longitude: 77.1887 },
    'jaisalmer': { latitude: 26.9157, longitude: 70.9083 },
    'udaipur': { latitude: 24.5854, longitude: 73.7125 },
    'rishikesh': { latitude: 30.0869, longitude: 78.2676 },
    'varanasi': { latitude: 25.3176, longitude: 82.9739 },
    'amritsar': { latitude: 31.6340, longitude: 74.8723 },
    'mysore': { latitude: 12.2958, longitude: 76.6394 },
    'mysuru': { latitude: 12.2958, longitude: 76.6394 },
    'ooty': { latitude: 11.4102, longitude: 76.6950 },
    'darjeeling': { latitude: 27.0410, longitude: 88.2663 },

    // NCR cities
    'noida': { latitude: 28.5355, longitude: 77.3910 },
    'gurugram': { latitude: 28.4595, longitude: 77.0266 },
    'gurgaon': { latitude: 28.4595, longitude: 77.0266 },
    'faridabad': { latitude: 28.4089, longitude: 77.3178 },
    'greater noida': { latitude: 28.4744, longitude: 77.5040 },

    // Other important cities
    'mathura': { latitude: 27.4924, longitude: 77.6737 },
    'vrindavan': { latitude: 27.5820, longitude: 77.6990 },
    'haridwar': { latitude: 29.9457, longitude: 78.1642 },
    'dehradun': { latitude: 30.3165, longitude: 78.0322 },
    'nainital': { latitude: 29.3803, longitude: 79.4636 },
    'mussoorie': { latitude: 30.4598, longitude: 78.0644 },
    'surat': { latitude: 21.1702, longitude: 72.8311 },
    'rajkot': { latitude: 22.3039, longitude: 70.8022 },
    'jodhpur': { latitude: 26.2389, longitude: 73.0243 },
    'kota': { latitude: 25.2138, longitude: 75.8648 },
    'ajmer': { latitude: 26.4499, longitude: 74.6399 },
    'bikaner': { latitude: 28.0229, longitude: 73.3119 },
};

/**
 * Get coordinates for a city name
 * @param cityName - Name of the city (case-insensitive)
 * @returns Coordinates object or null if not found
 */
export const getCityCoordinates = (cityName: string): { latitude: number; longitude: number } | null => {
    if (!cityName) return null;

    const normalizedName = cityName.toLowerCase().trim();
    return CITY_COORDINATES[normalizedName] || null;
};

/**
 * Get coordinates for a city with fallback to default
 * @param cityName - Name of the city
 * @param defaultCoords - Default coordinates if city not found
 * @returns Coordinates object
 */
export const getCityCoordinatesWithFallback = (
    cityName: string,
    defaultCoords: { latitude: number; longitude: number } = { latitude: 28.6139, longitude: 77.2090 }
): { latitude: number; longitude: number } => {
    return getCityCoordinates(cityName) || defaultCoords;
};

/**
 * Extract city name from a full address string
 * @param address - Full address string
 * @returns Extracted city name or original address
 */
export const extractCityName = (address: string): string => {
    if (!address) return '';

    // Try to find a known city in the address
    const normalizedAddress = address.toLowerCase();
    for (const city of Object.keys(CITY_COORDINATES)) {
        if (normalizedAddress.includes(city)) {
            return city;
        }
    }

    // If no known city found, return the original address
    return address;
};
