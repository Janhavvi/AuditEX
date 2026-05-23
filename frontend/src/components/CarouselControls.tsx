import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';

interface Props {
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
  onPrev: () => void;
  autoplay?: boolean;
}

export default function CarouselControls({ 
  currentIndex, 
  totalCount, 
  onNext, 
  onPrev,
  autoplay = false
}: Props) {
  const isLastSlide = currentIndex === totalCount - 1;
  const isFirstSlide = currentIndex === 0;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side - Navigation buttons */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onPrev}
            disabled={isFirstSlide}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#11152E]/35 px-4 py-3 text-sm font-semibold text-[#CBD5E1] transition disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-[#11152E]/60 hover:enabled:text-white hover:enabled:border-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </motion.button>

          <motion.button
            onClick={onNext}
            disabled={isLastSlide}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#11152E]/35 px-4 py-3 text-sm font-semibold text-[#CBD5E1] transition disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-[#11152E]/60 hover:enabled:text-white hover:enabled:border-white/20"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-3 justify-end">
          {isLastSlide ? (
            <Link to="/audit" className="w-full sm:w-auto">
              <div className="w-full sm:w-auto">
                <AnimatedButton>Run New Audit</AnimatedButton>
              </div>
            </Link>
          ) : (
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-aqua/20 to-cyan-400/20 border border-aqua/30 px-4 py-3 text-sm font-semibold text-aqua transition hover:from-aqua/30 hover:to-cyan-400/30 hover:border-aqua/50"
            >
              <span className="hidden sm:inline">Continue</span>
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Keyboard and interaction hints */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs text-[#94A3B8] text-center sm:text-left">
          💡 Use <kbd className="px-2 py-1 rounded bg-[#11152E]/60 border border-white/10 text-white text-xs font-mono">← →</kbd> keyboard arrows or click dots to navigate
        </p>
      </div>
    </div>
  );
}
