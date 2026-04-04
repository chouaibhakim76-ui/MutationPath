import { motion } from 'framer-motion';
import { VirusType } from '../types';
import { VIRUS_INFO } from '../lib/virusPresets';
import { VIRUS_ICONS } from './VirusIcons';

const VIRUS_LIST: VirusType[] = [
  'covid19', 'influenza', 'hiv', 'measles', 'ebola', 'norovirus',
];

const FITNESS_PROFILES: Record<VirusType, { transmissibility: number; immuneEvasion: number; virulence: number }> = {
  covid19:    { transmissibility: 82, immuneEvasion: 91, virulence: 38 },
  influenza:  { transmissibility: 78, immuneEvasion: 68, virulence: 25 },
  hiv:        { transmissibility: 28, immuneEvasion: 96, virulence: 58 },
  measles:    { transmissibility: 97, immuneEvasion: 12, virulence: 22 },
  ebola:      { transmissibility: 22, immuneEvasion: 8,  virulence: 94 },
  norovirus:  { transmissibility: 88, immuneEvasion: 38, virulence: 10 },
};

function FitnessBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] tracking-widest text-text-secondary uppercase">{label}</span>
        <span className="font-mono text-[11px]" style={{ color }}>{value}%</span>
      </div>
      <div className="fitness-bar-track">
        <motion.div
          className="fitness-bar-fill"
          style={{ background: `linear-gradient(90deg, ${color}90, ${color})`, width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        />
      </div>
    </div>
  );
}

export default function VirusProfiles() {
  return (
    <section id="viruses" className="relative py-32 px-6">
      {/* Section ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,23,68,0.04) 0%, transparent 70%)' }}
      />

      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-label text-crimson justify-center mb-4">
          PATHOGEN DATABASE
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Six Pathogens.{' '}
          <span className="bio-gradient-text">Six Evolutionary Stories.</span>
        </h2>
        <p className="font-body text-text-secondary max-w-xl mx-auto">
          Each virus has a unique evolutionary strategy shaped by mutation rate, host dynamics, and selection pressure.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-5">
        {VIRUS_LIST.map((type, i) => {
          const info = VIRUS_INFO[type];
          const IconComponent = VIRUS_ICONS[type];
          const fitness = FITNESS_PROFILES[type];
          return (
            <motion.div
              key={type}
              className="group relative rounded-2xl p-7 transition-all duration-500 overflow-hidden"
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              style={{
                background: `linear-gradient(135deg, ${info.color}09 0%, rgba(255,255,255,0.02) 100%)`,
                border: `1px solid ${info.color}20`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 ${info.color}12`,
              }}
              whileHover={{ y: -4, boxShadow: `0 16px 48px rgba(0,0,0,0.5), 0 0 32px ${info.color}14, inset 0 1px 0 ${info.color}22` }}
            >
              {/* Accent line */}
              <div
                className="absolute left-0 top-0 w-[3px] h-full transition-all duration-500 group-hover:w-[5px]"
                style={{ background: `linear-gradient(180deg, ${info.color}, ${info.color}50)`, boxShadow: `2px 0 14px ${info.color}50` }}
              />
              {/* Top shimmer */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${info.color}50, transparent)` }}
              />
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 100% 0%, ${info.color}0c 0%, transparent 60%)` }}
              />

              <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start relative">
                <div>
                  {/* Header row */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105"
                      style={{
                        width: 52, height: 52,
                        background: `${info.color}0e`,
                        border: `1px solid ${info.color}20`,
                        boxShadow: `0 0 16px ${info.color}18`,
                      }}
                    >
                      {IconComponent && <IconComponent size={40} color={info.color} />}
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-black" style={{ color: info.color }}>
                        {info.name}
                      </h3>
                      <p className="font-mono text-xs text-text-secondary tracking-wide">{info.classification}</p>
                    </div>
                    <span
                      className="speed-badge ml-auto hidden sm:block"
                      style={{
                        background: `${info.color}14`,
                        border: `1px solid ${info.color}28`,
                        color: info.color,
                      }}
                    >
                      {info.speed}
                    </span>
                  </div>

                  {/* Info grid */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    <div>
                      <div className="text-[10px] tracking-widest text-text-secondary mb-1 uppercase">Mutation Rate</div>
                      <div className="font-mono text-sm" style={{ color: info.color }}>{info.realMutationRate}</div>
                    </div>
                    <div>
                      <div className="text-[10px] tracking-widest text-text-secondary mb-1 uppercase">Notable Variants</div>
                      <div className="font-body text-sm text-text-primary">{info.famousVariants}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-[10px] tracking-widest text-text-secondary mb-1 uppercase">Historical Impact</div>
                      <div className="font-body text-sm text-text-primary">{info.historicalImpact}</div>
                    </div>
                  </div>

                  {/* Fitness bars */}
                  <div
                    className="rounded-xl p-4 space-y-3"
                    style={{
                      background: 'rgba(0,0,0,0.25)',
                      border: `1px solid ${info.color}10`,
                    }}
                  >
                    <div className="text-[9px] tracking-[0.2em] text-text-secondary mb-2 uppercase">Fitness Profile</div>
                    <FitnessBar label="Transmissibility" value={fitness.transmissibility} color={info.color} />
                    <FitnessBar label="Immune Evasion" value={fitness.immuneEvasion} color={info.color} />
                    <FitnessBar label="Virulence" value={fitness.virulence} color={info.color} />
                  </div>
                </div>

                {/* Simulate button */}
                <div className="flex md:flex-col items-start justify-start md:pt-1">
                  <a
                    href="#simulator"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-display font-semibold text-xs tracking-wider whitespace-nowrap btn-3d"
                    style={{
                      background: `${info.color}14`,
                      color: info.color,
                      border: `1px solid ${info.color}32`,
                      boxShadow: `0 4px 16px ${info.color}18`,
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                    Simulate
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
