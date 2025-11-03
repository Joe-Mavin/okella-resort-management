import React from 'react';

const Logo = ({ className = '', size = 'default', variant = 'full' }) => {
  const sizes = {
    small: { width: 32, height: 32, text: 'text-lg' },
    default: { width: 40, height: 40, text: 'text-xl' },
    large: { width: 56, height: 56, text: 'text-2xl' },
    xlarge: { width: 80, height: 80, text: 'text-4xl' }
  };

  const { width, height, text } = sizes[size];

  // Scorpion SVG Logo
  const ScorpionIcon = () => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Scorpion Body */}
      <g className="scorpion-body">
        {/* Main body segments */}
        <ellipse cx="50" cy="45" rx="12" ry="16" fill="currentColor" opacity="0.9"/>
        <ellipse cx="50" cy="58" rx="10" ry="12" fill="currentColor" opacity="0.85"/>
        <ellipse cx="50" cy="68" rx="8" ry="10" fill="currentColor" opacity="0.8"/>
        
        {/* Tail segments - curved upward */}
        <ellipse cx="52" cy="76" rx="6" ry="8" fill="currentColor" opacity="0.75"/>
        <ellipse cx="55" cy="82" rx="5" ry="7" fill="currentColor" opacity="0.7"/>
        <ellipse cx="59" cy="86" rx="4" ry="6" fill="currentColor" opacity="0.65"/>
        <ellipse cx="64" cy="88" rx="3.5" ry="5" fill="currentColor" opacity="0.6"/>
        
        {/* Stinger - sharp point */}
        <path
          d="M 67 88 Q 72 86 75 82 L 78 80 L 76 82 L 73 85 Q 70 88 67 89 Z"
          fill="currentColor"
          opacity="0.9"
        />
        
        {/* Pincers/Claws - left */}
        <path
          d="M 38 40 Q 32 38 28 35 Q 25 33 24 30 Q 23 28 24 26 Q 25 25 27 26 Q 30 28 33 32 Q 36 36 38 38 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <ellipse cx="26" cy="28" rx="3" ry="4" fill="currentColor" opacity="0.9" transform="rotate(-30 26 28)"/>
        
        {/* Pincers/Claws - right */}
        <path
          d="M 62 40 Q 68 38 72 35 Q 75 33 76 30 Q 77 28 76 26 Q 75 25 73 26 Q 70 28 67 32 Q 64 36 62 38 Z"
          fill="currentColor"
          opacity="0.85"
        />
        <ellipse cx="74" cy="28" rx="3" ry="4" fill="currentColor" opacity="0.9" transform="rotate(30 74 28)"/>
        
        {/* Legs - left side */}
        <line x1="44" y1="48" x2="36" y2="52" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
        <line x1="44" y1="54" x2="36" y2="60" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
        <line x1="44" y1="60" x2="38" y2="68" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <line x1="46" y1="66" x2="40" y2="74" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        
        {/* Legs - right side */}
        <line x1="56" y1="48" x2="64" y2="52" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
        <line x1="56" y1="54" x2="64" y2="60" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
        <line x1="56" y1="60" x2="62" y2="68" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        <line x1="54" y1="66" x2="60" y2="74" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
        
        {/* Head/Eyes */}
        <circle cx="47" cy="38" r="1.5" fill="#FFD700" opacity="0.9"/>
        <circle cx="53" cy="38" r="1.5" fill="#FFD700" opacity="0.9"/>
      </g>
      
      {/* Decorative circle border */}
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3"/>
    </svg>
  );

  if (variant === 'icon') {
    return <ScorpionIcon />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <ScorpionIcon />
      {variant === 'full' && (
        <div className="flex flex-col leading-tight">
          <span className={`font-bold tracking-wider ${text} bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent`}>
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
