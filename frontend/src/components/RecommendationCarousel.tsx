import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Recommendation } from '../types/audit';
import RecommendationCard from './RecommendationCard';
import ReviewProgress from './ReviewProgress';
import CarouselControls from './CarouselControls';

interface Props {
  recommendations: Recommendation[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

export default function RecommendationCarousel({ 
  recommendations, 
  autoplay = false, 
  autoplayDelay = 5000 
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const totalCount = recommendations.length;

  useEffect(() => {
    if (!autoplay || totalCount === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalCount);
    }, autoplayDelay);

    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, totalCount]);

  const goToNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % totalCount);
  };

  const goToPrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + totalCount) % totalCount);
  };

  const goToSlide = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalCount]);

  if (totalCount === 0) {
    return (
      <div className="glass-card rounded-3xl p-12 text-center">
        <h3 className="text-2xl font-bold text-white">No recommendations</h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#94A3B8]">
          This stack is already optimized. Keep monitoring usage before renewal.
        </p>
      </div>
    );
  }

  const currentRecommendation = recommendations[activeIndex];
  const nextRecommendation = recommendations[(activeIndex + 1) % totalCount];

  return (
    <div className="space-y-8">
      {/* Carousel Container with 3D perspective */}
      <div className="relative perspective" style={{ perspective: '1200px' }}>
        {/* Background stacked cards effect */}
        <div className="absolute inset-0 pointer-events-none hidden sm:block">
          {/* Second card (subtle) */}
          {totalCount > 1 && (
            <motion.div
              initial={false}
              animate={{ 
                y: 12,
                x: 6,
                scale: 0.97,
                opacity: 0.4,
                rotateZ: -1
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 glass-card rounded-2xl bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm"
            />
          )}
          {/* Third card (very subtle) */}
          {totalCount > 2 && (
            <motion.div
              initial={false}
              animate={{ 
                y: 24,
                x: 12,
                scale: 0.94,
                opacity: 0.2,
                rotateZ: -2
              }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
              className="absolute inset-0 glass-card rounded-2xl bg-gradient-to-br from-white/2 to-transparent"
            />
          )}
        </div>

        {/* Main card carousel with 3D rotation */}
        <div className="relative h-auto sm:min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRecommendation.id}
              initial={{ 
                opacity: 0, 
                x: direction > 0 ? 100 : -100,
                rotateY: direction > 0 ? 45 : -45,
                scale: 0.85,
                z: -100,
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                rotateY: 0,
                scale: 1,
                z: 0,
              }}
              exit={{ 
                opacity: 0, 
                x: direction > 0 ? -100 : 100,
                rotateY: direction > 0 ? -45 : 45,
                scale: 0.85,
                z: -100,
              }}
              transition={{ 
                duration: 0.6, 
                ease: 'easeInOut',
                type: 'tween',
              }}
              style={{
                perspective: '1000px',
              }}
              className="relative will-change-transform"
            >
              {/* Animated glow background */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1,
                  scale: 1,
                  boxShadow: [
                    '0 0 30px rgba(34, 211, 238, 0.15)',
                    '0 0 60px rgba(34, 211, 238, 0.25)',
                    '0 0 30px rgba(34, 211, 238, 0.15)',
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute -inset-4 rounded-2xl -z-10 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-cyan-500/10 blur-2xl sm:blur-3xl"
              />

              {/* Glow border effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-aqua/20 via-cyan-400/10 to-aqua/20 -z-5 blur-lg sm:blur-xl opacity-50"
              />

              {/* Card content with hover effect */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative h-full"
              >
                <RecommendationCard recommendation={currentRecommendation} index={0} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress and Controls Section */}
      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Progress indicator */}
        <ReviewProgress 
          currentIndex={activeIndex}
          totalCount={totalCount}
          onDotClick={goToSlide}
        />

        {/* Navigation controls */}
        <CarouselControls
          currentIndex={activeIndex}
          totalCount={totalCount}
          onNext={goToNext}
          onPrev={goToPrev}
          autoplay={autoplay}
        />
      </div>
    </div>
  );
}
