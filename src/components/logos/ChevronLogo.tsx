import React from 'react';

interface ChevronLogoProps {
  size?: number;
  className?: string;
  variant?: 'danger' | 'steel' | 'highlight';
}

const ChevronLogo: React.FC<ChevronLogoProps> = ({ 
  size = 32, 
  className = '',
  variant = 'danger' 
}) => {
  const colors = {
    danger: '#9E1B1B',
    steel: '#AEB6BD', 
    highlight: '#DFD9CB'
  };

  const color = colors[variant];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chevron stylisé avec effet stencil */}
      <defs>
        <linearGradient id={`chevronGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.7 }} />
        </linearGradient>
        
        {/* Pattern de texture métallique */}
        <pattern id={`metalTexture-${variant}`} x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill={color} fillOpacity="0.1"/>
          <circle cx="2" cy="2" r="0.5" fill={color} fillOpacity="0.2"/>
        </pattern>
      </defs>
      
      {/* Base du chevron principal */}
      <path 
        d="M8 12 L24 4 L40 12 L32 24 L24 20 L16 24 Z" 
        fill={`url(#chevronGradient-${variant})`}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="miter"
      />
      
      {/* Chevron central (stencil) */}
      <path 
        d="M16 16 L24 12 L32 16 L28 24 L24 22 L20 24 Z" 
        fill="transparent"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="3,2"
        strokeLinejoin="miter"
      />
      
      {/* Chevrons de rang */}
      <path 
        d="M12 32 L18 28 L24 32" 
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      
      <path 
        d="M24 32 L30 28 L36 32" 
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      
      {/* Texture métallique subtile */}
      <rect 
        x="0" 
        y="0" 
        width="48" 
        height="48" 
        fill={`url(#metalTexture-${variant})`}
        opacity="0.3"
      />
      
      {/* Effet de brillance */}
      <path 
        d="M8 12 L16 8 L24 4 L20 16 L16 20" 
        fill={color}
        fillOpacity="0.2"
      />
    </svg>
  );
};

export default ChevronLogo;
