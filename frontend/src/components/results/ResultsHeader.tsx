import { CalendarCheck } from 'lucide-react';

interface Props {
  headline: string;
  subcopy: string;
  showConsultationLink: boolean;
}

export default function ResultsHeader({ headline, subcopy, showConsultationLink }: Props) {
  return (
    <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">Audit results</p>
        <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">{headline}</h1>
        <p className="mt-4 max-w-2xl text-[#94A3B8]">{subcopy}</p>
      </div>

      {showConsultationLink && (
        <a
          href="https://credex.rocks"
          target="_blank"
          rel="noreferrer"
          className="app-button-primary inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition"
        >
          Book Consultation
          <CalendarCheck className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
