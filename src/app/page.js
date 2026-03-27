'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function HomePage() {
  const { user } = useAuth();
  const [featuredCharities, setFeaturedCharities] = useState([]);

  useEffect(() => {
    async function loadCharities() {
      const supabase = createClient();
      const { data } = await supabase
        .from('charities')
        .select('*')
        .eq('is_featured', true)
        .limit(3);
      if (data) setFeaturedCharities(data);
    }
    loadCharities();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
          filter: 'blur(60px)',
        }} className="animate-float" />
        <div style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12), transparent 70%)',
          filter: 'blur(60px)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            borderRadius: '50px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            fontSize: '0.85rem',
            color: 'var(--color-primary-light)',
            marginBottom: '24px',
            fontWeight: '500',
          }} className="animate-fade-in">
            ✨ Where Golf Meets Generosity
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: '900',
            lineHeight: '1.1',
            marginBottom: '24px',
            letterSpacing: '-1px',
          }} className="animate-fade-in-up">
            Play Golf. <span className="gradient-text">Win Big.</span><br />
            Change Lives.
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: '1.7',
          }} className="animate-fade-in-up" >
            Subscribe, track your Stableford scores, and enter monthly draws for incredible prizes — 
            all while supporting the charities you care about most.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }} className="animate-fade-in-up">
            <Link href={user ? '/dashboard' : '/signup'} className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
              {user ? 'Go to Dashboard' : 'Start Subscribing'} →
            </Link>
            <Link href="/charities" className="btn-secondary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
              Explore Charities
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
            marginTop: '64px',
            maxWidth: '500px',
            margin: '64px auto 0',
          }}>
            {[
              { value: '£50K+', label: 'Prizes Awarded' },
              { value: '2,500+', label: 'Active Players' },
              { value: '£30K+', label: 'Charity Raised' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary-light)' }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, transparent, rgba(30, 41, 59, 0.3))',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px' }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '56px', fontSize: '1.05rem' }}>
            Three simple steps to start winning and giving
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
          }}>
            {[
              {
                icon: '📝',
                title: 'Subscribe & Choose',
                desc: 'Pick a monthly or yearly plan and select a charity to support. A portion of your subscription goes directly to your chosen cause.',
                color: '#6366f1',
              },
              {
                icon: '⛳',
                title: 'Track Your Scores',
                desc: 'Enter your Stableford golf scores (1-45). Your last 5 scores are your entry numbers for the monthly prize draw.',
                color: '#06b6d4',
              },
              {
                icon: '🏆',
                title: 'Win & Give Back',
                desc: 'Each month, 5 numbers are drawn. Match 3, 4, or 5 of your scores to win from the prize pool. No 5-match winner? The jackpot rolls over!',
                color: '#f59e0b',
              },
            ].map((step, i) => (
              <div key={i} className="glass-card" style={{ padding: '40px 28px', textAlign: 'center' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  background: `linear-gradient(135deg, ${step.color}20, ${step.color}05)`,
                  border: `1px solid ${step.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  margin: '0 auto 24px',
                }}>
                  {step.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px' }}>{step.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Tiers */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px' }}>
            Prize <span className="gradient-text">Tiers</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '56px', fontSize: '1.05rem' }}>
            The more scores you match, the bigger the prize
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {[
              { matches: '5 Matches', pct: '40%', label: 'JACKPOT', emoji: '💎', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)', sub: 'Rolls over if unclaimed!' },
              { matches: '4 Matches', pct: '35%', label: 'SECOND TIER', emoji: '🥈', gradient: 'linear-gradient(135deg, #6366f1, #06b6d4)', sub: 'Split among all 4-match winners' },
              { matches: '3 Matches', pct: '25%', label: 'THIRD TIER', emoji: '🥉', gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', sub: 'Split among all 3-match winners' },
            ].map((tier, i) => (
              <div key={i} className="glass-card" style={{ padding: '36px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                {i === 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    height: '3px',
                    background: tier.gradient,
                  }} />
                )}
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{tier.emoji}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-accent)', letterSpacing: '2px', marginBottom: '8px' }}>
                  {tier.label}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px' }}>{tier.matches}</h3>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '900',
                  background: tier.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '12px',
                }}>
                  {tier.pct} of Pool
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{tier.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Charities */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.3), transparent)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '12px' }}>
            Charities We <span className="gradient-text">Support</span>
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '56px', fontSize: '1.05rem' }}>
            Your subscription directly impacts these amazing organizations
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {featuredCharities.length > 0 ? featuredCharities.map((charity) => (
              <Link key={charity.id} href={`/charities/${charity.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="glass-card" style={{ padding: '32px', textAlign: 'left', height: '100%' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: 'var(--gradient-success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    marginBottom: '20px',
                  }}>
                    💚
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '10px' }}>{charity.name}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                    {charity.description?.substring(0, 120)}...
                  </p>
                </div>
              </Link>
            )) : (
              [1, 2, 3].map(i => (
                <div key={i} className="glass-card" style={{ padding: '32px', opacity: 0.5 }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--color-border)', marginBottom: '20px' }} />
                  <div style={{ height: '20px', width: '70%', background: 'var(--color-border)', borderRadius: '6px', marginBottom: '10px' }} />
                  <div style={{ height: '14px', width: '100%', background: 'var(--color-border)', borderRadius: '6px', marginBottom: '6px' }} />
                  <div style={{ height: '14px', width: '80%', background: 'var(--color-border)', borderRadius: '6px' }} />
                </div>
              ))
            )}
          </div>

          <Link href="/charities" className="btn-secondary" style={{ marginTop: '40px', display: 'inline-flex' }}>
            View All Charities →
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '56px 40px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(6, 182, 212, 0.1))',
          border: '1px solid rgba(99, 102, 241, 0.2)',
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px' }}>
            Ready to Make a Difference?
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', marginBottom: '32px', lineHeight: '1.7' }}>
            Join thousands of golfers who are winning prizes and supporting charities. 
            Plans start from just £9.99/month.
          </p>
          <Link href="/signup" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
            Subscribe Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
