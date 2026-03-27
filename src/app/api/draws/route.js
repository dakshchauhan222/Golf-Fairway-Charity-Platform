import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';
import { generateDrawNumbers, findWinners, formatDrawMonth } from '@/lib/drawEngine';
import { distributePool, calculateWinnerPrize } from '@/lib/prizePool';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('draws')
      .select('*, prize_pool(*)')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { action } = body; // 'simulate' or 'publish'

    const drawNumbers = body.drawNumbers || generateDrawNumbers();

    // Get all active users with scores
    const { data: activeUsers } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('subscription_status', 'active');

    const usersWithScores = [];
    for (const u of (activeUsers || [])) {
      const { data: scores } = await supabase
        .from('scores')
        .select('score')
        .eq('user_id', u.id);
      usersWithScores.push({ ...u, scores: scores || [] });
    }

    const winners = findWinners(drawNumbers, usersWithScores);
    const activeCount = activeUsers?.length || 0;
    const totalPool = activeCount * 9.99 * 0.20;

    // Check for carryover
    let carryover = 0;
    const { data: lastDraw } = await supabase
      .from('draws')
      .select('id, prize_pool(*)')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(1);

    if (lastDraw?.[0]?.prize_pool?.[0]) {
      const { data: lastJackpotWinners } = await supabase
        .from('winners')
        .select('id')
        .eq('draw_id', lastDraw[0].id)
        .eq('match_type', 5);
      if (!lastJackpotWinners?.length) {
        carryover = parseFloat(lastDraw[0].prize_pool[0].jackpot_pool) || 0;
      }
    }

    const pool = distributePool(totalPool, carryover);

    if (action === 'simulate') {
      return NextResponse.json({ drawNumbers, winners, pool, totalPool, carryover, activeUsers: activeCount });
    }

    // Publish
    const month = formatDrawMonth();
    const { data: draw, error: drawError } = await supabase
      .from('draws')
      .insert({ draw_numbers: drawNumbers, month, status: 'published', jackpot_carried_over: carryover > 0 })
      .select()
      .single();

    if (drawError) return NextResponse.json({ error: drawError.message }, { status: 400 });

    await supabase.from('prize_pool').insert({
      draw_id: draw.id,
      total_pool: totalPool,
      jackpot_pool: pool.jackpotPool,
      four_match_pool: pool.fourMatchPool,
      three_match_pool: pool.threeMatchPool,
    });

    for (const tier of [5, 4, 3]) {
      if (winners[tier].length > 0) {
        const poolForTier = tier === 5 ? pool.jackpotPool : tier === 4 ? pool.fourMatchPool : pool.threeMatchPool;
        const prizePerWinner = calculateWinnerPrize(poolForTier, winners[tier].length);
        for (const w of winners[tier]) {
          await supabase.from('winners').insert({
            user_id: w.userId,
            draw_id: draw.id,
            match_type: tier,
            prize_amount: prizePerWinner,
            payment_status: 'pending',
          });
        }
      }
    }

    return NextResponse.json({ draw, winners, pool }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
