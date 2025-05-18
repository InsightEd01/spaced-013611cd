
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

// We're using the values directly from the integrations folder instead of environment variables
const supabaseUrl = "https://ssrhvkewfijkyylgffzs.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzcmh2a2V3Zmlqa3l5bGdmZnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDg5NDEsImV4cCI6MjA2MzA4NDk0MX0.Wute4ADWntAjh5usU3fbTzJ13LX1jxH2NeaSsx2sogY";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Get the user's role from their metadata
export const getRole = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Get role from user metadata
  return user.user_metadata.role as string || null;
};
