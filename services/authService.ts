import { supabase } from './supabaseClient';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  university?: string;
  subjects?: string[];
}

export interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
}

export class AuthService {
  static async signUp(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const profileData = {
          id: data.user.id,
          email: data.user.email || email,
          name: name || '',
          avatar_url: null,
          university: null,
          subjects: [],
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData]);

        if (profileError) {
          return { user: null, error: profileError.message };
        }

        const user: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          name: name,
        };

        return { user, error: null };
      }

      return { user: null, error: 'Sign up failed' };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          return { user: null, error: profileError.message };
        }

        const user: AuthUser = profileData || {
          id: data.user.id,
          email: data.user.email || email,
          name: '',
        };

        return { user, error: null };
      }

      return { user: null, error: 'Sign in failed' };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async getCurrentSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { session: data.session, error: error?.message || null };
    } catch (error) {
      return {
        session: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        return { user: null, error: error?.message || 'No user found' };
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profileError) {
        return { user: null, error: profileError.message };
      }

      const user: AuthUser = profileData || {
        id: data.user.id,
        email: data.user.email || '',
        name: '',
      };

      return { user, error: null };
    } catch (error) {
      return {
        user: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const subscription = supabase.auth.onAuthStateChange(async (event: any, session: any) => {
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        const user: AuthUser = profileData || {
          id: session.user.id,
          email: session.user.email || '',
          name: '',
        };

        callback(user);
      } else {
        callback(null);
      }
    });

    return subscription;
  }
}
