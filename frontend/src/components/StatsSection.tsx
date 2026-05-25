import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 70, damping: 16 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(() => spring.on('change', (latest) => setDisplay(Math.round(latest))), [spring]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {[
          ['Average savings surfaced', 28, '%'],
          ['Supported AI tools', 10, ''],
          ['Audit setup time', 4, ' min'],
          ['Annual spend reviewed', 2, 'M+'],
        ].map(([label, value, suffix], index) => (
          <motion.div
            key={label as string}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
            className="glass-card rounded-2xl p-6 text-center"
          >
            <p className="text-4xl font-bold text-white">
              <Counter value={value as number} suffix={suffix as string} />
            </p>
            <p className="mt-3 text-sm text-[#94A3B8]">{label as string}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
