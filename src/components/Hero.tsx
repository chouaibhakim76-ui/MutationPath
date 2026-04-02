import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle system background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      color: string;
      alpha: number;
      life: number;
      maxLife: number;
    }

    const colors = ['#00f0ff', '#39ff14', '#ff1744', '#6366f1', '#a855f7'];
    const particles: Particle[] = [];

    const createParticle = (): Particle => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * 2.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 0.1 + Math.random() * 0.5,
      life: 0,
      maxLife: 300 + Math.random() * 400,
    });

    for (let i = 0; i < 80; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        const fade = lifeRatio < 0.1 ? lifeRatio / 0.1
          : lifeRatio > 0.9 ? (1 - lifeRatio) / 0.1
          : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * fade;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.globalAlpha = p.alpha * fade * 0.15;
        ctx.fill();

        if (p.life >= p.maxLife) {
          particles[i] = createParticle();
        }
      }

      ctx.globalAlpha = 1;

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = (1 - dist / 120) * 0.06;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const headline = 'Evolution, rendered in real time.';
  const words = headline.split(' ');

  // Calculate cumulative char offset for animation delay per word
  let charOffset = 0;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, #060610 70%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
        {/* Left */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            <span className="font-mono text-xs text-text-secondary tracking-wider">
              PHYLOGENETIC SIMULATION ENGINE
            </span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
            {words.map((word, wi) => {
              const delay = 0.8 + charOffset * 0.04;
              charOffset += word.length + 1; // +1 for the space
              return (
                <motion.span
                  key={wi}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ display: 'inline-block', marginRight: '0.25em', whiteSpace: 'nowrap' }}
                >
                  {word}
                </motion.span>
              );
            })}
          </h1>

          <motion.p
            className="font-body text-lg text-text-secondary max-w-xl mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            Watch how viruses evolve across populations through real-time stochastic
            simulation. A phylogenetic tree grows before your eyes, branch by branch,
            mutation by mutation.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.8 }}
          >
            <a
              href="#simulator"
              className="group relative px-8 py-3.5 rounded-full font-display font-semibold text-sm tracking-wider text-void overflow-hidden"
            >
              <div className="absolute inset-0 bio-gradient transition-all group-hover:brightness-110" />
              <span className="relative z-10 flex items-center gap-2">
                Start Simulation
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>
            <a
              href="#science"
              className="px-8 py-3.5 rounded-full font-display font-semibold text-sm tracking-wider text-text-secondary glass hover:text-white transition-colors"
            >
              Learn the Science
            </a>
          </motion.div>
        </div>

        {/* Right - Mini tree preview */}
        <motion.div
          className="flex-1 hidden lg:flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-80 h-80">
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {/* Static preview tree — top-down phylogenetic */}
              <defs>
                <radialGradient id="glow-cyan" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="glow-green" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#39ff14" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#39ff14" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="glow-red" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff1744" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#ff1744" stopOpacity="0" />
                </radialGradient>
                <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Generation guide lines */}
              <line x1="30" y1="40" x2="270" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8" />
              <line x1="30" y1="110" x2="270" y2="110" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8" />
              <line x1="30" y1="180" x2="270" y2="180" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8" />
              <line x1="30" y1="250" x2="270" y2="250" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="4 8" />

              {/* S-curve branches — root at top, branches downward */}
              <path d="M150,40 C150,75 100,75 100,110" stroke="#00f0ff" strokeWidth="1.5" opacity="0.4" fill="none" />
              <path d="M150,40 C150,75 200,75 200,110" stroke="#39ff14" strokeWidth="1.5" opacity="0.4" fill="none" />
              <path d="M100,110 C100,145 60,145 60,180" stroke="#00f0ff" strokeWidth="1" opacity="0.3" fill="none" />
              <path d="M100,110 C100,145 130,145 130,180" stroke="#ff1744" strokeWidth="1" opacity="0.3" fill="none" />
              <path d="M200,110 C200,145 170,145 170,180" stroke="#39ff14" strokeWidth="1" opacity="0.3" fill="none" />
              <path d="M200,110 C200,145 240,145 240,180" stroke="#39ff14" strokeWidth="1" opacity="0.3" fill="none" />
              <path d="M60,180 C60,215 40,215 40,250" stroke="#00f0ff" strokeWidth="0.8" opacity="0.2" fill="none" />
              <path d="M60,180 C60,215 80,215 80,250" stroke="#6366f1" strokeWidth="0.8" opacity="0.15" fill="none" />
              <path d="M240,180 C240,215 220,215 220,250" stroke="#39ff14" strokeWidth="0.8" opacity="0.2" fill="none" />
              <path d="M240,180 C240,215 260,215 260,250" stroke="#39ff14" strokeWidth="0.8" opacity="0.2" fill="none" />
              <path d="M170,180 C170,215 155,215 155,250" stroke="#39ff14" strokeWidth="0.8" opacity="0.2" fill="none" />

              {/* Root — Gen 0 (top) */}
              <circle cx="150" cy="40" r="18" fill="url(#glow-cyan)" className="node-pulse" />
              <circle cx="150" cy="40" r="7" fill="#00f0ff" filter="url(#hero-glow)" />

              {/* Gen 1 */}
              <circle cx="100" cy="110" r="12" fill="url(#glow-cyan)" />
              <circle cx="100" cy="110" r="5" fill="#00f0ff" />
              <circle cx="200" cy="110" r="12" fill="url(#glow-green)" />
              <circle cx="200" cy="110" r="5" fill="#39ff14" />

              {/* Gen 2 */}
              <circle cx="60" cy="180" r="9" fill="url(#glow-cyan)" />
              <circle cx="60" cy="180" r="3.5" fill="#00f0ff" />
              <circle cx="130" cy="180" r="7" fill="url(#glow-red)" />
              <circle cx="130" cy="180" r="3" fill="#ff1744" />
              <circle cx="170" cy="180" r="9" fill="url(#glow-green)" />
              <circle cx="170" cy="180" r="3.5" fill="#39ff14" />
              <circle cx="240" cy="180" r="10" fill="url(#glow-green)" />
              <circle cx="240" cy="180" r="4" fill="#39ff14" />

              {/* Gen 3 — leaves (bottom) */}
              <circle cx="40" cy="250" r="6" fill="url(#glow-cyan)" />
              <circle cx="40" cy="250" r="2.5" fill="#00f0ff" />
              <circle cx="80" cy="250" r="5" fill="#6366f1" opacity="0.25" /> {/* extinct */}
              <circle cx="155" cy="250" r="6" fill="url(#glow-green)" />
              <circle cx="155" cy="250" r="2.5" fill="#39ff14" />
              <circle cx="220" cy="250" r="7" fill="url(#glow-green)" />
              <circle cx="220" cy="250" r="3" fill="#39ff14" />
              <circle cx="260" cy="250" r="6" fill="url(#glow-green)" />
              <circle cx="260" cy="250" r="2.5" fill="#39ff14" />

              {/* Gen labels */}
              <text x="284" y="43" fill="rgba(255,255,255,0.12)" fontSize="8" fontFamily="monospace">G0</text>
              <text x="284" y="113" fill="rgba(255,255,255,0.12)" fontSize="8" fontFamily="monospace">G1</text>
              <text x="284" y="183" fill="rgba(255,255,255,0.12)" fontSize="8" fontFamily="monospace">G2</text>
              <text x="284" y="253" fill="rgba(255,255,255,0.12)" fontSize="8" fontFamily="monospace">G3</text>
            </svg>

            {/* Ambient glow */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-10"
              style={{
                background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <span className="font-mono text-xs text-text-secondary tracking-widest">SCROLL</span>
        <motion.div
          className="w-5 h-8 rounded-full border border-text-secondary/30 flex justify-center pt-1.5"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-1 h-2 rounded-full bg-cyan" />
        </motion.div>
      </motion.div>
    </section>
  );
}
