import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimulationConfig, VirusType } from '../types';
import { VIRUS_PRESETS } from '../lib/virusPresets';
import VirusCard from './VirusCard';

interface Props {
  config: SimulationConfig;
  onConfigChange: (config: SimulationConfig) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onExport: () => void;
  isRunning: boolean;
  isPaused: boolean;
}

const VIRUS_TYPES: VirusType[] = [
  'covid19', 'influenza', 'hiv', 'measles', 'ebola', 'norovirus',
];

export default function ControlPanel({
  config,
  onConfigChange,
  onStart,
  onPause,
  onReset,
  onExport,
  isRunning,
  isPaused,
}: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const selectVirus = (type: VirusType) => {
    const preset = VIRUS_PRESETS[type];
    onConfigChange({ ...preset, virusType: type });
  };

  const updateField = <K extends keyof SimulationConfig>(
    key: K,
    value: SimulationConfig[K]
  ) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="flex flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar">
      {/* Virus selector */}
      <div>
        <h3 className="font-display text-sm font-semibold tracking-wider mb-3 text-text-secondary">
          SELECT VIRUS
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {VIRUS_TYPES.map((type) => (
            <VirusCard
              key={type}
              virusType={type}
              selected={config.virusType === type}
              onSelect={selectVirus}
            />
          ))}
        </div>
      </div>

      {/* Advanced controls */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 font-mono text-[10px] font-semibold tracking-[0.2em] text-text-secondary hover:text-white transition-colors w-full py-1 group btn-3d rounded-lg px-2"
          style={{ background: 'transparent' }}
        >
          <span
            className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200 group-hover:bg-white/[0.08]"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <svg
              width="8" height="8" viewBox="0 0 12 12" fill="currentColor"
              className={`transition-transform duration-200 ${showAdvanced ? 'rotate-90' : ''}`}
            >
              <path d="M4 2l4 4-4 4" />
            </svg>
          </span>
          ADVANCED CONTROLS
        </button>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                {/* Mutation Rate */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs text-text-secondary">
                      Mutation Rate
                    </label>
                    <span className="font-mono text-xs text-cyan">
                      {config.mutationRate.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.50"
                    step="0.01"
                    value={config.mutationRate}
                    onChange={(e) =>
                      updateField('mutationRate', parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* Fitness Threshold */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs text-text-secondary">
                      Fitness Threshold
                    </label>
                    <span className="font-mono text-xs text-lime">
                      {config.fitnessThreshold.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.20"
                    max="0.70"
                    step="0.01"
                    value={config.fitnessThreshold}
                    onChange={(e) =>
                      updateField('fitnessThreshold', parseFloat(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* Generation Speed */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs text-text-secondary">
                      Generation Speed
                    </label>
                    <span className="font-mono text-xs text-purple-400">
                      {config.generationInterval}ms
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="50"
                    value={config.generationInterval}
                    onChange={(e) =>
                      updateField('generationInterval', parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* Population Size */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs text-text-secondary">
                      Population Size
                    </label>
                    <span className="font-mono text-xs text-crimson">
                      {config.populationSize}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    step="5"
                    value={config.populationSize}
                    onChange={(e) =>
                      updateField('populationSize', parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* Branching Factor */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs text-text-secondary">
                      Branching Factor
                    </label>
                    <span className="font-mono text-xs text-yellow-400">
                      {config.branchingFactor}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="1"
                    value={config.branchingFactor}
                    onChange={(e) =>
                      updateField('branchingFactor', parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>

                {/* Max Generations */}
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs text-text-secondary">
                      Max Generations
                    </label>
                    <span className="font-mono text-xs text-orange-400">
                      {config.maxGenerations}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={config.maxGenerations}
                    onChange={(e) =>
                      updateField('maxGenerations', parseInt(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Simulation controls */}
      <div className="space-y-2.5">
        {!isRunning ? (
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl font-display font-black text-sm tracking-[0.22em] text-void btn-3d"
            style={{
              background: 'linear-gradient(135deg, #00f0ff 0%, #39ff14 52%, #a855f7 100%)',
              boxShadow: '0 6px 32px rgba(0,240,255,0.35), 0 2px 12px rgba(57,255,20,0.25), 0 0 0 1px rgba(255,255,255,0.15) inset',
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              START SIMULATION
            </span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onPause}
              className="flex-1 py-3.5 rounded-2xl font-display font-black text-xs tracking-[0.18em] btn-3d"
              style={{
                background: isPaused
                  ? 'linear-gradient(135deg, rgba(57,255,20,0.22) 0%, rgba(57,255,20,0.08) 100%)'
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid ${isPaused ? 'rgba(57,255,20,0.4)' : 'rgba(255,255,255,0.1)'}`,
                color: isPaused ? '#39ff14' : '#8888a0',
                boxShadow: isPaused
                  ? '0 4px 20px rgba(57,255,20,0.2), 0 0 0 1px rgba(57,255,20,0.08) inset'
                  : '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
            </button>
            <button
              onClick={onReset}
              className="flex-1 py-3.5 rounded-2xl font-display font-black text-xs tracking-[0.18em] btn-3d"
              style={{
                background: 'linear-gradient(135deg, rgba(255,23,68,0.15) 0%, rgba(255,23,68,0.06) 100%)',
                border: '1px solid rgba(255,23,68,0.28)',
                color: '#ff1744',
                boxShadow: '0 4px 20px rgba(255,23,68,0.18), 0 0 0 1px rgba(255,23,68,0.06) inset',
              }}
            >
              ↺ RESET
            </button>
          </div>
        )}

        <button
          onClick={onExport}
          className="w-full py-3 rounded-2xl font-display text-xs tracking-[0.18em] btn-3d"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            color: '#777799',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#e0e0ff';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#777799';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
          }}
        >
          ↓ EXPORT DATA
        </button>
      </div>
    </div>
  );
}
