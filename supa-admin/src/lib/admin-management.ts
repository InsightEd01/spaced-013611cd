import { supabase } from '@/lib/supabase';

interface AdminUser {
  email: string;
  name: string;
  schoolId?: string;
}

export async function createAdmin(type: 'supa' | 'school', userData: AdminUser) {
  try {
    // Create the user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: generateTemporaryPassword(), // This would be a function to generate a secure temporary password
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: type === 'supa' ? 'supa_admin' : 'school_admin',
        school_id: userData.schoolId,
      },
    });

    if (authError) throw authError;

    // Log the admin creation in audit_logs
    await supabase.from('audit_logs').insert({
      action: type === 'supa' ? 'supa_admin_created' : 'school_admin_created',
      supa_admin_id: (await supabase.auth.getUser()).data.user?.id,
      target_school_id: userData.schoolId,
      details: {
        admin_email: userData.email,
        admin_name: userData.name,
      },
    });

    return { success: true, data: authUser };
  } catch (error) {
    console.error(\`Failed to create \${type} admin:\`, error);
    return { success: false, error };
  }
}

export async function resetAdminPassword(userId: string) {
  try {
    const { data, error } = await supabase.auth.admin.resetUserPassword(userId);
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Failed to reset admin password:', error);
    return { success: false, error };
  }
}

export async function removeAdminAccess(userId: string, type: 'supa' | 'school') {
  try {
    // Soft delete the user
    const { error } = await supabase.auth.admin.deleteUser(userId, true);
    if (error) throw error;

    // Log the admin removal
    await supabase.from('audit_logs').insert({
      action: type === 'supa' ? 'supa_admin_removed' : 'school_admin_removed',
      supa_admin_id: (await supabase.auth.getUser()).data.user?.id,
      details: {
        removed_user_id: userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to remove admin access:', error);
    return { success: false, error };
  }
}

function generateTemporaryPassword() {
  // Generate a secure random password (this is a simple example)
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}
