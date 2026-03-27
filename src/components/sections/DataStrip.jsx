'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function DataStrip() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const [jackpot, setJackpot] = useState(0);
  const [players, setPlayers] = useState(0);
  const [donated, setDonated] = useState(0);
  const [days, setDays] = useState(0);

  const animate = useCallback((target, setter, dur = 1800) => {
    const t0 = performance.now();
    const step = (ts) => {
      const p = Math.min((ts - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setter(Math.floor(target * e));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  useEffect(() => {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setDays(Math.max(0, Math.ceil((end - now) / 86400000)));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        setStarted(true);
        animate(4230, setJackpot);
        animate(847, setPlayers);
        animate(12400, setDonated);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [started, animate]);

  const fmt = (n) => n.toLocaleString();

  const items = [
    { pre: '\u00A3', val: fmt(jackpot), suf: ' CURRENT JACKPOT', highlight: true },
    { pre: '', val: fmt(players), suf: ' ACTIVE PLAYERS', highlight: true },
    { pre: '\u00A3', val: fmt(donated), suf: ' DONATED TO CHARITY', highlight: true },
    { pre: '', val: days, suf: ' DAYS TO NEXT DRAW', highlight: true },
    { pre: '', val: '', suf: 'JACKPOT ROLLS OVER IF UNCLAIMED', highlight: false },
  ];

  const renderItems = () => items.map((item, i) => (
    <span key={i} style={{ whiteSpace: 'nowrap' }}>
      {item.highlight ? (
        <span style={{ color: '#E8FF00', fontFamily: 'var(--font-mono)' }}>
          {item.pre}{item.val}
        </span>
      ) : null}
      <span style={{ color: '#5C5C5C' }}>{item.suf}</span>
      <span style={{ color: '#5C5C5C', padding: '0 24px' }}>&middot;</span>
    </span>
  ));

  return (
    <div ref={ref} style={{
      background: '#141414', height: 52, overflow: 'hidden',
      borderTop: '1px solid #2A2A2A', borderBottom: '1px solid #2A2A2A',
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
        animation: 'marquee 35s linear infinite',
        fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
        fontFamily: 'var(--font-sans)',
      }}>
        {renderItems()}
        {renderItems()}
      </div>
    </div>
  );
}
