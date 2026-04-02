export interface Strain {
  id: string;
  parentId: string | null;
  generation: number;
  genome: string;
  mutations: number[];
  fitness: FitnessScore;
  isExtinct: boolean;
  children: string[];
  timestamp: number;
}

export interface FitnessScore {
  transmissibility: number;
  immuneEvasion: number;
  virulence: number;
  overall: number;
  survived: boolean;
}

export interface SimulationConfig {
  virusType: VirusType;
  mutationRate: number;
  fitnessThreshold: number;
  branchingFactor: number;
  generationInterval: number;
  maxGenerations: number;
  populationSize: number;
}

export type VirusType =
  | 'covid19'
  | 'influenza'
  | 'hiv'
  | 'measles'
  | 'ebola'
  | 'norovirus';

export interface SimulationStats {
  totalStrains: number;
  activeStrains: number;
  extinctStrains: number;
  deepestBranch: number;
  mostFitStrain: Strain | null;
  dominantTrait: 'transmissibility' | 'immuneEvasion' | 'virulence' | '—';
  extinctionRate: number;
  currentGeneration: number;
  totalMutations: number;
}

export interface TreeNode extends Strain {
  x: number;
  y: number;
  childNodes: TreeNode[];
}
