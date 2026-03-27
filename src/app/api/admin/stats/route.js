import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Must be admin
    const { data: profile } = await supabase
      .from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const [usersRes, activeRes, poolRes, winnersRes, charitiesRes, drawsRes] = await Promise.all([
      supabase.from('users').select('id, subscription_type, charity_percentage', { count: 'exact' }),
      supabase.from('users').select('id', { count: 'exact', head: true }).eq('subscription_status', 'active'),
      supabase.from('prize_pool').select('total_pool'),
      supabase.from('winners').select('prize_amount, payment_status, match_type'),
      supabase.from('charities').select('id', { count: 'exact', head: true }),
      supabase.from('draws').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    ]);

    const totalPool = (poolRes.data || []).reduce((s, p) => s + parseFloat(p.total_pool || 0), 0);

    return NextResponse.json({
      totalUsers: usersRes.count || 0,
      activeSubscribers: activeRes.count || 0,
      totalPrizePool: totalPool,
      totalCharities: charitiesRes.count || 0,
      totalDraws: drawsRes.count || 0,
      totalWinners: (winnersRes.data || []).length,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
