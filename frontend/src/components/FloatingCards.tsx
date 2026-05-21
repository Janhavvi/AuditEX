import { motion } from 'framer-motion';
import { BarChart3, CircleDollarSign, Layers3, ShieldCheck, Sparkles, TrendingDown } from 'lucide-react';
import { useState, type PointerEvent } from 'react';

const chartData = [
  { name: 'Assistants', value: 42, fill: '#3B82F6' },
  { name: 'Coding', value: 38, fill: '#8B5CF6' },
  { name: 'API', value: 20, fill: '#22d3ee' },
];

export default function FloatingCards() {
  const [tilt, setTilt] = useState({ x: 5, y: -10 });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: 5 - py * 7,
      y: -10 + px * 11,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="relative mx-auto mt-4 max-w-4xl perspective-stage lg:absolute lg:-right-2 lg:top-24 lg:w-[610px] lg:max-w-none xl:w-[640px]"
    >
      <div
        className="dashboard-shell glass-card grid gap-3 rounded-3xl p-3 md:grid-cols-[0.36fr_1fr]"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setTilt({ x: 5, y: -10 })}
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)` }}
      >
        <div className="glass-card hidden rounded-2xl p-4 dashboard-panel md:block">
          <div className="mb-4 flex items-center gap-2 font-bold text-white">
            <Sparkles className="h-4 w-4 text-aqua" />
            AuditEX
          </div>
          {['Overview', 'Subscriptions', 'Recommendations', 'Savings', 'Reports'].map((item, index) => (
            <div
              key={item}
              className={`mb-1.5 rounded-xl px-3 py-2 text-xs ${index === 0 ? 'bg-[#3B82F6]/20 text-white' : 'text-[#94A3B8]'}`}
            >
              {item}
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-3.5 dashboard-panel dashboard-panel-right">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Overview</p>
              <p className="text-xs text-[#94A3B8]">AI spend command center</p>
            </div>
            <span className="rounded-full border border-white/10 bg-[#11152E]/45 px-3 py-1 text-xs font-semibold text-white">Share Report</span>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-4">
            {[
              ['Monthly Spend', '$2,480', ShieldCheck],
              ['Potential Savings', '$770', TrendingDown],
              ['Yearly Savings', '$9,240', BarChart3],
              ['Savings %', '31%', CircleDollarSign],
            ].map(([label, value, Icon]) => (
              <div key={label as string} className="glass-card rounded-2xl p-2.5 metric-tile">
                <Icon className="mb-2 h-4 w-4 text-aqua" />
                <p className="text-xs text-[#94A3B8]">{label as string}</p>
                <p className="mt-1 text-lg font-bold text-white">{value as string}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-card rounded-2xl p-3.5">
              <div className="mb-2 flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-aqua" />
                <p className="font-semibold text-white">Spend mix</p>
              </div>
              <div className="grid gap-4">
                <div className="grid min-h-28 min-w-0 place-items-center">
                  <div className="spend-donut" aria-label="Spend mix chart">
                    <span />
                  </div>
                </div>
                <div className="grid gap-2">
                  {chartData.map((entry) => (
                    <div key={entry.name} className="grid grid-cols-[1fr_auto] items-center gap-3 text-xs text-[#94A3B8]">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full shadow-[0_0_40px_rgba(34,211,238,0.08)]" style={{ background: entry.fill }} />
                        <span className="truncate">{entry.name}</span>
                      </span>
                      <span className="font-semibold text-white">{entry.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-3.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Layers3 className="h-4 w-4 text-[#8B5CF6]" />
                Monthly spend trend
              </div>
              <div className="mt-5 grid h-28 grid-cols-6 items-end gap-3">
                {[38, 52, 74, 62, 88, 79].map((height, index) => (
                  <span
                    key={height}
                    className="block rounded-t-lg bg-gradient-to-t from-[#8B5CF6] to-[#22D3EE] shadow-[0_0_40px_rgba(34,211,238,0.08)]"
                    style={{ height: `${height}%`, transform: `translateZ(${index * 8}px)` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {['Reduce ChatGPT Team seats', 'Switch to Claude Pro'].map((title, index) => (
              <div key={title} className="glass-card rounded-2xl p-2.5">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-1 text-xs text-[#94A3B8]">Save ${index === 0 ? 420 : 180}/month</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
