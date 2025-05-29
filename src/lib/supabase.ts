
// Redirecting to the main Supabase client
export { supabase } from '@/integrations/supabase/client';

// Get the user's role from their metadata
export const getRole = async () => {
  const { supabase } = await import('@/integrations/supabase/client');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Get role from user metadata
  return user.user_metadata.role as string || null;
};
