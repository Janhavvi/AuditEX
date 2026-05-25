import { BarChart3 } from 'lucide-react';
import { currency } from '../../utils/formatter';

interface Props {
  benchmarkDelta: number;
  peerBenchmark: number;
  referralCode: string;
  spendPerDeveloper: number;
}

export default function BenchmarkPanel({ benchmarkDelta, peerBenchmark, referralCode, spendPerDeveloper }: Props) {
  const delta = currency(Math.abs(benchmarkDelta));
  const direction = benchmarkDelta > 0 ? 'above' : 'below';

  return (
    <div className="grid gap-4 border-b border-white/10 py-8 md:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
          <BarChart3 className="h-4 w-4" />
          Benchmark mode
        </p>
        <h2 className="mt-3 text-2xl font-bold text-white">
          Your AI spend per developer is {currency(spendPerDeveloper)}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
          Companies your size average about {currency(peerBenchmark)} per developer per month in this planning model.
          That puts this stack {delta} per developer {direction} the modeled peer baseline.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#0A0F23]/45 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">Referral code</p>
        <p className="mt-2 text-3xl font-bold text-white">{referralCode || 'Generating share link...'}</p>
        <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
          Shared report links include this code so referrals can be attributed without exposing contact details.
        </p>
      </div>
    </div>
  );
}
