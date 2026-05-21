import { FormEvent, useState } from 'react';
import { MailCheck, Save, ShieldCheck } from 'lucide-react';
import { saveLead } from '../utils/api';
import AnimatedButton from './AnimatedButton';

export default function EmailCapture({ auditId, efficient = false }: { auditId?: string; efficient?: boolean }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', teamSize: '', website: '' });
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('saving');
    try {
      await saveLead({ ...form, teamSize: form.teamSize ? Number(form.teamSize) : undefined, auditId });
      setStatus('saved');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={submit} className="glass-card rounded-3xl p-6">
      <div className="mb-5">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
          <MailCheck className="h-4 w-4" />
          Lead capture
        </p>
        <h3 className="mt-2 text-2xl font-bold text-white">
          {efficient ? 'Notify me when new optimizations apply to my stack.' : 'Send me this audit and next steps'}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
          Name and email are required. Organization, role, and team size help route high-savings reports for follow-up.
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
          {status === 'saving' ? 'Saving...' : 'Save My Audit Report'}
        </AnimatedButton>
        {status === 'saved' && <p className="text-sm text-[#22D3EE]">Saved. Your team can revisit this audit anytime.</p>}
        {status === 'error' && <p className="text-sm text-[#8B5CF6]">Lead capture is offline. The report still works locally.</p>}
      </div>
      <p className="mt-4 inline-flex items-start gap-2 text-xs leading-5 text-[#94A3B8]">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-aqua" />
        Public reports never include contact details. This form uses a hidden honeypot field and API rate limiting to reduce spam.
      </p>
    </form>
  );
}
