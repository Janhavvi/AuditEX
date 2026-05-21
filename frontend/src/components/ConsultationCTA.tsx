import { CalendarCheck } from 'lucide-react';
import AnimatedButton from './AnimatedButton';

export default function ConsultationCTA() {
  return (
    <div className="glass-card rounded-3xl bg-[radial-gradient(circle_at_15%_0%,rgba(34,211,238,0.07),transparent_16rem),radial-gradient(circle_at_90%_50%,rgba(139,92,246,0.07),transparent_16rem),rgba(17,21,46,0.45)] p-6 md:flex md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">High savings signal</p>
        <h3 className="mt-2 text-2xl font-bold text-white">Book Credex Consultation</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#94A3B8]">
          Your savings estimate is large enough for a structured vendor and workflow review.
        </p>
      </div>
      <AnimatedButton className="mt-5 md:mt-0" icon={<CalendarCheck className="h-4 w-4" />}>
        Book Consultation
      </AnimatedButton>
    </div>
  );
}
