import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import { sendLeadConfirmation } from '../services/leadEmail.js';
import { isHoneypotFilled, parseLeadPayload } from '../utils/leadPayload.js';

const memoryLeads: unknown[] = [];

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (isHoneypotFilled(req.body)) {
      res.status(204).end();
      return;
    }

    const parsed = parseLeadPayload(req.body);
    if ('error' in parsed) {
      res.status(400).json({ message: parsed.error });
      return;
    }

    const lead = parsed.data;

    if (mongoose.connection.readyState !== 1) {
      const localLead = { ...lead, createdAt: new Date().toISOString() };
      memoryLeads.push(localLead);
      await sendLeadConfirmation(lead);
      res.status(201).json(localLead);
      return;
    }

    const savedLead = await Lead.create(lead);
    await sendLeadConfirmation(lead);
    res.status(201).json(savedLead);
  } catch (error) {
    next(error);
  }
};
