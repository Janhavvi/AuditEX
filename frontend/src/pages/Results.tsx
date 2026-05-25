import { Link } from 'react-router-dom';
import { useState } from 'react';
import ResultsDashboard from '../components/ResultsDashboard';
import LoadingScreen from '../components/LoadingScreen';
import { useAuditStore } from '../store/auditStore';
import { saveAudit } from '../utils/api';
import AnimatedButton from '../components/AnimatedButton';

export default function Results() {
  const { report, setReport } = useAuditStore();
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(false);

  if (!report) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-36 text-center">
        <h1 className="text-4xl font-bold text-white">No audit generated yet</h1>
        <p className="mt-4 text-[#94A3B8]">Start with your AI tools and generate a fresh report.</p>
        <Link to="/audit" className="mt-8 inline-flex">
          <AnimatedButton>Start Audit</AnimatedButton>
        </Link>
      </div>
    );
  }

  const ensureAuditSaved = async () => {
    if (report.auditId) return report.auditId;

    setSaving(true);
    setApiError(false);
    try {
      const saved = await saveAudit(report);
      setReport(saved);
      return saved.auditId;
    } catch {
      setApiError(true);
      throw new Error('Unable to save audit.');
    } finally {
      setSaving(false);
    }
  };

  if (saving) return <LoadingScreen label="Generating share link" />;

  return (
    <>
      <ResultsDashboard report={report} ensureAuditSaved={ensureAuditSaved} />
      {apiError && (
        <p className="mx-auto max-w-7xl px-4 pb-10 text-sm text-[#8B5CF6] sm:px-6 lg:px-8">
          Backend is not reachable. The report still works locally, but the share link cannot be generated yet.
        </p>
      )}
    </>
  );
}
