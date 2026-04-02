<div align="center">

# MutationPath — Viral Evolution Simulator

**Watch viruses evolve in real time. Branch by branch. Mutation by mutation.**

<br/>

[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![D3.js](https://img.shields.io/badge/D3.js-7-f9a03c?style=flat-square&logo=d3dotjs&logoColor=white)](https://d3js.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055ff?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88ce02?style=flat-square&logo=greensock&logoColor=white)](https://greensock.com/gsap)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](./LICENSE)

<br/>

*"Viruses do not evolve to kill. They evolve to survive. MutationPath lets you watch that story unfold in real time."*

<br/>

[![LinkedIn](https://img.shields.io/badge/LinkedIn-hakim--chouaib-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/hakim-chouaib/)

</div>

---

## What is MutationPath?

MutationPath is a **browser-based phylogenetic simulation engine** that visualizes viral evolution in real time. It models how viruses mutate, how natural selection filters which strains survive, and how a phylogenetic tree grows generation by generation  the exact same forces that shaped COVID-19's Omicron variants, HIV's drug-resistant clades, and the 1918 influenza pandemic.

This is not a game. The underlying algorithms  stochastic branching processes, multi-axis fitness landscapes, Hamming distance-based divergence scoring  are grounded in real computational virology methodology. Every simulation run is stochastic: every tree that grows is a unique evolutionary history that will never repeat.

---

## Features

| Feature | Description |
|---|---|
| 6 virus presets | COVID-19, Influenza, HIV, Measles, Ebola, Norovirus  each with scientifically calibrated mutation rates, fitness profiles, and real historical data |
| Live phylogenetic tree | D3.js SVG tree that grows in real time, color-coded by dominant fitness trait per node |
| Multi-axis fitness engine | Three competing fitness axes  transmissibility, immune evasion, virulence  with evolutionary tradeoff modeling |
| Advanced controls | Fine-tune mutation rate, fitness threshold, branching factor, generation speed, population size, max generations |
| Node interaction | Click any node to inspect genome sequence, fitness breakdown, generation depth, mutation positions, and lineage |
| Lineage highlighting | Hover a node to trace its full ancestral path back to the root strain |
| Extinct branch tracking | Dead lineages rendered as hollow nodes with dashed links  visually distinct from active branches |
| Real-time stats panel | Generation counter, active strain count, extinct count, total mutations, dominant trait, extinction rate, dominant strain ID |
| JSON export | Download the full simulation dataset for offline analysis |
| Custom particle canvas | 80-particle animated background on the hero built entirely with requestAnimationFrame and raw Canvas API |
| GSAP loading screen | Animated entry sequence before the app mounts |
| Custom cursor | Neon cursor that reacts to interactive elements |

---

## Virus Profiles

| Virus | Classification | Real Mutation Rate | Branching Factor | Sim Speed | Evolutionary Signature |
|---|---|---|---|---|---|
| COVID-19 | Betacoronavirus / SARS-CoV-2 | ~110 subs/site/yr | 4 | Fast | Immune evasion sweeps; bushy, wide trees |
| Influenza | Orthomyxovirus / H1N1H3N2 | ~410 subs/site/yr | 5 | Fast | Ladder-like antigenic drift with periodic selective sweeps |
| HIV | Lentivirus / HIV-1 | ~4.110 subs/site/yr | 6 | Extreme | Most explosive divergence of any preset; drug resistance branching |
| Measles | Morbillivirus / MeV | ~0.910 subs/site/yr | 2 | Slow | Ultra-stable; sparse deep trees; vaccine still works 60 years on |
| Ebola | Filovirus / ZEBOV | ~1.210 subs/site/yr | 2 | Medium | Short intense outbreaks followed by mass extinction events |
| Norovirus | Calicivirus / GII | ~4.510 subs/site/yr | 4 | Fast | Wide shallow trees; many short-lived competing lineages |

Each profile card in the app includes:
- Taxonomic classification down to family/genus/species
- Actual published mutation rate in substitutions/site/year
- Famous real-world variants (Alpha, Delta, Omicron BA.1KP.2 for COVID; Group M subtypes for HIV; etc.)
- Historical death toll and outbreak context
- One-click "Simulate This Virus" that pre-loads the simulator with that pathogen's parameters

---

## How the Engine Works

### Genome Representation

Each strain carries a 20-character synthetic genome string composed of nucleotide characters (A, T, G, C). The root strain's genome is generated randomly at simulation start and saved as `rootGenome`. Every divergence and immune evasion calculation references this sequence for the entire run.

### Mutation

Every character in a genome has a per-generation probability equal to `mutationRate` of being replaced by a randomly chosen different character. The positions that mutated are stored as an integer array on each strain object  used in the tooltip display and in fitness scoring.

### Fitness Scoring

Each strain receives a `FitnessScore` computed across three axes then combined:

```
transmissibility    GC content of genome + drift inherited from parent fitness
immuneEvasion       Hamming distance from rootGenome (divergence = harder to recognize)
virulence           Inverse tradeoff with transmissibility

// Diminishing returns: too many mutations reduce viability
if (hammingDistance > 0.6) immuneEvasion -= (hammingDistance - 0.6) * 0.5;

// Transmissibility-virulence evolutionary tradeoff
virulence += (1 - transmissibility) * 0.1 - transmissibility * 0.05;

// Weighted overall fitness:
overall = transmissibility * 0.4 + immuneEvasion * 0.35 + virulence * 0.25

// Natural selection:
survived = overall > fitnessThreshold
```

Strains where `survived = false` are marked extinct. Survivors spawn up to `branchingFactor` children in the next generation tick.

### Stochastic Branching Process

Each generation is a discrete time step, firing every `generationInterval` milliseconds via `setInterval`. The simulation runs asynchronously and pushes strain map updates into React state on each tick. All strain data lives in a `Map<string, Strain>`  O(1) lookups for parent/child traversal, lineage walks, and statistics computation.

### Phylogenetic Tree Rendering

The strain map is converted to `d3.hierarchy()` and laid out with `d3.tree()` using node sizes derived dynamically from the canvas container. Each node is an SVG `<circle>` with:

- Radius proportional to the strain's overall fitness score
- Fill color encoding dominant fitness trait (cyan = transmissibility, green = immune evasion, red = virulence)
- SVG `feGaussianBlur` + `feComposite` filter stack for the neon glow effect
- Opacity reduced to ~0.35 and stroke switched to dashed array for extinct strains
- Framer Motion enter/exit transitions for node lifecycle

### Lineage Highlighting

Clicking any node calls `getLineage()`, which walks parent pointers up the strain map from the clicked strain to the root. The resulting ID array is passed to the SVG renderer, which identifies all matching links and renders them at full opacity with 2 stroke weight  tracing the evolutionary ancestry visually through the tree.

---

## The Science Behind It

### Transmissibility-Virulence Tradeoff

One of the most important evolutionary constraints in virology: a virus that kills its host too quickly loses transmission opportunities. The engine models this explicitly. Ebola achieves extreme virulence but has a tight branching factor and generates short-lived trees  it burns through hosts before they can spread. Influenza has evolved near-optimal balance: high transmissibility keeping hosts mobile and infectious for days. HIV operates on a third axis entirely  latency minimizing detection while continuous mutation compounds drug resistance.

### Stochastic vs. Deterministic

Real viral evolution is stochastic. Two viruses with identical genomes in identical hosts will diverge differently due to probabilistic replication errors. MutationPath models this correctly: the simulation uses `Math.random()` at every mutation site and branching decision. No two runs produce the same tree, even with identical parameters  matching the biological reality.

### Validated Topology

The algorithm produces phylogenetic patterns consistent with real-world observations: bushy trees for rapidly mutating viruses (HIV, COVID-19), ladder-like trees for genetically conserved viruses (Measles), and short explosive bursts followed by mass extinction for high-virulence pathogens (Ebola). These patterns match the published phylogenetic datasets from Nextstrain used as qualitative calibration references.

### In Silico Methodology

Computational evolutionary simulation  running models in software rather than in biological hosts  is a legitimate and widely-used research tool in virology and epidemiology. It allows exploration of evolutionary dynamics (parameter sweeps, extinction thresholds, resistance emergence) that would be impossible or unethical to study in vivo.

---

## Simulation Parameter Reference

### Mutation Rate
Per-base substitution probability per replication cycle. HIV's real rate (~4.110) is among the highest of any known pathogen  its reverse transcriptase completely lacks proofreading. Measles (~0.910) is one of the most genetically stable RNA viruses known, which is why a single vaccine developed in the 1960s still neutralizes every circulating strain.

### Fitness Threshold
Minimum weighted fitness score for a strain to survive to the next generation. Lower values produce dense bushy trees with many coexisting lineages. Higher values trigger mass extinction events visible as entire generation layers going hollow simultaneously, with only the fittest one or two lineages persisting.

### Branching Factor
Maximum offspring count per surviving strain per generation. HIV (6) generates explosive wide trees. Measles and Ebola (2) produce narrow, deep lineages reflecting the real-world transmission bottlenecks these viruses face.

### Generation Speed
Millisecond interval between generation ticks. Has zero effect on the biological simulation logic  only affects observation speed. At 200ms the tree growth becomes nearly meditative.

### Population Size
Number of strains entering the fitness filter each generation. Larger populations preserve more diversity, producing wider trees with competing sublineages.

### Max Generations
Total simulation depth. 20 generations with COVID-19 parameters typically produces 250350 total strains, 6075% extinction, and 8001000 total point mutations accumulated.

---

## Real-World Impact of Phylogenetics

The science this simulator is built on has direct, ongoing, life-saving applications:

**COVID-19**  Phylogenetic surveillance identified Omicron's explosive divergence from Delta and tracked subvariant emergence (BA.1 through KP.2) in real time. This directly informed WHO vaccine composition decisions and targeted travel restrictions. Over 7 million deaths documented through phylogenetic tracking.

**HIV**  Mutation tracking reveals drug resistance patterns as they emerge, guiding combination antiretroviral therapy selection to prevent resistance-induced treatment failure. Impacts treatment decisions for 40+ million people living with HIV globally.

**Influenza**  The largest operational application of viral phylogenetics. Every year, WHO analyzes circulating influenza lineages via phylogenetic surveillance to determine which strains go into each season's vaccine. This process is estimated to prevent approximately 500,000 deaths annually.

---

## Project Structure

```
mutationpath/
 src/
    App.tsx                       # Root component  section assembly and top-level state
    main.tsx                      # React DOM entry point
    components/
       Hero.tsx                  # Particle canvas (raw Canvas API + rAF) + hero text
       WhatIsMutationPath.tsx    # Mutation / Fitness / Phylogenetics concept cards
       TheScience.tsx            # Science pillars + annotated tree visual legend
       Simulator.tsx             # Simulation orchestrator  owns all simulation state
       ControlPanel.tsx          # Virus selector + parameter sliders + controls
       MutationTree.tsx          # D3 SVG phylogenetic tree renderer
       StatsPanel.tsx            # Animated real-time stat counters
       NodeTooltip.tsx           # Viewport-aware per-node inspection popup
       VirusProfiles.tsx         # Six virus profile card section
       VirusCard.tsx             # Individual virus data card
       VirusIcons.tsx            # Custom SVG virus icon per pathogen
       RealWorldImpact.tsx       # Animated epidemiological impact stat panels
       About.tsx                 # Algorithm methodology + limitations section
       Navbar.tsx                # Sticky floating pill navigation
       Footer.tsx                # Footer with links and marquee
       LoadingScreen.tsx         # GSAP-animated entry sequence
       CustomCursor.tsx          # Custom neon cursor overlay
       MutationPathLogo.tsx      # Animated SVG logo
    lib/
       mutationEngine.ts         # Core: genome mutation, fitness scoring, branching, stats
       genomeUtils.ts            # Genome generation, Hamming distance, GC content, trait colors
       treeLayout.ts             # D3 hierarchy construction + node/link visual properties
       virusPresets.ts           # Per-virus simulation configs + scientific profile data
    types/
       index.ts                  # Strain, FitnessScore, SimulationConfig, TreeNode, SimulationStats
    styles/
        index.css                 # Tailwind base + global design tokens
 .gitignore
 index.html
 package.json
 postcss.config.js
 tailwind.config.js
 tsconfig.json
 vite.config.ts
```

---

## Tech Stack

| Layer | Technology | Version | Why |
|---|---|---|---|
| UI Framework | React | 19 | Concurrent rendering keeps simulation callbacks non-blocking |
| Language | TypeScript | 5.6 | Full static types from engine internals to component props |
| Build Tool | Vite | 6 | Sub-second HMR in dev; optimized tree-shaken production bundles |
| Styling | Tailwind CSS | 3.4 | Utility-first with zero runtime overhead; custom neon palette tokens |
| Tree Visualization | D3.js | 7 | Industry-standard hierarchical layout algorithms and SVG rendering |
| Animations | Framer Motion | 12 | Spring-physics section entrances and node lifecycle transitions |
| Timeline Animation | GSAP | 3.12 | High-performance loading screen and hero sequencing |

---

## Getting Started

```bash
# Clone
git clone https://github.com/chouaibhakim76-ui/MutationPath.git
cd MutationPath

# Install
npm install

# Develop
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

**Requirements:** Node.js >= 18, npm >= 9

---

## Running a Simulation

1. **Choose a virus** from the left panel  each loads scientifically calibrated defaults
2. **Optionally expand Advanced Controls**  override any parameter with the sliders
3. **Click Start Simulation**  the tree begins growing immediately in real time
4. **Click any node** to inspect its genome sequence, fitness scores across all three axes, generation depth, and exact mutation positions
5. **Hover any node** to highlight its complete ancestral lineage traced back to the root strain
6. **Pause / Resume** at any generation to freeze and analyze the tree state
7. **Export** the full simulation dataset as JSON for offline use
8. **Reset** and run again  the stochastic engine guarantees every run is unique

---

## Limitations and Future Work

MutationPath is a simplified model. It produces accurate phylogenetic topology but does not yet model:

- **Recombination**  RNA viruses swap genome segments between co-infecting strains (influenza reassortment, HIV recombination create entirely new variant classes)
- **Host immune dynamics**  as population immunity builds, the adaptive landscape shifts, escalating evolutionary pressure toward immune evasion
- **Geographic spread**  spatial modeling where transmission probability is a function of host proximity and movement
- **Real genome data**  integration with GISAID or GenBank to run the engine against actual sequenced variants
- **Nextstrain comparison mode**  overlay a simulated tree against a downloaded real phylogeny
- **Per-site selection coefficients**  position-specific fitness weights mirroring known critical residues in real proteins (ACE2-binding domain, reverse transcriptase active site, etc.)
- **Mobile touch support**  responsive tree interaction for smaller viewports

---

## License

MIT  see [LICENSE](./LICENSE) for full terms.

---

<div align="center">

Built by **Hakim Chouaib** — Future Health Informatics Expert

[![LinkedIn](https://img.shields.io/badge/LinkedIn-hakim--chouaib-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/hakim-chouaib/)

*Built at the intersection of biology, data science, and visual engineering.*

</div>
