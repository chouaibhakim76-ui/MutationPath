import { Strain, FitnessScore, SimulationConfig, SimulationStats } from '../types';
import { generateGenome, mutateBase, gcContent, hammingDistance, shortId, getDominantTrait } from './genomeUtils';

let rootGenome = '';

export function mutateGenome(
  genome: string,
  mutationRate: number
): { newGenome: string; mutatedPositions: number[] } {
  const chars = genome.split('');
  const mutatedPositions: number[] = [];

  for (let i = 0; i < chars.length; i++) {
    if (Math.random() < mutationRate) {
      chars[i] = mutateBase(chars[i]);
      mutatedPositions.push(i);
    }
  }

  return { newGenome: chars.join(''), mutatedPositions };
}

export function calculateFitness(
  genome: string,
  parentFitness: FitnessScore | null,
  config: SimulationConfig
): FitnessScore {
  const gc = gcContent(genome);
  const hd = rootGenome ? hammingDistance(genome, rootGenome) / genome.length : 0;

  // Transmissibility: based on GC content + random variation from parent
  let transmissibility: number;
  if (parentFitness) {
    transmissibility = parentFitness.transmissibility + (Math.random() - 0.5) * 0.2;
  } else {
    transmissibility = 0.3 + gc * 0.5;
  }
  transmissibility = Math.max(0, Math.min(1, transmissibility));

  // Immune evasion: based on hamming distance from root
  let immuneEvasion: number;
  if (parentFitness) {
    immuneEvasion = parentFitness.immuneEvasion + (Math.random() - 0.5) * 0.15;
    // Bonus for more mutations from root
    immuneEvasion += hd * 0.3;
  } else {
    immuneEvasion = 0.2 + hd * 0.5;
  }
  // Diminishing returns: too many mutations can break function
  if (hd > 0.6) {
    immuneEvasion -= (hd - 0.6) * 0.5;
  }
  immuneEvasion = Math.max(0, Math.min(1, immuneEvasion));

  // Virulence: inverse relationship with transmissibility (tradeoff)
  let virulence: number;
  if (parentFitness) {
    virulence = parentFitness.virulence + (Math.random() - 0.5) * 0.15;
  } else {
    virulence = 0.7 - transmissibility * 0.4;
  }
  // Evolutionary tradeoff
  virulence = virulence + (1 - transmissibility) * 0.1 - transmissibility * 0.05;
  virulence = Math.max(0, Math.min(1, virulence));

  // Overall: weighted average
  const overall =
    transmissibility * 0.4 + immuneEvasion * 0.35 + virulence * 0.25;

  return {
    transmissibility,
    immuneEvasion,
    virulence,
    overall,
    survived: overall > config.fitnessThreshold,
  };
}

export function createRootStrain(config: SimulationConfig): Strain {
  const genome = generateGenome(20);
  rootGenome = genome;

  const fitness: FitnessScore = {
    transmissibility: 0.5,
    immuneEvasion: 0.3,
    virulence: 0.4,
    overall: 0.5 * 0.4 + 0.3 * 0.35 + 0.4 * 0.25,
    survived: true,
  };

  return {
    id: shortId(),
    parentId: null,
    generation: 0,
    genome,
    mutations: [],
    fitness,
    isExtinct: false,
    children: [],
    timestamp: Date.now(),
  };
}

export function runGeneration(
  currentStrains: Strain[],
  config: SimulationConfig,
  allStrains: Map<string, Strain>,
  generation: number
): Strain[] {
  const activeStrains = currentStrains.filter((s) => !s.isExtinct);
  const newStrains: Strain[] = [];

  for (const parent of activeStrains) {
    const numChildren = 1 + Math.floor(Math.random() * config.branchingFactor);

    for (let i = 0; i < numChildren; i++) {
      if (newStrains.length + activeStrains.length >= config.populationSize) break;

      const { newGenome, mutatedPositions } = mutateGenome(
        parent.genome,
        config.mutationRate
      );
      const fitness = calculateFitness(newGenome, parent.fitness, config);
      const child: Strain = {
        id: shortId(),
        parentId: parent.id,
        generation,
        genome: newGenome,
        mutations: mutatedPositions,
        fitness,
        isExtinct: !fitness.survived,
        children: [],
        timestamp: Date.now(),
      };

      parent.children.push(child.id);
      allStrains.set(child.id, child);
      newStrains.push(child);
    }
  }

  // Some active parents may go extinct due to competition
  for (const parent of activeStrains) {
    if (Math.random() < 0.15) {
      parent.isExtinct = true;
    }
  }

  return newStrains;
}

export function computeStats(
  allStrains: Map<string, Strain>,
  currentGeneration: number
): SimulationStats {
  const strains = Array.from(allStrains.values());
  const active = strains.filter((s) => !s.isExtinct);
  const extinct = strains.filter((s) => s.isExtinct);

  let mostFit: Strain | null = null;
  let maxFitness = -1;
  let deepest = 0;
  let totalMutations = 0;

  const traitSums = { transmissibility: 0, immuneEvasion: 0, virulence: 0 };

  for (const s of strains) {
    if (s.fitness.overall > maxFitness) {
      maxFitness = s.fitness.overall;
      mostFit = s;
    }
    if (s.generation > deepest) deepest = s.generation;
    totalMutations += s.mutations.length;
  }

  for (const s of active) {
    traitSums.transmissibility += s.fitness.transmissibility;
    traitSums.immuneEvasion += s.fitness.immuneEvasion;
    traitSums.virulence += s.fitness.virulence;
  }

  let dominantTrait: SimulationStats['dominantTrait'] = '—';
  if (active.length > 0) {
    dominantTrait = getDominantTrait({
      transmissibility: traitSums.transmissibility / active.length,
      immuneEvasion: traitSums.immuneEvasion / active.length,
      virulence: traitSums.virulence / active.length,
    });
  }

  return {
    totalStrains: strains.length,
    activeStrains: active.length,
    extinctStrains: extinct.length,
    deepestBranch: deepest,
    mostFitStrain: mostFit,
    dominantTrait,
    extinctionRate: strains.length > 0 ? (extinct.length / strains.length) * 100 : 0,
    currentGeneration,
    totalMutations,
  };
}

export function runSimulation(
  config: SimulationConfig,
  onGenerationComplete: (
    strains: Strain[],
    generation: number,
    allStrains: Map<string, Strain>
  ) => void,
  onComplete: (allStrains: Map<string, Strain>) => void
): { stop: () => void; pause: () => void; resume: () => void } {
  const allStrains = new Map<string, Strain>();
  const root = createRootStrain(config);
  allStrains.set(root.id, root);

  let currentGeneration = 0;
  let currentStrains = [root];
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let paused = false;

  onGenerationComplete([root], 0, allStrains);

  const tick = () => {
    if (paused) return;
    currentGeneration++;

    if (currentGeneration > config.maxGenerations) {
      stop();
      onComplete(allStrains);
      return;
    }

    const activeCount = currentStrains.filter((s) => !s.isExtinct).length +
      Array.from(allStrains.values()).filter(
        (s) => !s.isExtinct && s.generation === currentGeneration - 1
      ).length;

    if (activeCount === 0) {
      stop();
      onComplete(allStrains);
      return;
    }

    const allActive = Array.from(allStrains.values()).filter(
      (s) => !s.isExtinct
    );
    const newStrains = runGeneration(allActive, config, allStrains, currentGeneration);
    currentStrains = newStrains;
    onGenerationComplete(newStrains, currentGeneration, allStrains);

    if (currentGeneration >= config.maxGenerations) {
      stop();
      onComplete(allStrains);
    }
  };

  intervalId = setInterval(tick, config.generationInterval);

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  const pause = () => {
    paused = true;
  };

  const resume = () => {
    paused = false;
  };

  return { stop, pause, resume };
}
