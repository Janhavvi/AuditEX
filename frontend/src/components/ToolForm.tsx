import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseZap, RotateCcw, WandSparkles } from 'lucide-react';
import { supportedTools } from '../data/pricingData';
import { useAuditStore } from '../store/auditStore';
import AnimatedButton from './AnimatedButton';
import AuditSummary from './AuditSummary';
import ToolFormContainer from './ToolFormContainer';

const previewTools = supportedTools
  .filter((name) => !['Anthropic API direct', 'NVIDIA NIM'].includes(name))
  .slice(0, 6);

export default function ToolForm() {
  const navigate = useNavigate();
  const {
    tools,
    addTool,
    duplicateTool,
    removeTool,
    toggleToolCollapse,
    updateTool,
    runCurrentAudit,
    reset,
  } = useAuditStore();
  const [error, setError] = useState('');

  const totalMonthlySpend = useMemo(
    () => tools.reduce((sum, tool) => sum + (tool.monthlySpend === '' ? 0 : Number(tool.monthlySpend)), 0),
    [tools],
  );
  const activeToolCount = useMemo(
    () => new Set(tools.filter((tool) => tool.tool).map((tool) => tool.tool)).size,
    [tools],
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (!tools.length) {
      setError('Add at least one AI tool before generating an audit.');
      return;
    }

    const invalid = tools.find(
      (tool) =>
        !tool.tool ||
        !tool.plan ||
        tool.monthlySpend === '' ||
        Number(tool.monthlySpend) < 0 ||
        tool.seats === '' ||
        Number(tool.seats) < 1 ||
        tool.teamSize === '' ||
        Number(tool.teamSize) < 1 ||
        !tool.useCase,
    );

    if (invalid) {
      setError('Please complete every tool card with valid spend, seats, team size, plan, and use case.');
      return;
    }

    setError('');
    runCurrentAudit();
    navigate('/results');
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
            <DatabaseZap className="h-4 w-4" />
            Spend input form
          </p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Build your AI spend baseline</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#94A3B8] sm:text-base">
            Add one tool at a time, keep cards collapsed when you are scanning, and generate a report when every card is complete.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
          {previewTools.map((name) => (
            <span
              key={name}
              className="rounded-full border border-white/10 bg-[#0A0F23]/50 px-3 py-1.5 text-xs font-medium text-[#CBD5E1]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <ToolFormContainer
          tools={tools}
          onAddTool={addTool}
          onDuplicateTool={duplicateTool}
          onRemoveTool={removeTool}
          onToggleToolCollapse={toggleToolCollapse}
          onUpdateTool={updateTool}
        />

        <AuditSummary
          activeToolCount={activeToolCount}
          formCount={tools.length}
          totalMonthlySpend={totalMonthlySpend}
          totalYearlySpend={totalMonthlySpend * 12}
        />
      </div>

      {error && (
        <p className="glass-card mt-5 rounded-xl border-violet/25 px-4 py-3 text-sm font-medium text-[#C4B5FD]">
          {error}
        </p>
      )}

      <div className="sticky bottom-4 z-20 mt-8 rounded-2xl border border-white/10 bg-[#050816]/75 p-3 shadow-[0_18px_60px_rgba(2,6,23,0.42)] backdrop-blur-xl">
        <div className="flex flex-col justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#11152E]/35 px-5 py-3 text-sm font-semibold text-[#94A3B8] transition hover:bg-[#11152E]/60 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <AnimatedButton type="submit" icon={<WandSparkles className="h-4 w-4" />}>
            Generate Audit
          </AnimatedButton>
        </div>
      </div>
    </form>
  );
}
