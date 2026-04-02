import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="font-mono text-xs tracking-[0.3em] text-purple-400 mb-4 block">
            ABOUT & METHODOLOGY
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Built by{' '}
            <span className="bio-gradient-text">Hakim</span>
          </h2>
          <p className="font-body text-lg text-text-secondary">
            Future Health Informatics Expert
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {[
            {
              color: '#00f0ff',
              title: 'Data Structures',
              colorClass: 'text-cyan',
              text: 'Each viral strain stores a 20-nucleotide genome, parent-child relationships, a multi-axis fitness score, and mutation history. The tree is maintained as a Map for O(1) lookups and rendered as a D3 hierarchy.',
            },
            {
              color: '#39ff14',
              title: 'Algorithm Design',
              colorClass: 'text-lime',
              text: 'A stochastic branching process with configurable mutation rates, fitness landscapes across three axes (transmissibility, immune evasion, virulence), and natural selection via fitness thresholds. Includes evolutionary tradeoffs between traits.',
            },
            {
              color: '#ff1744',
              title: 'Validation',
              colorClass: 'text-crimson',
              text: 'The algorithm produces phylogenetic patterns consistent with real-world observation: bushy trees for rapidly mutating viruses (HIV, COVID-19), ladder-like trees for conserved viruses (Measles), and realistic extinction rates across generations.',
            },
            {
              color: '#a855f7',
              title: 'Limitations & Future Work',
              colorClass: 'text-purple-400',
              text: 'This is a simplified model — real viral evolution involves recombination, host immune dynamics, and geographic spread. Future iterations could add spatial modeling, real genome data integration, and comparison with Nextstrain datasets.',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group relative rounded-xl p-6 overflow-hidden transition-all duration-400 hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${card.color}0a 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${card.color}18`,
                boxShadow: `0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 ${card.color}12`,
              }}
            >
              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, ${card.color}70, transparent)` }}
              />
              {/* Hover sheen */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${card.color}08 0%, transparent 60%)` }}
              />
              <div className="relative">
                <h4 className={`font-display font-semibold ${card.colorClass} mb-3`}>
                  {card.title}
                </h4>
                <p className="font-body text-sm text-text-secondary leading-relaxed">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="https://github.com/chouaibhakim76-ui"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass hover:bg-white/[0.06] transition-colors font-display text-sm tracking-wider text-text-secondary hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
