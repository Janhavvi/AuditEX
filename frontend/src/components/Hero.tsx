import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Users, WalletCards } from 'lucide-react';
import AnimatedButton from './AnimatedButton';
import FloatingCards from './FloatingCards';

export default function Hero() {
  const stats = [
    ['$2.4M+', 'Total spend analyzed', WalletCards],
    ['32%', 'Average savings', Sparkles],
    ['12,500+', 'AI stacks audited', Users],
    ['98%', 'Customer satisfaction', ShieldCheck],
  ];

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden px-4 pb-8 pt-24 sm:px-6 sm:pt-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid min-h-[calc(100svh-7rem)] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55 }}
            className="relative z-10 max-w-2xl pt-2"
          >
            <p className="mb-5 inline-flex rounded-full border border-white/10 bg-[#11152E]/45 px-4 py-2 text-sm font-semibold text-aqua shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Spend Intelligence Platform
            </p>
            <h1 className="text-balance text-5xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-[4.75rem]">
              Find Hidden Savings Across Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-aqua via-electric to-violet">AI Stack</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-[#94A3B8] sm:text-lg">
              AuditEX maps every AI subscription, API workload, and team seat into a board-ready savings report with clear recommendations.
            </p>

            <div className="mt-6 flex flex-wrap gap-5 text-sm text-[#94A3B8]">
              {['100% Free Audit', 'No Credit Card', 'Instant Results'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#8B5CF6]" />
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/audit">
                <AnimatedButton icon={<ArrowRight className="h-4 w-4" />} className="w-full sm:w-auto">
                  Start Audit
                </AnimatedButton>
              </Link>
            </div>

            <div className="glass-card mt-9 grid max-w-xl grid-cols-2 gap-0 overflow-hidden rounded-2xl sm:grid-cols-4">
              {stats.map(([value, label, Icon]) => (
                <div key={label as string} className="border-white/10 p-3 text-center sm:border-r last:border-r-0">
                  <Icon className="mx-auto mb-2 h-5 w-5 text-aqua" />
                  <p className="text-lg font-bold text-white">{value as string}</p>
                  <p className="mt-1 text-xs leading-5 text-[#94A3B8]">{label as string}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 28, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative min-h-[430px] lg:min-h-[570px]"
          >
            <div className="pointer-events-none absolute -right-10 top-0 hidden h-52 w-52 rounded-full bg-[#8B5CF6]/10 blur-3xl lg:block" />
            <FloatingCards />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
