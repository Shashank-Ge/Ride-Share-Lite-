import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';
import { createProfile } from '../services/database';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, fullName: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set a timeout to prevent hanging if Supabase is not configured
        const timeout = setTimeout(() => {
            console.log('Supabase initialization timeout - proceeding without authentication');
            setLoading(false);
        }, 3000);

        // Get initial session
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                clearTimeout(timeout);
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Supabase auth error:', error);
                clearTimeout(timeout);
                setLoading(false);
            });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth state changed:', event, 'Session:', !!session);
            setSession(session);
            setUser(session?.user ?? null);
        });

        return () => {
            clearTimeout(timeout);
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
    };

    const signUp = async (email: string, password: string, fullName: string) => {
        // Create auth user
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Create profile record with full name
        if (data.user) {
            await createProfile({
                id: data.user.id,
                full_name: fullName,
            });
        }
    };

    const signOut = async () => {
        try {
            console.log('🔴 [AuthContext] signOut() called');

            // Clear the session and user state immediately
            console.log('🔴 [AuthContext] Clearing session and user state...');
            setSession(null);
            setUser(null);
            console.log('✅ [AuthContext] Local state cleared');

            // Sign out from Supabase
            console.log('🔴 [AuthContext] Calling Supabase signOut...');
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('❌ [AuthContext] Supabase sign out error:', error);
                throw error;
            }

            console.log('✅ [AuthContext] Successfully signed out from Supabase');
            console.log('✅ [AuthContext] signOut() completed successfully');
        } catch (error) {
            console.error('❌ [AuthContext] Sign out failed:', error);
            throw error;
        }
    };

    const value = {
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
