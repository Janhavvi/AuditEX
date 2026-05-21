import type { Severity } from '../types/audit';

const styles: Record<Severity, string> = {
  Low: 'border-[#22D3EE]/30 bg-[#22D3EE]/10 text-[#22D3EE]',
  Medium: 'border-[#3B82F6]/30 bg-[#3B82F6]/10 text-white',
  High: 'border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#8B5CF6]',
};

export default function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${styles[severity]}`}>{severity}</span>;
}
