import { motion } from 'framer-motion';

const concepts = [
  {
    title: 'Mutation',
    description:
      'When viruses replicate, errors in genome copying create random point mutations. Most are neutral or harmful, but some give the virus new abilities.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="20" stroke="#00f0ff" strokeWidth="1" opacity="0.3" />
        <circle cx="24" cy="24" r="12" stroke="#00f0ff" strokeWidth="1.5" opacity="0.5" />
        <circle cx="24" cy="24" r="4" fill="#00f0ff" />
        <circle cx="15" cy="15" r="2" fill="#ff1744" opacity="0.8" />
        <circle cx="33" cy="18" r="1.5" fill="#39ff14" opacity="0.8" />
        <line x1="24" y1="12" x2="24" y2="4" stroke="#00f0ff" strokeWidth="0.8" opacity="0.4" />
        <line x1="36" y1="24" x2="44" y2="24" stroke="#00f0ff" strokeWidth="0.8" opacity="0.4" />
      </svg>
    ),
    color: '#00f0ff',
  },
  {
    title: 'Fitness',
    description:
      'Each mutation changes virus fitness — its ability to spread, evade immunity, and cause disease. Natural selection favors the fittest variants.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M4 40 L12 28 L20 32 L28 16 L36 20 L44 8" stroke="#39ff14" strokeWidth="1.5" opacity="0.6" />
        <circle cx="12" cy="28" r="2.5" fill="#39ff14" />
        <circle cx="28" cy="16" r="3" fill="#39ff14" />
        <circle cx="44" cy="8" r="3.5" fill="#39ff14" />
        <path d="M4 44 L44 44" stroke="#39ff14" strokeWidth="0.5" opacity="0.2" />
      </svg>
    ),
    color: '#39ff14',
  },
  {
    title: 'Phylogenetics',
    description:
      'By tracking mutations across generations, scientists build phylogenetic trees — visual maps of how variants emerge, spread, and sometimes die out.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <line x1="24" y1="44" x2="24" y2="30" stroke="#ff1744" strokeWidth="1.5" opacity="0.5" />
        <line x1="24" y1="30" x2="14" y2="20" stroke="#ff1744" strokeWidth="1" opacity="0.4" />
        <line x1="24" y1="30" x2="34" y2="20" stroke="#ff1744" strokeWidth="1" opacity="0.4" />
        <line x1="14" y1="20" x2="8" y2="10" stroke="#ff1744" strokeWidth="0.8" opacity="0.3" />
        <line x1="14" y1="20" x2="18" y2="10" stroke="#ff1744" strokeWidth="0.8" opacity="0.3" />
        <line x1="34" y1="20" x2="30" y2="10" stroke="#ff1744" strokeWidth="0.8" opacity="0.3" />
        <line x1="34" y1="20" x2="40" y2="10" stroke="#ff1744" strokeWidth="0.8" opacity="0.3" />
        <circle cx="24" cy="44" r="3.5" fill="#ff1744" />
        <circle cx="14" cy="20" r="2.5" fill="#ff1744" opacity="0.8" />
        <circle cx="34" cy="20" r="2.5" fill="#ff1744" opacity="0.8" />
        <circle cx="8" cy="10" r="2" fill="#ff1744" opacity="0.6" />
        <circle cx="18" cy="10" r="2" fill="#ff1744" opacity="0.6" />
        <circle cx="30" cy="10" r="2" fill="#ff1744" opacity="0.6" />
        <circle cx="40" cy="10" r="2" fill="#ff1744" opacity="0.6" />
      </svg>
    ),
    color: '#ff1744',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export default function WhatIsMutationPath() {
  return (
    <section className="relative py-32 px-6">
      {/* Section header */}
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-label text-cyan justify-center mb-4">
          UNDERSTANDING VIRAL EVOLUTION
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          What is <span className="bio-gradient-text">MutationPath?</span>
        </h2>
        <p className="font-body text-text-secondary max-w-2xl mx-auto text-lg">
          A real-time simulator that shows how viruses evolve through mutation,
          selection, and drift — the same forces that shape pandemics.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        {concepts.map((concept, i) => (
          <motion.div
            key={concept.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: '-50px' }}
            className="group relative rounded-2xl overflow-hidden transition-all duration-500 gloss-overlay"
            style={{
              background: `linear-gradient(160deg, ${concept.color}0e 0%, rgba(20,20,40,0.7) 60%, rgba(0,0,0,0.3) 100%)`,
              border: `1px solid ${concept.color}28`,
              borderTopColor: `${concept.color}45`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 ${concept.color}20`,
            }}
            whileHover={{ y: -12, boxShadow: `0 28px 70px rgba(0,0,0,0.55), 0 0 50px ${concept.color}18, inset 0 1px 0 ${concept.color}35` }}
          >
            {/* Top gradient border */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background: `linear-gradient(90deg, transparent, ${concept.color}90, transparent)`,
              }}
            />

            {/* Corner accent */}
            <div
              className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 100% 0%, ${concept.color}12 0%, transparent 70%)`,
              }}
            />

            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${concept.color}16 0%, transparent 65%)`,
              }}
            />

            <div className="relative z-10 p-8">
              {/* Icon container */}
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: `${concept.color}14`,
                  border: `1px solid ${concept.color}25`,
                  boxShadow: `0 0 24px ${concept.color}14`,
                }}
              >
                {concept.icon}
              </div>

              <h3
                className="font-display text-xl font-black mb-3"
                style={{ color: concept.color }}
              >
                {concept.title}
              </h3>
              <p className="font-body text-text-secondary text-sm leading-relaxed">
                {concept.description}
              </p>

              {/* Bottom accent */}
              <div
                className="mt-6 h-px"
                style={{ background: `linear-gradient(90deg, ${concept.color}40, transparent)` }}
              />

              {/* Hover read-more arrow */}
              <div
                className="mt-4 flex items-center gap-1.5 font-mono text-[10px] tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: concept.color }}
              >
                <span>LEARN MORE</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
