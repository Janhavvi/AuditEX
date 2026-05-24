import { CalendarCheck } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import { currency } from '../utils/formatter';

export default function ConsultationCTA({ monthlySavings, annualSavings }: { monthlySavings: number; annualSavings: number }) {
  return (
    <div className="glass-card rounded-2xl bg-[linear-gradient(135deg,rgba(34,211,238,0.13),rgba(59,130,246,0.08)_42%,rgba(139,92,246,0.11)),rgba(17,21,46,0.55)] p-6 md:flex md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">Credex opportunity</p>
        <h3 className="mt-2 text-2xl font-bold text-white">Capture more of the {currency(monthlySavings)}/mo opportunity</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#94A3B8]">
          This audit shows {currency(annualSavings)} in annual savings potential. Credex can help turn the estimate into vendor actions, usage controls, and renewal leverage.
        </p>
      </div>
      <AnimatedButton className="mt-5 md:mt-0" icon={<CalendarCheck className="h-4 w-4" />}>
        Talk to Credex
      </AnimatedButton>
    </div>
  );
}
