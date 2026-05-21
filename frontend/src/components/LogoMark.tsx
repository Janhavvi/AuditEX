interface LogoMarkProps {
  className?: string;
}

export default function LogoMark({ className = '' }: LogoMarkProps) {
  return (
    <span
      className={`relative grid place-items-center overflow-hidden rounded-2xl border border-white/10 bg-[#11152E]/45 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl ${className}`}
      aria-hidden="true"
    >
      <span className="absolute inset-0 bg-[radial-gradient(circle_at_26%_24%,rgba(34,211,238,0.68),transparent_32%),radial-gradient(circle_at_76%_78%,rgba(139,92,246,0.72),transparent_40%),linear-gradient(145deg,rgba(15,23,42,0.82),rgba(2,6,23,0.96))]" />
      <span className="absolute inset-[1px] rounded-[0.9rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.11),transparent_28%,rgba(255,255,255,0.03)_70%,transparent)]" />
      <span className="absolute inset-[5px] rounded-xl border border-white/10" />
      <svg className="relative h-7 w-7 translate-y-px drop-shadow-[0_0_12px_rgba(34,211,238,0.55)]" viewBox="0 0 48 48" fill="none">
        <defs>
          <linearGradient id="auditex-logo-stroke" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22D3EE" />
            <stop offset="0.48" stopColor="#22d3ee" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <path
          d="M12.5 31.8c5.4-9.2 14.2-15.7 22.8-16.4"
          stroke="url(#auditex-logo-stroke)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M12.2 24.3c6.8 1.7 12.9 5.5 17.6 10.9"
          stroke="url(#auditex-logo-stroke)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M23.8 10.8v21.4c0 3.1-2.5 5.6-5.6 5.6h-3.1"
          stroke="url(#auditex-logo-stroke)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M33.4 9.4v8.2M29.3 13.5h8.2"
          stroke="#FFFFFF"
          strokeWidth="2.25"
          strokeLinecap="round"
        />
        <circle cx="12.5" cy="31.8" r="3.1" fill="#22d3ee" />
        <circle cx="23.8" cy="10.8" r="2.35" fill="#8B5CF6" />
      </svg>
    </span>
  );
}
