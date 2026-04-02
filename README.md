<div align="center">

<br/>

```
             
      
                   
                  
                 
                         
                         P A T H
```

# MutationPath  Viral Evolution Simulator

**Watch viruses evolve in real time. Branch by branch. Mutation by mutation.**

[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![D3.js](https://img.shields.io/badge/D3.js-7-f9a03c?style=flat-square&logo=d3dotjs&logoColor=white)](https://d3js.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055ff?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88ce02?style=flat-square&logo=greensock&logoColor=white)](https://greensock.com/gsap)
[![License: MIT](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](./LICENSE)

<br/>

> *"Viruses do not evolve to kill. They evolve to survive. MutationPath lets you watch that story unfold in real time."*

<br/>

[GitHub](https://github.com/chouaibhakim76-ui/MutationPath)  [LinkedIn](https://www.linkedin.com/in/hakim-chouaib/)

</div>

---

## What is MutationPath?

MutationPath is a **browser-based phylogenetic simulation engine** that visualizes viral evolution in real time. It models how viruses mutate, how natural selection filters which strains survive, and how a phylogenetic tree grows generation by generation  the exact same forces that shaped COVID-19's Omicron, HIV's drug-resistant clades, and the 1918 influenza pandemic.

This is not a game. The underlying algorithms  stochastic branching processes, multi-axis fitness landscapes, Hamming distance-based divergence scoring  are grounded in real computational virology. Every simulation run is different. Every tree that grows is a unique evolutionary history.

---

## Screenshots

### Hero

![Hero Section](./screenshots/01-hero.png)

A full-bleed animated canvas with 80 floating particles cycling across five neon colors, a live phylogenetic tree preview glowing on the right, and two CTAs: jump straight into the simulator or dig into the science. The particle system is entirely custom  per-particle lifecycle management (spawn, fade-in, drift, fade-out, respawn) running on a raw `<canvas>` with `requestAnimationFrame`. No library involved.

---

### What is MutationPath?

![What is MutationPath](./screenshots/02-what-is.png)

Three foundational concepts of viral evolution, explained cleanly with glowing icon cards:

- **Mutation**  errors in genome copying produce random point mutations. Most are neutral or harmful; occasionally one grants a competitive edge.
- **Fitness**  each mutation shifts three axes (transmissibility, immune evasion, virulence). Natural selection keeps only the strains that exceed the survival threshold.
- **Phylogenetics**  by tracking mutations across generations, a tree emerges that maps which variants arose from which ancestors, when they diverged, and which went extinct. This is exactly how scientists traced Omicron's lineage.

---

### Real Science, In Your Browser

![The Science Section](./screenshots/03-science.png)

Four scientific pillars backing the simulation engine, alongside an annotated phylogenetic tree diagram explaining the visual language (root strain, internal nodes, active leaf nodes, extinct branches) so users understand what they are looking at before running anything:

| Pillar | What it means |
|---|---|
| Stochastic Branching Process | Each generation spawns offspring with random mutations. Survival is probabilistic  mirrors Galton-Watson branching theory used in epidemiology |
| Fitness Landscape | Three fitness axes create a high-dimensional adaptive surface. Mutations are random steps on it  only steps above the threshold persist |
| In Silico Simulation | A legitimate research methodology. Computational models allow studying evolutionary dynamics that would be impossible to observe ethically in living organisms |
| Validated Patterns | The engine produces bushy trees for HIV/COVID-19 and ladder-like trees for Measles  consistent with patterns in published phylogenetic datasets |

---

### The Simulator  Idle

![Simulator Idle State](./screenshots/04-simulator-idle.png)

The simulator section shows a clean two-column layout at rest. Left panel has the virus selector with all six pathogens, each labeled with a speed badge (SLOW / MEDIUM / FAST / EXTREME) and a one-line evolutionary description. The right canvas sits empty with the trait map legend pre-rendered in the corner  ready to receive a tree.

---

### The Simulator  Running (mid-simulation)

![Simulator Running](./screenshots/05-simulator-running.png)

Generation 11 of 20 into a COVID-19 run. The tree is actively growing  branches spreading right from the central trunk, color-coded cyan (transmissibility) and red (virulence) nodes competing for dominance. The left panel shows **SIMULATING** status, the live generation progress bar, and real-time stats updating every tick. The trait map legend in the top-right corner explains node colors at a glance.

---

### The Simulator  Completed Run

![Simulator Complete](./screenshots/06-simulator-complete.png)

A finished 20-generation COVID-19 simulation. The full phylogenetic tree is visible  82 active strains survived to the end, 207 went extinct (71.6% extinction rate), 880 total mutations accumulated across all lineages. The dominant strain `M6YYYM` holds 68% fitness. The completed tree clearly shows the evolutionary sweep: many early branches dying off (hollow rings) while a few high-fitness lineages dominate the terminal generation.

---

### Advanced Controls

![Advanced Controls](./screenshots/07-advanced-controls.png)

Expand the **Advanced Controls** drawer to override every simulation parameter with smooth range sliders. All six parameters update in real time as you drag  changes apply to the next simulation run.

| Parameter | COVID-19 Default | Effect |
|---|---|---|
| Mutation Rate | 0.15 | Per-base probability of a point substitution per replication |
| Fitness Threshold | 0.35 | Minimum overall fitness score to survive to next generation |
| Generation Speed | 800ms | Time between generation ticks  lower = faster evolution |
| Population Size | 100 | Starting population entering the fitness filter each generation |
| Branching Factor | 4 | Maximum offspring count per surviving strain |
| Max Generations | 20 | Simulation length in discrete generations |

---

### Virus Profiles  COVID-19 & Influenza

![Virus Profiles Top](./screenshots/08-virus-profiles.png)

The virus profiles section opens with COVID-19 and Influenza cards. Each card shows:
- Taxonomic classification down to species level
- Real-world measured mutation rate in substitutions/site/year
- Famous variants that shaped medical and public health history
- Historical death toll or outbreak context
- One-click "Simulate This Virus" button that loads the simulator with that pathogen pre-selected and pre-configured

---

### Virus Profiles  HIV, Measles, Ebola

![Virus Profiles Bottom](./screenshots/09-virus-cards-2.png)

The lower half of the profiles section covers the remaining three pathogens. HIV's ~4.110 subs/site/year makes it the fastest-mutating pathogen in the simulator  its reverse transcriptase has no proofreading mechanism. Measles at ~0.910 is one of the most genetically stable RNA viruses known, which is why the 1960s vaccine still works today. Ebola's virulence tradeoff is reflected in its low branching factor.

---

### Real-World Impact

![Real World Impact](./screenshots/10-real-world-impact.png)

Three counter panels anchoring the simulation to real epidemiological consequences. These are not symbolic numbers  they represent direct applications of phylogenetic surveillance:

- **7M+ deaths** tracked via COVID-19 phylogenetics, enabling targeted vaccine reformulation (Omicron boosters were designed using variant trees)
- **40M+ lives impacted** by HIV mutation tracking that drives combination antiretroviral therapy selection, preventing resistance-induced treatment failure
- **500K deaths prevented annually** through influenza phylogenetic surveillance  the primary method by which WHO determines which strains go into each year's seasonal flu vaccine

---

### About  Algorithm Deep Dive

![About Section](./screenshots/11-about.png)

The About section exposes the full technical methodology: how the mutation engine computes fitness, how the D3 tree hierarchy is constructed from the strain map, what the transmissibility-virulence tradeoff equation looks like, and what the known limitations of the model are. Honest about what it is  a simplified model that still produces topologically accurate evolutionary patterns  and what future iterations could add.

---

### Footer

![Footer](./screenshots/12-footer.png)

Clean footer with methodology disclosure, GitHub and LinkedIn links, and an oversized watermark marquee  **MUTATIONPATH  VIRAL EVOLUTION SIMULATOR**  scrolling behind the content in the background.

---

## Virus Profiles

| Virus | Classification | Mutation Rate | Branching Factor | Sim Speed | Dominant Behavior |
|---|---|---|---|---|---|
| COVID-19 | Betacoronavirus / SARS-CoV-2 | ~110 subs/site/yr | 4 | Fast | Immune evasion sweeps |
| Influenza | Orthomyxovirus | ~410 subs/site/yr | 5 | Fast | Antigenic drift / shift |
| HIV | Lentivirus / HIV-1 | ~4.110 subs/site/yr | 6 | Extreme | Drug resistance evolution |
| Measles | Morbillivirus / MeV | ~0.910 subs/site/yr | 2 | Slow | Stable conserved lineages |
| Ebola | Filovirus / ZEBOV | ~1.210 subs/site/yr | 2 | Medium | Virulence-transmissibility tradeoff |
| Norovirus | Calicivirus / GII | ~4.510 subs/site/yr | 4 | Fast | Rapid spread, short-lived branches |

---

## How the Engine Works

### 1. Genome Representation

Each strain carries a 20-character synthetic genome string (characters: A, T, G, C). The root strain's genome is randomly generated at simulation start and saved globally as `rootGenome`  every Hamming distance and divergence calculation references this origin sequence throughout the run.

### 2. Mutation

Per replication, every genome character has a probability equal to `mutationRate` of being replaced by a randomly chosen different character. The positions that mutated are stored as an integer array on the strain object for display in the node tooltip and use in fitness scoring.

### 3. Fitness Scoring

Each strain receives a `FitnessScore` across three axes, then a weighted overall:

```
transmissibility    GC content of the genome + drift inherited from parent fitness
immuneEvasion       Hamming distance from rootGenome (more divergence = harder to recognize)
virulence           Inverse tradeoff with transmissibility

// Virulence-transmissibility tradeoff:
virulence += (1 - transmissibility) * 0.1 - transmissibility * 0.05;

// Weighted overall:
overall = transmissibility * 0.4 + immuneEvasion * 0.35 + virulence * 0.25

// Survival:
survived = overall > fitnessThreshold
```

Strains with `survived = false` are marked extinct. Survivors spawn up to `branchingFactor` child strains in the next generation.

### 4. Stochastic Branching Process

Each generation is a discrete time step, ticking every `generationInterval` milliseconds via `setInterval`. The simulation runs asynchronously, feeding updates back into React state on each tick. All data lives in a `Map<string, Strain>`  O(1) lookups for parent/child traversal, lineage computation, and stats calculation.

### 5. Phylogenetic Tree Rendering

The strain map is converted to a `d3.hierarchy()` structure, then laid out with `d3.tree()` using node sizes computed from the canvas container dimensions. Each node renders as an SVG `<circle>` with:

- Radius proportional to the strain's overall fitness score
- Fill color encoding the dominant fitness trait (cyan / green / red)
- SVG `feGaussianBlur` + `feComposite` composited filter for the neon glow
- Opacity reduced to ~0.35 for extinct strains; dashed stroke on extinct branch paths
- Framer Motion enter/exit transitions on each node

### 6. Lineage Highlighting

Clicking a node invokes `getLineage()`, which walks parent-pointer references up the strain map from the clicked strain to the root. The resulting ID array is passed to the SVG renderer, which identifies matching links and renders them at full opacity with 2 stroke width  tracing the evolutionary path visually.

---

## Project Structure

```
mutationpath/
 src/
    App.tsx                       # Root component  section assembly and app state
    main.tsx                      # React DOM entry point
    components/
       Hero.tsx                  # Particle canvas (requestAnimationFrame) + hero text
       WhatIsMutationPath.tsx    # Three-card concept explainer
       TheScience.tsx            # Science pillars + annotated tree legend
       Simulator.tsx             # Simulation orchestrator  owns all state
       ControlPanel.tsx          # Virus selector + sliders + start/pause/reset/export
       MutationTree.tsx          # D3 SVG phylogenetic tree renderer
       StatsPanel.tsx            # Animated real-time stat counters
       NodeTooltip.tsx           # Viewport-aware per-node inspection popup
       VirusProfiles.tsx         # Six virus profile card section
       VirusCard.tsx             # Individual virus data card component
       VirusIcons.tsx            # Custom SVG virus iconography (per pathogen)
       RealWorldImpact.tsx       # Animated epidemiological impact stats
       About.tsx                 # Algorithm methodology + limitations section
       Navbar.tsx                # Sticky floating pill navigation
       Footer.tsx                # Footer with links and marquee
       LoadingScreen.tsx         # GSAP-animated boot sequence
       CustomCursor.tsx          # Custom neon cursor
       MutationPathLogo.tsx      # Animated SVG logo component
    lib/
       mutationEngine.ts         # Core: mutations, fitness scoring, branching, stats
       genomeUtils.ts            # Genome gen, Hamming distance, GC content, trait colors
       treeLayout.ts             # D3 hierarchy construction + node/link visual props
       virusPresets.ts           # Per-virus simulation configs + scientific profile data
    types/
       index.ts                  # Strain, FitnessScore, SimulationConfig, TreeNode types
    styles/
        index.css                 # Tailwind base + global tokens
 screenshots/                      # All README screenshots
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

| Layer | Technology | Why |
|---|---|---|
| UI Framework | React 19 | Concurrent rendering keeps simulation updates non-blocking |
| Language | TypeScript 5.6 | Full type safety from engine types to component props |
| Build Tool | Vite 6 | Sub-second HMR during development, optimized production bundles |
| Styling | Tailwind CSS 3.4 | Utility-first, zero runtime; custom design tokens for neon palette |
| Tree Visualization | D3.js 7 | Industry-standard hierarchical layout and SVG rendering |
| Animations | Framer Motion 12 | Spring-physics section entrances and node lifecycle transitions |
| Timeline Animation | GSAP 3.12 | High-performance loading screen and hero sequencing |

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

1. **Choose a virus** from the left panel  each preset loads scientifically calibrated parameters
2. **Expand Advanced Controls** (optional) to manually override any parameter
3. **Click "Start Simulation"**  the phylogenetic tree begins growing immediately
4. **Interact with nodes**  click any node to inspect its genome, generation depth, fitness breakdown across all three axes, and mutation count
5. **Hover a node** to highlight its complete ancestral lineage traced back to the root strain
6. **Pause / Resume** at any generation to freeze and examine the current tree state
7. **Export** the full simulation dataset as JSON for offline analysis or comparison
8. **Reset** and run again  the stochastic engine guarantees every run produces a unique evolutionary history

---

## The Transmissibility-Virulence Tradeoff

One of the most important evolutionary constraints in virology: a virus that kills its host too quickly loses transmission opportunities. MutationPath models this explicitly in the fitness calculation:

```ts
virulence += (1 - transmissibility) * 0.1 - transmissibility * 0.05;
```

This is why **Ebola**, despite extreme virulence, generates short-lived narrow trees  it burns through hosts before they can pass it on. **Influenza** has evolved near-optimal balance: high transmissibility for global spread, low enough virulence to keep hosts mobile and infectious for days. **HIV** operates on a completely different axis: latency suppresses both virulence and immune detection while constant mutation ensures drug resistance compounds over time.

---

## Simulation Parameter Deep Dive

### Mutation Rate
Per-base substitution probability per replication cycle. HIV's real rate (~4.110) is among the highest of any pathogen  its reverse transcriptase has no proofreading. Measles (~0.910) is among the most genetically stable RNA viruses, which is why the vaccine from the 1960s still protects against all circulating strains.

### Fitness Threshold
The minimum weighted fitness score for survival. Low threshold  dense bushy trees with many survivors. High threshold  mass extinction events visible as entire generations dying off, with only one or two lineages persisting.

### Branching Factor
Maximum offspring per surviving strain each generation. HIV (6) generates explosive wide trees. Measles and Ebola (2) produce narrow, deep lineages reflecting real-world transmission bottlenecks.

### Generation Speed
Milliseconds between ticks. No effect on the biological simulation  only on observation speed. At 200ms the tree growth becomes hypnotic.

---

## Limitations and What Could Come Next

MutationPath is a simplified model that produces scientifically accurate phylogenetic topology but does not yet model:

- **Recombination**  RNA viruses can swap genome segments between co-infecting strains (influenza reassortment, HIV recombination)
- **Host immune dynamics**  as population-level immunity builds, the fitness landscape shifts, escalating pressure toward immune evasion variants
- **Geographic spread**  spatial modeling where transmission probability depends on host proximity and movement patterns
- **Real genome data**  integration with GISAID or GenBank to run the engine against actual variant sequences
- **Nextstrain comparison**  overlay the simulated tree over a downloaded real phylogeny to validate model accuracy
- **Per-site selection coefficients**  position-specific fitness weights mirroring known critical residues in real viral proteins (ACE2-binding domain in spike protein, etc.)

---

## License

MIT  see [LICENSE](./LICENSE) for full terms.

---

<div align="center">

Built by **Hakim Chouaib**  Future Health Informatics Expert

[![GitHub](https://img.shields.io/badge/GitHub-chouaibhakim76--ui-181717?style=flat-square&logo=github)](https://github.com/chouaibhakim76-ui)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-hakim--chouaib-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/hakim-chouaib/)

*Built at the intersection of biology, data science, and visual engineering.*

</div>
