import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseZap, Plus, RotateCcw, ShieldCheck, WandSparkles } from 'lucide-react';
import { supportedTools } from '../data/pricingData';
import { useAuditStore } from '../store/auditStore';
import { calculateTotals } from '../utils/calculations';
import { currency } from '../utils/formatter';
import AnimatedButton from './AnimatedButton';
import ToolCard from './ToolCard';

export default function ToolForm() {
  const navigate = useNavigate();
  const { tools, addTool, removeTool, updateTool, runCurrentAudit, reset } = useAuditStore();
  const [error, setError] = useState('');
  const liveTotals = useMemo(() => calculateTotals(tools), [tools]);
  const activeToolCount = useMemo(() => new Set(tools.map((tool) => tool.toolName)).size, [tools]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const invalid = tools.find((tool) => !tool.toolName || !tool.plan || tool.monthlySpend < 0 || tool.seats < 1 || tool.teamSize < 1);
    if (invalid) {
      setError('Please complete every tool with valid spend, seats, and team size.');
      return;
    }
    setError('');
    runCurrentAudit();
    navigate('/results');
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
      <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_22rem] lg:items-stretch">
        <div className="glass-card rounded-2xl p-6 sm:p-7">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
            <DatabaseZap className="h-4 w-4" />
            Spend input form
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold text-white sm:text-5xl">Build your AI spend baseline</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#94A3B8] sm:text-base">
            Capture each tool, plan, monthly spend, paid seats, team size, and use case. Your entries stay available after reloads.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {supportedTools.map((name) => (
              <span
                key={name}
                className="rounded-full border border-white/10 bg-[#0A0F23]/50 px-3 py-1.5 text-xs font-medium text-[#CBD5E1]"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-medium text-[#94A3B8]">Monthly total</p>
            <span className="rounded-full bg-aqua/10 px-3 py-1 text-xs font-semibold text-aqua">{tools.length} line items</span>
          </div>
          <p className="mt-3 text-4xl font-bold text-white">{currency(liveTotals.totalMonthlySpend)}</p>
          <div className="mt-5 grid gap-3 text-sm text-[#94A3B8]">
            <div className="flex items-center justify-between gap-3">
              <span>Yearly run rate</span>
              <strong className="text-white">{currency(liveTotals.totalYearlySpend)}</strong>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Unique tools</span>
              <strong className="text-white">{activeToolCount}</strong>
            </div>
            <div className="flex items-center gap-2 pt-1 text-xs text-[#94A3B8]">
              <ShieldCheck className="h-4 w-4 text-aqua" />
              Saved locally in this browser
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onChange={(values) => updateTool(tool.id, values)}
            onRemove={() => removeTool(tool.id)}
            canRemove={tools.length > 1}
          />
        ))}
      </div>

      {error && <p className="glass-card mt-5 rounded-xl px-4 py-3 text-sm text-[#8B5CF6]">{error}</p>}

      <div className="sticky bottom-4 z-20 mt-8 rounded-2xl border border-white/10 bg-[#050816]/75 p-3 shadow-[0_18px_60px_rgba(2,6,23,0.42)] backdrop-blur-xl">
        <div className="flex flex-col justify-between gap-3 sm:flex-row">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={addTool}
              className="app-button-secondary inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              Add tool
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#11152E]/35 px-5 py-3 text-sm font-semibold text-[#94A3B8] transition hover:bg-[#11152E]/60 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
          <AnimatedButton type="submit" icon={<WandSparkles className="h-4 w-4" />}>
            Generate Audit
          </AnimatedButton>
        </div>
      </div>
    </form>
  );
}
