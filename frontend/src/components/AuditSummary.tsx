import { ShieldCheck, Sparkles, WalletCards } from 'lucide-react';
import { motion } from 'framer-motion';
import { currency } from '../utils/formatter';

interface Props {
  activeToolCount: number;
  formCount: number;
  totalMonthlySpend: number;
  totalYearlySpend: number;
}

export default function AuditSummary({ activeToolCount, formCount, totalMonthlySpend, totalYearlySpend }: Props) {
  const progress = Math.min(100, Math.round((totalMonthlySpend / 5000) * 100));

  return (
    <aside className="glass-card rounded-2xl p-5 shadow-[0_0_55px_rgba(34,211,238,0.1)] lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-aqua">Live total</p>
          <motion.p
            key={totalMonthlySpend}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-4xl font-bold text-white"
          >
            {currency(totalMonthlySpend)}
          </motion.p>
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-aqua/20 bg-aqua/10 text-aqua">
          <WalletCards className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 space-y-3 text-sm text-[#94A3B8]">
        <div className="flex items-center justify-between gap-3">
          <span>Yearly run rate</span>
          <strong className="text-white">{currency(totalYearlySpend)}</strong>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Forms added</span>
          <strong className="text-white">{formCount}</strong>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Unique tools</span>
          <strong className="text-white">{activeToolCount}</strong>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-[#050816]/35 p-4">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-[#94A3B8]">
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-aqua" />
            Monthly spend load
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-aqua to-violet"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-[#94A3B8]">
        <ShieldCheck className="h-4 w-4 text-aqua" />
        Saved locally in this browser
      </div>
    </aside>
  );
}
