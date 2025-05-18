import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { updateSubscription } from '@/lib/schools';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { plan, status, end_date } = body;

    const updatedSubscription = await updateSubscription(params.id, {
      plan,
      status,
      end_date,
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { schoolId, plan, status, end_date } = body;

    // Create new subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          school_id: schoolId,
          plan,
          status,
          start_date: new Date().toISOString(),
          end_date,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Log the action
    await supabase.from('audit_logs').insert([
      {
        action: 'subscription_created',
        supa_admin_id: (await supabase.auth.getUser()).data.user?.id,
        target_school_id: schoolId,
        details: { plan, status, end_date },
      },
    ]);

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
