import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get Supa Admins
    const { data: supaAdmins, error: supaAdminError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('role', 'supa_admin')
      .order('created_at', { ascending: false });

    if (supaAdminError) throw supaAdminError;

    // Get School Admins with their school info
    const { data: schoolAdmins, error: schoolAdminError } = await supabase
      .from('auth.users')
      .select(\`
        *,
        schools!school_admin_schools (
          id,
          name
        )
      \`)
      .eq('role', 'school_admin')
      .order('created_at', { ascending: false });

    if (schoolAdminError) throw schoolAdminError;

    return NextResponse.json({
      supaAdmins,
      schoolAdmins,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, role, schoolId } = body;

    // Create user in auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        name,
        role,
        school_id: role === 'school_admin' ? schoolId : null,
      },
    });

    if (userError) throw userError;

    // If school admin, create relationship with school
    if (role === 'school_admin' && schoolId) {
      const { error: relationError } = await supabase
        .from('school_admin_schools')
        .insert([
          {
            admin_id: userData.user.id,
            school_id: schoolId,
          },
        ]);

      if (relationError) throw relationError;
    }

    // Log the action
    await supabase.from('audit_logs').insert([
      {
        action: \`\${role}_created\`,
        supa_admin_id: 'current_admin_id', // You would get this from the session
        target_school_id: schoolId || null,
        details: {
          email,
          name,
          role,
        },
      },
    ]);

    return NextResponse.json({ user: userData.user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
