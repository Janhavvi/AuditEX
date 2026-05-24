import { describe, expect, it } from 'vitest';
import type { AuditTool } from '../types/audit';
import { runAudit } from './auditEngine';

const tool = (overrides: Partial<AuditTool>): AuditTool => ({
  id: overrides.id || `tool-${overrides.toolName || 'default'}`,
  toolName: overrides.toolName || 'ChatGPT',
  plan: overrides.plan || 'Team',
  monthlySpend: overrides.monthlySpend ?? 0,
  seats: overrides.seats ?? 1,
  teamSize: overrides.teamSize ?? 1,
  useCase: overrides.useCase || 'mixed',
});

describe('runAudit', () => {
  it('flags unused seats using vendor seat pricing', () => {
    const report = runAudit([
      tool({ toolName: 'ChatGPT', plan: 'Team', monthlySpend: 300, seats: 10, teamSize: 6, useCase: 'mixed' }),
    ]);

    const unusedSeatRecommendation = report.recommendations.find((item) => item.title.includes('Remove 4 unused ChatGPT'));

    expect(unusedSeatRecommendation).toBeDefined();
    expect(unusedSeatRecommendation?.estimatedMonthlySavings).toBe(120);
    expect(report.totals.totalMonthlySpend).toBe(300);
  });

  it('flags spend above public plan benchmarks', () => {
    const report = runAudit([
      tool({
        toolName: 'GitHub Copilot',
        plan: 'Business',
        monthlySpend: 300,
        seats: 5,
        teamSize: 5,
        useCase: 'coding',
      }),
    ]);

    const benchmarkRecommendation = report.recommendations.find((item) => item.title.includes('above plan benchmarks'));

    expect(benchmarkRecommendation).toBeDefined();
    expect(benchmarkRecommendation?.currentMonthlySpend).toBe(300);
    expect(benchmarkRecommendation?.estimatedMonthlySavings).toBe(205);
  });

  it('recommends API workload routing only for high-volume API spend', () => {
    const report = runAudit([
      tool({
        toolName: 'OpenAI API direct',
        plan: 'API direct',
        monthlySpend: 1000,
        seats: 1,
        teamSize: 8,
        useCase: 'data',
      }),
    ]);

    const routingRecommendation = report.recommendations.find((item) => item.title.includes('Route high-volume API workloads'));

    expect(routingRecommendation).toBeDefined();
    expect(routingRecommendation?.tools).toContain('OpenAI API direct');
    expect(routingRecommendation?.estimatedMonthlySavings).toBe(120);
  });

  it('models category consolidation from the smallest overlapping spend', () => {
    const report = runAudit([
      tool({ id: 'chatgpt', toolName: 'ChatGPT', plan: 'Team', monthlySpend: 300, seats: 10, teamSize: 10 }),
      tool({ id: 'claude', toolName: 'Claude', plan: 'Team', monthlySpend: 300, seats: 10, teamSize: 10 }),
      tool({ id: 'gemini', toolName: 'Gemini', plan: 'Pro', monthlySpend: 80, seats: 4, teamSize: 10, useCase: 'writing' }),
    ]);

    const consolidation = report.recommendations.find((item) => item.title === 'Consolidate overlapping assistant tools');

    expect(consolidation).toBeDefined();
    expect(consolidation?.estimatedMonthlySavings).toBe(80);
    expect(consolidation?.currentMonthlySpend).toBe(680);
  });

  it('caps total estimated savings at 72 percent of monthly spend', () => {
    const report = runAudit([
      tool({ id: 'cursor', toolName: 'Cursor', plan: 'Business', monthlySpend: 400, seats: 10, teamSize: 2, useCase: 'coding' }),
      tool({ id: 'copilot', toolName: 'GitHub Copilot', plan: 'Enterprise', monthlySpend: 390, seats: 10, teamSize: 2, useCase: 'coding' }),
      tool({ id: 'windsurf', toolName: 'Windsurf', plan: 'Team', monthlySpend: 300, seats: 10, teamSize: 2, useCase: 'coding' }),
    ]);

    expect(report.totals.estimatedMonthlySavings).toBeLessThanOrEqual(report.totals.totalMonthlySpend * 0.72);
    expect(report.totals.estimatedYearlySavings).toBe(report.totals.estimatedMonthlySavings * 12);
  });

  it('does not manufacture recommendations for tools with no monthly spend', () => {
    const report = runAudit([
      tool({ toolName: 'Cursor', plan: 'Hobby', monthlySpend: 0, seats: 1, teamSize: 1, useCase: 'coding' }),
    ]);

    expect(report.recommendations).toHaveLength(0);
    expect(report.totals.totalMonthlySpend).toBe(0);
    expect(report.totals.estimatedMonthlySavings).toBe(0);
  });
});
