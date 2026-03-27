'use client';

import { useEffect, useState } from 'react';

export default function MechanismSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorColor, setCursorColor] = useState('#DFFF00');

  const prizeRows = [
    { type: '5 Match', share: '40%', value: '£1,692', status: 'Jackpot' },
    { type: '4 Match', share: '35%', value: '£1,480', status: 'Active' },
    { type: '3 Match', share: '25%', value: '£1,058', status: 'Active' },
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      const width = window.innerWidth;
      const pct = e.clientX / width;
      if (pct < 0.33) setCursorColor('#DFFF00');
      else if (pct < 0.66) setCursorColor('#A855F7');
      else setCursorColor('#38BDF8');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      className="relative w-full bg-[#0C0C0C] py-20 px-6"
      style={{ cursor: 'none' }}
    >
      <div
        className="fixed pointer-events-none z-50 transition-all duration-150 ease-out"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
          width: 20,
          height: 20,
          borderRadius: '50%',
          border: `2px solid ${cursorColor}`,
          background: `${cursorColor}33`,
          boxShadow: `0 0 20px ${cursorColor}, 0 0 40px ${cursorColor}`,
          transform: 'translate(0, 0)',
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">

        {/* LEFT */}
        <div className="space-y-10 font-serif italic text-white">
          <h2 className="text-5xl hover:translate-x-2 transition-all duration-300">Enter five scores.</h2>
          <h2 className="text-5xl hover:translate-x-2 transition-all duration-300">The monthly draw.</h2>
          <h2 className="text-5xl hover:translate-x-2 transition-all duration-300">Win. And give.</h2>
        </div>

        {/* RIGHT */}
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-6">Prize Structure</div>

          {prizeRows.map((row, i) => (
            <div
              key={i}
              className="relative flex justify-between items-center py-4 border-b border-white/10 group hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="absolute left-0 top-0 h-full w-[2px] bg-[#DFFF00] opacity-0 group-hover:opacity-100 transition-all" />

              <div className="text-white">{row.type}</div>
              <div className="text-gray-400">{row.share}</div>
              <div className="text-white font-medium">{row.value}</div>

              <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">{row.status}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
