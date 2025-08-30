import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

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
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
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
  const { error } = await supabase
    .from('user_budgets')
    .upsert({
      user_id: userId,
      budget_data: data,
      updated_at: new Date().toISOString(),
    });
  
  if (error) throw error;
};

export const getUserData = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_budgets')
    .select('budget_data')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data?.budget_data;
};
