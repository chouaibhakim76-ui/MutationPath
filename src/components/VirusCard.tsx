import { motion } from 'framer-motion';
import { VirusType } from '../types';
import { VIRUS_INFO } from '../lib/virusPresets';
import { VIRUS_ICONS } from './VirusIcons';

interface Props {
  virusType: VirusType;
  selected: boolean;
  onSelect: (type: VirusType) => void;
}

export default function VirusCard({ virusType, selected, onSelect }: Props) {
  const info = VIRUS_INFO[virusType];
  const IconComponent = VIRUS_ICONS[virusType];

  return (
    <motion.button
      onClick={() => onSelect(virusType)}
      className="relative w-full text-left rounded-xl transition-all duration-300 group overflow-hidden gloss-overlay"
      style={{
        background: selected
          ? `linear-gradient(135deg, ${info.color}18 0%, ${info.color}06 100%)`
          : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: `1px solid ${selected ? `${info.color}50` : 'rgba(255,255,255,0.07)'}`,
        borderTopColor: selected ? `${info.color}70` : 'rgba(255,255,255,0.12)',
        boxShadow: selected
          ? `0 0 30px ${info.color}25, 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 ${info.color}25`
          : '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
      whileHover={{ scale: 1.025, y: -2, boxShadow: `0 12px 32px rgba(0,0,0,0.5), 0 0 20px ${info.color}15` }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Top sheen line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: selected
            ? `linear-gradient(90deg, transparent, ${info.color}50, transparent)`
            : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
        }}
      />

      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 w-[3px] h-full rounded-l-xl transition-all duration-500"
        style={{
          background: selected
            ? `linear-gradient(180deg, ${info.color}, ${info.color}60)`
            : 'transparent',
          boxShadow: selected ? `2px 0 12px ${info.color}50` : 'none',
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 50%, ${info.color}08 0%, transparent 70%)`,
        }}
      />

      <div className="flex items-center gap-3 px-4 py-3">
        {/* SVG Icon */}
        <div
          className="flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-300"
          style={{
            width: 40,
            height: 40,
            background: selected ? `${info.color}14` : `${info.color}08`,
            border: `1px solid ${selected ? `${info.color}25` : `${info.color}12`}`,
            boxShadow: selected ? `0 0 12px ${info.color}20` : 'none',
          }}
        >
          {IconComponent && <IconComponent size={28} color={info.color} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-display font-semibold text-sm text-white truncate">
              {info.name}
            </span>
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded-md tracking-wider uppercase"
              style={{
                background: selected ? `${info.color}20` : `${info.color}0e`,
                color: info.color,
                border: `1px solid ${info.color}25`,
              }}
            >
              {info.speed}
            </span>
          </div>
          <p className="text-[11px] text-text-secondary truncate leading-tight">
            {info.description}
          </p>
        </div>

        {/* Selection indicator */}
        {selected && (
          <motion.div
            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: `${info.color}20`, border: `1px solid ${info.color}50` }}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: info.color, boxShadow: `0 0 8px ${info.color}` }} />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
