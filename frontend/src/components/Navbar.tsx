import { Link } from 'react-router-dom';
import LogoMark from './LogoMark';

export default function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center">
        <Link
          to="/"
          aria-label="AuditEX home"
          className="pointer-events-auto inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-[#050816]/58 px-3 py-2 shadow-[0_18px_70px_rgba(2,6,23,0.38),0_0_42px_rgba(34,211,238,0.08)] backdrop-blur-2xl transition hover:border-white/15 hover:bg-[#0A0F23]/70"
        >
          <LogoMark className="h-10 w-10" />
          <span className="pr-2">
            <span className="block text-base font-bold leading-5 text-white sm:text-lg">
              Audit<span className="text-transparent bg-clip-text bg-gradient-to-r from-aqua to-violet">EX</span>
            </span>
            <span className="mt-0.5 block text-[0.7rem] leading-4 text-[#94A3B8] sm:text-xs">AI Spend Intelligence Platform</span>
          </span>
        </Link>
      </nav>
    </header>
  );
}
