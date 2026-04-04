import { motion } from 'framer-motion';

export default function TheScience() {
  return (
    <section id="science" className="relative py-32 px-6">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(57,255,20,0.04) 0%, transparent 70%)' }}
      />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left - Text */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <div className="section-label text-lime mb-4">
            THE METHODOLOGY
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-8">
            Real Science,{' '}
            <span className="bio-gradient-text">In Your Browser</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                color: '#00f0ff',
                colorClass: 'text-cyan',
                label: '01',
                title: 'Stochastic Branching Process',
                body: 'Each viral generation produces offspring with random mutations. Survival probability depends on fitness â€” mirroring real evolutionary dynamics used in epidemiological modeling.',
              },
              {
                color: '#39ff14',
                colorClass: 'text-lime',
                label: '02',
                title: 'Fitness Landscape',
                body: 'Three fitness axes â€” transmissibility, immune evasion, virulence â€” create a multidimensional landscape. Mutations navigate this landscape, and only the fittest strains persist.',
              },
              {
                color: '#ff1744',
                colorClass: 'text-crimson',
                label: '03',
                title: 'In Silico Simulation',
                body: 'This is a legitimate research methodology. Computational models allow researchers to explore evolutionary dynamics that would be impossible to study ethically in vivo.',
              },
              {
                color: '#a855f7',
                colorClass: 'text-purple-400',
                label: '04',
                title: 'Validated Patterns',
                body: 'The algorithm produces phylogenetic patterns consistent with real viral evolution â€” bushy trees for fast-mutating viruses like HIV, ladder-like trees for conserved viruses like Measles.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="group relative rounded-xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${card.color}0c 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${card.color}20`,
                  boxShadow: `0 2px 12px rgba(0,0,0,0.2), inset 0 1px 0 ${card.color}12`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, ${card.color}50, transparent)` }} />
                <div className="flex items-start gap-4">
                  <span
                    className="font-mono text-xs flex-shrink-0 mt-0.5 opacity-50"
                    style={{ color: card.color }}
                  >
                    {card.label}
                  </span>
                  <div>
                    <h4 className={`font-display font-black text-sm mb-1.5 ${card.colorClass}`}>
                      {card.title}
                    </h4>
                    <p className="font-body text-text-secondary text-sm leading-relaxed">
                      {card.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right - Animated tree anatomy diagram */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <div
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(8,8,20,0.6)',
              border: '1px solid rgba(0,240,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Header bar */}
            <div
              className="flex items-center gap-2 px-4 py-3"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff1744', boxShadow: '0 0 6px #ff174460' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#f59e0b', boxShadow: '0 0 6px #f59e0b60' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#39ff14', boxShadow: '0 0 6px #39ff1460' }} />
              <span className="font-mono text-[10px] text-text-secondary ml-2 tracking-wider">phylo-tree-anatomy.svg</span>
            </div>

            <svg viewBox="0 0 400 480" className="w-full h-auto p-2">
              <defs>
                <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <filter id="glow-filter">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-soft">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect width="400" height="480" fill="url(#bg-glow)" />

              {/* Subtle grid */}
              <line x1="0" y1="130" x2="400" y2="130" stroke="rgba(255,255,255,0.025)" strokeWidth="1" strokeDasharray="3 8" />
              <line x1="0" y1="220" x2="400" y2="220" stroke="rgba(255,255,255,0.025)" strokeWidth="1" strokeDasharray="3 8" />
              <line x1="0" y1="310" x2="400" y2="310" stroke="rgba(255,255,255,0.025)" strokeWidth="1" strokeDasharray="3 8" />
              <line x1="0" y1="400" x2="400" y2="400" stroke="rgba(255,255,255,0.025)" strokeWidth="1" strokeDasharray="3 8" />

              {/* Gen labels */}
              <text x="14" y="55" fill="rgba(0,240,255,0.3)" fontSize="9" fontFamily="monospace" letterSpacing="1">GEN 0</text>
              <text x="14" y="145" fill="rgba(0,240,255,0.2)" fontSize="9" fontFamily="monospace" letterSpacing="1">GEN 1</text>
              <text x="14" y="235" fill="rgba(0,240,255,0.16)" fontSize="9" fontFamily="monospace" letterSpacing="1">GEN 2</text>
              <text x="14" y="325" fill="rgba(0,240,255,0.12)" fontSize="9" fontFamily="monospace" letterSpacing="1">GEN 3</text>
              <text x="14" y="415" fill="rgba(0,240,255,0.09)" fontSize="9" fontFamily="monospace" letterSpacing="1">GEN 4</text>

              {/* Tree branches */}
              <line x1="200" y1="420" x2="200" y2="380" stroke="#00f0ff" strokeWidth="1.5" opacity="0.35" />
              <line x1="200" y1="380" x2="120" y2="300" stroke="#00f0ff" strokeWidth="1.2" opacity="0.3" />
              <line x1="200" y1="380" x2="280" y2="300" stroke="#39ff14" strokeWidth="1.2" opacity="0.3" />
              <line x1="120" y1="300" x2="70" y2="220" stroke="#00f0ff" strokeWidth="1" opacity="0.25" />
              <line x1="120" y1="300" x2="150" y2="220" stroke="#ff1744" strokeWidth="1" opacity="0.22" />
              <line x1="280" y1="300" x2="250" y2="220" stroke="#39ff14" strokeWidth="1" opacity="0.25" />
              <line x1="280" y1="300" x2="320" y2="220" stroke="#39ff14" strokeWidth="1" opacity="0.25" />
              <line x1="70" y1="220" x2="40" y2="140" stroke="#00f0ff" strokeWidth="0.8" opacity="0.2" />
              <line x1="70" y1="220" x2="90" y2="140" stroke="#6366f1" strokeWidth="0.8" opacity="0.12" />
              <line x1="320" y1="220" x2="355" y2="140" stroke="#39ff14" strokeWidth="0.8" opacity="0.2" />
              <line x1="250" y1="220" x2="240" y2="140" stroke="#39ff14" strokeWidth="0.8" opacity="0.2" />
              <line x1="40" y1="140" x2="30" y2="60" stroke="#00f0ff" strokeWidth="0.6" opacity="0.15" />
              <line x1="355" y1="140" x2="365" y2="60" stroke="#39ff14" strokeWidth="0.6" opacity="0.15" />
              <line x1="240" y1="140" x2="235" y2="60" stroke="#39ff14" strokeWidth="0.6" opacity="0.15" />

              {/* Root node â€” animated pulse */}
              <circle cx="200" cy="420" r="16" fill="#00f0ff" opacity="0.08" className="node-pulse" />
              <circle cx="200" cy="420" r="9" fill="#00f0ff" opacity="0.9" filter="url(#glow-filter)" />
              {/* Gen 1 */}
              <circle cx="120" cy="300" r="6" fill="#00f0ff" opacity="0.75" filter="url(#glow-soft)" />
              <circle cx="280" cy="300" r="7" fill="#39ff14" opacity="0.75" filter="url(#glow-soft)" />
              {/* Gen 2 */}
              <circle cx="70" cy="220" r="5" fill="#00f0ff" opacity="0.65" />
              <circle cx="150" cy="220" r="4.5" fill="#ff1744" opacity="0.65" />
              <circle cx="250" cy="220" r="5.5" fill="#39ff14" opacity="0.65" />
              <circle cx="320" cy="220" r="6" fill="#39ff14" opacity="0.65" />
              {/* Gen 3 */}
              <circle cx="40" cy="140" r="4" fill="#00f0ff" opacity="0.55" />
              <circle cx="90" cy="140" r="3.5" fill="#6366f1" opacity="0.18" />
              <circle cx="240" cy="140" r="4.5" fill="#39ff14" opacity="0.55" />
              <circle cx="355" cy="140" r="5" fill="#39ff14" opacity="0.55" />
              {/* Gen 4 leaves */}
              <circle cx="30" cy="60" r="3.5" fill="#00f0ff" opacity="0.45" />
              <circle cx="235" cy="60" r="4" fill="#39ff14" opacity="0.45" />
              <circle cx="365" cy="60" r="4.5" fill="#39ff14" opacity="0.45" />

              {/* Annotation callouts */}
              <line x1="200" y1="408" x2="240" y2="395" stroke="#e0e0ec" strokeWidth="0.4" opacity="0.15" strokeDasharray="2,3" />
              <text x="245" y="392" fill="#e0e0ec" fontSize="9" fontFamily="Inter" opacity="0.3">Root Strain</text>

              <line x1="150" y1="218" x2="175" y2="205" stroke="#ff1744" strokeWidth="0.4" opacity="0.25" strokeDasharray="2,3" />
              <text x="180" y="203" fill="#ff1744" fontSize="9" fontFamily="Inter" opacity="0.45">Extinct variant</text>

              <line x1="320" y1="216" x2="350" y2="203" stroke="#e0e0ec" strokeWidth="0.4" opacity="0.15" strokeDasharray="2,3" />
              <text x="355" y="201" fill="#e0e0ec" fontSize="9" fontFamily="Inter" opacity="0.28">Dominant clade</text>

              <line x1="40" y1="128" x2="13" y2="115" stroke="#e0e0ec" strokeWidth="0.4" opacity="0.12" strokeDasharray="2,3" />
              <text x="50" y="455" fill="#e0e0ec" fontSize="9" fontFamily="Inter" opacity="0.2">Branch âˆ mutation distance</text>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}