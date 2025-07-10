import { supabase, isSupabaseConfigured } from './supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

export async function signUp(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.');
  }
  
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password,
    options: {
      data: {
        username: email.split('@')[0] // Use email prefix as default username
      }
    }
  });
  
  if (error) {
    console.error('Sign up error:', error);
    throw error;
  }
  
  if (!data.user) {
    throw new Error('No user data returned from sign up');
  }
  
  return data.user;
}

export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.');
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
  
  if (error) {
    console.error('Sign in error:', error);
    
    // Handle specific error cases
    if (error.message === 'Email not confirmed') {
      throw new Error('Email not confirmed. Please check your email for a confirmation link, or try creating a new account.');
    }
    
    throw error;
  }
  
  if (!data.user) {
    throw new Error('No user data returned from sign in');
  }
  
  return data.user;
}

export async function signOut() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.');
  }
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<SupabaseUser | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function resetPassword(email: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured. Please set up your environment variables.');
  }
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
}

// Listen for auth state changes
export function onAuthStateChange(callback: (user: SupabaseUser | null) => void) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: { subscription: null } };
  }
  
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
} 