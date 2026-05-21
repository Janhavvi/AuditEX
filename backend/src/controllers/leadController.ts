import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Lead from '../models/Lead.js';

const memoryLeads: unknown[] = [];

const sendLeadEmail = async (lead: { email: string; name: string; auditId?: string }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || 'AuditEX <audit@auditex.ai>',
        to: lead.email,
        subject: 'Your AuditEX AI spend audit was received',
        text: `Hi ${lead.name},\n\nYour AuditEX audit has been received. If your report shows a high-savings opportunity, Credex may reach out with next steps for a vendor and workflow review.\n\n${lead.auditId ? `Shareable report: ${process.env.CLIENT_URL || 'http://localhost:5173'}/audit/${lead.auditId}` : ''}\n\nAuditEX`,
      }),
    });
  } catch {
    // Lead storage should remain successful even if the transactional email provider is temporarily unavailable.
  }
};

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, company, role, teamSize, auditId, website } = req.body;

    if (website) {
      res.status(204).end();
      return;
    }

    if (!name || !email) {
      res.status(400).json({ message: 'name and email are required.' });
      return;
    }

    if (mongoose.connection.readyState !== 1) {
      const lead = { name, email, company, role, teamSize, auditId, createdAt: new Date().toISOString() };
      memoryLeads.push(lead);
      await sendLeadEmail({ email, name, auditId });
      res.status(201).json(lead);
      return;
    }

    const lead = await Lead.create({ name, email, company, role, teamSize, auditId });
    await sendLeadEmail({ email, name, auditId });
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};
