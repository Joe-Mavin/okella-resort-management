import React from 'react';

const Logo = ({ className = '', size = 'default', variant = 'full' }) => {
  const sizes = {
    small: { width: 32, height: 32, text: 'text-lg' },
    default: { width: 40, height: 40, text: 'text-xl' },
    large: { width: 56, height: 56, text: 'text-2xl' },
    xlarge: { width: 80, height: 80, text: 'text-4xl' }
  };

  const { width, height, text } = sizes[size];

  // Sunrise over calm water icon (water-inspired, blue palette)
  const ResortIcon = () => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Okella Resort sunrise over water logo"
    >
      <defs>
        <linearGradient id="waterGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="60%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="sunGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF7E6" />
          <stop offset="60%" stopColor="#FFE4C4" />
          <stop offset="100%" stopColor="#FFD8A8" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="56%" r="60%">
          <stop offset="0%" stopColor="#FFEFD6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFEFD6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer ring (subtle) */}
      <circle cx="50" cy="50" r="48" stroke="#38BDF8" strokeWidth="1.5" opacity="0.25" />

      {/* Sun glow */}
      <circle cx="50" cy="56" r="16" fill="url(#sunGlow)" opacity="0.35" />

      {/* Sunrise (semi-circle) */}
      <path d="M 36 56 A 14 14 0 0 1 64 56 L 64 56 L 36 56 Z" fill="url(#sunGradient)" />

      {/* Minimal fountain flow (center) */}
      <path d="M 50 54 C 52 50 52 46 50 42 C 48 46 48 50 50 54" stroke="url(#waterGradient)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />

      {/* Water ripples */}
      <path d="M 22 60 Q 50 58 78 60" stroke="url(#waterGradient)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M 18 64 Q 50 62 82 64" stroke="url(#waterGradient)" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.8" />
      <path d="M 14 68 Q 50 66 86 68" stroke="url(#waterGradient)" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7" />
      <path d="M 18 72 Q 50 71 82 72" stroke="url(#waterGradient)" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />

      {/* Subtle floral accents */}
      <path d="M 26 57 C 24 55 22 55 21 57 C 22 59 24 60 26 58 Z" fill="#A7F3D0" opacity="0.9" />
      <path d="M 74 57 C 76 55 78 55 79 57 C 78 59 76 60 74 58 Z" fill="#A7F3D0" opacity="0.9" />
      <line x1="24" y1="58" x2="22" y2="60" stroke="#34D399" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
      <line x1="76" y1="58" x2="78" y2="60" stroke="#34D399" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
    </svg>
  );

  if (variant === 'icon') {
    return <ResortIcon />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <ResortIcon />
      {variant === 'full' && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold tracking-wider ${text} bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent`}>
            OKELLA
          </span>
          <span className="text-xs tracking-widest text-gray-600 dark:text-gray-400 -mt-1">
            RESORT
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
