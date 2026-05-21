import { Link, useLocation } from 'react-router-dom';
import LogoMark from './LogoMark';

const navLinks = [
  { label: 'Home', href: '/', step: 0 },
  { label: 'Audit', href: '/audit', step: 1 },
  { label: 'Results', href: '/results', step: 2 },
];

export default function Navbar() {
  const location = useLocation();
  const currentStep = location.pathname.startsWith('/results')
    ? 2
    : location.pathname.startsWith('/audit') && !location.pathname.match(/^\/audit\/[^/]+/)
      ? 1
      : 0;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3">
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

        <div className="pointer-events-auto flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-[#050816]/58 p-1 shadow-[0_18px_70px_rgba(2,6,23,0.34),0_0_34px_rgba(34,211,238,0.06)] backdrop-blur-2xl">
            {navLinks.map((link) => {
              const isActive = currentStep === link.step;
              const isAllowed = link.step === 0 || link.step === currentStep - 1 || isActive;
              const className = `rounded-xl px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                isActive
                  ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                  : isAllowed
                    ? 'text-[#94A3B8] hover:bg-white/[0.06] hover:text-white'
                    : 'cursor-not-allowed text-[#64748B]/55'
              }`;

              if (!isAllowed) {
                return (
                  <span
                    key={link.href}
                    className={className}
                    aria-disabled="true"
                    title="Navigation is sequential: use Home or the previous step."
                  >
                    {link.label}
                  </span>
                );
              }

              return (
                <Link key={link.href} to={link.href} className={className} title={link.step === 0 ? 'Go home' : 'Go to the previous step'}>
                  {link.label}
                </Link>
              );
            })}
          </div>
          <span className="hidden rounded-full bg-[#050816]/45 px-3 py-1 text-[0.68rem] font-medium text-[#94A3B8] backdrop-blur-xl sm:block">
            Jump only to Home or the previous step
          </span>
        </div>
      </nav>
    </header>
  );
}
