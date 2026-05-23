import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, CheckCircle2, ClipboardCheck, Copy, ExternalLink, LockKeyhole, Printer, Share2 } from 'lucide-react';
import type { AuditReport } from '../types/audit';
import { currency, percent } from '../utils/formatter';
import { generateSummary, getAuditPdfUrl } from '../utils/api';
import AnimatedButton from './AnimatedButton';
import ConsultationCTA from './ConsultationCTA';
import EmailCapture from './EmailCapture';
import RecommendationCarousel from './RecommendationCarousel';
import SavingsChart from './SavingsChart';

export default function ResultsDashboard({ report, publicView = false }: { report: AuditReport; publicView?: boolean }) {
  const [summary, setSummary] = useState(report.summary || '');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  
  const statCards = [
    ['Monthly spend', currency(report.totals.totalMonthlySpend)],
    ['Yearly spend', currency(report.totals.totalYearlySpend)],
    ['Monthly savings', currency(report.totals.estimatedMonthlySavings)],
    ['Savings rate', percent(report.totals.savingsPercentage)],
  ];
  
  const reviewCount = report.recommendations.length;
  const shareUrl = report.auditId ? `${window.location.origin}/audit/${report.auditId}` : '';
  const shareText = `AuditEX found ${currency(report.totals.estimatedYearlySavings)} in potential yearly AI savings across ${report.tools.length} tools.`;
  const twitterShareUrl = shareUrl
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    : '';
  const linkedinShareUrl = shareUrl
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    : '';

  const copyShare = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopyState('copied');
    window.setTimeout(() => setCopyState('idle'), 1800);
  };

  const pdfUrl = report.auditId ? getAuditPdfUrl(report.auditId) : '';

  const fallbackSummary = `${report.totals.estimatedMonthlySavings < 100 ? "You're already spending efficiently. " : ''}AuditEX reviewed ${report.tools.length} AI tools with ${currency(report.totals.totalMonthlySpend)} in monthly spend and found ${currency(report.totals.estimatedMonthlySavings)} in defensible monthly savings. The strongest signals come from ${report.recommendations.slice(0, 2).map((item) => item.title.toLowerCase()).join(' and ') || 'maintaining the current stack without forced cuts'}.`;

  useEffect(() => {
    let active = true;
    if (summary) return;
    generateSummary(report)
      .then((value) => {
        if (active) setSummary(value || fallbackSummary);
      })
      .catch(() => {
        if (active) setSummary(fallbackSummary);
      });
    return () => {
      active = false;
    };
  }, [fallbackSummary, report, summary]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">Audit results</p>
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">Your AI spend report</h1>
          <p className="mt-4 max-w-2xl text-[#94A3B8]">
            {report.recommendations.length} recommendations found across {report.tools.length} tools.
          </p>
        </div>
      </div>

      <section id="snapshot" className="scroll-mt-28">
        {report.auditId && (
          <div className="mb-8 border-b border-white/10 pb-6">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
                  <LockKeyhole className="h-4 w-4" />
                  Shareable result URL
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  {publicView ? 'Public audit snapshot' : 'Your private report now has a public link'}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#94A3B8]">
                  This public version shows tools, totals, savings, and recommendations only. Contact details from lead capture are stored separately and never embedded in the share URL.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={copyShare} className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
                  {copyState === 'copied' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copyState === 'copied' ? 'Copied' : 'Copy link'}
                </button>
                {!publicView && (
                  <Link to={`/audit/${report.auditId}`} className="app-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
                    <ExternalLink className="h-4 w-4" />
                    Open public view
                  </Link>
                )}
                <a href={twitterShareUrl} target="_blank" rel="noreferrer" className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
                  <Share2 className="h-4 w-4" />
                  Share
                </a>
                <a href={linkedinShareUrl} target="_blank" rel="noreferrer" className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
                  LinkedIn
                </a>
                <a href={pdfUrl} className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
                  <Printer className="h-4 w-4" />
                  PDF
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 border-y border-white/10 py-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">Total monthly savings</p>
            <p className="mt-3 text-5xl font-bold text-white">{currency(report.totals.estimatedMonthlySavings)}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">Total annual savings</p>
            <p className="mt-3 text-5xl font-bold text-white">{currency(report.totals.estimatedYearlySavings)}</p>
          </div>
        </div>

        <div className="grid gap-4 border-b border-white/10 py-6 md:grid-cols-4">
          {statCards.map(([label, value], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="border-l border-white/10 px-5 py-3"
            >
              <p className="text-sm text-[#94A3B8]">{label}</p>
              <p className="mt-3 text-3xl font-bold text-white">{value}</p>
            </motion.div>
          ))}
        </div>

        <div className="border-b border-white/10 py-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">Personalized summary</p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#94A3B8]">
            {summary || fallbackSummary}
          </p>
          {report.totals.estimatedMonthlySavings < 100 && (
            <p className="mt-4 text-lg font-semibold text-white">You're already spending efficiently.</p>
          )}
        </div>
      </section>

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
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
              <ClipboardCheck className="h-4 w-4" />
              Recommendations
            </p>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white">Review & optimize</h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#94A3B8]">
              Explore each recommendation in detail. Use arrow keys or pagination dots to navigate through the insights.
            </p>
          </div>
        </div>

        {report.totals.estimatedMonthlySavings > 500 && (
          <div className="mb-8">
            <ConsultationCTA />
          </div>
        )}

        <RecommendationCarousel 
          recommendations={report.recommendations}
          autoplay={false}
          autoplayDelay={5000}
        />

        <div className="mt-12">
          {publicView ? (
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
            <EmailCapture auditId={report.auditId} efficient={report.totals.estimatedMonthlySavings < 100} />
          )}
        </div>
      </section>
    </div>
  );
}
