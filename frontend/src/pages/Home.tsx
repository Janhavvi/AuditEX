import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import FeatureSection from '../components/FeatureSection';
import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import AnimatedButton from '../components/AnimatedButton';

const steps = ['Connect the spend picture', 'Run intelligent audit rules', 'Share a board-ready report'];
const faqs = [
  ['Does AuditEX need billing access?', 'No. This demo uses form-based input so teams can audit spend without connecting finance systems.'],
  ['Can it compare API and subscription spend?', 'Yes. The audit engine separates assistants, coding tools, builders, and API workloads.'],
  ['Is the public report shareable?', 'Yes. Saved audits receive a unique ID and can be opened from /audit/:id.'],
];

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureSection />
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">How it works</p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">From subscription sprawl to CFO-ready clarity</h2>
            <p className="mt-5 text-[#94A3B8]">
              AuditEX turns messy AI tooling into a prioritized savings roadmap in minutes.
            </p>
          </div>
          <div className="grid gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="glass-card flex gap-4 rounded-2xl p-5"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-aqua/10 font-bold text-aqua">{index + 1}</span>
                <div>
                  <h3 className="font-semibold text-white">{step}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
                    {index === 0 && 'Enter AI subscriptions, API spend, seats, team size, and primary workflows.'}
                    {index === 1 && 'AuditEX checks seat waste, plan fit, API efficiency, and consolidation opportunities.'}
                    {index === 2 && 'Export a shareable report with savings estimates, severity, and next steps.'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <StatsSection />
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            {['Cut duplicate seats before renewal', 'Route APIs by workload cost', 'Standardize AI tooling by role'].map((quote) => (
              <div key={quote} className="glass-card rounded-2xl p-6">
                <CheckCircle2 className="h-6 w-6 text-[#22D3EE]" />
                <p className="mt-5 text-lg font-semibold text-white">{quote}</p>
                <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
                  Used by ops, finance, and engineering leaders who need rapid spend visibility.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-aqua">FAQ</p>
          <div className="mt-8 grid gap-4">
            {faqs.map(([question, answer]) => (
              <div key={question} className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold text-white">{question}</h3>
                <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="glass-card mx-auto max-w-5xl rounded-3xl bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.08),transparent_18rem),radial-gradient(circle_at_85%_40%,rgba(139,92,246,0.08),transparent_16rem),rgba(17,21,46,0.45)] p-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-5xl">Reveal your AI savings in minutes</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#94A3B8]">
            Build a clean spend baseline before the next renewal cycle.
          </p>
          <Link to="/audit" className="mt-8 inline-flex">
            <AnimatedButton>Start Audit</AnimatedButton>
          </Link>
        </div>
      </section>
    </>
  );
}
