import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThreeBackground from './components/ThreeBackground';
import Home from './pages/Home';
import AuditForm from './pages/AuditForm';
import Results from './pages/Results';
import PublicAudit from './pages/PublicAudit';
import Demo from './pages/Demo';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    const updateGlow = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
    };

    window.addEventListener('pointermove', updateGlow);
    return () => window.removeEventListener('pointermove', updateGlow);
  }, []);

  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-[#050816] text-white">
      <ThreeBackground mode="fixed" />
      <div className="mouse-glow" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_12%_20%,rgba(34,211,238,0.12),transparent_34rem),radial-gradient(circle_at_86%_18%,rgba(139,92,246,0.13),transparent_36rem),radial-gradient(circle_at_50%_52%,rgba(59,130,246,0.08),transparent_42rem),linear-gradient(180deg,rgba(5,8,22,0.7)_0%,rgba(5,8,22,0)_18%,rgba(5,8,22,0)_76%,rgba(5,8,22,0.72)_100%)]" />
      <div className="aurora-field" aria-hidden="true">
        <span className="aurora-ribbon aurora-ribbon-a" />
        <span className="aurora-ribbon aurora-ribbon-b" />
        <span className="aurora-ribbon aurora-ribbon-c" />
      </div>
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative z-10"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/audit" element={<AuditForm />} />
            <Route path="/results" element={<Results />} />
            <Route path="/audit/:id" element={<PublicAudit />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
