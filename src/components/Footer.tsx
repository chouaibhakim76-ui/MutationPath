import MutationPathLogo from './MutationPathLogo';

export default function Footer() {
  return (
    <footer className="relative py-16 border-t border-white/5">
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
