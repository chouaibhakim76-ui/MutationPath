const BASES = ['A', 'C', 'G', 'T'] as const;

export function generateGenome(length: number = 20): string {
  let genome = '';
  for (let i = 0; i < length; i++) {
    genome += BASES[Math.floor(Math.random() * 4)];
  }
  return genome;
}

export function mutateBase(base: string): string {
  const others = BASES.filter((b) => b !== base);
  return others[Math.floor(Math.random() * others.length)];
}

export function gcContent(genome: string): number {
  let gc = 0;
  for (const base of genome) {
    if (base === 'G' || base === 'C') gc++;
  }
  return gc / genome.length;
}

export function hammingDistance(a: string, b: string): number {
  let dist = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) dist++;
  }
  return dist;
}

export function shortId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function formatGenome(genome: string): string {
  return genome.match(/.{1,4}/g)?.join(' ') ?? genome;
}

export function getDominantTrait(fitness: {
  transmissibility: number;
  immuneEvasion: number;
  virulence: number;
}): 'transmissibility' | 'immuneEvasion' | 'virulence' {
  if (
    fitness.transmissibility >= fitness.immuneEvasion &&
    fitness.transmissibility >= fitness.virulence
  ) {
    return 'transmissibility';
  }
  if (fitness.immuneEvasion >= fitness.virulence) {
    return 'immuneEvasion';
  }
  return 'virulence';
}

export function traitColor(trait: string): string {
  switch (trait) {
    case 'transmissibility':
      return '#00f0ff';
    case 'immuneEvasion':
      return '#39ff14';
    case 'virulence':
      return '#ff1744';
    default:
      return '#8888a0';
  }
}

export function traitLabel(trait: string): string {
  switch (trait) {
    case 'transmissibility':
      return 'Transmissibility';
    case 'immuneEvasion':
      return 'Immune Evasion';
    case 'virulence':
      return 'Virulence';
    default:
      return '—';
  }
}
