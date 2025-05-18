
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// Replace with your actual Supabase URL and Anon Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const getRole = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Get role from user metadata
  return user.user_metadata.role as string || null;
};
