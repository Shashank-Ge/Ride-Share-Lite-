import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
// import { requestNotificationPermissions, setupNotificationListeners } from './src/services/notifications';

export default function App() {
  // Temporarily commented out to debug blank screen
  // useEffect(() => {
  //   // Request notification permissions on app start
  //   requestNotificationPermissions();

  //   // Setup notification listeners
  //   const cleanup = setupNotificationListeners(
  //     (notification) => {
  //       console.log('📬 Notification received:', notification);
  //     },
  //     (response) => {
  //       console.log('👆 Notification tapped:', response);
  //       // TODO: Navigate based on notification type
  //       const data = response.notification.request.content.data;
  //       if (data?.type === 'new_message') {
  //         // Navigate to chat
  //       }
  //     }
  //   );

  //   return cleanup;
  // }, []);

  return (
    <AuthProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
