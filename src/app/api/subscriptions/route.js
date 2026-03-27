import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { subscription_type } = body;

    if (!['monthly', 'yearly'].includes(subscription_type)) {
      return NextResponse.json({ error: 'Invalid subscription type' }, { status: 400 });
    }

    const days = subscription_type === 'monthly' ? 30 : 365;
    const now = new Date();
    const renewal = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        subscription_type,
        subscription_start: now.toISOString(),
        renewal_date: renewal.toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
