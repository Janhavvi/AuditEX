import { Link } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import ResultsDashboard from '../components/ResultsDashboard';
import LoadingScreen from '../components/LoadingScreen';
import { useAuditStore } from '../store/auditStore';
import { saveAudit } from '../utils/api';
import AnimatedButton from '../components/AnimatedButton';

export default function Results() {
  const { report, setReport } = useAuditStore();
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(false);
  const saveAttempted = useRef(false);

  const ensureAuditSaved = useCallback(async () => {
    if (!report) return undefined;
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
  }, [report, setReport]);

  useEffect(() => {
    if (!report || report.auditId || saveAttempted.current) return;
    saveAttempted.current = true;
    ensureAuditSaved().catch(() => undefined);
  }, [ensureAuditSaved, report]);

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

  if (saving) return <LoadingScreen label="Generating share link" />;

  return (
    <>
      {apiError && (
        <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 p-4 text-sm leading-6 text-[#E9D5FF]">
            Share link generation needs the AuditEX API. Set `VITE_API_URL` to the deployed backend `/api` URL, then redeploy.
          </div>
        </div>
      )}
      <ResultsDashboard report={report} ensureAuditSaved={ensureAuditSaved} />
    </>
  );
}
