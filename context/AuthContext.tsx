import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { AuthService, AuthUser } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { user } = await AuthService.getCurrentUser();
        if (isMounted) {
          setUser(user);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    const unsubscribe = AuthService.onAuthStateChange((currentUser) => {
      if (isMounted) {
        setUser(currentUser);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe?.data?.subscription?.unsubscribe?.();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user: authUser, error } = await AuthService.signIn(email, password);
      if (error) {
        return { error };
      }
      if (authUser) {
        setUser(authUser);
        return { error: null };
      }
      return { error: 'Sign in failed' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign in failed' };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const { user: authUser, error } = await AuthService.signUp(email, password, name);
      if (error) {
        return { error };
      }
      if (authUser) {
        setUser(authUser);
        return { error: null };
      }
      return { error: 'Sign up failed' };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign up failed' };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await AuthService.signOut();
      if (error) {
        return { error };
      }
      setUser(null);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Sign out failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isSignedIn: user !== null, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
