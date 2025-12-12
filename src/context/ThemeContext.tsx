import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeMode, lightTheme, darkTheme } from '../styles/theme';
import { Appearance } from 'react-native';

interface ThemeContextType {
    theme: Theme;
    themeMode: ThemeMode;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@rideshare_theme_mode';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
    const [isLoading, setIsLoading] = useState(true);

    // Load saved theme preference on mount
    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        console.log('🎨 [ThemeContext] Loading theme preference...');

        // Set a timeout to prevent hanging
        const timeout = setTimeout(() => {
            console.warn('⚠️ [ThemeContext] Theme loading timeout - using default light theme');
            setIsLoading(false);
        }, 2000);

        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            clearTimeout(timeout);

            console.log('🎨 [ThemeContext] Saved theme:', savedTheme);

            if (savedTheme === 'light' || savedTheme === 'dark') {
                setThemeModeState(savedTheme);
            } else {
                // Use system preference if no saved preference
                const systemTheme = Appearance.getColorScheme();
                console.log('🎨 [ThemeContext] Using system theme:', systemTheme);
                setThemeModeState(systemTheme === 'dark' ? 'dark' : 'light');
            }
        } catch (error) {
            console.error('❌ [ThemeContext] Failed to load theme preference:', error);
            clearTimeout(timeout);
        } finally {
            setIsLoading(false);
            console.log('✅ [ThemeContext] Theme loaded successfully');
        }
    };

    const setThemeMode = async (mode: ThemeMode) => {
        try {
            setThemeModeState(mode);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    const toggleTheme = () => {
        const newMode = themeMode === 'light' ? 'dark' : 'light';
        setThemeMode(newMode);
    };

    const theme = themeMode === 'light' ? lightTheme : darkTheme;
    const isDark = themeMode === 'dark';

    const value: ThemeContextType = {
        theme,
        themeMode,
        toggleTheme,
        setThemeMode,
        isDark,
    };

    // Don't render children until theme is loaded
    if (isLoading) {
        return null;
    }

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
