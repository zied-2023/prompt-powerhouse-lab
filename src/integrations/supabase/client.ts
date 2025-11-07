import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { logEnvironmentInfo } from '@/lib/envCheck';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

logEnvironmentInfo();

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  console.error('CRITICAL: Missing Supabase environment variables');
  console.error('Please configure environment variables in Vercel or your .env file');
  throw new Error('Missing Supabase environment variables. Please check your .env file or Vercel configuration.');
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});