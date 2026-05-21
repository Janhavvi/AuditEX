import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-wave relative overflow-hidden bg-transparent px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-5 text-sm text-[#94A3B8] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-white">AuditEX</p>
          <p className="mt-1">AI Spend Intelligence Platform for startups and modern teams.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/audit" className="hover:text-white">Start audit</Link>
          <a href="mailto:hello@auditex.ai" className="hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
}
