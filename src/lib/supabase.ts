import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'giftflare-web'
    }
  }
});

// Enhanced connection test with retry logic
let connectionAttempts = 0;
const maxAttempts = 3;

const testConnection = async () => {
  try {
    connectionAttempts++;
    console.log(`Testing Supabase connection (attempt ${connectionAttempts}/${maxAttempts})...`);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection error:', error);
      if (connectionAttempts < maxAttempts) {
        setTimeout(testConnection, 2000);
      }
    } else {
      console.log('✅ Supabase connected successfully');
    }
  } catch (err) {
    console.error('Supabase connection failed:', err);
    if (connectionAttempts < maxAttempts) {
      setTimeout(testConnection, 2000);
    }
  }
};

testConnection();