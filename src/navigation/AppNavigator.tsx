import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

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

// Import types
import { RootStackParamList, AuthStackParamList, MainTabsParamList } from '../types/navigation';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabsParamList>();

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

// Main Tabs Navigator
const MainNavigator = () => {
    return (
        <MainTabs.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: '#999',
                headerShown: false,
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
        <NavigationContainer linking={linking}>
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
