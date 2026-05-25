import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeDollarSign,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  ExternalLink,
  Mail,
  MessageCircle,
  Printer,
  Share2,
  Target,
  Users,
  LockKeyhole,
} from 'lucide-react';
import type { AuditReport, AuditTool, Recommendation } from '../types/audit';
import { currency, percent } from '../utils/formatter';
import { generateSummary, getAuditPdfUrl, getAuditShareUrl } from '../utils/api';
import { referralCodeFromAuditId, withReferralCode } from '../utils/referral';
import AnimatedButton from './AnimatedButton';
import EmailCapture from './EmailCapture';
import RecommendationCarousel from './RecommendationCarousel';
import SavingsChart from './SavingsChart';

interface ToolBreakdownRow {
  tool: AuditTool;
  recommendation?: Recommendation;
  savings: number;
  reason: string;
  recommendedAction: string;
}

const firstSentence = (value: string) => {
  const normalized = value.replace(/\s+/g, ' ').trim();
  const sentence = normalized.match(/^.*?[.!?](?:\s|$)/);
  return sentence ? sentence[0].trim() : normalized;
};

const buildToolBreakdown = (report: AuditReport): ToolBreakdownRow[] =>
  report.tools.map((tool) => {
    const relevantRecommendations = report.recommendations
      .filter((recommendation) => recommendation.tools.includes(tool.toolName))
      .sort((a, b) => {
        const primaryDelta = Number(b.tools[0] === tool.toolName) - Number(a.tools[0] === tool.toolName);
        return primaryDelta || b.estimatedMonthlySavings - a.estimatedMonthlySavings;
      });
    const recommendation = relevantRecommendations[0];
    const savings = recommendation ? Math.max(0, Math.min(recommendation.estimatedMonthlySavings, tool.monthlySpend)) : 0;

    return {
      tool,
      recommendation,
      savings,
      recommendedAction: recommendation?.recommendedAction || 'Keep current setup and monitor usage',
      reason: recommendation
        ? firstSentence(recommendation.reasoning)
        : 'This line item does not show a defensible savings opportunity right now.',
    };
  });

const benchmarkForTeamSize = (teamSize: number) => {
  if (teamSize <= 5) return 65;
  if (teamSize <= 20) return 95;
  return 125;
};

export default function ResultsDashboard({
  report,
  publicView = false,
  ensureAuditSaved,
}: {
  report: AuditReport;
  publicView?: boolean;
  ensureAuditSaved?: () => Promise<string | undefined>;
}) {
  const [summary, setSummary] = useState(report.summary || '');
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
  const efficientAudit = report.totals.estimatedMonthlySavings < 100 || report.recommendations.every((item) => item.estimatedMonthlySavings <= 0);
  const highSavingsAudit = report.totals.estimatedMonthlySavings > 500;
  const toolBreakdown = buildToolBreakdown(report);
  const teamSize = Math.max(...report.tools.map((tool) => tool.teamSize), 1);
  const spendPerDeveloper = report.totals.totalMonthlySpend / teamSize;
  const peerBenchmark = benchmarkForTeamSize(teamSize);
  const benchmarkDelta = spendPerDeveloper - peerBenchmark;
  const referralCode = referralCodeFromAuditId(report.auditId);
  
  const statCards = [
    ['Monthly spend', currency(report.totals.totalMonthlySpend)],
    ['Yearly spend', currency(report.totals.totalYearlySpend)],
    ['Tools reviewed', String(report.tools.length)],
    ['Savings rate', percent(report.totals.savingsPercentage)],
  ];
  
  const publicReportUrl = report.auditId ? withReferralCode(`${window.location.origin}/audit/${report.auditId}`, referralCode) : '';
  const shareUrl = report.auditId ? withReferralCode(getAuditShareUrl(report.auditId), referralCode) : '';
  const shareText = `AuditEX found ${currency(report.totals.estimatedYearlySavings)} in potential yearly AI savings across ${report.tools.length} tools.`;
  const shareSubject = 'AuditEX AI spend report';
  const encodedShareUrl = encodeURIComponent(shareUrl);
  const encodedShareText = encodeURIComponent(shareText);
  const sharePlatforms = shareUrl
    ? [
        {
          label: 'LinkedIn',
          href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareUrl}`,
          icon: <BriefcaseBusiness className="h-4 w-4" />,
        },
        {
          label: 'Facebook',
          href: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}`,
          icon: <Share2 className="h-4 w-4" />,
        },
        {
          label: 'WhatsApp',
          href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
          icon: <MessageCircle className="h-4 w-4" />,
        },
        {
          label: 'Teams',
          href: `https://teams.microsoft.com/share?href=${encodedShareUrl}&msgText=${encodedShareText}`,
          icon: <Users className="h-4 w-4" />,
        },
        {
          label: 'Email',
          href: `mailto:?subject=${encodeURIComponent(shareSubject)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
          icon: <Mail className="h-4 w-4" />,
        },
      ]
    : [];

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
        await navigator.share({
          title: shareSubject,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    await copyShare();
  };

  const pdfUrl = report.auditId ? getAuditPdfUrl(report.auditId) : '';

  const fallbackSummary = `${efficientAudit ? "You're spending well. " : ''}AuditEX reviewed ${report.tools.length} AI tools with ${currency(report.totals.totalMonthlySpend)} in monthly spend and found ${currency(report.totals.estimatedMonthlySavings)} in defensible monthly savings. The strongest signals come from ${report.recommendations.slice(0, 2).map((item) => item.title.toLowerCase()).join(' and ') || 'maintaining the current stack without forced cuts'}.`;

  const headline = efficientAudit
    ? "You're spending well."
    : highSavingsAudit
      ? 'Your AI savings are material'
      : 'Your AI spend report';

  const subcopy = efficientAudit
    ? 'AuditEX did not find a meaningful savings gap. Keep the stack as-is and monitor pricing, credits, and usage changes.'
    : highSavingsAudit
      ? 'This audit found enough monthly savings potential to justify a structured vendor and workflow review.'
      : `${report.recommendations.length} recommendations found across ${report.tools.length} tools.`;

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
          <h1 className="mt-4 text-4xl font-bold text-white sm:text-5xl">{headline}</h1>
          <p className="mt-4 max-w-2xl text-[#94A3B8]">
            {subcopy}
          </p>
        </div>
        {!report.auditId && (
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
              <div className="flex flex-wrap gap-2 lg:max-w-xl lg:justify-end">
                <button type="button" onClick={nativeShare} className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <button type="button" onClick={copyShare} className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
                  {copyState === 'copied' ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copyState === 'copied' ? 'Copied' : 'Copy link'}
                </button>
                {!publicView && (
                  <Link to={`/audit/${report.auditId}`} className="app-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
                    <ExternalLink className="h-4 w-4" />
                    Open public view
                  </Link>
                )}
                {sharePlatforms.map((platform) => (
                  <a
                    key={platform.label}
                    href={platform.href}
                    target={platform.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={platform.href.startsWith('mailto:') ? undefined : 'noreferrer'}
                    className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
                  >
                    {platform.icon}
                    {platform.label}
                  </a>
                ))}
                <a href={pdfUrl} className="app-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold">
                  <Printer className="h-4 w-4" />
                  PDF
                </a>
              </div>
            </div>
            {publicReportUrl && (
              <p className="mt-4 text-xs leading-5 text-[#94A3B8]">
                Public report: {publicReportUrl}. Shared links use a preview endpoint so social cards show the latest tools and savings without exposing contact details.
              </p>
            )}
          </div>
        )}

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
              Companies your size average about {currency(peerBenchmark)} per developer per month in this planning model.{' '}
              {benchmarkDelta > 0
                ? `That puts this stack ${currency(benchmarkDelta)} per developer above the modeled peer baseline.`
                : `That puts this stack ${currency(Math.abs(benchmarkDelta))} per developer below the modeled peer baseline.`}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0A0F23]/45 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">Referral code</p>
            <p className="mt-2 text-3xl font-bold text-white">{referralCode || 'Generated after email capture'}</p>
            <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
              Shared report links include this code so referrals can be attributed without exposing contact details.
            </p>
          </div>
        </div>

        <div className="border-b border-white/10 py-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">Personalized summary</p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#94A3B8]">
            {summary || fallbackSummary}
          </p>
          {efficientAudit && (
            <p className="mt-4 inline-flex items-center gap-2 text-lg font-semibold text-white">
              <CheckCircle2 className="h-5 w-5 text-aqua" />
              You're spending well.
            </p>
          )}
        </div>
      </section>

      <section id="tool-breakdown" className="scroll-mt-28 border-b border-white/10 py-12">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
              <Target className="h-4 w-4" />
              Per-tool breakdown
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">Current spend to recommended action</h2>
          </div>
          {efficientAudit && (
            <span className="inline-flex items-center gap-2 rounded-full border border-aqua/25 bg-aqua/10 px-4 py-2 text-sm font-semibold text-aqua">
              <Bell className="h-4 w-4" />
              Notify-only mode
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0F23]/45">
          <div className="hidden grid-cols-[1.1fr_1.6fr_0.8fr_1.8fr] gap-4 border-b border-white/10 px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8] lg:grid">
            <span>Current spend</span>
            <span>Recommended action</span>
            <span>Savings</span>
            <span>Reason</span>
          </div>
          <div className="divide-y divide-white/10">
            {toolBreakdown.map(({ tool, recommendedAction, savings, reason }) => (
              <div key={tool.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.1fr_1.6fr_0.8fr_1.8fr] lg:items-start">
                <div>
                  <p className="font-semibold text-white">{tool.toolName}</p>
                  <p className="mt-1 text-sm text-[#94A3B8]">{tool.plan} · {currency(tool.monthlySpend)}/mo</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8] lg:hidden">Recommended action</p>
                  <p className="mt-1 text-sm font-semibold text-white lg:mt-0">{recommendedAction}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94A3B8] lg:hidden">Savings</p>
                  <p className={`mt-1 inline-flex items-center gap-2 text-lg font-bold lg:mt-0 ${savings > 0 ? 'text-aqua' : 'text-[#CBD5E1]'}`}>
                    <BadgeDollarSign className="h-4 w-4" />
                    {currency(savings)}/mo
                  </p>
                </div>
                <p className="text-sm leading-6 text-[#CBD5E1]">{reason}</p>
              </div>
            ))}
          </div>
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
              Detailed recommendations are ranked by savings impact and include the assumptions behind each action.
            </p>
          </div>
        </div>

        <RecommendationCarousel 
          recommendations={report.recommendations}
          autoplay={false}
          autoplayDelay={5000}
        />

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
