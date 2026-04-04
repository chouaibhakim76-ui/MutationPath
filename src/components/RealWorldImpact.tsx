import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const impacts = [
  {
    headline: 'COVID-19',
    stat: '7M+',
    statLabel: 'deaths tracked via phylogenetics',
    description:
      'Phylogenetic analysis identified the emergence of Delta from B.1.617.2 and tracked Omicron\'s explosive divergence — enabling targeted vaccine updates and travel policy decisions.',
    color: '#00f0ff',
    icon: (
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1" opacity="0.3" strokeDasharray="3 4" />
        <circle cx="24" cy="8" r="4" fill="currentColor" opacity="0.8" />
        <circle cx="24" cy="40" r="4" fill="currentColor" opacity="0.8" />
        <circle cx="8" cy="24" r="4" fill="currentColor" opacity="0.8" />
        <circle cx="40" cy="24" r="4" fill="currentColor" opacity="0.8" />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="36" cy="12" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="12" cy="36" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="36" cy="36" r="3" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    headline: 'HIV',
    stat: '40M+',
    statLabel: 'lives impacted by resistance tracking',
    description:
      'Mutation tracking reveals drug resistance patterns in real time, guiding antiretroviral therapy combinations and preventing treatment failure in millions of patients worldwide.',
    color: '#f43f5e',
    icon: (
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
        <path d="M24 4 L24 44" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M4 24 L44 24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
        <circle cx="24" cy="4" r="3" fill="currentColor" opacity="0.8" />
        <circle cx="24" cy="44" r="3" fill="currentColor" opacity="0.8" />
        <circle cx="4" cy="24" r="3" fill="currentColor" opacity="0.8" />
        <circle cx="44" cy="24" r="3" fill="currentColor" opacity="0.8" />
      </svg>
    ),
  },
  {
    headline: 'Influenza',
    stat: '500K',
    statLabel: 'annual deaths prevented by vaccine design',
    description:
      'Every year, phylogenetic surveillance of influenza antigenic drift directly determines which strains go into seasonal flu vaccines — the largest application of viral phylogenetics.',
    color: '#39ff14',
    icon: (
      <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="4" fill="currentColor" />
        <circle cx="24" cy="4" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="24" cy="44" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="4" cy="24" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="44" cy="24" r="3" fill="currentColor" opacity="0.6" />
        <line x1="24" y1="20" x2="24" y2="7" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="24" y1="28" x2="24" y2="41" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="20" y1="24" x2="7" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <line x1="28" y1="24" x2="41" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <circle cx="24" cy="24" r="14" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeDasharray="2 4" />
      </svg>
    ),
  },
];

function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const numericPart = parseFloat(target.replace(/[^0-9.]/g, ''));
          const suffixPart = target.replace(/[0-9.]/g, '');
          const duration = 2000;
          const start = performance.now();

          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = numericPart * eased;

            if (Number.isInteger(numericPart)) {
              setDisplay(Math.floor(current) + suffixPart);
            } else {
              setDisplay(current.toFixed(1) + suffixPart);
            }

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplay(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="font-display text-5xl md:text-6xl font-black tabular-nums">
      {display}{suffix}
    </div>
  );
}

export default function RealWorldImpact() {
  return (
    <section className="relative py-32 px-6">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(57,255,20,0.04) 0%, transparent 70%)' }}
      />

      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <div className="section-label text-lime justify-center mb-4">
          WHY IT MATTERS
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Real-World <span className="bio-gradient-text">Impact</span>
        </h2>
        <p className="font-body text-text-secondary max-w-2xl mx-auto text-lg">
          Phylogenetic analysis isn't just academic — it directly saves lives
          by informing vaccine design, treatment protocols, and pandemic response.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-6">
        {impacts.map((item, i) => (
          <motion.div
            key={item.headline}
            className="impact-card overflow-hidden gloss-overlay"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            style={{
              background: `linear-gradient(135deg, ${item.color}0e 0%, rgba(10,10,24,0.95) 100%)`,
              border: `1px solid ${item.color}28`,
              borderTopColor: `${item.color}50`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 ${item.color}22`,
            }}
            whileHover={{ y: -4, boxShadow: `0 20px 70px rgba(0,0,0,0.55), 0 0 50px ${item.color}18, inset 0 1px 0 ${item.color}38` }}
          >
            {/* Top shimmer line */}
            <div
              className="h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent 0%, ${item.color}80 50%, transparent 100%)` }}
            />

            <div className="p-8 md:p-10">
              <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
                {/* Left — stat + icon */}
                <div className="flex md:flex-col items-center md:items-start gap-6 md:gap-3 md:min-w-[180px]">
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-2xl"
                    style={{
                      background: `${item.color}14`,
                      border: `1px solid ${item.color}28`,
                      color: item.color,
                      boxShadow: `0 0 20px ${item.color}20`,
                    }}
                  >
                    {item.icon}
                  </div>
                  {/* Big animated number */}
                  <div>
                    <div style={{ color: item.color, textShadow: `0 0 30px ${item.color}80, 0 0 60px ${item.color}40` }}>
                      <AnimatedCounter target={item.stat} />
                    </div>
                    <div
                      className="text-xs mt-1 font-mono tracking-wide max-w-[150px]"
                      style={{ color: `${item.color}99` }}
                    >
                      {item.statLabel}
                    </div>
                  </div>
                </div>

                {/* Right — text */}
                <div>
                  <h3
                    className="font-display text-2xl font-black mb-3"
                    style={{ color: item.color }}
                  >
                    {item.headline}
                  </h3>
                  <p className="font-body text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
