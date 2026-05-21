import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import type { Recommendation } from '../types/audit';
import { currency } from '../utils/formatter';
import SeverityBadge from './SeverityBadge';

export default function RecommendationCard({ recommendation, index = 0 }: { recommendation: Recommendation; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-aqua/10 text-aqua">
            <Lightbulb className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-semibold text-white">{recommendation.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{recommendation.description}</p>
          </div>
        </div>
        <SeverityBadge severity={recommendation.severity} />
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-1 text-xs text-[#94A3B8] sm:grid-cols-3 sm:gap-4">
          <span>Current: <strong className="text-white">{currency(recommendation.currentMonthlySpend)}/mo</strong></span>
          <span>Action: <strong className="text-white">{recommendation.recommendedAction}</strong></span>
          <span>Savings: <strong className="text-white">{currency(recommendation.estimatedMonthlySavings)}/mo</strong></span>
        </div>
        <div className="flex flex-wrap gap-2">
          {recommendation.tools.map((tool) => (
            <span key={tool} className="rounded-full border border-white/10 bg-[#11152E]/45 px-2.5 py-1 text-xs text-[#94A3B8]">
              {tool}
            </span>
          ))}
        </div>
        <p className="text-sm font-semibold text-[#22D3EE]">{currency(recommendation.estimatedMonthlySavings)}/mo potential</p>
      </div>
      <p className="mt-3 text-xs leading-5 text-[#94A3B8]">{recommendation.reasoning}</p>
    </motion.article>
  );
}
