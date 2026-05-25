interface LeadEmail {
  auditId?: string;
  email: string;
  estimatedMonthlySavings?: number;
  name: string;
}

const HIGH_SAVINGS_THRESHOLD = 500;

export const sendLeadConfirmation = async (lead: LeadEmail) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const highSavings = Number(lead.estimatedMonthlySavings || 0) >= HIGH_SAVINGS_THRESHOLD;
  const auditUrl = lead.auditId ? `${process.env.CLIENT_URL || 'http://localhost:5173'}/audit/${lead.auditId}` : '';
  const savingsLine = lead.estimatedMonthlySavings
    ? `AuditEX found about $${Math.round(lead.estimatedMonthlySavings)} in defensible monthly savings.\n\n`
    : '';
  const followUpLine = highSavings
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
        text: `Hi ${lead.name},\n\nYour AuditEX audit has been received.\n\n${savingsLine}${followUpLine}${auditUrl ? `Shareable report: ${auditUrl}\n\n` : ''}AuditEX`,
      }),
    });

    if (!response.ok) throw new Error('Resend email request failed.');
  } catch {
    // Lead storage should remain successful even if email delivery is temporarily unavailable.
  }
};
