import { Strain } from '../types';
import { formatGenome, getDominantTrait, traitColor, traitLabel } from '../lib/genomeUtils';

interface Props {
  strain: Strain;
  x: number;
  y: number;
  allStrains: Map<string, Strain>;
}

export default function NodeTooltip({ strain, x, y, allStrains }: Props) {
  const dominant = getDominantTrait(strain.fitness);
  const parent = strain.parentId ? allStrains.get(strain.parentId) : null;
  const mutationCount = strain.mutations.length;
  const dominantColor = traitColor(dominant);

  // Smart screen-edge-aware positioning
  const TOOLTIP_W = 300;
  const TOOLTIP_H = 360;
  const MARGIN = 16;
  const vpW = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const vpH = typeof window !== 'undefined' ? window.innerHeight : 1080;

  const tooltipX = x + MARGIN + TOOLTIP_W > vpW ? x - TOOLTIP_W - MARGIN : x + MARGIN;
  const rawY = y - 20;
  const tooltipY = rawY + TOOLTIP_H > vpH - MARGIN
    ? Math.max(MARGIN, vpH - TOOLTIP_H - MARGIN)
    : Math.max(MARGIN, rawY);

  return (
    <div
      className="fixed z-[500] pointer-events-none tooltip-enter"
      style={{
        left: tooltipX,
        top: tooltipY,
        width: `${TOOLTIP_W}px`,
      }}
    >
      <div
        className="rounded-xl p-4 shadow-2xl"
        style={{
          background: 'rgba(8,8,20,0.92)',
          backdropFilter: 'blur(24px)',
          border: `1px solid ${strain.isExtinct ? 'rgba(255,255,255,0.06)' : `${dominantColor}25`}`,
          boxShadow: strain.isExtinct ? 'none' : `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${dominantColor}08`,
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: strain.isExtinct ? '#2a2a3a' : dominantColor,
                  boxShadow: strain.isExtinct ? 'none' : `0 0 8px ${dominantColor}80`,
                }}
              />
              {!strain.isExtinct && (
                <div
                  className="absolute inset-0 w-3 h-3 rounded-full animate-ping"
                  style={{ background: dominantColor, opacity: 0.3 }}
                />
              )}
            </div>
            <span className="font-mono text-sm font-bold tracking-wide text-white">
              {strain.id}
            </span>
          </div>
          <span
            className="text-[10px] font-mono px-2 py-0.5 rounded tracking-wider"
            style={{
              background: strain.isExtinct ? 'rgba(42,42,58,0.5)' : `${dominantColor}15`,
              color: strain.isExtinct ? '#666' : dominantColor,
              border: `1px solid ${strain.isExtinct ? 'rgba(42,42,58,0.8)' : `${dominantColor}25`}`,
            }}
          >
            {strain.isExtinct ? 'EXTINCT' : 'ACTIVE'}
          </span>
        </div>

        {/* Gen + lineage info */}
        <div className="flex items-center gap-3 mb-3 text-[11px] text-text-secondary">
          <span>Gen <span className="text-white font-mono">{strain.generation}</span></span>
          <span className="text-text-secondary/30">|</span>
          <span><span className="text-white font-mono">{mutationCount}</span> mutation{mutationCount !== 1 ? 's' : ''}</span>
          <span className="text-text-secondary/30">|</span>
          <span><span className="text-white font-mono">{strain.children.length}</span> offspring</span>
        </div>

        {/* Genome display */}
        <div className="font-mono text-[11px] rounded-lg p-2.5 mb-3 tracking-wider" style={{ background: 'rgba(0,0,0,0.3)' }}>
          {formatGenome(strain.genome).split('').map((char, i) => {
            const isSpace = char === ' ';
            const posMapped = Math.floor(i - Math.floor(i / 5));
            const isMutated = !isSpace && strain.mutations.includes(posMapped);
            return (
              <span
                key={i}
                style={{
                  color: isSpace
                    ? 'transparent'
                    : isMutated
                    ? '#ff1744'
                    : char === 'A'
                    ? '#00f0ff'
                    : char === 'C'
                    ? '#39ff14'
                    : char === 'G'
                    ? '#f59e0b'
                    : '#a855f7',
                  fontWeight: isMutated ? 700 : 400,
                  textShadow: isMutated ? '0 0 6px rgba(255,23,68,0.5)' : 'none',
                }}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Fitness bars — redesigned */}
        <div className="space-y-2">
          {(['transmissibility', 'immuneEvasion', 'virulence'] as const).map((trait) => {
            const val = strain.fitness[trait];
            const color = traitColor(trait);
            return (
              <div key={trait}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-text-secondary tracking-wide">{traitLabel(trait)}</span>
                  <span className="font-mono font-semibold" style={{ color }}>
                    {(val * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${val * 100}%`,
                      background: `linear-gradient(90deg, ${color}80, ${color})`,
                      boxShadow: `0 0 8px ${color}30`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall fitness footer */}
        <div className="mt-3 pt-2.5 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] text-text-secondary tracking-wide">OVERALL FITNESS</span>
          <span
            className="font-mono text-sm font-bold"
            style={{ color: dominantColor }}
          >
            {(strain.fitness.overall * 100).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
