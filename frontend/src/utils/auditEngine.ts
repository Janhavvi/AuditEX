import { pricingData } from '../data/pricingData';
import type { AuditReport, AuditTool, Recommendation, Severity, ToolName, ToolPlan, UseCase } from '../types/audit';
import { calculateTotals } from './calculations';
import { currency } from './formatter';

const recommendationId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `rec-${Math.random().toString(16).slice(2)}`;

const severityFromSavings = (savings: number, spend: number): Severity => {
  if (savings >= 120 || savings / Math.max(spend, 1) > 0.35) return 'High';
  if (savings >= 45 || savings / Math.max(spend, 1) > 0.18) return 'Medium';
  return 'Low';
};

const pushRecommendation = (
  recommendations: Recommendation[],
  title: string,
  description: string,
  savings: number,
  tools: ToolName[],
  spend = savings,
) => {
  if (savings < 0) return;
  if (recommendations.some((item) => item.title === title)) return;
  recommendations.push({
    id: recommendationId(),
    title,
    description,
    recommendedAction: title,
    reasoning: description,
    severity: severityFromSavings(savings, spend),
    currentMonthlySpend: Math.round(spend),
    estimatedMonthlySavings: Math.round(savings),
    tools,
  });
};

const planFitsUseCase = (plan: ToolPlan, useCase: UseCase) =>
  useCase === 'mixed' || plan.bestFor.includes(useCase) || plan.bestFor.includes('mixed');

const planMonthlyBenchmark = (plan: ToolPlan, seats: number) =>
  plan.monthlyPrice > 0 ? plan.monthlyPrice * Math.max(seats, 1) : 0;

const planLabel = (plan: ToolPlan) =>
  plan.monthlyPrice > 0 ? `${plan.name} at ${currency(plan.monthlyPrice)}/seat/month` : `${plan.name} with custom or usage-based pricing`;

const publicPlanCandidates = (toolName: ToolName, useCase: UseCase) =>
  pricingData[toolName].plans.filter(
    (plan) =>
      plan.monthlyPrice > 0 &&
      !['Enterprise', 'API direct', 'API'].includes(plan.name) &&
      planFitsUseCase(plan, useCase),
  );

const bestSameVendorPlan = (tool: AuditTool, currentPlan?: ToolPlan) => {
  const candidates = publicPlanCandidates(tool.toolName, tool.useCase).filter((plan) => plan.name !== tool.plan);

  const filtered = candidates.filter((plan) => {
    const planName = plan.name.toLowerCase();
    const currentName = tool.plan.toLowerCase();

    if (tool.teamSize <= 2 && ['team', 'business', 'enterprise'].some((name) => currentName.includes(name))) {
      return ['plus', 'pro', 'individual'].some((name) => planName.includes(name));
    }

    if (tool.teamSize < 15 && currentName.includes('enterprise')) {
      return ['team', 'business', 'pro'].some((name) => planName.includes(name));
    }

    return Boolean(currentPlan?.monthlyPrice && plan.monthlyPrice < currentPlan.monthlyPrice);
  });

  return filtered.sort((a, b) => planMonthlyBenchmark(a, tool.seats) - planMonthlyBenchmark(b, tool.seats))[0];
};

const bestAlternative = (tool: AuditTool) => {
  const currentSpend = tool.monthlySpend;
  const candidates = pricingData[tool.toolName].alternatives
    .flatMap((alternative) =>
      publicPlanCandidates(alternative, tool.useCase).map((plan) => ({
        toolName: alternative,
        plan,
        benchmark: planMonthlyBenchmark(plan, tool.seats),
      })),
    )
    .filter((candidate) => candidate.benchmark > 0 && candidate.benchmark < currentSpend * 0.82)
    .sort((a, b) => a.benchmark - b.benchmark);

  return candidates[0];
};

const hasRetailSpendSignal = (tool: AuditTool, currentPlan?: ToolPlan) =>
  pricingData[tool.toolName].category === 'api' ||
  tool.monthlySpend >= 250 ||
  tool.plan === 'Enterprise' ||
  currentPlan?.monthlyPrice === 0;

export const runAudit = (tools: AuditTool[]): AuditReport => {
  const recommendations: Recommendation[] = [];
  const paidTools = tools.filter((tool) => tool.monthlySpend > 0);
  const totalSpend = paidTools.reduce((sum, tool) => sum + tool.monthlySpend, 0);

  for (const tool of paidTools) {
    const pricing = pricingData[tool.toolName];
    const currentPlan = pricing.plans.find((plan) => plan.name === tool.plan);
    const seatPrice = currentPlan?.monthlyPrice || tool.monthlySpend / Math.max(tool.seats, 1);
    const referencePrice = currentPlan?.monthlyPrice ? currentPlan.monthlyPrice * Math.max(tool.seats, 1) : 0;
    const sameVendorPlan = bestSameVendorPlan(tool, currentPlan);
    const alternative = bestAlternative(tool);

    if (tool.seats > tool.teamSize) {
      const unusedSeats = tool.seats - tool.teamSize;
      pushRecommendation(
        recommendations,
        `Remove ${unusedSeats} unused ${tool.toolName} ${unusedSeats === 1 ? 'seat' : 'seats'}`,
        `${tool.toolName} has ${tool.seats} seats for a team of ${tool.teamSize}. At roughly ${Math.round(seatPrice)}/seat/month, removing unused seats is a direct, auditable reduction.`,
        unusedSeats * seatPrice,
        [tool.toolName],
        tool.monthlySpend,
      );
    }

    if (referencePrice > 0 && tool.monthlySpend > referencePrice * 1.35) {
      pushRecommendation(
        recommendations,
        `${tool.toolName} spend is above plan benchmarks`,
        `The public ${tool.plan} benchmark is about $${Math.round(referencePrice)}/month for ${tool.seats} seats, but current spend is $${Math.round(tool.monthlySpend)}. The gap should be reconciled against duplicate workspaces, add-ons, annual billing mismatches, or usage overages before renewal.`,
        tool.monthlySpend - referencePrice,
        [tool.toolName],
        tool.monthlySpend,
      );
    }

    if (sameVendorPlan) {
      const benchmark = planMonthlyBenchmark(sameVendorPlan, tool.seats);
      const savings = Math.max(0, tool.monthlySpend - benchmark);
      pushRecommendation(
        recommendations,
        `Review ${tool.toolName} ${tool.plan} plan fit`,
        `${tool.toolName} is on ${tool.plan} for ${tool.seats} ${tool.seats === 1 ? 'seat' : 'seats'} and a ${tool.teamSize}-person team. ${planLabel(sameVendorPlan)} is a same-vendor benchmark for ${tool.useCase} work, implying a ${currency(benchmark)}/month reference cost against ${currency(tool.monthlySpend)} entered spend. Validate admin, security, and workspace needs before downgrading.`,
        savings,
        [tool.toolName],
        tool.monthlySpend,
      );
    }

    if (alternative) {
      const savings = tool.monthlySpend - alternative.benchmark;
      pushRecommendation(
        recommendations,
        `Compare ${tool.toolName} with ${alternative.toolName}`,
        `${alternative.toolName} ${alternative.plan.name} benchmarks at ${currency(alternative.benchmark)}/month for ${tool.seats} ${tool.seats === 1 ? 'seat' : 'seats'}, versus ${currency(tool.monthlySpend)} entered for ${tool.toolName}. Treat this as a replacement test for ${tool.useCase} workflows; run a pilot before moving regulated, high-context, or quality-sensitive work.`,
        savings,
        [tool.toolName, alternative.toolName],
        tool.monthlySpend,
      );
    }

    if (pricing.category === 'api' && tool.monthlySpend > 400) {
      const alternative = tool.toolName === 'Anthropic API direct' ? 'OpenAI API direct' : 'Gemini';
      pushRecommendation(
        recommendations,
        `Route high-volume API workloads through ${alternative}`,
        `${tool.toolName} usage is large enough to justify workload routing. A conservative 12% estimate assumes only summarization, classification, and low-risk jobs move after quality testing; do not move regulated or quality-sensitive workloads without evals.`,
        tool.monthlySpend * 0.12,
        [tool.toolName, alternative as ToolName],
        tool.monthlySpend,
      );
    }

    if (hasRetailSpendSignal(tool, currentPlan)) {
      pushRecommendation(
        recommendations,
        `Check credits and negotiated pricing for ${tool.toolName}`,
        `At ${currency(tool.monthlySpend)}/month on ${tool.plan}, confirm whether startup credits, nonprofit discounts, education programs, annual commitments, marketplace private offers, or committed-use agreements apply. AuditEX records this as a $0 savings item until eligibility is documented by the vendor or marketplace.`,
        0,
        [tool.toolName],
        tool.monthlySpend,
      );
    }

    if (currentPlan && !currentPlan.bestFor.includes(tool.useCase) && tool.useCase !== 'mixed') {
      pushRecommendation(
        recommendations,
        `${tool.toolName} is not the best fit for ${tool.useCase.toLowerCase()}`,
        `The selected ${tool.plan} plan is benchmarked for ${currentPlan.bestFor.join(', ')} workflows, while this line item is tagged as ${tool.useCase}. The estimate is capped at 10% and should be validated through usage logs, user interviews, and a side-by-side workflow test.`,
        Math.min(tool.monthlySpend * 0.1, 50),
        [tool.toolName, ...pricing.alternatives.slice(0, 1)],
        tool.monthlySpend,
      );
    }
  }

  const categories = paidTools.reduce<Record<string, AuditTool[]>>((acc, tool) => {
    const category = pricingData[tool.toolName].category;
    acc[category] = [...(acc[category] || []), tool];
    return acc;
  }, {});

  for (const [category, group] of Object.entries(categories)) {
    if (group.length >= 3) {
      const groupSpend = group.reduce((sum, tool) => sum + tool.monthlySpend, 0);
      pushRecommendation(
        recommendations,
        `Consolidate overlapping ${category} tools`,
        `${group.map((tool) => tool.toolName).join(', ')} overlap in the same workflow. Standardizing on two preferred tools is modeled as removing only the smallest duplicate spend, not a blanket percentage cut.`,
        Math.min(...group.map((tool) => tool.monthlySpend)),
        group.map((tool) => tool.toolName),
        groupSpend,
      );
    }
  }

  const codingTools = paidTools.filter((tool) => pricingData[tool.toolName].category === 'coding');
  const assistantTools = paidTools.filter((tool) => pricingData[tool.toolName].category === 'assistant');

  if (codingTools.length >= 2 && codingTools.reduce((sum, tool) => sum + tool.seats, 0) > Math.max(...codingTools.map((tool) => tool.teamSize))) {
    const codingSpend = codingTools.reduce((sum, tool) => sum + tool.monthlySpend, 0);
    pushRecommendation(
      recommendations,
      'Standardize developer AI seats',
      'Cursor, Copilot, Windsurf, and v0 can create hidden seat duplication. The estimate removes only the lowest-cost duplicated coding line item after cohort assignment.',
      Math.min(...codingTools.map((tool) => tool.monthlySpend)),
      codingTools.map((tool) => tool.toolName),
      codingSpend,
    );
  }

  if (assistantTools.length >= 3) {
    const assistantSpend = assistantTools.reduce((sum, tool) => sum + tool.monthlySpend, 0);
    pushRecommendation(
      recommendations,
      'Create an assistant policy by team role',
      'Multiple general assistants are being purchased for similar knowledge-work jobs. A role-based policy can preserve capability and reduce duplicate paid seats.',
      Math.min(...assistantTools.map((tool) => tool.monthlySpend)),
      assistantTools.map((tool) => tool.toolName),
      assistantSpend,
    );
  }

  if (totalSpend > 1500) {
    pushRecommendation(
      recommendations,
      'Negotiate annual commitments for core vendors',
      'Your AI budget is large enough to support vendor negotiations, usage caps, and annual discounts across core platforms. The estimate uses a conservative 8% planning assumption and should be validated in procurement.',
      totalSpend * 0.08,
      paidTools.slice(0, 5).map((tool) => tool.toolName),
      totalSpend,
    );
  }

  const totals = calculateTotals(tools, recommendations);
  return { tools, totals, recommendations };
};
