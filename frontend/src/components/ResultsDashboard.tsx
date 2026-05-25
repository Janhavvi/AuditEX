import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, ClipboardCheck } from 'lucide-react';
import type { AuditReport } from '../types/audit';
import { generateSummary, getAuditPdfUrl, getAuditShareUrl } from '../utils/api';
import { currency, percent } from '../utils/formatter';
import {
  fallbackSummaryFor,
  isEfficientAudit,
  peerSpendBenchmark,
  reportHeadline,
  reportSubcopy,
  toolBreakdownFor,
} from '../utils/reportPresentation';
import { referralCodeFromAuditId, withReferralCode } from '../utils/referral';
import AnimatedButton from './AnimatedButton';
import EmailCapture from './EmailCapture';
import RecommendationCarousel from './RecommendationCarousel';
import SavingsChart from './SavingsChart';
import BenchmarkPanel from './results/BenchmarkPanel';
import ResultsHeader from './results/ResultsHeader';
import SharePanel from './results/SharePanel';
import ToolBreakdownTable from './results/ToolBreakdownTable';

interface Props {
  report: AuditReport;
  publicView?: boolean;
  ensureAuditSaved?: () => Promise<string | undefined>;
}

export default function ResultsDashboard({ report, publicView = false, ensureAuditSaved }: Props) {
  const [summary, setSummary] = useState(report.summary || '');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');

  const efficientAudit = isEfficientAudit(report);
  const fallbackSummary = useMemo(() => fallbackSummaryFor(report), [report]);
  const referralCode = referralCodeFromAuditId(report.auditId);
  const shareUrl = report.auditId ? withReferralCode(getAuditShareUrl(report.auditId), referralCode) : '';
  const publicReportUrl = report.auditId ? withReferralCode(`${window.location.origin}/audit/${report.auditId}`, referralCode) : '';
  const shareText = `AuditEX found ${currency(report.totals.estimatedYearlySavings)} in potential yearly AI savings across ${report.tools.length} tools.`;
  const shareSubject = 'AuditEX AI spend report';
  const pdfUrl = report.auditId ? getAuditPdfUrl(report.auditId) : '';

  const teamSize = Math.max(...report.tools.map((tool) => tool.teamSize), 1);
  const spendPerDeveloper = report.totals.totalMonthlySpend / teamSize;
  const peerBenchmark = peerSpendBenchmark(teamSize);
  const statCards = [
    ['Monthly spend', currency(report.totals.totalMonthlySpend)],
    ['Yearly spend', currency(report.totals.totalYearlySpend)],
    ['Tools reviewed', String(report.tools.length)],
    ['Savings rate', percent(report.totals.savingsPercentage)],
  ];

  useEffect(() => {
    let mounted = true;
    if (summary) return;

    generateSummary(report)
      .then((value) => {
        if (mounted) setSummary(value || fallbackSummary);
      })
      .catch(() => {
        if (mounted) setSummary(fallbackSummary);
      });

    return () => {
      mounted = false;
    };
  }, [fallbackSummary, report, summary]);

  const copyShare = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopyState('copied');
    window.setTimeout(() => setCopyState('idle'), 1800);
  };

  const nativeShare = async () => {
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareSubject, text: shareText, url: shareUrl });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    await copyShare();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
      <ResultsHeader
        headline={reportHeadline(report)}
        subcopy={reportSubcopy(report)}
        showConsultationLink={!report.auditId}
      />

      <section id="snapshot" className="scroll-mt-28">
        <SharePanel
          copyState={copyState}
          pdfUrl={pdfUrl}
          publicReportUrl={publicReportUrl}
          publicView={publicView}
          shareSubject={shareSubject}
          shareText={shareText}
          shareUrl={shareUrl}
          onCopy={copyShare}
          onNativeShare={nativeShare}
        />

        <div className="grid gap-6 border-y border-white/10 py-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">Total monthly savings</p>
            <p className="mt-3 text-6xl font-bold text-white sm:text-7xl">{currency(report.totals.estimatedMonthlySavings)}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">Total annual savings</p>
            <p className="mt-3 text-6xl font-bold text-white sm:text-7xl">{currency(report.totals.estimatedYearlySavings)}</p>
          </div>
        </div>

        <div className="grid gap-4 border-b border-white/10 py-6 md:grid-cols-4">
          {statCards.map(([label, value], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.045 }}
              className="border-l border-white/10 px-5 py-3"
            >
              <p className="text-sm text-[#94A3B8]">{label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{value}</p>
            </motion.div>
          ))}
        </div>

        <BenchmarkPanel
          benchmarkDelta={spendPerDeveloper - peerBenchmark}
          peerBenchmark={peerBenchmark}
          referralCode={referralCode}
          spendPerDeveloper={spendPerDeveloper}
        />

        <div className="border-b border-white/10 py-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">Personalized summary</p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#94A3B8]">{summary || fallbackSummary}</p>
          {efficientAudit && (
            <p className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-white">
              <CheckCircle2 className="h-5 w-5 text-aqua" />
              You're spending well.
            </p>
          )}
        </div>
      </section>

      <ToolBreakdownTable efficientAudit={efficientAudit} rows={toolBreakdownFor(report)} />

      <section id="spend-view" className="perspective-stage scroll-mt-28 py-12">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
              <BarChart3 className="h-4 w-4" />
              3D spend view
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">Inspect the spend shape</h2>
          </div>
          <span className="rounded-full border border-white/10 bg-[#0A0F23]/45 px-4 py-2 text-sm font-semibold text-[#CBD5E1]">
            {report.tools.length} tools analyzed
          </span>
        </div>
        <motion.div
          initial={{ rotateX: 5, rotateY: -8, y: 12 }}
          whileInView={{ rotateX: 0, rotateY: 0, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="[transform-style:preserve-3d]"
        >
          <SavingsChart report={report} />
        </motion.div>
      </section>

      <section id="review" className="scroll-mt-28 border-t border-white/10 pt-16">
        <div className="mb-12">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
            <ClipboardCheck className="h-4 w-4" />
            Recommendations
          </p>
          <h2 className="mt-4 text-4xl font-bold text-white md:text-5xl">Review & optimize</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#94A3B8]">
            Detailed recommendations are ranked by savings impact and include the assumptions behind each action.
          </p>
        </div>

        <RecommendationCarousel recommendations={report.recommendations} autoplay={false} autoplayDelay={5000} />

        <div className="mt-12">
          {publicView && !efficientAudit ? (
            <div className="glass-card rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white">Benchmark your own AI spend</h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#94A3B8]">
                Generate a separate audit with your own tools, seats, spend, and use cases.
              </p>
              <Link to="/audit" className="mt-6 inline-flex">
                <AnimatedButton>Run a new audit</AnimatedButton>
              </Link>
            </div>
          ) : (
            <EmailCapture
              auditId={report.auditId}
              efficient={efficientAudit}
              estimatedMonthlySavings={report.totals.estimatedMonthlySavings}
              ensureAuditSaved={ensureAuditSaved}
            />
          )}
        </div>
      </section>
    </div>
  );
}
