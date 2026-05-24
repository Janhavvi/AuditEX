import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import ResultsDashboard from '../components/ResultsDashboard';
import AnimatedButton from '../components/AnimatedButton';
import type { AuditReport } from '../types/audit';
import { fetchAudit, getAuditShareUrl } from '../utils/api';
import { currency } from '../utils/formatter';

export default function PublicAudit() {
  const { id } = useParams();
  const [report, setReport] = useState<AuditReport | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchAudit(id)
      .then((data) => {
        setReport(data);
        document.title = `AuditEX Report ${data.auditId}`;
        const title = document.querySelector('meta[property="og:title"]');
        const description = document.querySelector('meta[property="og:description"]');
        const url = document.querySelector('meta[property="og:url"]');
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        title?.setAttribute('content', `AuditEX report: ${currency(data.totals.estimatedYearlySavings)} yearly savings`);
        description?.setAttribute('content', `${data.recommendations.length} AI spend recommendations across ${data.tools.length} tools.`);
        if (data.auditId) url?.setAttribute('content', getAuditShareUrl(data.auditId));
        twitterTitle?.setAttribute('content', `AuditEX report: ${currency(data.totals.estimatedYearlySavings)} yearly savings`);
        twitterDescription?.setAttribute('content', `${data.recommendations.length} AI spend recommendations across ${data.tools.length} tools.`);
      })
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-36 text-center">
        <h1 className="text-4xl font-bold text-white">Audit report not found</h1>
        <p className="mt-4 text-[#94A3B8]">The report may be private, expired, or the backend is offline.</p>
        <Link to="/audit" className="mt-8 inline-flex">
          <AnimatedButton>Run a new audit</AnimatedButton>
        </Link>
      </div>
    );
  }

  if (!report) return <LoadingScreen label="Loading public audit report" />;
  return <ResultsDashboard report={report} publicView />;
}
