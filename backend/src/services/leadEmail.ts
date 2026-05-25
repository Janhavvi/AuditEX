import { Resend } from 'resend';

interface LeadEmail {
  auditId?: string;
  email: string;
  estimatedMonthlySavings?: number;
  name: string;
}

const HIGH_SAVINGS_THRESHOLD = 500;
const clientUrl = () => process.env.CLIENT_URL?.split(',')[0]?.trim() || 'https://main.d1gt3euco9a18p.amplifyapp.com';

export const sendLeadConfirmation = async (lead: LeadEmail) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const highSavings = Number(lead.estimatedMonthlySavings || 0) >= HIGH_SAVINGS_THRESHOLD;
  const auditUrl = lead.auditId ? `${clientUrl()}/audit/${lead.auditId}` : '';
  const savingsLine = lead.estimatedMonthlySavings
    ? `AuditEX found about $${Math.round(lead.estimatedMonthlySavings)} in defensible monthly savings.\n\n`
    : '';
  const followUpLine = highSavings
    ? 'Because this is a high-savings case, Credex will reach out with next steps for a vendor and workflow review.\n\n'
    : 'We will keep you posted when new optimizations apply to your stack.\n\n';

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'AuditEX <audit@auditex.ai>',
      to: lead.email,
      subject: 'Your AuditEX AI spend audit was received',
      text: `Hi ${lead.name},\n\nYour AuditEX audit has been received.\n\n${savingsLine}${followUpLine}${auditUrl ? `Shareable report: ${auditUrl}\n\n` : ''}AuditEX`,
    });
  } catch {
    // Lead storage should remain successful even if email delivery is temporarily unavailable.
  }
};
