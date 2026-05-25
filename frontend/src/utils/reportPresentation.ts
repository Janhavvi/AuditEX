import type { AuditReport, AuditTool, Recommendation } from '../types/audit';
import { currency } from './formatter';

export interface ToolBreakdownRow {
  tool: AuditTool;
  recommendation?: Recommendation;
  savings: number;
  reason: string;
  recommendedAction: string;
}

const firstSentence = (value: string) => {
  const normalized = value.replace(/\s+/g, ' ').trim();
  const sentence = normalized.match(/^.*?[.!?](?:\s|$)/);
  return sentence ? sentence[0].trim() : normalized;
};

export const isEfficientAudit = (report: AuditReport) =>
  report.totals.estimatedMonthlySavings < 100 ||
  report.recommendations.every((item) => item.estimatedMonthlySavings <= 0);

export const isHighSavingsAudit = (report: AuditReport) => report.totals.estimatedMonthlySavings > 500;

export const reportHeadline = (report: AuditReport) => {
  if (isEfficientAudit(report)) return "You're spending well.";
  if (isHighSavingsAudit(report)) return 'Your AI savings are material';
  return 'Your AI spend report';
};

export const reportSubcopy = (report: AuditReport) => {
  if (isEfficientAudit(report)) {
    return 'AuditEX did not find a meaningful savings gap. Keep the stack as-is and monitor pricing, credits, and usage changes.';
  }

  if (isHighSavingsAudit(report)) {
    return 'This audit found enough monthly savings potential to justify a structured vendor and workflow review.';
  }

  return `${report.recommendations.length} recommendations found across ${report.tools.length} tools.`;
};

export const fallbackSummaryFor = (report: AuditReport) => {
  const themes =
    report.recommendations
      .slice(0, 2)
      .map((item) => item.title.toLowerCase())
      .join(' and ') || 'maintaining the current stack without forced cuts';

  return `${isEfficientAudit(report) ? "You're spending well. " : ''}AuditEX reviewed ${report.tools.length} AI tools with ${currency(report.totals.totalMonthlySpend)} in monthly spend and found ${currency(report.totals.estimatedMonthlySavings)} in defensible monthly savings. The strongest signals come from ${themes}.`;
};

export const toolBreakdownFor = (report: AuditReport): ToolBreakdownRow[] =>
  report.tools.map((tool) => {
    const [recommendation] = report.recommendations
      .filter((item) => item.tools.includes(tool.toolName))
      .sort((a, b) => {
        const primaryDelta = Number(b.tools[0] === tool.toolName) - Number(a.tools[0] === tool.toolName);
        return primaryDelta || b.estimatedMonthlySavings - a.estimatedMonthlySavings;
      });

    return {
      tool,
      recommendation,
      savings: recommendation ? Math.max(0, Math.min(recommendation.estimatedMonthlySavings, tool.monthlySpend)) : 0,
      recommendedAction: recommendation?.recommendedAction || 'Keep current setup and monitor usage',
      reason: recommendation
        ? firstSentence(recommendation.reasoning)
        : 'This line item does not show a defensible savings opportunity right now.',
    };
  });

export const peerSpendBenchmark = (teamSize: number) => {
  if (teamSize <= 5) return 65;
  if (teamSize <= 20) return 95;
  return 125;
};
