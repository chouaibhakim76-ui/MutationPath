import { SimulationStats } from '../types';
import { traitColor, traitLabel } from '../lib/genomeUtils';
import { motion } from 'framer-motion';

interface Props {
  stats: SimulationStats;
  isRunning: boolean;
  maxGenerations: number;
}

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="font-mono"
    >
      {decimals > 0 ? value.toFixed(decimals) : value}
    </motion.span>
  );
}

export default function StatsPanel({ stats, isRunning, maxGenerations }: Props) {
  const items = [
    {
      label: 'Generation',
      value: `${stats.currentGeneration}/${maxGenerations}`,
      color: '#00f0ff',
    },
    {
      label: 'Active Strains',
      value: stats.activeStrains,
      color: '#39ff14',
    },
    {
      label: 'Extinct Strains',
      value: stats.extinctStrains,
      color: '#ff1744',
    },
    {
      label: 'Total Mutations',
      value: stats.totalMutations,
      color: '#a855f7',
    },
    {
      label: 'Dominant Trait',
      value: stats.dominantTrait === '—' ? '—' : traitLabel(stats.dominantTrait),
      color: stats.dominantTrait === '—' ? '#8888a0' : traitColor(stats.dominantTrait),
    },
    {
      label: 'Extinction Rate',
      value: `${stats.extinctionRate.toFixed(1)}%`,
      color: stats.extinctionRate > 70 ? '#ff1744' : stats.extinctionRate > 40 ? '#f59e0b' : '#39ff14',
    },
  ];

  return (
    <div
      className="rounded-2xl p-4 glass-deep gloss-overlay"
      style={{
        background: 'linear-gradient(145deg, rgba(0,240,255,0.04) 0%, rgba(8,8,22,0.8) 40%, rgba(57,255,20,0.03) 100%)',
        border: '1px solid rgba(0,240,255,0.1)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 60px rgba(0,240,255,0.04), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
    >
      {/* Status header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className={`w-2 h-2 rounded-full ${
                isRunning ? 'bg-lime' : 'bg-extinct'
              }`}
            />
            {isRunning && (
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-lime animate-ping opacity-40" />
            )}
          </div>
          <span className="font-display text-xs tracking-widest text-text-secondary">
            {isRunning ? 'SIMULATING' : 'IDLE'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-text-secondary/40">
          GEN {stats.currentGeneration}/{maxGenerations}
        </span>
      </div>

      {/* Progress bar */}
      <div className="neon-progress-track mb-4">
        <div
          className="neon-progress-fill"
          style={{ width: `${(stats.currentGeneration / maxGenerations) * 100}%` }}
        />
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.label} className="stat-item-glow flex items-center justify-between">
            <span className="text-[11px] text-text-secondary/70 tracking-wide">{item.label}</span>
            <span
              className="font-mono text-sm font-semibold"
              style={{ color: item.color, textShadow: `0 0 12px ${item.color}60` }}
            >
              {typeof item.value === 'number' ? (
                <AnimatedNumber value={item.value} />
              ) : (
                item.value
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Most fit strain */}
      {stats.mostFitStrain && (
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="text-[10px] tracking-widest text-text-secondary mb-2">
            DOMINANT STRAIN
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-cyan">
              {stats.mostFitStrain.id}
            </span>
            <span
              className="font-mono text-xs font-semibold"
              style={{ color: '#39ff14' }}
            >
              {(stats.mostFitStrain.fitness.overall * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
