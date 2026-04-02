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
  },
  {
    headline: 'HIV',
    stat: '40M+',
    statLabel: 'lives impacted by resistance tracking',
    description:
      'Mutation tracking reveals drug resistance patterns in real time, guiding antiretroviral therapy combinations and preventing treatment failure in millions of patients worldwide.',
    color: '#f43f5e',
  },
  {
    headline: 'Influenza',
    stat: '500K',
    statLabel: 'annual deaths prevented by vaccine design',
    description:
      'Every year, phylogenetic surveillance of influenza antigenic drift directly determines which strains go into seasonal flu vaccines — the largest application of viral phylogenetics.',
    color: '#39ff14',
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
    <div ref={ref} className="font-display text-5xl md:text-6xl font-bold">
      {display}{suffix}
    </div>
  );
}

export default function RealWorldImpact() {
  return (
    <section className="relative py-32 px-6">
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <span className="font-mono text-xs tracking-[0.3em] text-lime mb-4 block">
          WHY IT MATTERS
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Real-World Impact
        </h2>
        <p className="font-body text-text-secondary max-w-2xl mx-auto text-lg">
          Phylogenetic analysis isn't just academic — it directly saves lives
          by informing vaccine design, treatment protocols, and pandemic response.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto space-y-12">
        {impacts.map((item, i) => (
          <motion.div
            key={item.headline}
            className="glass rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
          >
            <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center">
              <div className="text-center md:text-left">
                <AnimatedCounter target={item.stat} />
                <div className="text-xs text-text-secondary mt-2" style={{ color: item.color }}>
                  {item.statLabel}
                </div>
              </div>
              <div>
                <h3
                  className="font-display text-2xl font-bold mb-3"
                  style={{ color: item.color }}
                >
                  {item.headline}
                </h3>
                <p className="font-body text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
