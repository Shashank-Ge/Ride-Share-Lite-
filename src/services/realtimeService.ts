import { supabase } from './supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

// Store active channels for cleanup
let channels: RealtimeChannel[] = [];

/**
 * Subscribe to booking updates for a specific user (as passenger)
 */
export const subscribeToPassengerBookings = (
    userId: string,
    onUpdate: (payload: any) => void
): RealtimeChannel => {
    console.log('📡 Subscribing to passenger bookings for user:', userId);

    const channel = supabase
        .channel(`passenger_bookings:${userId}`)
        .on(
            'postgres_changes',
            {
                event: '*', // Listen to INSERT, UPDATE, DELETE
                schema: 'public',
                table: 'bookings',
                filter: `passenger_id=eq.${userId}`,
            },
            (payload) => {
                console.log('📡 Passenger booking update received:', payload);
                onUpdate(payload);
            }
        )
        .subscribe((status) => {
            console.log('📡 Passenger booking subscription status:', status);
        });

    channels.push(channel);
    return channel;
};

/**
 * Subscribe to booking requests for a driver's rides
 */
export const subscribeToDriverBookings = (
    driverId: string,
    onUpdate: (payload: any) => void
): RealtimeChannel => {
    console.log('📡 Subscribing to driver bookings for user:', driverId);

    // We need to subscribe to bookings where the ride belongs to this driver
    // This requires a join, so we'll subscribe to all bookings and filter client-side
    const channel = supabase
        .channel(`driver_bookings:${driverId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'bookings',
            },
            async (payload) => {
                console.log('📡 Booking update received, checking if for driver:', payload);

                // Check if this booking is for one of the driver's rides
                if (payload.new && (payload.new as any).ride_id) {
                    const { data: ride } = await supabase
                        .from('rides')
                        .select('driver_id')
                        .eq('id', (payload.new as any).ride_id)
                        .single();

                    if (ride?.driver_id === driverId) {
                        console.log('📡 Booking is for this driver, triggering update');
                        onUpdate(payload);
                    }
                }
            }
        )
        .subscribe((status) => {
            console.log('📡 Driver booking subscription status:', status);
        });

    channels.push(channel);
    return channel;
};

/**
 * Subscribe to ride updates (for seat availability changes)
 */
export const subscribeToRideUpdates = (
    rideId: string,
    onUpdate: (payload: any) => void
): RealtimeChannel => {
    console.log('📡 Subscribing to ride updates for ride:', rideId);

    const channel = supabase
        .channel(`ride:${rideId}`)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'rides',
                filter: `id=eq.${rideId}`,
            },
            (payload) => {
                console.log('📡 Ride update received:', payload);
                onUpdate(payload);
            }
        )
        .subscribe((status) => {
            console.log('📡 Ride subscription status:', status);
        });

    channels.push(channel);
    return channel;
};

/**
 * Subscribe to all rides published by a driver
 */
export const subscribeToDriverRides = (
    driverId: string,
    onUpdate: (payload: any) => void
): RealtimeChannel => {
    console.log('📡 Subscribing to driver rides for user:', driverId);

    const channel = supabase
        .channel(`driver_rides:${driverId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'rides',
                filter: `driver_id=eq.${driverId}`,
            },
            (payload) => {
                console.log('📡 Driver ride update received:', payload);
                onUpdate(payload);
            }
        )
        .subscribe((status) => {
            console.log('📡 Driver rides subscription status:', status);
        });

    channels.push(channel);
    return channel;
};

/**
 * Unsubscribe from a specific channel
 */
export const unsubscribeChannel = async (channel: RealtimeChannel) => {
    console.log('📡 Unsubscribing from channel');
    await channel.unsubscribe();
    channels = channels.filter(c => c !== channel);
};

/**
 * Unsubscribe from all channels (cleanup)
 */
export const unsubscribeAll = async () => {
    console.log('📡 Unsubscribing from all channels');
    for (const channel of channels) {
        await channel.unsubscribe();
    }
    channels = [];
};
