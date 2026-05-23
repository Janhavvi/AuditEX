import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  BriefcaseBusiness,
  ChevronDown,
  Copy,
  CreditCard,
  Layers3,
  Trash2,
  Users,
} from 'lucide-react';
import { pricingData, supportedTools, useCases } from '../data/pricingData';
import type { AuditToolForm, ToolName, UseCase } from '../types/audit';
import { currency } from '../utils/formatter';

interface Props {
  form: AuditToolForm;
  index: number;
  onChange: (values: Partial<AuditToolForm>) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onToggleCollapse: () => void;
}

const numberValue = (value: string, minimum: number) => {
  if (value === '') return '';
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? Math.max(minimum, numericValue) : '';
};

function FieldLabel({
  children,
  icon,
}: {
  children: string;
  icon: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">
      {icon}
      {children}
    </span>
  );
}

export default function AuditFormCard({ form, index, onChange, onDuplicate, onRemove, onToggleCollapse }: Props) {
  const selectedTool = form.tool ? pricingData[form.tool] : null;
  const plans = selectedTool?.plans || [];
  const selectedPlan = plans.find((plan) => plan.name === form.plan) || plans[0];
  const seats = form.seats === '' ? 0 : Number(form.seats);
  const benchmarkSpend = selectedPlan ? selectedPlan.monthlyPrice * Math.max(seats, 1) : 0;
  const title = form.tool || `AI tool ${index + 1}`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -14, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      className="glass-card group overflow-hidden rounded-2xl border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.08)] transition hover:border-aqua/25 hover:shadow-[0_0_60px_rgba(34,211,238,0.13)]"
    >
      <div className="flex flex-col gap-4 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <button type="button" onClick={onToggleCollapse} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-aqua/20 bg-aqua/10 text-aqua">
            <Bot className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-base font-semibold text-white">{title}</span>
            <span className="mt-1 block text-sm text-[#94A3B8]">
              {selectedTool ? `${selectedTool.category} workflow` : 'Select a tool to start this card'}
            </span>
          </span>
          <ChevronDown
            className={`ml-auto h-5 w-5 shrink-0 text-[#94A3B8] transition ${form.isCollapsed ? '-rotate-90' : 'rotate-0'}`}
          />
        </button>

        <div className="flex items-center gap-2 sm:justify-end">
          {form.monthlySpend !== '' && (
            <span className="rounded-full border border-white/10 bg-[#050816]/40 px-3 py-1.5 text-xs font-semibold text-white">
              {currency(Number(form.monthlySpend))}/mo
            </span>
          )}
          <button
            type="button"
            onClick={onDuplicate}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-[#11152E]/45 text-[#94A3B8] transition hover:border-aqua/30 hover:bg-aqua/10 hover:text-white"
            aria-label="Duplicate tool form"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-[#11152E]/45 text-[#94A3B8] transition hover:border-violet/35 hover:bg-violet/15 hover:text-white"
            aria-label="Delete tool form"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!form.isCollapsed && (
          <motion.div
            key="form-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-6">
              <label className="space-y-2 xl:col-span-2">
                <FieldLabel icon={<Layers3 className="h-4 w-4 text-aqua" />}>Tool</FieldLabel>
                <select
                  value={form.tool}
                  onChange={(event) => onChange({ tool: event.target.value as ToolName | '' })}
                  className="field bg-[#050816]/40"
                >
                  <option value="">Select AI tool</option>
                  {supportedTools.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 xl:col-span-2">
                <FieldLabel icon={<CreditCard className="h-4 w-4 text-aqua" />}>Plan</FieldLabel>
                <select
                  value={form.plan}
                  onChange={(event) => onChange({ plan: event.target.value })}
                  disabled={!selectedTool}
                  className="field bg-[#050816]/40 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <option value="">{selectedTool ? 'Select plan' : 'Choose a tool first'}</option>
                  {plans.map((plan) => (
                    <option key={plan.name} value={plan.name}>
                      {plan.name} - {currency(plan.monthlyPrice)}/seat
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 xl:col-span-2">
                <FieldLabel icon={<CreditCard className="h-4 w-4 text-aqua" />}>Monthly Spend</FieldLabel>
                <input
                  type="number"
                  min="0"
                  step="1"
                  inputMode="decimal"
                  placeholder="Enter monthly spend"
                  value={form.monthlySpend}
                  onChange={(event) => onChange({ monthlySpend: numberValue(event.target.value, 0) })}
                  className="field bg-[#050816]/40 placeholder:text-[#64748B]"
                />
              </label>

              <label className="space-y-2">
                <FieldLabel icon={<Users className="h-4 w-4 text-aqua" />}>Seats</FieldLabel>
                <input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  placeholder="Seats"
                  value={form.seats}
                  onChange={(event) => onChange({ seats: numberValue(event.target.value, 1) })}
                  className="field bg-[#050816]/40 placeholder:text-[#64748B]"
                />
              </label>

              <label className="space-y-2">
                <FieldLabel icon={<BriefcaseBusiness className="h-4 w-4 text-aqua" />}>Team Size</FieldLabel>
                <input
                  type="number"
                  min="1"
                  step="1"
                  inputMode="numeric"
                  placeholder="Team"
                  value={form.teamSize}
                  onChange={(event) => onChange({ teamSize: numberValue(event.target.value, 1) })}
                  className="field bg-[#050816]/40 placeholder:text-[#64748B]"
                />
              </label>

              <label className="space-y-2 md:col-span-2 xl:col-span-4">
                <FieldLabel icon={<Bot className="h-4 w-4 text-aqua" />}>Use Case</FieldLabel>
                <select
                  value={form.useCase}
                  onChange={(event) => onChange({ useCase: event.target.value as UseCase | '' })}
                  className="field bg-[#050816]/40"
                >
                  <option value="">Select primary use case</option>
                  {useCases.map((useCase) => (
                    <option key={useCase} value={useCase}>
                      {useCase.charAt(0).toUpperCase() + useCase.slice(1)}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mx-4 mb-4 grid gap-3 rounded-2xl border border-white/10 bg-[#050816]/35 p-4 text-sm text-[#94A3B8] sm:mx-5 sm:mb-5 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#64748B]">Plan benchmark</p>
                <p className="mt-1 font-semibold text-white">
                  {selectedPlan ? (selectedPlan.monthlyPrice ? `${currency(benchmarkSpend)}/mo` : 'Usage based') : 'Pending'}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#64748B]">Plan notes</p>
                <p className="mt-1 truncate font-semibold text-white">{selectedPlan?.notes || 'Choose a tool and plan'}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[#64748B]">Alternatives</p>
                <p className="mt-1 truncate font-semibold text-white">
                  {selectedTool?.alternatives.join(', ') || 'Available after tool selection'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
