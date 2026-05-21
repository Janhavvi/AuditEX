import mongoose, { Schema } from 'mongoose';

interface LeadDocument extends mongoose.Document {
  name: string;
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  auditId?: string;
  createdAt: Date;
}

const LeadSchema = new Schema<LeadDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    company: { type: String, trim: true },
    role: { type: String, trim: true },
    teamSize: { type: Number, min: 1 },
    auditId: { type: String, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export default mongoose.model<LeadDocument>('Lead', LeadSchema);
