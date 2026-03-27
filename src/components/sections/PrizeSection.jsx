'use client';

export default function PrizeSection() {
  const prizeRows = [
    { type: '5 Match', share: '40%', value: '£1,692', status: 'Jackpot' },
    { type: '4 Match', share: '35%', value: '£1,480', status: 'Active' },
    { type: '3 Match', share: '25%', value: '£1,058', status: 'Active' },
  ];

  return (
    <section className="w-full bg-[#141414] min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-20">

        {/* LEFT */}
        <div className="space-y-8 font-serif italic text-white">
          <h2 className="text-6xl lg:text-7xl hover:translate-x-3 transition-all duration-300 leading-tight">Enter five scores.</h2>
          <h2 className="text-6xl lg:text-7xl hover:translate-x-3 transition-all duration-300 leading-tight">The monthly draw.</h2>
          <h2 className="text-6xl lg:text-7xl hover:translate-x-3 transition-all duration-300 leading-tight">Win. And give.</h2>
        </div>

        {/* RIGHT */}
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-xs uppercase tracking-widest text-gray-400 mb-6">Prize Structure</div>

          {prizeRows.map((row, index) => (
            <div
              key={index}
              className="relative flex flex-wrap justify-between items-center py-4 border-b border-white/10 group hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="absolute left-0 top-0 h-full w-[2px] bg-[#DFFF00] opacity-0 group-hover:opacity-100 transition-all duration-300" />

              <div className="text-white text-lg font-semibold">{row.type}</div>
              <div className="text-gray-400 text-sm">{row.share}</div>
              <div className="text-white text-lg font-medium">{row.value}</div>
              <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">{row.status}</div>
            </div>
          ))}

          <div className="text-xs text-gray-400 mt-6">Pool calculated from active subscriber count each month.</div>
        </div>
      </div>
    </section>
  );
}
