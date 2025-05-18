import { supabase } from './supabase';
import { Database } from '@/types/database';

type School = Database['public']['Tables']['schools']['Row'];
type Subscription = Database['public']['Tables']['subscriptions']['Row'];

export async function getSchools() {
  const { data, error } = await supabase
    .from('schools')
    .select(\`
      *,
      subscriptions (
        id,
        plan,
        status,
        start_date,
        end_date
      )
    \`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSchool(id: string) {
  const { data, error } = await supabase
    .from('schools')
    .select(\`
      *,
      subscriptions (
        id,
        plan,
        status,
        start_date,
        end_date
      )
    \`)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createSchool(
  schoolData: Pick<School, 'name' | 'region' | 'subscription_plan'> & {
    admin_email: string;
  }
) {
  const { name, region, subscription_plan, admin_email } = schoolData;

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

  // Log the action
  await supabase.from('audit_logs').insert([
    {
      action: 'school_created',
      supa_admin_id: (await supabase.auth.getUser()).data.user?.id,
      target_school_id: school.id,
      details: {
        name,
        region,
        subscription_plan,
        admin_email,
      },
    },
  ]);

  return school;
}

export async function updateSchool(
  id: string,
  data: Partial<Pick<School, 'name' | 'region' | 'status' | 'subscription_plan'>>
) {
  const { data: school, error } = await supabase
    .from('schools')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Log the action
  await supabase.from('audit_logs').insert([
    {
      action: 'school_updated',
      supa_admin_id: (await supabase.auth.getUser()).data.user?.id,
      target_school_id: id,
      details: data,
    },
  ]);

  return school;
}

export async function updateSubscription(
  id: string,
  data: Partial<Pick<Subscription, 'plan' | 'status' | 'end_date'>>
) {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Log the action
  await supabase.from('audit_logs').insert([
    {
      action: 'subscription_updated',
      supa_admin_id: (await supabase.auth.getUser()).data.user?.id,
      target_school_id: subscription.school_id,
      details: data,
    },
  ]);

  return subscription;
}

export async function deleteSchool(id: string) {
  // Soft delete by updating status
  const { error } = await supabase
    .from('schools')
    .update({ status: 'inactive' })
    .eq('id', id);

  if (error) throw error;

  // Log the action
  await supabase.from('audit_logs').insert([
    {
      action: 'school_deleted',
      supa_admin_id: (await supabase.auth.getUser()).data.user?.id,
      target_school_id: id,
      details: { deleted_at: new Date().toISOString() },
    },
  ]);
}
