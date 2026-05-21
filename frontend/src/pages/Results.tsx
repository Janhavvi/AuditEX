import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ResultsDashboard from '../components/ResultsDashboard';
import LoadingScreen from '../components/LoadingScreen';
import { useAuditStore } from '../store/auditStore';
import { saveAudit } from '../utils/api';
import AnimatedButton from '../components/AnimatedButton';

export default function Results() {
  const navigate = useNavigate();
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

  const persistReport = async () => {
    setSaving(true);
    setApiError(false);
    try {
      const saved = await saveAudit(report);
      setReport(saved);
      navigate(`/audit/${saved.auditId}`);
    } catch {
      setApiError(true);
    } finally {
      setSaving(false);
    }
  };

  if (saving) return <LoadingScreen label="Saving shareable report" />;

  return (
    <>
      {!report.auditId && (
        <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-4 md:flex md:items-center md:justify-between">
            <p className="text-sm text-[#94A3B8]">Save this audit to generate a public shareable report URL.</p>
            <button onClick={persistReport} className="app-button-primary mt-4 rounded-xl px-4 py-2 text-sm font-semibold md:mt-0">
              Generate share link
            </button>
          </div>
          {apiError && <p className="mt-3 text-sm text-[#8B5CF6]">Backend is not reachable. Run the API or keep using the local report.</p>}
        </div>
      )}
      <ResultsDashboard report={report} />
    </>
  );
}
