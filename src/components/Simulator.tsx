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
    <section id="simulator" className="relative py-20 px-6 min-h-screen">
      <motion.div
        className="max-w-[1400px] mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, margin: '-50px' }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-mono text-xs tracking-[0.3em] text-cyan mb-4 block">
            THE SIMULATOR
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Start a Simulation
          </h2>
          <p className="font-body text-text-secondary max-w-xl mx-auto">
            Choose a virus, configure parameters, and watch evolution unfold in real time.
          </p>
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-6" style={{ height: '700px' }}>
          {/* Left panel - Controls */}
          <div className="w-full lg:w-[320px] flex-shrink-0 flex flex-col gap-4">
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

            {/* Stats */}
            <StatsPanel
              stats={stats}
              isRunning={isRunning}
              maxGenerations={config.maxGenerations}
            />
          </div>

          {/* Right panel - Tree */}
          <div className="flex-1 min-w-0 glass rounded-xl overflow-hidden">
            <MutationTree
              allStrains={allStrains}
              currentGeneration={currentGeneration}
              highlightedLineage={highlightedLineage}
              onNodeClick={handleNodeClick}
            />
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
