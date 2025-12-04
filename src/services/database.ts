import { supabase } from './supabase';

// Types
export interface Ride {
    id: string;
    driver_id: string;
    from_location: string;
    to_location: string;
    departure_date: string;
    departure_time: string;
    available_seats: number;
    price_per_seat: number;
    instant_booking: boolean;
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_color?: string;
    status?: string;
    created_at: string;
    driver?: {
        id: string;
        full_name: string;
        avatar_url?: string;
    };
}

export interface Profile {
    id: string;
    full_name: string;
    avatar_url?: string;
    bio?: string;
    phone?: string;
    created_at: string;
}

/**
 * Fetch all available rides with driver information
 */
export const fetchRides = async (filters?: {
    from?: string;
    to?: string;
    date?: string;
    minSeats?: number;
}): Promise<Ride[]> => {
    try {
        console.log('📋 Fetching all rides with filters:', filters);

        let query = supabase
            .from('rides')
            .select(`
        *,
        driver:profiles!driver_id (
          id,
          full_name,
          avatar_url
        )
      `)
            .gte('available_seats', 1)
            .eq('status', 'active')
            .order('departure_date', { ascending: true });

        if (filters?.from) {
            query = query.ilike('from_location', `%${filters.from}%`);
        }
        if (filters?.to) {
            query = query.ilike('to_location', `%${filters.to}%`);
        }
        if (filters?.date) {
            query = query.gte('departure_date', filters.date);
        }
        if (filters?.minSeats) {
            query = query.gte('available_seats', filters.minSeats);
        }

        const { data, error } = await query;

        if (error) {
            console.error('❌ Error fetching rides:', error);
            throw error;
        }

        console.log(`✅ Fetched ${data?.length || 0} rides`);
        return data || [];
    } catch (error) {
        console.error('💥 Failed to fetch rides:', error);
        return [];
    }
};

/**
 * Search rides with advanced filters
 */
export const searchRides = async (params: {
    from: string;
    to: string;
    date?: string;
    passengers?: number;
    sortBy?: 'price' | 'time' | 'rating';
    instantOnly?: boolean;
}): Promise<Ride[]> => {
    try {
        console.log('🔍 Searching rides with params:', params);

        let query = supabase
            .from('rides')
            .select(`
        *,
        driver:profiles!driver_id (
          id,
          full_name,
          avatar_url
        )
      `)
            .gte('available_seats', params.passengers || 1)
            .eq('status', 'active');


        // Apply location filters if provided (case-insensitive)
        if (params.from && params.from.trim() !== '') {
            console.log('📍 Filtering by from_location:', params.from);
            query = query.ilike('from_location', `%${params.from.trim()}%`);
        }

        if (params.to && params.to.trim() !== '') {
            console.log('🎯 Filtering by to_location:', params.to);
            query = query.ilike('to_location', `%${params.to.trim()}%`);
        }

        if (params.date) {
            console.log('📅 Filtering by date:', params.date);
            query = query.gte('departure_date', params.date);
        }

        if (params.instantOnly) {
            console.log('⚡ Filtering instant booking only');
            query = query.eq('instant_booking', true);
        }

        // Apply sorting
        if (params.sortBy === 'price') {
            query = query.order('price_per_seat', { ascending: true });
        } else if (params.sortBy === 'time') {
            query = query
                .order('departure_date', { ascending: true })
                .order('departure_time', { ascending: true });
        } else {
            query = query.order('departure_date', { ascending: true });
        }

        const { data, error } = await query;

        if (error) {
            console.error('❌ Error searching rides:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            throw error;
        }

        console.log(`✅ Found ${data?.length || 0} rides`);
        if (data && data.length > 0) {
            console.log('First ride:', data[0]);
        }

        return data || [];
    } catch (error) {
        console.error('💥 Failed to search rides:', error);
        console.error('Error stack:', error);
        return [];
    }
};

export const fetchRideById = async (rideId: string): Promise<Ride | null> => {
    try {
        const { data, error } = await supabase
            .from('rides')
            .select(`
        *,
        driver:profiles!driver_id (
          id,
          full_name,
          avatar_url,
          bio,
          phone
        )
      `)
            .eq('id', rideId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Failed to fetch ride:', error);
        return null;
    }
};

export const createRide = async (rideData: any): Promise<Ride | null> => {
    try {
        const { data, error } = await supabase
            .from('rides')
            .insert([rideData])
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Failed to create ride:', error);
        return null;
    }
};

export const updateRide = async (rideId: string, updates: Partial<Ride>): Promise<Ride | null> => {
    try {
        const { data, error } = await supabase
            .from('rides')
            .update(updates)
            .eq('id', rideId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Failed to update ride:', error);
        return null;
    }
};

export const deleteRide = async (rideId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('rides')
            .delete()
            .eq('id', rideId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Failed to delete ride:', error);
        return false;
    }
};

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Failed to fetch profile:', error);
        return null;
    }
};

export const updateProfile = async (userId: string, updates: Partial<Profile>): Promise<Profile | null> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Failed to update profile:', error);
        return null;
    }
};
