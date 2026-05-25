import { FormEvent, useState } from 'react';
import { CheckCircle2, ExternalLink, MailCheck, Save, ShieldCheck } from 'lucide-react';
import { saveLead } from '../utils/api';
import { referralCodeFromAuditId, withReferralCode } from '../utils/referral';
import AnimatedButton from './AnimatedButton';

export default function EmailCapture({
  auditId,
  efficient = false,
  estimatedMonthlySavings = 0,
  ensureAuditSaved,
}: {
  auditId?: string;
  efficient?: boolean;
  estimatedMonthlySavings?: number;
  ensureAuditSaved?: () => Promise<string | undefined>;
}) {
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', teamSize: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [shareAuditId, setShareAuditId] = useState(auditId || '');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('saving');
    try {
      const savedAuditId = auditId || (await ensureAuditSaved?.()) || '';
      await saveLead({
        ...form,
        teamSize: form.teamSize ? Number(form.teamSize) : undefined,
        auditId: savedAuditId,
        estimatedMonthlySavings,
      });
      setShareAuditId(savedAuditId);
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  };

  const referralCode = referralCodeFromAuditId(shareAuditId);
  const publicReportUrl = shareAuditId ? withReferralCode(`${window.location.origin}/audit/${shareAuditId}`, referralCode) : '';

  return (
    <form onSubmit={submit} className="glass-card rounded-3xl p-6">
      <div className="mb-5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
          <MailCheck className="h-4 w-4" />
          Lead capture
        </p>
        <h3 className="mt-2 text-2xl font-bold text-white">
          {efficient ? 'Notify me when new optimizations apply to my stack' : 'Send me this audit and next steps'}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
          {efficient
            ? "You're spending well today. Leave your email and AuditEX will flag new pricing, credits, or stack changes when they become relevant."
            : 'Name and email are required. Organization, role, and team size help route high-savings reports for follow-up.'}
        </p>
      </div>
      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        placeholder="Website"
        value={form.website}
        onChange={(event) => setForm({ ...form, website: event.target.value })}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <input className="field" required placeholder="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input className="field" required type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="field" placeholder="Organization" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} />
        <input className="field" placeholder="Role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} />
        <input className="field" type="number" min="1" placeholder="Team size" value={form.teamSize} onChange={(event) => setForm({ ...form, teamSize: event.target.value })} />
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <AnimatedButton type="submit" disabled={status === 'saving'} icon={<Save className="h-4 w-4" />}>
          {status === 'saving' ? 'Saving...' : efficient ? 'Generate Link' : 'Save My Audit Report'}
        </AnimatedButton>
        {status === 'saved' && (
          <p className="inline-flex items-center gap-2 text-sm text-[#22D3EE]">
            <CheckCircle2 className="h-4 w-4" />
            Saved. Your share link is ready.
          </p>
        )}
        {status === 'error' && <p className="text-sm text-[#8B5CF6]">Lead capture is offline. The report still works locally.</p>}
      </div>
      {publicReportUrl && status === 'saved' && (
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-aqua/20 bg-aqua/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="break-all text-sm font-medium text-white">{publicReportUrl}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-aqua">
              Referral code: {referralCode}
            </p>
          </div>
          <a
            href={publicReportUrl}
            className="app-button-secondary inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
          >
            Open public report
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}
      <p className="mt-4 inline-flex items-start gap-2 text-xs leading-5 text-[#94A3B8]">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-aqua" />
        Public reports never include contact details. This form uses a hidden honeypot field and API rate limiting to reduce spam.
      </p>
    </form>
  );
}
