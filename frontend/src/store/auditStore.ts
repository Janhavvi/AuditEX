import { create } from 'zustand';
import { pricingData, supportedTools, useCases } from '../data/pricingData';
import type { AuditReport, AuditTool, ToolName, UseCase } from '../types/audit';
import { runAudit } from '../utils/auditEngine';
import { storage } from '../utils/storage';

const createTool = (toolName: ToolName = 'ChatGPT'): AuditTool => ({
  id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `tool-${Date.now()}`,
  toolName,
  plan: pricingData[toolName].plans[0].name,
  monthlySpend: pricingData[toolName].plans[0].monthlyPrice,
  seats: 1,
  teamSize: 5,
  useCase: 'mixed',
});

const isToolName = (value: unknown): value is ToolName =>
  typeof value === 'string' && supportedTools.includes(value as ToolName);

const isUseCase = (value: unknown): value is UseCase =>
  typeof value === 'string' && useCases.includes(value as UseCase);

const positiveNumber = (value: unknown, fallback: number, minimum = 0) => {
  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numericValue) ? Math.max(minimum, numericValue) : fallback;
};

const sanitizeTool = (value: unknown, fallbackName: ToolName = 'ChatGPT'): AuditTool => {
  if (!value || typeof value !== 'object') return createTool(fallbackName);

  const candidate = value as Partial<AuditTool>;
  const toolName = isToolName(candidate.toolName) ? candidate.toolName : fallbackName;
  const plans = pricingData[toolName].plans;
  const fallbackPlan = plans[0];
  const plan = typeof candidate.plan === 'string' && plans.some((item) => item.name === candidate.plan)
    ? candidate.plan
    : fallbackPlan.name;

  return {
    id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : createTool(toolName).id,
    toolName,
    plan,
    monthlySpend: positiveNumber(candidate.monthlySpend, fallbackPlan.monthlyPrice),
    seats: positiveNumber(candidate.seats, 1, 1),
    teamSize: positiveNumber(candidate.teamSize, 5, 1),
    useCase: isUseCase(candidate.useCase) ? candidate.useCase : 'mixed',
  };
};

const sanitizeTools = (value: unknown, fallback: AuditTool[]) => {
  if (!Array.isArray(value)) return fallback;
  const tools = value.map((tool) => sanitizeTool(tool));
  return tools.length ? tools : fallback;
};

const sanitizeReport = (value: unknown): AuditReport | null => {
  if (!value || typeof value !== 'object') return null;

  const report = value as Partial<AuditReport>;
  if (!Array.isArray(report.tools) || !report.totals || !Array.isArray(report.recommendations)) {
    return null;
  }

  return {
    ...report,
    tools: sanitizeTools(report.tools, [createTool('ChatGPT')]),
    recommendations: report.recommendations,
    totals: report.totals,
  };
};

interface AuditState {
  tools: AuditTool[];
  report: AuditReport | null;
  setTools: (tools: AuditTool[]) => void;
  addTool: () => void;
  removeTool: (id: string) => void;
  updateTool: (id: string, values: Partial<AuditTool>) => void;
  runCurrentAudit: () => AuditReport;
  setReport: (report: AuditReport) => void;
  loadDemo: () => AuditReport;
  reset: () => void;
}

const initialTools = [createTool('ChatGPT'), createTool('Cursor')];
const storedTools = sanitizeTools(storage.get<unknown>('tools', initialTools), initialTools);
const storedReport = sanitizeReport(storage.get<unknown>('report', null));

export const useAuditStore = create<AuditState>((set, get) => ({
  tools: storedTools,
  report: storedReport,
  setTools: (tools) => {
    storage.set('tools', tools);
    set({ tools });
  },
  addTool: () => {
    const tools = [...get().tools, createTool('Claude')];
    storage.set('tools', tools);
    set({ tools });
  },
  removeTool: (id) => {
    const tools = get().tools.filter((tool) => tool.id !== id);
    storage.set('tools', tools);
    set({ tools });
  },
  updateTool: (id, values) => {
    const tools = get().tools.map((tool) => {
      if (tool.id !== id) return tool;
      const next = { ...tool, ...values };
      if (values.toolName && values.toolName !== tool.toolName) {
        next.plan = pricingData[values.toolName].plans[0].name;
        next.monthlySpend = pricingData[values.toolName].plans[0].monthlyPrice;
      }
      if (values.plan) {
        const plan = pricingData[next.toolName].plans.find((item) => item.name === values.plan);
        if (plan && !values.monthlySpend) next.monthlySpend = plan.monthlyPrice * Math.max(next.seats, 1);
      }
      return next;
    });
    storage.set('tools', tools);
    set({ tools });
  },
  runCurrentAudit: () => {
    const report = runAudit(get().tools);
    storage.set('report', report);
    set({ report });
    return report;
  },
  setReport: (report) => {
    storage.set('report', report);
    set({ report, tools: report.tools });
  },
  loadDemo: () => {
    const tools: AuditTool[] = [
      { ...createTool('ChatGPT'), plan: 'Team', monthlySpend: 180, seats: 6, teamSize: 4, useCase: 'mixed' as UseCase },
      { ...createTool('Claude'), plan: 'Team', monthlySpend: 150, seats: 5, teamSize: 4, useCase: 'research' },
      { ...createTool('Cursor'), plan: 'Business', monthlySpend: 360, seats: 9, teamSize: 6, useCase: 'coding' },
      { ...createTool('GitHub Copilot'), plan: 'Business', monthlySpend: 171, seats: 9, teamSize: 6, useCase: 'coding' },
      { ...createTool('Anthropic API direct'), plan: 'API direct', monthlySpend: 840, seats: 1, teamSize: 6, useCase: 'data' },
      { ...createTool('v0'), plan: 'Team', monthlySpend: 90, seats: 3, teamSize: 6, useCase: 'coding' },
    ];
    const report = runAudit(tools);
    storage.set('tools', tools);
    storage.set('report', report);
    set({ tools, report });
    return report;
  },
  reset: () => {
    const tools = [createTool('ChatGPT')];
    storage.set('tools', tools);
    storage.remove('report');
    set({ tools, report: null });
  },
}));
