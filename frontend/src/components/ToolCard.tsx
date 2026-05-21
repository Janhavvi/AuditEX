import { Bot, BriefcaseBusiness, CreditCard, Layers3, Trash2, Users } from 'lucide-react';
import { pricingData, supportedTools, useCases } from '../data/pricingData';
import type { AuditTool, ToolName } from '../types/audit';
import { currency } from '../utils/formatter';

interface Props {
  tool: AuditTool;
  onChange: (values: Partial<AuditTool>) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export default function ToolCard({ tool, onChange, onRemove, canRemove }: Props) {
  const plans = pricingData[tool.toolName].plans;
  const pricing = pricingData[tool.toolName];
  const selectedPlan = plans.find((plan) => plan.name === tool.plan) || plans[0];
  const benchmarkSpend = selectedPlan.monthlyPrice * Math.max(tool.seats, 1);
  const useCaseLabel = tool.useCase.charAt(0).toUpperCase() + tool.useCase.slice(1);

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="flex min-w-0 gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-aqua/10 text-aqua">
            <Bot className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{tool.toolName}</h3>
              <span className="rounded-full bg-[#0A0F23]/55 px-2.5 py-1 text-xs font-medium capitalize text-[#94A3B8]">
                {pricing.category}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{selectedPlan.notes}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-[#11152E]/45 text-[#94A3B8] transition hover:bg-[#8B5CF6]/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Remove tool"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_0.8fr_0.8fr_0.9fr_1fr]">
        <label className="space-y-2 lg:col-span-2">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
            <Layers3 className="h-4 w-4 text-aqua" />
            Tool
          </span>
          <select
            value={tool.toolName}
            onChange={(event) => onChange({ toolName: event.target.value as ToolName })}
            className="field"
          >
            {supportedTools.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
            <CreditCard className="h-4 w-4 text-aqua" />
            Plan
          </span>
          <select value={tool.plan} onChange={(event) => onChange({ plan: event.target.value })} className="field">
            {plans.map((plan) => (
              <option key={plan.name} value={plan.name}>
                {plan.name} - {currency(plan.monthlyPrice)}/seat
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
            <CreditCard className="h-4 w-4 text-aqua" />
            Monthly spend
          </span>
          <input
            type="number"
            min="0"
            step="1"
            inputMode="decimal"
            value={tool.monthlySpend}
            onChange={(event) => onChange({ monthlySpend: Number(event.target.value) })}
            className="field"
          />
        </label>
        <label className="space-y-2">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
            <Users className="h-4 w-4 text-aqua" />
            Seats
          </span>
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={tool.seats}
            onChange={(event) => onChange({ seats: Math.max(1, Number(event.target.value)) })}
            className="field"
          />
        </label>
        <label className="space-y-2">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
            <BriefcaseBusiness className="h-4 w-4 text-aqua" />
            Team size
          </span>
          <input
            type="number"
            min="1"
            step="1"
            inputMode="numeric"
            value={tool.teamSize}
            onChange={(event) => onChange({ teamSize: Math.max(1, Number(event.target.value)) })}
            className="field"
          />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[#94A3B8]">
            <Bot className="h-4 w-4 text-aqua" />
            Use case
          </span>
          <select value={tool.useCase} onChange={(event) => onChange({ useCase: event.target.value as AuditTool['useCase'] })} className="field">
            {useCases.map((useCase) => (
              <option key={useCase} value={useCase}>
                {useCase.charAt(0).toUpperCase() + useCase.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-3 rounded-xl bg-[#0A0F23]/35 p-4 text-sm text-[#94A3B8] md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748B]">Plan benchmark</p>
          <p className="mt-1 font-semibold text-white">
            {selectedPlan.monthlyPrice ? `${currency(benchmarkSpend)}/mo` : 'Usage based'}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748B]">Use case</p>
          <p className="mt-1 font-semibold text-white">{useCaseLabel}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748B]">Alternatives</p>
          <p className="mt-1 truncate font-semibold text-white">{pricing.alternatives.join(', ')}</p>
        </div>
      </div>
    </div>
  );
}
