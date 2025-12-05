export type ThemeMode = 'light' | 'dark';

export interface Theme {
    mode: ThemeMode;
    colors: {
        // Base colors
        background: string;
        surface: string;
        surfaceVariant: string;
        text: string;
        textSecondary: string;
        textTertiary: string;
        border: string;
        borderLight: string;

        // Brand colors
        primary: string;
        primaryLight: string;
        primaryDark: string;
        secondary: string;
        accent: string;

        // Status colors
        success: string;
        warning: string;
        error: string;
        info: string;

        // Glass colors
        glassBackground: string;
        glassBorder: string;
        glassHighlight: string;

        // Overlay
        overlay: string;
        overlayLight: string;
    };
    gradients: {
        primary: string[];
        secondary: string[];
        accent: string[];
        success: string[];
        hero: string[];
        card: string[];
        button: string[];
    };
    glass: {
        light: {
            backgroundColor: string;
            borderColor: string;
            opacity: number;
            blur: number;
        };
        medium: {
            backgroundColor: string;
            borderColor: string;
            opacity: number;
            blur: number;
        };
        strong: {
            backgroundColor: string;
            borderColor: string;
            opacity: number;
            blur: number;
        };
    };
    shadows: {
        small: {
            shadowColor: string;
            shadowOffset: { width: number; height: number };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
        medium: {
            shadowColor: string;
            shadowOffset: { width: number; height: number };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
        large: {
            shadowColor: string;
            shadowOffset: { width: number; height: number };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
        };
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    borderRadius: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
        full: number;
    };
    typography: {
        h1: { fontSize: number; fontWeight: string; lineHeight: number };
        h2: { fontSize: number; fontWeight: string; lineHeight: number };
        h3: { fontSize: number; fontWeight: string; lineHeight: number };
        h4: { fontSize: number; fontWeight: string; lineHeight: number };
        body: { fontSize: number; fontWeight: string; lineHeight: number };
        bodyLarge: { fontSize: number; fontWeight: string; lineHeight: number };
        caption: { fontSize: number; fontWeight: string; lineHeight: number };
        button: { fontSize: number; fontWeight: string; lineHeight: number };
    };
}

// Light Theme
export const lightTheme: Theme = {
    mode: 'light',
    colors: {
        background: '#F8FAFB',
        surface: '#FFFFFF',
        surfaceVariant: '#F1F5F9',
        text: '#0F172A',
        textSecondary: '#475569',
        textTertiary: '#94A3B8',
        border: '#E2E8F0',
        borderLight: '#F1F5F9',

        primary: '#0EA5E9',
        primaryLight: '#38BDF8',
        primaryDark: '#0284C7',
        secondary: '#14B8A6',
        accent: '#3B82F6',

        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#06B6D4',

        glassBackground: 'rgba(255, 255, 255, 0.7)',
        glassBorder: 'rgba(255, 255, 255, 0.8)',
        glassHighlight: 'rgba(255, 255, 255, 0.9)',

        overlay: 'rgba(0, 0, 0, 0.5)',
        overlayLight: 'rgba(0, 0, 0, 0.3)',
    },
    gradients: {
        primary: ['#0EA5E9', '#14B8A6'],
        secondary: ['#14B8A6', '#10B981'],
        accent: ['#3B82F6', '#0EA5E9'],
        success: ['#10B981', '#059669'],
        hero: ['#0EA5E9', '#14B8A6', '#10B981'],
        card: ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)'],
        button: ['#0EA5E9', '#0284C7'],
    },
    glass: {
        light: {
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            borderColor: 'rgba(255, 255, 255, 0.8)',
            opacity: 0.6,
            blur: 10,
        },
        medium: {
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            borderColor: 'rgba(255, 255, 255, 0.9)',
            opacity: 0.75,
            blur: 20,
        },
        strong: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'rgba(255, 255, 255, 1)',
            opacity: 0.9,
            blur: 30,
        },
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 4,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 8,
        },
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
    },
    typography: {
        h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
        h2: { fontSize: 28, fontWeight: 'bold', lineHeight: 36 },
        h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
        h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
        body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
        bodyLarge: { fontSize: 18, fontWeight: '400', lineHeight: 28 },
        caption: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
        button: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
    },
};

// Dark Theme
export const darkTheme: Theme = {
    mode: 'dark',
    colors: {
        background: '#0F172A',
        surface: '#1E293B',
        surfaceVariant: '#334155',
        text: '#F8FAFC',
        textSecondary: '#E2E8F0',
        textTertiary: '#94A3B8',
        border: '#475569',
        borderLight: '#64748B',

        primary: '#38BDF8',
        primaryLight: '#7DD3FC',
        primaryDark: '#0EA5E9',
        secondary: '#2DD4BF',
        accent: '#60A5FA',

        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        info: '#22D3EE',

        glassBackground: 'rgba(30, 41, 59, 0.7)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
        glassHighlight: 'rgba(255, 255, 255, 0.05)',

        overlay: 'rgba(0, 0, 0, 0.7)',
        overlayLight: 'rgba(0, 0, 0, 0.5)',
    },
    gradients: {
        primary: ['#38BDF8', '#2DD4BF'],
        secondary: ['#2DD4BF', '#34D399'],
        accent: ['#60A5FA', '#38BDF8'],
        success: ['#34D399', '#10B981'],
        hero: ['#38BDF8', '#2DD4BF', '#34D399'],
        card: ['rgba(30, 41, 59, 0.9)', 'rgba(30, 41, 59, 0.7)'],
        button: ['#38BDF8', '#0EA5E9'],
    },
    glass: {
        light: {
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            opacity: 0.5,
            blur: 10,
        },
        medium: {
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            opacity: 0.7,
            blur: 20,
        },
        strong: {
            backgroundColor: 'rgba(30, 41, 59, 0.85)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            opacity: 0.85,
            blur: 30,
        },
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 4,
        },
        large: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 8,
        },
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
    },
    typography: {
        h1: { fontSize: 32, fontWeight: 'bold', lineHeight: 40 },
        h2: { fontSize: 28, fontWeight: 'bold', lineHeight: 36 },
        h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
        h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
        body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
        bodyLarge: { fontSize: 18, fontWeight: '400', lineHeight: 28 },
        caption: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
        button: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
    },
};
