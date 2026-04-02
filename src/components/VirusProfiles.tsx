import { motion } from 'framer-motion';
import { VirusType } from '../types';
import { VIRUS_INFO } from '../lib/virusPresets';
import { VIRUS_ICONS } from './VirusIcons';

const VIRUS_LIST: VirusType[] = [
  'covid19', 'influenza', 'hiv', 'measles', 'ebola', 'norovirus',
];

export default function VirusProfiles() {
  return (
    <section id="viruses" className="relative py-32 px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <span className="font-mono text-xs tracking-[0.3em] text-crimson mb-4 block">
          PATHOGEN DATABASE
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Six Pathogens. Six Evolutionary Stories.
        </h2>
        <p className="font-body text-text-secondary max-w-xl mx-auto">
          Each virus has a unique evolutionary strategy shaped by mutation rate, host dynamics, and selection pressure.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-6">
        {VIRUS_LIST.map((type, i) => {
          const info = VIRUS_INFO[type];
          const IconComponent = VIRUS_ICONS[type];
          return (
            <motion.div
              key={type}
              className="group relative rounded-2xl p-8 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              style={{
                background: `linear-gradient(135deg, ${info.color}08 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${info.color}18`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 ${info.color}12`,
              }}
              whileHover={{ y: -4, boxShadow: `0 12px 40px rgba(0,0,0,0.4), 0 0 30px ${info.color}12, inset 0 1px 0 ${info.color}20` }}
            >
              {/* Accent line */}
              <div
                className="absolute left-0 top-0 w-[3px] h-full transition-all duration-500 group-hover:w-[5px]"
                style={{ background: `linear-gradient(180deg, ${info.color}, ${info.color}50)`, boxShadow: `2px 0 12px ${info.color}40` }}
              />

              {/* Top shimmer */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${info.color}40, transparent)` }}
              />

              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 100% 0%, ${info.color}0a 0%, transparent 60%)` }}
              />

              <div className="grid md:grid-cols-[1fr_auto] gap-6 items-center relative">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="rounded-xl flex items-center justify-center"
                      style={{
                        width: 52,
                        height: 52,
                        background: `${info.color}08`,
                        border: `1px solid ${info.color}15`,
                      }}
                    >
                      {IconComponent && <IconComponent size={40} color={info.color} />}
                    </div>
                    <div>
                      <h3
                        className="font-display text-2xl font-bold"
                        style={{ color: info.color }}
                      >
                        {info.name}
                      </h3>
                      <p className="font-mono text-xs text-text-secondary tracking-wide">
                        {info.classification}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-[10px] tracking-widest text-text-secondary mb-1 uppercase">
                        Real Mutation Rate
                      </div>
                      <div className="font-mono text-sm" style={{ color: info.color }}>
                        {info.realMutationRate}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] tracking-widest text-text-secondary mb-1 uppercase">
                        Notable Variants
                      </div>
                      <div className="font-body text-sm text-text-primary">
                        {info.famousVariants}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-[10px] tracking-widest text-text-secondary mb-1 uppercase">
                        Historical Impact
                      </div>
                      <div className="font-body text-sm text-text-primary">
                        {info.historicalImpact}
                      </div>
                    </div>
                  </div>
                </div>

                <a
                  href="#simulator"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full font-display text-xs tracking-wider whitespace-nowrap btn-3d"
                  style={{
                    background: `${info.color}10`,
                    color: info.color,
                    border: `1px solid ${info.color}30`,
                  }}
                >
                  Simulate This Virus
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
