import { motion } from 'framer-motion';

export default function TheScience() {
  return (
    <section id="science" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left - Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-xs tracking-[0.3em] text-lime mb-4 block">
            THE METHODOLOGY
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
            Real Science,{' '}
            <span className="bio-gradient-text">In Your Browser</span>
          </h2>

          <div className="space-y-6">
            <div className="glass rounded-xl p-5">
              <h4 className="font-display font-semibold text-cyan mb-2">
                Stochastic Branching Process
              </h4>
              <p className="font-body text-text-secondary text-sm leading-relaxed">
                Each viral generation produces offspring with random mutations.
                Survival probability depends on fitness — mirroring real
                evolutionary dynamics used in epidemiological modeling.
              </p>
            </div>

            <div className="glass rounded-xl p-5">
              <h4 className="font-display font-semibold text-lime mb-2">
                Fitness Landscape
              </h4>
              <p className="font-body text-text-secondary text-sm leading-relaxed">
                Three fitness axes — transmissibility, immune evasion, virulence —
                create a multidimensional landscape. Mutations navigate this
                landscape, and only the fittest strains persist.
              </p>
            </div>

            <div className="glass rounded-xl p-5">
              <h4 className="font-display font-semibold text-crimson mb-2">
                In Silico Simulation
              </h4>
              <p className="font-body text-text-secondary text-sm leading-relaxed">
                This is a legitimate research methodology. Computational models
                allow researchers to explore evolutionary dynamics that would be
                impossible to study ethically in vivo.
              </p>
            </div>

            <div className="glass rounded-xl p-5">
              <h4 className="font-display font-semibold text-purple-400 mb-2">
                Validated Patterns
              </h4>
              <p className="font-body text-text-secondary text-sm leading-relaxed">
                The algorithm produces phylogenetic patterns consistent with real
                viral evolution — bushy trees for fast-mutating viruses like HIV,
                ladder-like trees for conserved viruses like Measles.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right - Tree anatomy diagram */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-md">
            <svg viewBox="0 0 400 500" className="w-full h-auto">
              {/* Background glow */}
              <defs>
                <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <filter id="glow-filter">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="400" height="500" fill="url(#bg-glow)" />

              {/* Tree structure */}
              {/* Root */}
              <line x1="200" y1="450" x2="200" y2="350" stroke="#00f0ff" strokeWidth="2" opacity="0.5" />
              {/* Gen 1 branches */}
              <line x1="200" y1="350" x2="120" y2="270" stroke="#00f0ff" strokeWidth="1.5" opacity="0.4" />
              <line x1="200" y1="350" x2="280" y2="270" stroke="#39ff14" strokeWidth="1.5" opacity="0.4" />
              {/* Gen 2 branches */}
              <line x1="120" y1="270" x2="70" y2="190" stroke="#00f0ff" strokeWidth="1" opacity="0.3" />
              <line x1="120" y1="270" x2="150" y2="190" stroke="#ff1744" strokeWidth="1" opacity="0.3" />
              <line x1="280" y1="270" x2="250" y2="190" stroke="#39ff14" strokeWidth="1" opacity="0.3" />
              <line x1="280" y1="270" x2="320" y2="190" stroke="#39ff14" strokeWidth="1" opacity="0.3" />
              {/* Gen 3 */}
              <line x1="70" y1="190" x2="40" y2="120" stroke="#00f0ff" strokeWidth="0.8" opacity="0.25" />
              <line x1="70" y1="190" x2="90" y2="120" stroke="#6366f1" strokeWidth="0.8" opacity="0.15" />
              <line x1="320" y1="190" x2="350" y2="120" stroke="#39ff14" strokeWidth="0.8" opacity="0.25" />
              <line x1="250" y1="190" x2="240" y2="120" stroke="#39ff14" strokeWidth="0.8" opacity="0.25" />

              {/* Nodes */}
              <circle cx="200" cy="450" r="10" fill="#00f0ff" filter="url(#glow-filter)" opacity="0.9" />
              <circle cx="200" cy="350" r="6" fill="#00f0ff" filter="url(#glow-filter)" opacity="0.7" />
              <circle cx="120" cy="270" r="5" fill="#00f0ff" opacity="0.7" />
              <circle cx="280" cy="270" r="6" fill="#39ff14" opacity="0.7" />
              <circle cx="70" cy="190" r="4.5" fill="#00f0ff" opacity="0.6" />
              <circle cx="150" cy="190" r="4" fill="#ff1744" opacity="0.6" />
              <circle cx="250" cy="190" r="5" fill="#39ff14" opacity="0.6" />
              <circle cx="320" cy="190" r="5.5" fill="#39ff14" opacity="0.6" />
              <circle cx="40" cy="120" r="3.5" fill="#00f0ff" opacity="0.5" />
              <circle cx="90" cy="120" r="3" fill="#6366f1" opacity="0.2" />
              <circle cx="350" cy="120" r="4" fill="#39ff14" opacity="0.5" />
              <circle cx="240" cy="120" r="3.5" fill="#39ff14" opacity="0.5" />

              {/* Labels */}
              <text x="215" y="455" fill="#e0e0ec" fontSize="11" fontFamily="Space Grotesk" opacity="0.7">Root Strain</text>
              <text x="295" y="275" fill="#e0e0ec" fontSize="10" fontFamily="Space Grotesk" opacity="0.5">Internal Node</text>
              <text x="100" y="120" fill="#e0e0ec" fontSize="10" fontFamily="Space Grotesk" opacity="0.3">Extinct ✕</text>
              <text x="355" y="125" fill="#e0e0ec" fontSize="10" fontFamily="Space Grotesk" opacity="0.5">Leaf (Active)</text>

              {/* Annotation lines */}
              <line x1="200" y1="380" x2="240" y2="390" stroke="#e0e0ec" strokeWidth="0.5" opacity="0.2" strokeDasharray="2,2" />
              <text x="245" y="395" fill="#e0e0ec" fontSize="9" fontFamily="Inter" opacity="0.3">Branch = mutation distance</text>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
