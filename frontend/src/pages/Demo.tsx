import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import { useAuditStore } from '../store/auditStore';

export default function Demo() {
  const navigate = useNavigate();
  const loadDemo = useAuditStore((state) => state.loadDemo);

  useEffect(() => {
    loadDemo();
    const timer = window.setTimeout(() => navigate('/results'), 450);
    return () => window.clearTimeout(timer);
  }, [loadDemo, navigate]);

  return <LoadingScreen label="Preparing demo audit" />;
}
