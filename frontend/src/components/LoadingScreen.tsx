import { Loader2 } from 'lucide-react';

export default function LoadingScreen({ label = 'Loading AuditEX' }: { label?: string }) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <div className="glass-card rounded-2xl p-6 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-aqua" />
        <p className="mt-4 text-sm text-[#94A3B8]">{label}</p>
      </div>
    </div>
  );
}
