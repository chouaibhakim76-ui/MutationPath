import { motion } from 'framer-motion';

interface Props {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function MutationPathLogo({ size = 32, showText = true, className }: Props) {
  const scale = size / 32;

  return (
    <div className={`flex items-center gap-2.5 ${className || ''}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer rotating ring */}
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <circle
            cx="16"
            cy="16"
            r="14.5"
            stroke="url(#logo-ring-grad)"
            strokeWidth="1.2"
            strokeDasharray="3 5"
            opacity="0.75"
          />
          <defs>
            <linearGradient id="logo-ring-grad" x1="0" y1="0" x2="32" y2="32">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="50%" stopColor="#39ff14" />
              <stop offset="100%" stopColor="#ff1744" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Middle counter-rotating ring */}
        <motion.svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <circle
            cx="16"
            cy="16"
            r="11.5"
            stroke="#00f0ff"
            strokeWidth="0.8"
            strokeDasharray="1.5 6"
            opacity="0.55"
          />
        </motion.svg>

        {/* DNA helix paths */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          className="absolute inset-0"
        >
          <defs>
            <filter id="logo-strand-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Left strand */}
          <motion.path
            d="M12 6 Q8 11 12 16 Q16 21 12 26"
            stroke="#00f0ff"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            filter="url(#logo-strand-glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          {/* Right strand */}
          <motion.path
            d="M20 6 Q24 11 20 16 Q16 21 20 26"
            stroke="#39ff14"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
            filter="url(#logo-strand-glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
          />
          {/* Cross-links (base pairs) */}
          {[9, 12.5, 16, 19.5, 23].map((y, i) => {
            const shift = Math.sin((y - 6) * 0.314) * 4;
            return (
              <motion.line
                key={i}
                x1={16 - 4 + shift}
                y1={y}
                x2={16 + 4 - shift}
                y2={y}
                stroke={i % 2 === 0 ? '#00f0ff' : '#39ff14'}
                strokeWidth="0.8"
                opacity="0.4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 1 + i * 0.15 }}
              />
            );
          })}
          {/* Mutation spark */}
          <motion.circle
            cx="16"
            cy="16"
            r="2"
            fill="#ff1744"
            filter="url(#logo-strand-glow)"
            animate={{
              opacity: [0, 1, 0.6, 1, 0],
              scale: [0.5, 1.3, 0.9, 1.1, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>

        {/* Center glow — pulsing aura */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,240,255,0.18) 0%, rgba(57,255,20,0.06) 50%, transparent 70%)',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className="font-display font-bold tracking-wider text-white leading-none"
            style={{ fontSize: `${Math.max(13, size * 0.45)}px` }}
          >
            Mutation<span className="bio-gradient-text">Path</span>
          </span>
        </div>
      )}
    </div>
  );
}
