import { motion } from 'framer-motion';

interface Props {
  currentIndex: number;
  totalCount: number;
  onDotClick: (index: number) => void;
}

export default function ReviewProgress({ currentIndex, totalCount, onDotClick }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Counter and progress bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#94A3B8]">Review</span>
            <span className="rounded-full border border-aqua/30 bg-aqua/10 px-3 py-1 text-sm font-bold text-aqua">
              {currentIndex + 1} of {totalCount}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex-1 h-1.5 bg-[#11152E]/50 rounded-full overflow-hidden max-w-xs">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-aqua via-cyan-400 to-aqua"
          />
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalCount }).map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onDotClick(index)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`group relative transition-all duration-300 ${
              index === currentIndex ? 'w-8 h-3' : 'w-2.5 h-2.5 hover:w-3.5'
            } rounded-full`}
          >
            <motion.div
              animate={{
                backgroundColor: index === currentIndex 
                  ? '#22D3EE' 
                  : 'rgba(34, 211, 238, 0.3)',
                boxShadow: index === currentIndex
                  ? '0 0 20px rgba(34, 211, 238, 0.6), inset 0 0 10px rgba(34, 211, 238, 0.3)'
                  : 'none',
              }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-full"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
