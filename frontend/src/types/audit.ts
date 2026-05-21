export type ToolName =
  | 'Cursor'
  | 'GitHub Copilot'
  | 'Claude'
  | 'ChatGPT'
  | 'Anthropic API direct'
  | 'NVIDIA NIM'
  | 'OpenAI API direct'
  | 'Gemini'
  | 'Windsurf'
  | 'v0';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';
export type Severity = 'Low' | 'Medium' | 'High';

export interface ToolPlan {
  name: string;
  monthlyPrice: number;
  bestFor: UseCase[];
  seatsIncluded?: number;
  notes: string;
}

export interface ToolPricing {
  tool: ToolName;
  category: 'assistant' | 'coding' | 'api' | 'builder';
  plans: ToolPlan[];
  alternatives: ToolName[];
}

export interface AuditTool {
  id: string;
  toolName: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  useCase: UseCase;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  recommendedAction: string;
  reasoning: string;
  severity: Severity;
  currentMonthlySpend: number;
  estimatedMonthlySavings: number;
  tools: ToolName[];
}

export interface AuditTotals {
  totalMonthlySpend: number;
  totalYearlySpend: number;
  estimatedMonthlySavings: number;
  estimatedYearlySavings: number;
  savingsPercentage: number;
}

export interface AuditReport {
  auditId?: string;
  tools: AuditTool[];
  totals: AuditTotals;
  recommendations: Recommendation[];
  summary?: string;
  createdAt?: string;
}

export interface LeadPayload {
  name: string;
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  website?: string;
  auditId?: string;
}
