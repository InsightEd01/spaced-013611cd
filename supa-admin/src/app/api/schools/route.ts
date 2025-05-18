import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: schools, error } = await supabase
      .from('schools')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ schools });
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, region, subscription_plan, admin_email } = body;

    // Insert the school
    const { data: school, error: schoolError } = await supabase
      .from('schools')
      .insert([
        {
          name,
          region,
          subscription_plan,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (schoolError) throw schoolError;

    // Create subscription record
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert([
        {
          school_id: school.id,
          plan: subscription_plan,
          status: 'trial',
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days trial
        },
      ]);

    if (subscriptionError) throw subscriptionError;

    // Invite school admin - This would typically involve sending an email
    // and creating a user record in auth.users with role='school_admin'
    
    return NextResponse.json({ school });
  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json(
      { error: 'Failed to create school' },
      { status: 500 }
    );
  }
}
