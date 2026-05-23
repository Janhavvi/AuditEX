import { motion } from 'framer-motion';
import { Lightbulb, TrendingDown } from 'lucide-react';
import type { Recommendation } from '../types/audit';
import { currency } from '../utils/formatter';
import SeverityBadge from './SeverityBadge';

export default function RecommendationCard({ recommendation, index = 0 }: { recommendation: Recommendation; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index || 0) * 0.05, duration: 0.5 }}
      className="glass-card rounded-2xl p-6 md:p-8 h-full flex flex-col"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex gap-3 flex-1">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-aqua/20 to-aqua/10 text-aqua">
            <Lightbulb className="h-5 w-5" />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg leading-snug">{recommendation.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{recommendation.description}</p>
          </div>
        </div>
        <div className="shrink-0">
          <SeverityBadge severity={recommendation.severity} />
        </div>
      </div>

      {/* Savings highlight */}
      <div className="bg-gradient-to-r from-aqua/10 via-transparent to-transparent rounded-xl p-4 mb-6 border border-aqua/20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-semibold">Monthly Savings</p>
            <p className="mt-2 text-3xl font-bold text-aqua">{currency(recommendation.estimatedMonthlySavings)}</p>
          </div>
          <TrendingDown className="h-10 w-10 text-aqua/30" strokeWidth={1.5} />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="rounded-xl border border-white/10 bg-[#11152E]/30 p-3">
          <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-semibold">Current</p>
          <p className="mt-1.5 text-lg font-bold text-white">{currency(recommendation.currentMonthlySpend)}</p>
          <p className="text-xs text-[#94A3B8] mt-0.5">/month</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#11152E]/30 p-3">
          <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-semibold">Yearly</p>
          <p className="mt-1.5 text-lg font-bold text-aqua">{currency(recommendation.estimatedMonthlySavings * 12)}</p>
        </div>
      </div>

      {/* Action */}
      <div className="mb-6 rounded-xl border border-white/10 bg-[#11152E]/30 p-4">
        <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-semibold mb-2">Recommended Action</p>
        <p className="text-base font-semibold text-white">{recommendation.recommendedAction}</p>
      </div>

      {/* Tools */}
      <div className="mb-4">
        <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-semibold mb-2">Affected Tools</p>
        <div className="flex flex-wrap gap-2">
          {recommendation.tools.map((tool) => (
            <span key={tool} className="rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 text-xs font-medium text-aqua">
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Reasoning - takes remaining space */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <p className="text-xs text-[#94A3B8] uppercase tracking-wide font-semibold mb-2">Why This Matters</p>
        <p className="text-sm leading-6 text-[#CBD5E1]">{recommendation.reasoning}</p>
      </div>
    </motion.article>
  );
}
