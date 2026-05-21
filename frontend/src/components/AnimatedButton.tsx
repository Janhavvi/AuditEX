import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface Props extends HTMLMotionProps<'button'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode;
}

export default function AnimatedButton({ children, variant = 'primary', icon, className = '', ...props }: Props) {
  const variants = {
    primary: 'app-button-primary',
    secondary: 'app-button-secondary hover:bg-[#11152E]/60',
    ghost: 'app-button-secondary text-[#94A3B8] hover:text-white',
  };

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon ?? <ArrowRight className="h-4 w-4" />}
    </motion.button>
  );
}
