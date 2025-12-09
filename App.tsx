import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';
import { requestNotificationPermissions, setupNotificationListeners, getPushToken } from './src/services/notifications';
import { updatePushToken } from './src/services/database';

// Wrapper component to access auth context
function AppContent() {
  const { session } = useAuth();

  useEffect(() => {
    // Only initialize notifications on mobile (not web)
    if (Platform.OS !== 'web') {
      requestNotificationPermissions();

      const cleanup = setupNotificationListeners(
        (notification) => {
          console.log('📬 Notification received:', notification);
        },
        (response) => {
          console.log('👆 Notification tapped:', response);
          // TODO: Navigate based on notification type
          const data = response.notification.request.content.data;
          if (data?.type === 'new_message') {
            // Navigate to chat
          }
        }
      );

      return cleanup;
    }
  }, []);

  // Register push token when user logs in
  useEffect(() => {
    const registerPushToken = async () => {
      if (Platform.OS === 'web') {
        console.log('⚠️ Push notifications not supported on web');
        return;
      }

      if (!session?.user?.id) {
        console.log('⚠️ No user session, skipping push token registration');
        return;
      }

      try {
        console.log('📱 Registering push token for user:', session.user.id);
        const token = await getPushToken();

        if (token) {
          await updatePushToken(session.user.id, token);
          console.log('✅ Push token registered successfully');
        } else {
          console.log('⚠️ Failed to get push token');
        }
      } catch (error) {
        console.error('❌ Error registering push token:', error);
      }
    };

    registerPushToken();
  }, [session?.user?.id]);

  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

