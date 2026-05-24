import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Audit from '../models/Audit.js';
import { generateAuditId } from '../utils/generateId.js';
import { buildAuditPdf } from '../utils/pdfReport.js';
import type { AuditReport, AuditTool, AuditTotals, Recommendation } from '../types/audit.js';

interface MemoryAudit {
  auditId: string;
  tools: AuditTool[];
  totals: AuditTotals;
  recommendations: Recommendation[];
  summary?: string;
  createdAt: string;
}

type SummarySource = 'anthropic' | 'nvidia_nim' | 'fallback';

const buildFallbackSummary = (report: AuditReport) => {
  const top = report.recommendations
    .filter((item) => item.estimatedMonthlySavings > 0)
    .slice(0, 2)
    .map((item) => item.title.toLowerCase())
    .join(' and ');

  if (report.totals.estimatedMonthlySavings < 100) {
    return `You're already spending efficiently. AuditEX reviewed ${report.tools.length} AI tools and found only $${Math.round(report.totals.estimatedMonthlySavings)} in defensible monthly savings against $${Math.round(report.totals.totalMonthlySpend)} in current spend. Keep monitoring usage, seats, and vendor changes; we will flag new optimization opportunities when your stack or pricing shifts.`;
  }

  return `AuditEX reviewed ${report.tools.length} AI tools and found $${Math.round(report.totals.estimatedMonthlySavings)} in defensible monthly savings, or about $${Math.round(report.totals.estimatedYearlySavings)} annually. The clearest opportunities are ${top || 'seat right-sizing and vendor policy review'}. These recommendations are based on current plan benchmarks, entered spend, team size, and workflow fit rather than generic tool rankings.`;
};

const buildSummaryPrompt = (report: AuditReport) => `Write one polished ~100-word paragraph for an AI spend audit summary.

Rules:
- Use only the numbers and recommendations supplied.
- Do not invent savings.
- Do not rank tools as good or bad.
- If monthly savings are below $100, say the customer is already spending efficiently.
- Mention the strongest recommendation themes.
- Tone: concise, premium, CFO-friendly.
- Output exactly one paragraph. No bullets, headings, JSON, markdown, or preamble.

Report JSON:
${JSON.stringify({
  toolCount: report.tools.length,
  totalMonthlySpend: report.totals.totalMonthlySpend,
  estimatedMonthlySavings: report.totals.estimatedMonthlySavings,
  estimatedYearlySavings: report.totals.estimatedYearlySavings,
  recommendations: report.recommendations.slice(0, 5).map((item) => ({
    action: item.recommendedAction,
    savings: item.estimatedMonthlySavings,
    reasoning: item.reasoning,
  })),
})}`;

const fetchJsonWithTimeout = async (url: string, init: RequestInit, timeoutMs = 9000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) return null;
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
};

const normalizeSummary = (value: unknown) => {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim();
};

const generateAnthropicSummary = async (prompt: string) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return '';

  const data = await fetchJsonWithTimeout('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 180,
      temperature: 0.25,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  return normalizeSummary(data?.content?.find((block: { type?: string; text?: string }) => block.type === 'text')?.text);
};

const generateNvidiaSummary = async (prompt: string) => {
  const apiKey = process.env.NVIDIA_NIM_API_KEY;
  if (!apiKey) return '';

  const data = await fetchJsonWithTimeout('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.NVIDIA_NIM_MODEL || 'meta/llama-3.1-70b-instruct',
      max_tokens: 180,
      temperature: 0.25,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  return normalizeSummary(data?.choices?.[0]?.message?.content);
};

export const generateSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = req.body as AuditReport;

    if (!report?.tools || !report?.totals || !Array.isArray(report.recommendations)) {
      res.status(400).json({ message: 'A complete audit report is required.' });
      return;
    }

    const prompt = buildSummaryPrompt(report);
    const providers: Array<[SummarySource, () => Promise<string>]> = [
      ['nvidia_nim', () => generateNvidiaSummary(prompt)],
      ['anthropic', () => generateAnthropicSummary(prompt)],
    ];

    for (const [source, generate] of providers) {
      try {
        const summary = await generate();
        if (summary) {
          res.json({ summary, source });
          return;
        }
      } catch {
        // Continue to the next provider, then the deterministic template.
      }
    }

    res.json({ summary: buildFallbackSummary(report), source: 'fallback' });
  } catch (error) {
    next(error);
  }
};

const memoryAudits = new Map<string, MemoryAudit>();

const findAuditById = async (auditId: string) => {
  if (mongoose.connection.readyState !== 1) {
    return memoryAudits.get(auditId) || null;
  }

  return Audit.findOne({ auditId }).lean();
};

const toPublicAudit = (audit: AuditReport): AuditReport => ({
  auditId: audit.auditId,
  tools: audit.tools.map((tool) => ({
    id: tool.id,
    toolName: tool.toolName,
    plan: tool.plan,
    monthlySpend: tool.monthlySpend,
    seats: tool.seats,
    teamSize: tool.teamSize,
    useCase: tool.useCase,
  })),
  totals: {
    totalMonthlySpend: audit.totals.totalMonthlySpend,
    totalYearlySpend: audit.totals.totalYearlySpend,
    estimatedMonthlySavings: audit.totals.estimatedMonthlySavings,
    estimatedYearlySavings: audit.totals.estimatedYearlySavings,
    savingsPercentage: audit.totals.savingsPercentage,
  },
  recommendations: audit.recommendations.map((recommendation) => ({
    id: recommendation.id,
    title: recommendation.title,
    description: recommendation.description,
    recommendedAction: recommendation.recommendedAction,
    reasoning: recommendation.reasoning,
    severity: recommendation.severity,
    currentMonthlySpend: recommendation.currentMonthlySpend,
    estimatedMonthlySavings: recommendation.estimatedMonthlySavings,
    tools: recommendation.tools,
  })),
  summary: audit.summary,
  createdAt: audit.createdAt ? new Date(audit.createdAt).toISOString() : undefined,
});

const currency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const publicAuditUrl = (auditId: string) => `${process.env.CLIENT_URL || 'http://localhost:5173'}/audit/${encodeURIComponent(auditId)}`;
const apiOrigin = (req: Request) => process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`;

export const createAudit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tools, totals, recommendations, summary } = req.body;

    if (!Array.isArray(tools) || !totals || !Array.isArray(recommendations)) {
      res.status(400).json({ message: 'tools, totals, and recommendations are required.' });
      return;
    }

    const auditId = generateAuditId();

    if (mongoose.connection.readyState !== 1) {
      const audit = {
        auditId,
        tools,
        totals,
        recommendations,
        summary,
        createdAt: new Date().toISOString(),
      };
      memoryAudits.set(auditId, audit);
      res.status(201).json(audit);
      return;
    }

    const audit = await Audit.create({ auditId, tools, totals, recommendations, summary });

    res.status(201).json(audit);
  } catch (error) {
    next(error);
  }
};

export const getAudit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditId = String(req.params.id);
    const audit = await findAuditById(auditId);

    if (!audit) {
      res.status(404).json({ message: 'Audit not found.' });
      return;
    }

    res.json(toPublicAudit(audit as AuditReport));
  } catch (error) {
    next(error);
  }
};

export const getAuditSharePreview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditId = String(req.params.id);
    const audit = await findAuditById(auditId);

    if (!audit) {
      res.status(404).send('Audit report not found.');
      return;
    }

    const report = toPublicAudit(audit as AuditReport);
    const reportUrl = publicAuditUrl(auditId);
    const imageUrl = `${apiOrigin(req)}/api/audits/${encodeURIComponent(auditId)}/og.svg`;
    const title = `AuditEX report: ${currency(report.totals.estimatedYearlySavings)} annual AI savings`;
    const description = `${currency(report.totals.estimatedMonthlySavings)}/mo savings potential across ${report.tools.length} AI tools, with ${report.recommendations.length} recommendations.`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${escapeHtml(reportUrl)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:alt" content="${escapeHtml(title)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
    <meta http-equiv="refresh" content="0;url=${escapeHtml(reportUrl)}" />
    <link rel="canonical" href="${escapeHtml(reportUrl)}" />
  </head>
  <body>
    <p><a href="${escapeHtml(reportUrl)}">Open this AuditEX report</a></p>
    <script>window.location.replace(${JSON.stringify(reportUrl)});</script>
  </body>
</html>`);
  } catch (error) {
    next(error);
  }
};

export const getAuditOgImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditId = String(req.params.id);
    const audit = await findAuditById(auditId);

    if (!audit) {
      res.status(404).send('Audit report not found.');
      return;
    }

    const report = toPublicAudit(audit as AuditReport);
    const monthlySavings = currency(report.totals.estimatedMonthlySavings);
    const yearlySavings = currency(report.totals.estimatedYearlySavings);
    const subtitle = `${report.tools.length} tools reviewed - ${report.recommendations.length} recommendations`;

    res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeHtml(yearlySavings)} annual AI savings">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#050816"/>
      <stop offset="0.58" stop-color="#0A0F23"/>
      <stop offset="1" stop-color="#11152E"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#22D3EE"/>
      <stop offset="0.5" stop-color="#3B82F6"/>
      <stop offset="1" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1010" cy="70" r="260" fill="#22D3EE" opacity="0.08"/>
  <circle cx="140" cy="620" r="300" fill="#8B5CF6" opacity="0.09"/>
  <rect x="70" y="70" width="1060" height="490" rx="34" fill="#11152E" opacity="0.74" stroke="#FFFFFF" stroke-opacity="0.14"/>
  <text x="110" y="145" fill="#22D3EE" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="28" font-weight="700" letter-spacing="4">AUDITEX PUBLIC REPORT</text>
  <text x="110" y="255" fill="#FFFFFF" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="82" font-weight="800">${escapeHtml(monthlySavings)}/mo</text>
  <text x="110" y="325" fill="#CBD5E1" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="34" font-weight="600">Estimated monthly AI savings</text>
  <rect x="110" y="390" width="440" height="92" rx="20" fill="url(#accent)" opacity="0.18" stroke="#22D3EE" stroke-opacity="0.32"/>
  <text x="140" y="448" fill="#FFFFFF" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="34" font-weight="750">${escapeHtml(yearlySavings)} annualized</text>
  <text x="650" y="433" fill="#CBD5E1" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="32" font-weight="650">${escapeHtml(subtitle)}</text>
  <text x="650" y="482" fill="#94A3B8" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="24">Tools and savings shown. Contact details are never public.</text>
</svg>`);
  } catch (error) {
    next(error);
  }
};

export const getAuditPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auditId = String(req.params.id);
    const audit = await findAuditById(auditId);

    if (!audit) {
      res.status(404).json({ message: 'Audit not found.' });
      return;
    }

    const pdf = buildAuditPdf(toPublicAudit(audit as AuditReport));
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="auditex-${auditId}.pdf"`);
    res.setHeader('Content-Length', pdf.length);
    res.status(200).send(pdf);
  } catch (error) {
    next(error);
  }
};
