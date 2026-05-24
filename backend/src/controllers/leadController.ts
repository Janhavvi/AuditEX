import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Lead from '../models/Lead.js';

const memoryLeads: unknown[] = [];
const HIGH_SAVINGS_THRESHOLD = 500;

const cleanString = (value: unknown) => (typeof value === 'string' ? value.trim() : undefined);
const positiveNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : undefined;
};

const sendLeadEmail = async (lead: { email: string; name: string; auditId?: string; estimatedMonthlySavings?: number }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const highSavings = Number(lead.estimatedMonthlySavings || 0) >= HIGH_SAVINGS_THRESHOLD;
  const auditUrl = lead.auditId ? `${process.env.CLIENT_URL || 'http://localhost:5173'}/audit/${lead.auditId}` : '';
  const savingsLine = lead.estimatedMonthlySavings
    ? `AuditEX found about $${Math.round(lead.estimatedMonthlySavings)} in defensible monthly savings.\n\n`
    : '';
  const credexLine = highSavings
    ? 'Because this is a high-savings case, Credex will reach out with next steps for a vendor and workflow review.\n\n'
    : 'We will keep you posted when new optimizations apply to your stack.\n\n';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'AuditEX <audit@auditex.ai>',
        to: lead.email,
        subject: 'Your AuditEX AI spend audit was received',
        text: `Hi ${lead.name},\n\nYour AuditEX audit has been received.\n\n${savingsLine}${credexLine}${auditUrl ? `Shareable report: ${auditUrl}\n\n` : ''}AuditEX`,
      }),
    });

    if (!response.ok) throw new Error('Resend email request failed.');
  } catch {
    // Lead storage should remain successful even if the transactional email provider is temporarily unavailable.
  }
};

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { website } = req.body;

    if (website) {
      res.status(204).end();
      return;
    }

    const name = cleanString(req.body.name);
    const email = cleanString(req.body.email)?.toLowerCase();
    const company = cleanString(req.body.company);
    const role = cleanString(req.body.role);
    const auditId = cleanString(req.body.auditId);
    const teamSize = positiveNumber(req.body.teamSize);
    const estimatedMonthlySavings = positiveNumber(req.body.estimatedMonthlySavings) || 0;
    const highSavings = estimatedMonthlySavings >= HIGH_SAVINGS_THRESHOLD;

    if (!name || !email) {
      res.status(400).json({ message: 'name and email are required.' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ message: 'A valid email is required.' });
      return;
    }

    const leadData = { name, email, company, role, teamSize, auditId, estimatedMonthlySavings, highSavings };

    if (mongoose.connection.readyState !== 1) {
      const lead = { ...leadData, createdAt: new Date().toISOString() };
      memoryLeads.push(lead);
      await sendLeadEmail({ email, name, auditId, estimatedMonthlySavings });
      res.status(201).json(lead);
      return;
    }

    const lead = await Lead.create(leadData);
    await sendLeadEmail({ email, name, auditId, estimatedMonthlySavings });
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};
