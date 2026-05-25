import { BadgeDollarSign, Bell, Target } from 'lucide-react';
import type { ToolBreakdownRow } from '../../utils/reportPresentation';
import { currency } from '../../utils/formatter';

interface Props {
  efficientAudit: boolean;
  rows: ToolBreakdownRow[];
}

export default function ToolBreakdownTable({ efficientAudit, rows }: Props) {
  return (
    <section id="tool-breakdown" className="scroll-mt-28 border-b border-white/10 py-12">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
            <Target className="h-4 w-4" />
            Per-tool breakdown
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Current spend to recommended action</h2>
        </div>
        {efficientAudit && (
          <span className="inline-flex items-center gap-2 rounded-full border border-aqua/25 bg-aqua/10 px-4 py-2 text-sm font-semibold text-aqua">
            <Bell className="h-4 w-4" />
            Notify-only mode
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F23]/45">
        <div className="hidden grid-cols-[1.1fr_1.6fr_0.8fr_1.8fr] gap-4 border-b border-white/10 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8] lg:grid">
          <span>Current spend</span>
          <span>Recommended action</span>
          <span>Savings</span>
          <span>Reason</span>
        </div>
        <div className="divide-y divide-white/10">
          {rows.map(({ tool, recommendedAction, savings, reason }) => (
            <div key={tool.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.1fr_1.6fr_0.8fr_1.8fr] lg:items-start">
              <div>
                <p className="font-semibold text-white">{tool.toolName}</p>
                <p className="mt-1 text-sm text-[#94A3B8]">
                  {tool.plan} · {currency(tool.monthlySpend)}/mo
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8] lg:hidden">Recommended action</p>
                <p className="mt-1 text-sm font-semibold text-white lg:mt-0">{recommendedAction}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8] lg:hidden">Savings</p>
                <p className={`mt-1 inline-flex items-center gap-2 text-lg font-bold lg:mt-0 ${savings > 0 ? 'text-aqua' : 'text-[#CBD5E1]'}`}>
                  <BadgeDollarSign className="h-4 w-4" />
                  {currency(savings)}/mo
                </p>
              </div>
              <p className="text-sm leading-6 text-[#CBD5E1]">{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
