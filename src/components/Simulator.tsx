import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Strain, SimulationConfig, SimulationStats } from '../types';
import { VIRUS_PRESETS } from '../lib/virusPresets';
import { runSimulation, computeStats } from '../lib/mutationEngine';
import { getLineage } from '../lib/treeLayout';
import ControlPanel from './ControlPanel';
import StatsPanel from './StatsPanel';
import MutationTree from './MutationTree';

export default function Simulator() {
  const [config, setConfig] = useState<SimulationConfig>({
    ...VIRUS_PRESETS.covid19,
    virusType: 'covid19',
  });

  const [allStrains, setAllStrains] = useState<Map<string, Strain>>(new Map());
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState(0);
  const [highlightedLineage, setHighlightedLineage] = useState<string[]>([]);
  const [stats, setStats] = useState<SimulationStats>({
    totalStrains: 0,
    activeStrains: 0,
    extinctStrains: 0,
    deepestBranch: 0,
    mostFitStrain: null,
    dominantTrait: '—',
    extinctionRate: 0,
    currentGeneration: 0,
    totalMutations: 0,
  });
  const [exportSuccess, setExportSuccess] = useState(false);

  const controlRef = useRef<{
    stop: () => void;
    pause: () => void;
    resume: () => void;
  } | null>(null);

  const handleStart = useCallback(() => {
    // Reset
    setAllStrains(new Map());
    setCurrentGeneration(0);
    setHighlightedLineage([]);
    setIsRunning(true);
    setIsPaused(false);

    const controls = runSimulation(
      config,
      (newStrains, generation, allStrainsMap) => {
        setAllStrains(new Map(allStrainsMap));
        setCurrentGeneration(generation);
        setStats(computeStats(allStrainsMap, generation));
      },
      (finalStrains) => {
        setIsRunning(false);
        setStats(computeStats(finalStrains, config.maxGenerations));
      }
    );

    controlRef.current = controls;
  }, [config]);

  const handlePause = useCallback(() => {
    if (isPaused) {
      controlRef.current?.resume();
      setIsPaused(false);
    } else {
      controlRef.current?.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  const handleReset = useCallback(() => {
    controlRef.current?.stop();
    setAllStrains(new Map());
    setCurrentGeneration(0);
    setIsRunning(false);
    setIsPaused(false);
    setHighlightedLineage([]);
    setStats({
      totalStrains: 0,
      activeStrains: 0,
      extinctStrains: 0,
      deepestBranch: 0,
      mostFitStrain: null,
      dominantTrait: '—',
      extinctionRate: 0,
      currentGeneration: 0,
      totalMutations: 0,
    });
  }, []);

  const handleExport = useCallback(() => {
    const data = Array.from(allStrains.values());
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mutationpath-${config.virusType}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  }, [allStrains, config.virusType]);

  const handleNodeClick = useCallback(
    (strainId: string) => {
      if (highlightedLineage.includes(strainId)) {
        setHighlightedLineage([]);
      } else {
        setHighlightedLineage(getLineage(strainId, allStrains));
      }
    },
    [allStrains, highlightedLineage]
  );

  return (
    <section id="simulator" className="relative py-24 px-6 min-h-screen overflow-hidden">
      {/* Section ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(0,240,255,0.04) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(57,255,20,0.03) 0%, transparent 60%)',
        }}
      />

      <motion.div
        className="max-w-[1400px] mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: '-50px' }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-label justify-center text-cyan/60 mb-3">
            INTERACTIVE SIMULATION
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black mb-4 text-3d">
            Start a{' '}
            <span className="bio-gradient-text">Simulation</span>
          </h2>
          <p className="font-body text-text-secondary max-w-xl mx-auto">
            Choose a pathogen, configure parameters, and watch evolution unfold in real time.
          </p>
        </div>

        {/* Main layout — chrome frame */}
        <div
          className="rounded-3xl p-1 sim-frame"
          style={{
            background: 'linear-gradient(135deg, rgba(0,240,255,0.08) 0%, rgba(57,255,20,0.04) 50%, rgba(168,85,247,0.05) 100%)',
          }}
        >
          {/* Inner dark panel */}
          <div
            className="rounded-[20px] p-5 lg:p-6"
            style={{
              background: 'rgba(6,6,16,0.96)',
              backdropFilter: 'blur(40px)',
            }}
          >
            {/* Chrome titlebar */}
            <div
              className="flex items-center gap-2 mb-5 pb-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                <span className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
              </div>
              <div
                className="flex-1 mx-4 h-6 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="font-mono text-[10px] text-text-secondary/40 tracking-wider">
                  mutationpath://simulator/phylogenetic-engine
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: isRunning ? '#39ff14' : '#8888a0', boxShadow: isRunning ? '0 0 6px #39ff14' : 'none' }}
                />
                <span className="font-mono text-[10px] text-text-secondary/50 tracking-wider">
                  {isRunning ? (isPaused ? 'PAUSED' : 'RUNNING') : 'READY'}
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:h-[680px]">
              {/* Left panel - Controls */}
              <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-4 lg:min-h-0 lg:overflow-hidden">
                <div
                  className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:custom-scrollbar lg:pr-1 rounded-2xl p-4"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <ControlPanel
                    config={config}
                    onConfigChange={setConfig}
                    onStart={handleStart}
                    onPause={handlePause}
                    onReset={handleReset}
                    onExport={handleExport}
                    isRunning={isRunning}
                    isPaused={isPaused}
                  />
                </div>

                {/* Stats */}
                <StatsPanel
                  stats={stats}
                  isRunning={isRunning}
                  maxGenerations={config.maxGenerations}
                />
              </div>

              {/* Right panel - Tree */}
              <div
                className="w-full h-[500px] lg:flex-1 lg:h-auto min-w-0 rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.4)',
                }}
              >
                <MutationTree
                  allStrains={allStrains}
                  currentGeneration={currentGeneration}
                  highlightedLineage={highlightedLineage}
                  onNodeClick={handleNodeClick}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Export success toast */}
        {exportSuccess && (
          <motion.div
            className="fixed bottom-8 right-8 glass-strong rounded-xl px-6 py-3 flex items-center gap-3 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <span className="text-lime">✓</span>
            <span className="font-body text-sm text-white">Data exported successfully</span>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
