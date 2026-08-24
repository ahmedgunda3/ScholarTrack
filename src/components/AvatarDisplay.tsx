import React from 'react';
import type { AvatarConfig } from '../types';

interface Props {
  config?: Partial<AvatarConfig>;
  size?: number;
  className?: string;
}

export const AvatarDisplay: React.FC<Props> = ({ config = {}, size = 96, className = '' }) => {
  const skinColor = config.skinColor || '#f3d299';
  const hairStyle = config.hairStyle || 'curly';
  const hairColor = config.hairColor || '#1e1b18';
  const expression = config.expression || 'confident';
  const outfit = config.outfit || 'hoodie';
  const outfitColor = config.outfitColor || '#4f46e5';
  const glasses = config.glasses || 'round';
  const headwear = config.headwear || 'none';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`rounded-full bg-slate-950 border border-slate-800 shrink-0 shadow-lg ${className}`}
    >
      {/* Circle Background */}
      <circle cx="50" cy="50" r="48" fill="#0f172a" />

      {/* Outfit Layer */}
      {outfit === 'hoodie' && (
        <path d="M 20 85 C 20 68, 30 62, 50 62 C 70 62, 80 68, 80 85 Z" fill={outfitColor} />
      )}
      {outfit === 'tshirt' && (
        <path d="M 22 88 C 22 70, 32 65, 50 65 C 68 65, 78 70, 78 88 Z" fill={outfitColor} />
      )}
      {outfit === 'blazer' && (
        <g>
          <path d="M 20 85 C 20 66, 30 62, 50 62 C 70 62, 80 66, 80 85 Z" fill={outfitColor} />
          <polygon points="50,68 44,85 56,85" fill="#f8fafc" />
        </g>
      )}
      {outfit === 'sweater' && (
        <path d="M 18 85 C 18 64, 30 60, 50 60 C 70 60, 82 64, 82 85 Z" fill={outfitColor} stroke="#1e1b18" strokeWidth="1" />
      )}

      {/* Neck */}
      <rect x="43" y="52" width="14" height="14" fill={skinColor} rx="3" />

      {/* Head */}
      <ellipse cx="50" cy="42" rx="19" ry="21" fill={skinColor} />

      {/* Facial Expressions */}
      {expression === 'happy' && (
        <g fill="#1e293b">
          <circle cx="43" cy="40" r="2.5" />
          <circle cx="57" cy="40" r="2.5" />
          <path d="M 43 47 Q 50 54 57 47" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
      {expression === 'confident' && (
        <g fill="#1e293b">
          <path d="M 40 36 L 46 38" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 60 36 L 54 38" stroke="#1e293b" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="43" cy="41" r="2" />
          <circle cx="57" cy="41" r="2" />
          <path d="M 44 48 Q 50 52 56 48" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
      {expression === 'focused' && (
        <g stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round">
          <line x1="41" y1="40" x2="45" y2="40" />
          <line x1="55" y1="40" x2="59" y2="40" />
          <line x1="44" y1="48" x2="56" y2="48" strokeWidth="1.8" />
        </g>
      )}
      {expression === 'cool' && (
        <g fill="#1e293b">
          <circle cx="43" cy="41" r="2" />
          <circle cx="57" cy="41" r="2" />
          <path d="M 42 49 Q 50 53 58 48" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}
      {expression === 'wink' && (
        <g fill="#1e293b">
          <path d="M 40 40 Q 43 37 46 40" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="57" cy="40" r="2.2" />
          <path d="M 44 48 Q 50 53 56 48" stroke="#1e293b" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* Hairstyles */}
      {hairStyle === 'curly' && (
        <g fill={hairColor}>
          <circle cx="36" cy="24" r="8" />
          <circle cx="50" cy="21" r="9" />
          <circle cx="64" cy="24" r="8" />
          <circle cx="32" cy="31" r="7" />
          <circle cx="68" cy="31" r="7" />
          <circle cx="30" cy="38" r="5" />
          <circle cx="70" cy="38" r="5" />
        </g>
      )}
      {hairStyle === 'afro' && (
        <circle cx="50" cy="33" r="23" fill={hairColor} />
      )}
      {hairStyle === 'short' && (
        <path d="M 31 38 C 30 21, 70 21, 69 38 C 65 27, 35 27, 31 38 Z" fill={hairColor} />
      )}
      {hairStyle === 'spiky' && (
        <polygon points="31,35 34,20 40,28 47,18 53,28 60,20 66,28 69,35" fill={hairColor} />
      )}
      {hairStyle === 'buzz' && (
        <path d="M 31 35 C 30 24, 70 24, 69 35 Z" fill={hairColor} opacity="0.85" />
      )}
      {hairStyle === 'dreads' && (
        <g fill={hairColor}>
          <rect x="31" y="24" width="4.5" height="25" rx="2" />
          <rect x="37" y="20" width="4.5" height="29" rx="2" />
          <rect x="43" y="18" width="4.5" height="30" rx="2" />
          <rect x="49" y="18" width="4.5" height="30" rx="2" />
          <rect x="55" y="20" width="4.5" height="29" rx="2" />
          <rect x="61" y="24" width="4.5" height="25" rx="2" />
        </g>
      )}
      {hairStyle === 'long' && (
        <g fill={hairColor}>
          <path d="M 31 35 C 30 20, 70 20, 69 35 C 65 26, 35 26, 31 35 Z" />
          <rect x="30" y="32" width="6" height="26" rx="3" />
          <rect x="64" y="32" width="6" height="26" rx="3" />
        </g>
      )}

      {/* Glasses Layer */}
      {glasses === 'round' && (
        <g stroke="#334155" strokeWidth="2" fill="none">
          <circle cx="42" cy="41" r="6" fill="rgba(255,255,255,0.15)" />
          <circle cx="58" cy="41" r="6" fill="rgba(255,255,255,0.15)" />
          <line x1="48" y1="41" x2="52" y2="41" />
        </g>
      )}
      {glasses === 'square' && (
        <g stroke="#1e293b" strokeWidth="2" fill="none">
          <rect x="36" y="36" width="12" height="10" rx="2" fill="rgba(255,255,255,0.15)" />
          <rect x="52" y="36" width="12" height="10" rx="2" fill="rgba(255,255,255,0.15)" />
          <line x1="48" y1="40" x2="52" y2="40" />
        </g>
      )}
      {glasses === 'sunglasses' && (
        <g fill="#0f172a" stroke="#1e293b" strokeWidth="1">
          <path d="M 35 36 L 48 36 L 46 45 L 37 45 Z" />
          <path d="M 52 36 L 65 36 L 63 45 L 54 45 Z" />
          <line x1="48" y1="38" x2="52" y2="38" stroke="#1e293b" strokeWidth="2" />
        </g>
      )}

      {/* Headwear Layer */}
      {headwear === 'cap' && (
        <g>
          <path d="M 28 32 C 28 20, 72 20, 72 32 Z" fill="#6366f1" />
          <path d="M 24 32 Q 50 30 76 35 L 72 32 Z" fill="#4f46e5" />
        </g>
      )}
      {headwear === 'beanie' && (
        <g>
          <path d="M 29 35 C 28 15, 72 15, 71 35 Z" fill="#0284c7" />
          <rect x="27" y="31" width="46" height="6" rx="2" fill="#0369a1" />
        </g>
      )}
      {headwear === 'gradCap' && (
        <g>
          <polygon points="50,14 80,24 50,34 20,24" fill="#0f172a" stroke="#fbbf24" strokeWidth="1" />
          <rect x="38" y="28" width="24" height="8" rx="2" fill="#1e293b" />
          <line x1="50" y1="24" x2="72" y2="32" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="72" cy="33" r="2" fill="#fbbf24" />
        </g>
      )}
    </svg>
  );
};
