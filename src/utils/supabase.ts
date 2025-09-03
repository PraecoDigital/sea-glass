import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase configuration missing: set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  created_at: string;
}

export interface AuthError {
  message: string;
}

// Auth functions
export const signUp = async (email: string, password: string, name: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Sign up error:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Sign in error:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
};

// Database functions for user data
export const saveUserData = async (userId: string, data: any) => {
  try {
    const { error } = await supabase
      .from('user_budgets')
      .upsert({
        user_id: userId,
        budget_data: data,
        updated_at: new Date().toISOString(),
      });
    
    if (error) throw error;
  } catch (error) {
    console.error('Save user data error:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

export const getUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_budgets')
      .select('budget_data')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data?.budget_data;
  } catch (error) {
    console.error('Get user data error:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

// Test connection function for debugging
export const testSupabaseConnection = async () => {
  try {
    // Only log detailed info in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Testing Supabase connection...');
      console.log('Environment variables loaded:', {
        hasUrl: !!process.env.REACT_APP_SUPABASE_URL,
        hasKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
        urlValid: process.env.REACT_APP_SUPABASE_URL?.includes('supabase.co')
      });
    }
    
    const { data, error } = await supabase.from('user_budgets').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Supabase connection test successful');
    }
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
};
