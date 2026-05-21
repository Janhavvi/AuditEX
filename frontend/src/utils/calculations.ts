import type { AuditTool, AuditTotals, Recommendation } from '../types/audit';

export const calculateTotals = (tools: AuditTool[], recommendations: Recommendation[] = []): AuditTotals => {
  const totalMonthlySpend = tools.reduce((sum, tool) => sum + Number(tool.monthlySpend || 0), 0);
  const totalYearlySpend = totalMonthlySpend * 12;
  const estimatedMonthlySavings = recommendations.reduce(
    (sum, recommendation) => sum + recommendation.estimatedMonthlySavings,
    0,
  );
  const cappedMonthlySavings = Math.min(estimatedMonthlySavings, totalMonthlySpend * 0.72);
  const estimatedYearlySavings = cappedMonthlySavings * 12;
  const savingsPercentage = totalMonthlySpend > 0 ? (cappedMonthlySavings / totalMonthlySpend) * 100 : 0;

  return {
    totalMonthlySpend,
    totalYearlySpend,
    estimatedMonthlySavings: cappedMonthlySavings,
    estimatedYearlySavings,
    savingsPercentage,
  };
};
