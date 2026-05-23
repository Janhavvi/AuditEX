import { create } from 'zustand';
import { pricingData, supportedTools, useCases } from '../data/pricingData';
import type { AuditReport, AuditTool, AuditToolForm, ToolName, UseCase } from '../types/audit';
import { runAudit } from '../utils/auditEngine';
import { storage } from '../utils/storage';

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `tool-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createAuditTool = (toolName: ToolName = 'ChatGPT'): AuditTool => ({
  id: newId(),
  toolName,
  plan: pricingData[toolName].plans[0].name,
  monthlySpend: pricingData[toolName].plans[0].monthlyPrice,
  seats: 1,
  teamSize: 5,
  useCase: 'mixed',
});

const createToolForm = (values: Partial<AuditToolForm> = {}): AuditToolForm => ({
  id: newId(),
  tool: '',
  plan: '',
  monthlySpend: '',
  seats: '',
  teamSize: '',
  useCase: '',
  isCollapsed: false,
  ...values,
});

const isToolName = (value: unknown): value is ToolName =>
  typeof value === 'string' && supportedTools.includes(value as ToolName);

const isUseCase = (value: unknown): value is UseCase =>
  typeof value === 'string' && useCases.includes(value as UseCase);

const positiveNumber = (value: unknown, fallback: number, minimum = 0) => {
  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numericValue) ? Math.max(minimum, numericValue) : fallback;
};

const optionalPositiveNumber = (value: unknown, minimum = 0): number | '' => {
  if (value === '') return '';
  const numericValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numericValue) ? Math.max(minimum, numericValue) : '';
};

const sanitizeAuditTool = (value: unknown, fallbackName: ToolName = 'ChatGPT'): AuditTool => {
  if (!value || typeof value !== 'object') return createAuditTool(fallbackName);

  const candidate = value as Partial<AuditTool>;
  const toolName = isToolName(candidate.toolName) ? candidate.toolName : fallbackName;
  const plans = pricingData[toolName].plans;
  const fallbackPlan = plans[0];
  const plan =
    typeof candidate.plan === 'string' && plans.some((item) => item.name === candidate.plan)
      ? candidate.plan
      : fallbackPlan.name;

  return {
    id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : newId(),
    toolName,
    plan,
    monthlySpend: positiveNumber(candidate.monthlySpend, fallbackPlan.monthlyPrice),
    seats: positiveNumber(candidate.seats, 1, 1),
    teamSize: positiveNumber(candidate.teamSize, 5, 1),
    useCase: isUseCase(candidate.useCase) ? candidate.useCase : 'mixed',
  };
};

const auditToolToForm = (tool: AuditTool): AuditToolForm => ({
  id: tool.id || newId(),
  tool: tool.toolName,
  plan: tool.plan,
  monthlySpend: tool.monthlySpend,
  seats: tool.seats,
  teamSize: tool.teamSize,
  useCase: tool.useCase,
  isCollapsed: false,
});

const sanitizeToolForm = (value: unknown): AuditToolForm => {
  if (!value || typeof value !== 'object') return createToolForm();

  const candidate = value as Partial<AuditToolForm> & { toolName?: unknown };
  const tool = isToolName(candidate.tool) ? candidate.tool : isToolName(candidate.toolName) ? candidate.toolName : '';
  const plans = tool ? pricingData[tool].plans : [];
  const fallbackPlan = plans[0]?.name || '';
  const plan =
    typeof candidate.plan === 'string' && plans.some((item) => item.name === candidate.plan)
      ? candidate.plan
      : tool
        ? fallbackPlan
        : '';

  return createToolForm({
    id: typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : newId(),
    tool,
    plan,
    monthlySpend: optionalPositiveNumber(candidate.monthlySpend, 0),
    seats: optionalPositiveNumber(candidate.seats, 1),
    teamSize: optionalPositiveNumber(candidate.teamSize, 1),
    useCase: isUseCase(candidate.useCase) ? candidate.useCase : '',
    isCollapsed: Boolean(candidate.isCollapsed),
  });
};

const sanitizeToolForms = (value: unknown, fallback: AuditToolForm[]) => {
  if (!Array.isArray(value)) return fallback;
  const tools = value.map((tool) => sanitizeToolForm(tool));
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
    tools: report.tools.map((tool) => sanitizeAuditTool(tool)),
    recommendations: report.recommendations,
    totals: report.totals,
  };
};

const formToAuditTool = (form: AuditToolForm): AuditTool => {
  if (!form.tool || !form.plan || form.monthlySpend === '' || form.seats === '' || form.teamSize === '' || !form.useCase) {
    throw new Error('Every tool form must be complete before running an audit.');
  }

  return {
    id: form.id,
    toolName: form.tool,
    plan: form.plan,
    monthlySpend: Math.max(0, Number(form.monthlySpend)),
    seats: Math.max(1, Number(form.seats)),
    teamSize: Math.max(1, Number(form.teamSize)),
    useCase: form.useCase,
  };
};

interface AuditState {
  tools: AuditToolForm[];
  report: AuditReport | null;
  setTools: (tools: AuditToolForm[]) => void;
  addTool: () => void;
  duplicateTool: (id: string) => void;
  removeTool: (id: string) => void;
  toggleToolCollapse: (id: string) => void;
  updateTool: (id: string, values: Partial<AuditToolForm>) => void;
  runCurrentAudit: () => AuditReport;
  setReport: (report: AuditReport) => void;
  reset: () => void;
}

const initialTools = [createToolForm()];
const storedTools = initialTools;
const storedReport = sanitizeReport(storage.get<unknown>('report', null));

export const useAuditStore = create<AuditState>((set, get) => ({
  tools: storedTools,
  report: storedReport,
  setTools: (tools) => {
    storage.set('tools', tools);
    set({ tools });
  },
  addTool: () => {
    const tools = [...get().tools, createToolForm()];
    storage.set('tools', tools);
    set({ tools });
  },
  duplicateTool: (id) => {
    const source = get().tools.find((tool) => tool.id === id);
    if (!source) return;

    const tools = [...get().tools, createToolForm({ ...source, id: newId(), isCollapsed: false })];
    storage.set('tools', tools);
    set({ tools });
  },
  removeTool: (id) => {
    const tools = get().tools.filter((tool) => tool.id !== id);
    storage.set('tools', tools);
    set({ tools });
  },
  toggleToolCollapse: (id) => {
    const tools = get().tools.map((tool) =>
      tool.id === id ? { ...tool, isCollapsed: !tool.isCollapsed } : tool,
    );
    storage.set('tools', tools);
    set({ tools });
  },
  updateTool: (id, values) => {
    const tools = get().tools.map((tool) => {
      if (tool.id !== id) return tool;

      const next: AuditToolForm = { ...tool, ...values };

      if (values.tool !== undefined) {
        if (values.tool) {
          const firstPlan = pricingData[values.tool].plans[0];
          next.plan = firstPlan.name;
          next.monthlySpend = firstPlan.monthlyPrice;
        } else {
          next.plan = '';
          next.monthlySpend = '';
        }
      }

      if (values.plan && next.tool) {
        const plan = pricingData[next.tool].plans.find((item) => item.name === values.plan);
        if (plan && values.monthlySpend === undefined) {
          const seats = next.seats === '' ? 1 : Math.max(1, Number(next.seats));
          next.monthlySpend = plan.monthlyPrice * seats;
        }
      }

      if (values.monthlySpend !== undefined) next.monthlySpend = optionalPositiveNumber(values.monthlySpend, 0);
      if (values.seats !== undefined) next.seats = optionalPositiveNumber(values.seats, 1);
      if (values.teamSize !== undefined) next.teamSize = optionalPositiveNumber(values.teamSize, 1);

      return next;
    });
    storage.set('tools', tools);
    set({ tools });
  },
  runCurrentAudit: () => {
    const report = runAudit(get().tools.map((tool) => formToAuditTool(tool)));
    storage.set('report', report);
    set({ report });
    return report;
  },
  setReport: (report) => {
    const tools = report.tools.map((tool) => auditToolToForm(sanitizeAuditTool(tool)));
    storage.set('report', report);
    storage.set('tools', tools);
    set({ report, tools });
  },
  reset: () => {
    const tools = [createToolForm()];
    storage.set('tools', tools);
    storage.remove('report');
    set({ tools, report: null });
  },
}));
