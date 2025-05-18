import { createClient } from '@supabase/supabase-js';

// Replace with your actual Supabase URL and Anon Key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getRole = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user role:', error);
    return null;
  }

  return data?.role;
};
