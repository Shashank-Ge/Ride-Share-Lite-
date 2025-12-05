import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
    try {
        if (!Device.isDevice) {
            console.log('Must use physical device for Push Notifications');
            return false;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return false;
        }

        console.log('✅ Notification permissions granted');
        return true;
    } catch (error) {
        console.error('Error requesting notification permissions:', error);
        return false;
    }
};

/**
 * Get push notification token
 */
export const getPushToken = async (): Promise<string | null> => {
    try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;

        if (!projectId) {
            console.log('No project ID found');
            return null;
        }

        const token = await Notifications.getExpoPushTokenAsync({
            projectId,
        });

        console.log('📱 Push token:', token.data);
        return token.data;
    } catch (error) {
        console.error('Error getting push token:', error);
        return null;
    }
};

/**
 * Schedule a local notification
 */
export const scheduleLocalNotification = async (
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
) => {
    try {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data,
                sound: true,
            },
            trigger: trigger || null, // null means immediate
        });

        console.log('📬 Notification scheduled:', id);
        return id;
    } catch (error) {
        console.error('Error scheduling notification:', error);
        return null;
    }
};

/**
 * Send booking confirmation notification
 */
export const sendBookingConfirmationNotification = async (
    rideDetails: {
        from: string;
        to: string;
        date: string;
        time: string;
    }
) => {
    return scheduleLocalNotification(
        '🎉 Booking Confirmed!',
        `Your ride from ${rideDetails.from} to ${rideDetails.to} on ${rideDetails.date} at ${rideDetails.time} is confirmed!`,
        { type: 'booking_confirmed', ...rideDetails }
    );
};

/**
 * Send new booking request notification (for drivers)
 */
export const sendNewBookingRequestNotification = async (
    passengerName: string,
    seats: number,
    route: string
) => {
    return scheduleLocalNotification(
        '📨 New Booking Request',
        `${passengerName} wants to book ${seats} seat(s) for ${route}`,
        { type: 'booking_request', passengerName, seats, route }
    );
};

/**
 * Send booking rejected notification
 */
export const sendBookingRejectedNotification = async (
    rideDetails: {
        from: string;
        to: string;
        date: string;
    }
) => {
    return scheduleLocalNotification(
        '❌ Booking Rejected',
        `Your booking request for ${rideDetails.from} to ${rideDetails.to} on ${rideDetails.date} was rejected.`,
        { type: 'booking_rejected', ...rideDetails }
    );
};

/**
 * Send ride reminder notification (1 hour before)
 */
export const scheduleRideReminder = async (
    rideDetails: {
        from: string;
        to: string;
        departureTime: string;
    },
    rideDateTime: Date
) => {
    const reminderTime = new Date(rideDateTime.getTime() - 60 * 60 * 1000); // 1 hour before

    if (reminderTime > new Date()) {
        return scheduleLocalNotification(
            '⏰ Ride Reminder',
            `Your ride from ${rideDetails.from} to ${rideDetails.to} starts in 1 hour at ${rideDetails.departureTime}`,
            { type: 'ride_reminder', ...rideDetails },
            { date: reminderTime }
        );
    }
    return null;
};

/**
 * Send new message notification
 */
export const sendNewMessageNotification = async (
    senderName: string,
    message: string
) => {
    return scheduleLocalNotification(
        `💬 ${senderName}`,
        message,
        { type: 'new_message', senderName }
    );
};

/**
 * Cancel a scheduled notification
 */
export const cancelNotification = async (notificationId: string) => {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log('🗑️ Notification cancelled:', notificationId);
    } catch (error) {
        console.error('Error cancelling notification:', error);
    }
};

/**
 * Cancel all notifications
 */
export const cancelAllNotifications = async () => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('🗑️ All notifications cancelled');
    } catch (error) {
        console.error('Error cancelling all notifications:', error);
    }
};

/**
 * Set up notification listeners
 */
export const setupNotificationListeners = (
    onNotificationReceived?: (notification: Notifications.Notification) => void,
    onNotificationTapped?: (response: Notifications.NotificationResponse) => void
) => {
    // Listener for when notification is received while app is foregrounded
    const receivedListener = Notifications.addNotificationReceivedListener((notification) => {
        console.log('📬 Notification received:', notification);
        onNotificationReceived?.(notification);
    });

    // Listener for when user taps on notification
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('👆 Notification tapped:', response);
        onNotificationTapped?.(response);
    });

    return () => {
        Notifications.removeNotificationSubscription(receivedListener);
        Notifications.removeNotificationSubscription(responseListener);
    };
};
