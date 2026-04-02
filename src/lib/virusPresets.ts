import { SimulationConfig, VirusType } from '../types';

export const VIRUS_PRESETS: Record<VirusType, Omit<SimulationConfig, 'virusType'>> = {
  covid19: {
    mutationRate: 0.15,
    fitnessThreshold: 0.35,
    branchingFactor: 4,
    generationInterval: 800,
    maxGenerations: 20,
    populationSize: 100,
  },
  influenza: {
    mutationRate: 0.20,
    fitnessThreshold: 0.30,
    branchingFactor: 5,
    generationInterval: 700,
    maxGenerations: 18,
    populationSize: 80,
  },
  hiv: {
    mutationRate: 0.35,
    fitnessThreshold: 0.25,
    branchingFactor: 6,
    generationInterval: 600,
    maxGenerations: 25,
    populationSize: 60,
  },
  measles: {
    mutationRate: 0.03,
    fitnessThreshold: 0.55,
    branchingFactor: 2,
    generationInterval: 1200,
    maxGenerations: 12,
    populationSize: 40,
  },
  ebola: {
    mutationRate: 0.08,
    fitnessThreshold: 0.50,
    branchingFactor: 2,
    generationInterval: 1000,
    maxGenerations: 14,
    populationSize: 30,
  },
  norovirus: {
    mutationRate: 0.18,
    fitnessThreshold: 0.32,
    branchingFactor: 4,
    generationInterval: 750,
    maxGenerations: 20,
    populationSize: 70,
  },
};

export const VIRUS_INFO: Record<VirusType, {
  name: string;
  icon: string;
  speed: string;
  description: string;
  classification: string;
  realMutationRate: string;
  famousVariants: string;
  historicalImpact: string;
  color: string;
}> = {
  covid19: {
    name: 'COVID-19',
    icon: 'covid19',
    speed: 'Fast',
    description: 'Immune evasion specialist',
    classification: 'Betacoronavirus • SARS-CoV-2',
    realMutationRate: '~1×10⁻³ subs/site/year',
    famousVariants: 'Alpha, Delta, Omicron BA.1–BA.5, JN.1, KP.2',
    historicalImpact: '7+ million deaths worldwide since 2019',
    color: '#00f0ff',
  },
  influenza: {
    name: 'Influenza',
    icon: 'influenza',
    speed: 'Fast',
    description: 'Antigenic drift master',
    classification: 'Orthomyxovirus • Influenza A/B',
    realMutationRate: '~2.3×10⁻³ subs/site/year',
    famousVariants: 'H1N1 (Spanish Flu), H3N2, H5N1 (Avian)',
    historicalImpact: '50M deaths in 1918 pandemic alone',
    color: '#6366f1',
  },
  hiv: {
    name: 'HIV',
    icon: 'hiv',
    speed: 'Extreme',
    description: 'Drug resistance evolution',
    classification: 'Lentivirus • HIV-1/HIV-2',
    realMutationRate: '~4.1×10⁻³ subs/site/year',
    famousVariants: 'Group M (pandemic), subtypes A–K',
    historicalImpact: '40M+ deaths since epidemic began',
    color: '#f43f5e',
  },
  measles: {
    name: 'Measles',
    icon: 'measles',
    speed: 'Slow',
    description: 'High transmissibility, slow evolution',
    classification: 'Morbillivirus • MeV',
    realMutationRate: '~0.9×10⁻³ subs/site/year',
    famousVariants: 'Genotypes A, B3, D8, H1',
    historicalImpact: '200M deaths in last 150 years',
    color: '#f59e0b',
  },
  ebola: {
    name: 'Ebola',
    icon: 'ebola',
    speed: 'Medium',
    description: 'Virulence tradeoff exemplar',
    classification: 'Filovirus • Zaire ebolavirus',
    realMutationRate: '~1.2×10⁻³ subs/site/year',
    famousVariants: 'Makona, Mayinga, Kikwit',
    historicalImpact: '15,000+ deaths across West Africa outbreak',
    color: '#ef4444',
  },
  norovirus: {
    name: 'Norovirus',
    icon: 'norovirus',
    speed: 'Fast',
    description: 'Rapid spread cycles',
    classification: 'Calicivirus • Norovirus GII.4',
    realMutationRate: '~1.7×10⁻³ subs/site/year',
    famousVariants: 'GII.4 Sydney, GII.17 Kawasaki, GII.4 New Orleans',
    historicalImpact: '685M cases annually worldwide',
    color: '#a855f7',
  },
};
