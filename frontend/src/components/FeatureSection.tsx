import { motion } from 'framer-motion';
import { BrainCircuit, FileChartColumn, Route, ShieldCheck, Sparkles, Users } from 'lucide-react';

const features = [
  ['Subscription intelligence', 'Normalize seats, plans, renewals, and API spend across every major AI vendor.', BrainCircuit],
  ['Savings recommendations', 'Detect duplicated tools, premature enterprise plans, seat waste, and model routing opportunities.', Sparkles],
  ['Shareable reports', 'Generate polished audit summaries with charts, severity, and consultation-ready next steps.', FileChartColumn],
  ['Team fit analysis', 'Compare seats against team size and map tools to real use cases by role.', Users],
  ['Workflow consolidation', 'Identify where ChatGPT, Claude, Gemini, Cursor, Copilot, Windsurf, and v0 overlap.', Route],
  ['Executive-ready controls', 'Built for the path from quick audit to spend governance and vendor negotiation.', ShieldCheck],
];

export default function FeatureSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">Platform</p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-5xl">A spend command center for modern AI teams</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, body, Icon], index) => (
            <motion.div
              key={title as string}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-2xl p-6"
            >
              <Icon className="h-6 w-6 text-aqua" />
              <h3 className="mt-5 text-lg font-semibold text-white">{title as string}</h3>
              <p className="mt-3 text-sm leading-6 text-[#94A3B8]">{body as string}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
