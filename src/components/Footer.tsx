import MutationPathLogo from './MutationPathLogo';

const TECH_STACK = [
  { label: 'React', color: '#61dafb' },
  { label: 'TypeScript', color: '#3b82f6' },
  { label: 'D3.js', color: '#f97316' },
  { label: 'Framer Motion', color: '#a855f7' },
  { label: 'Tailwind', color: '#38bdf8' },
  { label: 'Vite', color: '#fbbf24' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.05]">
      {/* Top glow line */}
      <div className="glow-line w-full" style={{ maxWidth: '100%' }} />

      {/* Marquee */}
      <div className="overflow-hidden py-10">
        <div className="flex whitespace-nowrap marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-6xl md:text-8xl font-black tracking-tighter text-white/[0.025] mx-4"
            >
              MUTATIONPATH • VIRAL EVOLUTION SIMULATOR • HEALTH INFORMATICS •{' '}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        {/* Main footer grid */}
        <div className="grid md:grid-cols-3 gap-10 items-start mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <MutationPathLogo size={24} showText={false} />
              <span className="font-display font-black text-sm tracking-wider">
                <span className="text-white">Mutation</span>
                <span className="bio-gradient-text">Path</span>
              </span>
            </div>
            <p className="font-body text-xs text-text-secondary leading-relaxed mb-4">
              Built by <span className="bio-gradient-text font-black">Hakim</span>
            </p>
            <p className="font-mono text-[10px] text-text-secondary/50 mb-5">
              Future Health Informatics Expert
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/chouaibhakim76-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] text-text-secondary hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/hakim-chouaib/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] text-text-secondary hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
            </div>
          </div>

          {/* Methodology */}
          <div>
            <h4 className="font-display text-xs tracking-[0.2em] text-text-secondary mb-4 uppercase">
              Data Methodology
            </h4>
            <p className="font-body text-xs text-text-secondary/55 leading-relaxed">
              Stochastic phylogenetic simulation with fitness landscape modeling.
              In silico viral evolution using configurable mutation rates, branching
              factors, and multi-axis fitness scoring across transmissibility,
              immune evasion, and virulence dimensions.
            </p>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="font-display text-xs tracking-[0.2em] text-text-secondary mb-4 uppercase">
              Built With
            </h4>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech.label}
                  className="font-mono text-[10px] px-2.5 py-1 rounded-lg tracking-wide"
                  style={{
                    background: `${tech.color}12`,
                    border: `1px solid ${tech.color}25`,
                    color: tech.color,
                  }}
                >
                  {tech.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="font-mono text-[10px] text-text-secondary/35 tracking-wider text-center">
            © {new Date().getFullYear()} MutationPath — All simulation data is computationally generated
          </p>
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#39ff14', boxShadow: '0 0 6px #39ff14' }}
            />
            <span className="font-mono text-[10px] text-lime/60 tracking-wider">LIVE SIMULATION ENGINE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
      {/* Marquee */}
      <div className="overflow-hidden mb-12">
        <div className="flex whitespace-nowrap marquee">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-6xl md:text-8xl font-bold tracking-tighter text-white/[0.03] mx-4"
            >
              MUTATIONPATH • VIRAL EVOLUTION SIMULATOR • HEALTH INFORMATICS RESEARCH •{' '}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MutationPathLogo size={22} showText={false} />
              <span className="font-display font-semibold text-sm tracking-wider">
                <span className="text-white">Mutation</span>
                <span className="bio-gradient-text">Path</span>
              </span>
            </div>
            <p className="font-body text-xs text-text-secondary leading-relaxed">
              Built by <span className="bio-gradient-text font-semibold">Hakim</span> — Future Health Informatics Expert
            </p>
          </div>

          {/* Methodology */}
          <div>
            <h4 className="font-display text-xs tracking-widest text-text-secondary mb-3">
              DATA METHODOLOGY
            </h4>
            <p className="font-body text-xs text-text-secondary/60 leading-relaxed">
              Stochastic phylogenetic simulation with fitness landscape modeling.
              In silico viral evolution using configurable mutation rates, branching
              factors, and multi-axis fitness scoring.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-6">
            <a
              href="https://github.com/chouaibhakim76-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-text-secondary hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/hakim-chouaib/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-text-secondary hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 text-center">
          <p className="font-mono text-[10px] text-text-secondary/40 tracking-wider">
            © {new Date().getFullYear()} MutationPath — Built by Hakim • Future Health Informatics Expert
          </p>
        </div>
      </div>
    </footer>
  );
}
