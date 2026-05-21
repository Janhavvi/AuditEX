import mongoose, { Schema } from 'mongoose';
import type { AuditTool, AuditTotals, Recommendation } from '../types/audit.js';

interface AuditDocument extends mongoose.Document {
  auditId: string;
  tools: AuditTool[];
  totals: AuditTotals;
  recommendations: Recommendation[];
  summary?: string;
  createdAt: Date;
}

const AuditToolSchema = new Schema<AuditTool>(
  {
    id: { type: String, required: true },
    toolName: { type: String, required: true },
    plan: { type: String, required: true },
    monthlySpend: { type: Number, required: true, min: 0 },
    seats: { type: Number, required: true, min: 1 },
    teamSize: { type: Number, required: true, min: 1 },
    useCase: { type: String, required: true },
  },
  { _id: false },
);

const TotalsSchema = new Schema<AuditTotals>(
  {
    totalMonthlySpend: { type: Number, required: true, min: 0 },
    totalYearlySpend: { type: Number, required: true, min: 0 },
    estimatedMonthlySavings: { type: Number, required: true, min: 0 },
    estimatedYearlySavings: { type: Number, required: true, min: 0 },
    savingsPercentage: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const RecommendationSchema = new Schema<Recommendation>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    recommendedAction: { type: String, required: true },
    reasoning: { type: String, required: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    currentMonthlySpend: { type: Number, required: true, min: 0 },
    estimatedMonthlySavings: { type: Number, required: true, min: 0 },
    tools: [{ type: String, required: true }],
  },
  { _id: false },
);

const AuditSchema = new Schema<AuditDocument>(
  {
    auditId: { type: String, required: true, unique: true, index: true },
    tools: { type: [AuditToolSchema], required: true },
    totals: { type: TotalsSchema, required: true },
    recommendations: { type: [RecommendationSchema], required: true },
    summary: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<AuditDocument>('Audit', AuditSchema);
