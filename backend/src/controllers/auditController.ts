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

export const generateSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = req.body as AuditReport;

    if (!report?.tools || !report?.totals || !Array.isArray(report.recommendations)) {
      res.status(400).json({ message: 'A complete audit report is required.' });
      return;
    }

    const prompt = buildSummaryPrompt(report);
    const nvidiaKey = process.env.NVIDIA_NIM_API_KEY;

    if (!nvidiaKey) {
      res.json({ summary: buildFallbackSummary(report), source: 'fallback' });
      return;
    }

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${nvidiaKey}`,
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_NIM_MODEL || 'meta/llama-3.1-70b-instruct',
        max_tokens: 180,
        temperature: 0.25,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      res.json({ summary: buildFallbackSummary(report), source: 'fallback' });
      return;
    }

    const data = await response.json();
    const summary = data?.choices?.[0]?.message?.content?.trim() || buildFallbackSummary(report);
    res.json({ summary, source: 'nvidia_nim' });
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

    res.json(audit);
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

    const pdf = buildAuditPdf(audit as AuditReport);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="auditex-${auditId}.pdf"`);
    res.setHeader('Content-Length', pdf.length);
    res.status(200).send(pdf);
  } catch (error) {
    next(error);
  }
};
