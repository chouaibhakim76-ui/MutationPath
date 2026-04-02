/**
 * Professional SVG virus icons — one per pathogen.
 * Each is a unique, detailed, scientific-looking icon.
 */

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export function CovidIcon({ size = 32, color = '#00f0ff', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Outer membrane */}
      <circle cx="24" cy="24" r="16" stroke={color} strokeWidth="1.5" opacity="0.3" />
      {/* Core */}
      <circle cx="24" cy="24" r="10" fill={color} opacity="0.08" />
      <circle cx="24" cy="24" r="10" stroke={color} strokeWidth="1" opacity="0.6" />
      {/* Spike proteins */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 24 + Math.cos(rad) * 10;
        const y1 = 24 + Math.sin(rad) * 10;
        const x2 = 24 + Math.cos(rad) * 18;
        const y2 = 24 + Math.sin(rad) * 18;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" opacity="0.7" />
            <circle cx={x2} cy={y2} r="2.5" fill={color} opacity="0.8" />
          </g>
        );
      })}
      {/* Inner structure */}
      <circle cx="24" cy="24" r="4" fill={color} opacity="0.15" />
      <circle cx="24" cy="24" r="2" fill={color} opacity="0.4" />
    </svg>
  );
}

export function InfluenzaIcon({ size = 32, color = '#6366f1', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Segmented core */}
      <circle cx="24" cy="24" r="12" fill={color} opacity="0.06" />
      <circle cx="24" cy="24" r="12" stroke={color} strokeWidth="1" opacity="0.5" />
      {/* 8 RNA segments */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 24 + Math.cos(rad) * 7;
        const y = 24 + Math.sin(rad) * 7;
        return (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="2"
            ry="4"
            transform={`rotate(${angle} ${x} ${y})`}
            fill={color}
            opacity={0.2 + (i % 3) * 0.1}
          />
        );
      })}
      {/* Hemagglutinin spikes */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 24 + Math.cos(rad) * 12;
        const y1 = 24 + Math.sin(rad) * 12;
        const x2 = 24 + Math.cos(rad) * 17;
        const y2 = 24 + Math.sin(rad) * 17;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" opacity="0.5" />
            {i % 2 === 0 ? (
              <polygon
                points={`${x2},${y2 - 2} ${x2 - 1.5},${y2 + 1} ${x2 + 1.5},${y2 + 1}`}
                fill={color}
                opacity="0.6"
                transform={`rotate(${angle} ${x2} ${y2})`}
              />
            ) : (
              <circle cx={x2} cy={y2} r="1.5" fill={color} opacity="0.6" />
            )}
          </g>
        );
      })}
      {/* Center */}
      <circle cx="24" cy="24" r="3" fill={color} opacity="0.2" />
    </svg>
  );
}

export function HIVIcon({ size = 32, color = '#f43f5e', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Outer envelope */}
      <circle cx="24" cy="24" r="14" stroke={color} strokeWidth="1" opacity="0.3" strokeDasharray="3 2" />
      {/* Capsid cone */}
      <path
        d="M20 18 L28 18 L30 30 L18 30 Z"
        fill={color}
        opacity="0.1"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      {/* Inner RNA strands */}
      <path d="M22 20 Q24 25 22 29" stroke={color} strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M26 20 Q24 25 26 29" stroke={color} strokeWidth="1.5" opacity="0.4" fill="none" />
      {/* Glycoprotein spikes (gp120/gp41) */}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 24 + Math.cos(rad) * 14;
        const y1 = 24 + Math.sin(rad) * 14;
        const x2 = 24 + Math.cos(rad) * 19;
        const y2 = 24 + Math.sin(rad) * 19;
        const xm = 24 + Math.cos(rad) * 16.5;
        const ym = 24 + Math.sin(rad) * 16.5;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={xm} y2={ym} stroke={color} strokeWidth="2" opacity="0.4" />
            <line x1={xm} y1={ym} x2={x2 - 1} y2={y2} stroke={color} strokeWidth="1" opacity="0.5" />
            <line x1={xm} y1={ym} x2={x2 + 1} y2={y2} stroke={color} strokeWidth="1" opacity="0.5" />
          </g>
        );
      })}
      {/* Matrix */}
      <circle cx="24" cy="24" r="9" stroke={color} strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

export function MeaslesIcon({ size = 32, color = '#f59e0b', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Pleomorphic envelope */}
      <path
        d="M24 8 Q36 10 38 24 Q36 38 24 40 Q12 38 10 24 Q12 10 24 8Z"
        fill={color}
        opacity="0.06"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.4"
      />
      {/* Nucleocapsid helix */}
      <path
        d="M18 16 Q30 18 28 24 Q26 30 18 32"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.5"
        fill="none"
      />
      <path
        d="M30 16 Q18 18 20 24 Q22 30 30 32"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.3"
        fill="none"
      />
      {/* Fusion proteins */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 24 + Math.cos(rad) * 13;
        const y1 = 24 + Math.sin(rad) * 13;
        const x2 = 24 + Math.cos(rad) * 18;
        const y2 = 24 + Math.sin(rad) * 18;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" opacity="0.5" />
            <rect
              x={x2 - 2}
              y={y2 - 2}
              width="4"
              height="4"
              rx="1"
              fill={color}
              opacity="0.5"
              transform={`rotate(${angle} ${x2} ${y2})`}
            />
          </g>
        );
      })}
      {/* Center */}
      <circle cx="24" cy="24" r="5" fill={color} opacity="0.12" />
    </svg>
  );
}

export function EbolaIcon({ size = 32, color = '#ef4444', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Filamentous body — signature shape */}
      <path
        d="M14 8 Q16 8 18 12 Q20 18 20 24 Q20 30 18 36 Q16 40 14 40"
        stroke={color}
        strokeWidth="4"
        opacity="0.15"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14 8 Q16 8 18 12 Q20 18 20 24 Q20 30 18 36 Q16 40 14 40"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Hook end */}
      <path
        d="M14 40 Q12 42 14 44 Q18 44 20 42"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
        fill="none"
        strokeLinecap="round"
      />
      {/* Glycoprotein surface */}
      {[12, 18, 24, 30, 36].map((y, i) => (
        <g key={i}>
          <line x1={20} y1={y} x2={24} y2={y - 1} stroke={color} strokeWidth="0.8" opacity="0.4" />
          <line x1={20} y1={y} x2={24} y2={y + 1} stroke={color} strokeWidth="0.8" opacity="0.4" />
        </g>
      ))}
      {/* Nucleocapsid */}
      <path
        d="M16 12 L16 36"
        stroke={color}
        strokeWidth="1"
        opacity="0.3"
        strokeDasharray="2 3"
      />
      {/* VP40 matrix faint layer */}
      <path
        d="M15 10 Q17 10 19 14 Q21 20 21 24 Q21 28 19 34 Q17 38 15 38"
        stroke={color}
        strokeWidth="0.5"
        opacity="0.2"
        fill="none"
      />
      {/* Second filament for visual interest */}
      <path
        d="M28 6 Q30 6 32 10 Q34 16 34 24 Q34 32 32 38 Q30 42 28 42"
        stroke={color}
        strokeWidth="3"
        opacity="0.08"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M28 6 Q30 6 32 10 Q34 16 34 24 Q34 32 32 38 Q30 42 28 42"
        stroke={color}
        strokeWidth="1"
        opacity="0.35"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NorovirusIcon({ size = 32, color = '#a855f7', className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Icosahedral capsid */}
      <circle cx="24" cy="24" r="13" fill={color} opacity="0.06" />
      <circle cx="24" cy="24" r="13" stroke={color} strokeWidth="1" opacity="0.4" />
      {/* Capsid facets */}
      <polygon
        points="24,11 35,20 31,33 17,33 13,20"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.2"
        fill="none"
      />
      {/* Cup-shaped depressions (calicivirus feature) */}
      {[0, 72, 144, 216, 288].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 24 + Math.cos(rad) * 9;
        const y = 24 + Math.sin(rad) * 9;
        return (
          <circle key={i} cx={x} cy={y} r="3" stroke={color} strokeWidth="0.8" opacity="0.3" fill={color} fillOpacity="0.05" />
        );
      })}
      {/* P-domain protrusions */}
      {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 24 + Math.cos(rad) * 13;
        const y1 = 24 + Math.sin(rad) * 13;
        const x2 = 24 + Math.cos(rad) * 17;
        const y2 = 24 + Math.sin(rad) * 17;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.2" opacity="0.45" />
            <circle cx={x2} cy={y2} r="1.5" fill={color} opacity="0.5" />
          </g>
        );
      })}
      {/* RNA genome hint */}
      <circle cx="24" cy="24" r="5" stroke={color} strokeWidth="0.5" opacity="0.2" strokeDasharray="2 2" />
    </svg>
  );
}

export const VIRUS_ICONS: Record<string, React.FC<IconProps>> = {
  covid19: CovidIcon,
  influenza: InfluenzaIcon,
  hiv: HIVIcon,
  measles: MeaslesIcon,
  ebola: EbolaIcon,
  norovirus: NorovirusIcon,
};
