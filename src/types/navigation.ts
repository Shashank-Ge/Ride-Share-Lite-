import { NavigationProp, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Root Stack Navigator
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Main: undefined;
};

// Auth Stack Navigator
export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
};

// Main Tabs Navigator
export type MainTabsParamList = {
  Home: undefined;
  Search: undefined;
  Publish: undefined;
  MyRides: undefined;
  Profile: undefined;
  SearchResults: {
    from?: string;
    to?: string;
    date?: string;
    passengers?: number;
  };
  RideDetails: {
    rideId: number;
    from: string;
    to: string;
    date: string;
    departureTime: string;
    price: number;
    driver: string;
    rating: number;
    seats: number;
    vehicle: string;
    instant?: boolean;
  };
  EditProfile: undefined;
  Verification: undefined;
  Notifications: undefined;
  Privacy: undefined;
};

// Navigation Props
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabsNavigationProp = BottomTabNavigationProp<MainTabsParamList>;

// Route Props
export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;
export type AuthStackRouteProp<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;
export type MainTabsRouteProp<T extends keyof MainTabsParamList> = RouteProp<MainTabsParamList, T>;
