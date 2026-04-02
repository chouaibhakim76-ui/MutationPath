import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MutationPathLogo from './MutationPathLogo';

const WORDS = ['MUTATE', 'EVOLVE', 'ADAPT', 'SURVIVE'];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = 2500;
    const interval = 16;
    const step = 100 / (duration / interval);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setTimeout(() => {
          setVisible(false);
          setTimeout(onComplete, 600);
        }, 300);
      }
      setProgress(Math.min(100, Math.floor(current)));
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % WORDS.length);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
          style={{ background: '#060610' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* DNA helix background */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {Array.from({ length: 12 }).map((_, i) => {
              const dur = 3 + (i * 1.7 % 2);
              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${4 + (i * 3) % 8}px`,
                    height: `${4 + (i * 3) % 8}px`,
                    left: `${30 + Math.sin(i * 0.5) * 20}%`,
                    top: `${10 + i * 7}%`,
                    background: i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#39ff14' : '#ff1744',
                    animationName: 'particle-float',
                    animationDuration: `${dur}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              );
            })}
            {Array.from({ length: 12 }).map((_, i) => {
              const dur = 3 + (i * 1.3 % 2);
              return (
                <div
                  key={`r-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: `${4 + (i * 3) % 8}px`,
                    height: `${4 + (i * 3) % 8}px`,
                    left: `${70 + Math.cos(i * 0.5) * 20}%`,
                    top: `${10 + i * 7}%`,
                    background: i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#39ff14' : '#ff1744',
                    animationName: 'particle-float',
                    animationDuration: `${dur}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.15 + 0.5}s`,
                  }}
                />
              );
            })}
            {/* Connecting lines */}
            <svg className="absolute inset-0 w-full h-full">
              {Array.from({ length: 11 }).map((_, i) => (
                <line
                  key={i}
                  x1={`${30 + Math.sin(i * 0.5) * 20}%`}
                  y1={`${13 + i * 7}%`}
                  x2={`${70 + Math.cos(i * 0.5) * 20}%`}
                  y2={`${13 + i * 7}%`}
                  stroke="rgba(0,240,255,0.1)"
                  strokeWidth="1"
                />
              ))}
            </svg>
          </div>

          {/* Counter */}
          <motion.div
            className="font-display text-8xl font-bold tracking-tighter mb-6"
            style={{
              background: 'linear-gradient(135deg, #00f0ff, #39ff14)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {String(progress).padStart(3, '0')}
          </motion.div>

          {/* Rotating word */}
          <AnimatePresence mode="wait">
            <motion.div
              key={wordIndex}
              className="font-display text-2xl tracking-[0.3em] text-text-secondary mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              {WORDS[wordIndex]}
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-surface-light rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bio-gradient"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Brand */}
          <div className="absolute bottom-8 flex flex-col items-center gap-2">
            <MutationPathLogo size={32} showText={false} />
            <span className="font-display text-sm tracking-[0.2em] text-text-secondary opacity-50">
              MUTATIONPATH
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
