import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import LandingScreen from '../screens/auth/LandingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import PublishScreen from '../screens/main/PublishScreen';
import MyRidesScreen from '../screens/main/MyRidesScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SearchResultsScreen from '../screens/main/SearchResultsScreen';
import RideDetailsScreen from '../screens/main/RideDetailsScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import VerificationScreen from '../screens/profile/VerificationScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import PrivacyScreen from '../screens/profile/PrivacyScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatScreen from '../screens/chat/ChatScreen';

// Import types
import { RootStackParamList, AuthStackParamList, MainTabsParamList } from '../types/navigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabsParamList>();
const MainStack = createNativeStackNavigator();

// Auth Stack Navigator
const AuthNavigator = () => {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Landing" component={LandingScreen} />
            <AuthStack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: true, title: 'Login' }}
            />
            <AuthStack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ headerShown: true, title: 'Sign Up' }}
            />
        </AuthStack.Navigator>
    );
};

// Bottom Tabs Navigator (Only visible tabs)
const TabsNavigator = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <MainTabs.Navigator
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textTertiary,
                headerShown: false,
                tabBarStyle: {
                    paddingBottom: 5 + insets.bottom,
                    paddingTop: 5,
                    height: 60 + insets.bottom,
                    backgroundColor: theme.colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarItemStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    marginTop: 2,
                    marginBottom: 4,
                },
                tabBarIconStyle: {
                    marginBottom: 4,
                },
            }}
        >
            <MainTabs.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <TabIcon name="🏠" color={color} />,
                }}
            />
            <MainTabs.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    tabBarLabel: 'Search',
                    tabBarIcon: ({ color }) => <TabIcon name="🔍" color={color} />,
                }}
            />
            <MainTabs.Screen
                name="Publish"
                component={PublishScreen}
                options={{
                    tabBarLabel: 'Publish',
                    tabBarIcon: ({ color }) => <TabIcon name="➕" color={color} />,
                }}
            />
            <MainTabs.Screen
                name="MyRides"
                component={MyRidesScreen}
                options={{
                    tabBarLabel: 'My Rides',
                    tabBarIcon: ({ color }) => <TabIcon name="🚗" color={color} />,
                }}
            />
            <MainTabs.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color }) => <TabIcon name="👤" color={color} />,
                }}
            />
        </MainTabs.Navigator>
    );
};

// Main Stack Navigator (Tabs + Modal Screens)
const MainNavigator = () => {
    return (
        <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen name="Tabs" component={TabsNavigator} />
            <MainStack.Screen
                name="SearchResults"
                component={SearchResultsScreen}
                options={{ headerShown: true, title: 'Search Results' }}
            />
            <MainStack.Screen
                name="RideDetails"
                component={RideDetailsScreen}
                options={{ headerShown: true, title: 'Ride Details' }}
            />
            <MainStack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ headerShown: true, title: 'Edit Profile' }}
            />
            <MainStack.Screen
                name="Verification"
                component={VerificationScreen}
                options={{ headerShown: true, title: 'Verification' }}
            />
            <MainStack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ headerShown: true, title: 'Notifications' }}
            />
            <MainStack.Screen
                name="Privacy"
                component={PrivacyScreen}
                options={{ headerShown: true, title: 'Privacy' }}
            />
            <MainStack.Screen
                name="ChatList"
                component={ChatListScreen}
                options={{ headerShown: true, title: 'Messages' }}
            />
            <MainStack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ headerShown: true, title: 'Chat' }}
            />
        </MainStack.Navigator>
    );
};

// Simple emoji icon component
const TabIcon = ({ name, color }: { name: string; color: string }) => {
    return <Text style={{ fontSize: 24, color }}>{name}</Text>;
};

// Linking configuration for browser back button support
const linking = {
    prefixes: ['http://localhost:8081', 'ridesharelite://'],
    config: {
        screens: {
            Auth: {
                path: 'auth',
                screens: {
                    Landing: '',
                    Login: 'login',
                    Signup: 'signup',
                },
            },
            Main: {
                path: 'app',
                screens: {
                    Home: 'home',
                    Search: 'search',
                    Publish: 'publish',
                    MyRides: 'my-rides',
                    Profile: 'profile',
                    SearchResults: 'search-results',
                    RideDetails: 'ride-details',
                },
            },
        },
    },
};

// Root Navigator
const AppNavigator = () => {
    const { session, loading } = useAuth();

    if (loading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer
            linking={linking}
            key={session ? 'authenticated' : 'unauthenticated'}
        >
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
                {!session ? (
                    <RootStack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    <RootStack.Screen name="Main" component={MainNavigator} />
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
