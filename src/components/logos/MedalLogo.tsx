import React from 'react';

interface MedalLogoProps {
  size?: number;
  className?: string;
  variant?: 'danger' | 'steel' | 'highlight';
}

const MedalLogo: React.FC<MedalLogoProps> = ({ 
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
      <defs>
        {/* Gradient métallique pour la médaille */}
        <linearGradient id={`medalGradient-${variant}`} x1="30%" y1="30%" x2="70%" y2="70%">
          <stop offset="0%" style={{ stopColor: '#DFD9CB', stopOpacity: 0.8 }} />
          <stop offset="30%" style={{ stopColor: color, stopOpacity: 1 }} />
          <stop offset="70%" style={{ stopColor: color, stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#0B0F12', stopOpacity: 0.6 }} />
        </linearGradient>
        
        {/* Gradient pour le ruban */}
        <linearGradient id={`ribbonGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.8 }} />
          <stop offset="50%" style={{ stopColor: color, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.8 }} />
        </linearGradient>
        
        {/* Ombre portée */}
        <filter id={`dropShadow-${variant}`}>
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#0B0F12" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Ruban de la médaille */}
      <path 
        d="M16 4 L20 2 L28 2 L32 4 L30 12 L26 10 L22 10 L18 12 Z" 
        fill={`url(#ribbonGradient-${variant})`}
        stroke={color}
        strokeWidth="1"
        filter={`url(#dropShadow-${variant})`}
      />
      
      {/* Plis du ruban */}
      <path 
        d="M20 6 L22 8 L26 8 L28 6" 
        fill="none"
        stroke="#0B0F12"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      
      {/* Corps de la médaille - cercle principal */}
      <circle 
        cx="24" 
        cy="28" 
        r="14" 
        fill={`url(#medalGradient-${variant})`}
        stroke={color}
        strokeWidth="2"
        filter={`url(#dropShadow-${variant})`}
      />
      
      {/* Cercle intérieur gravé */}
      <circle 
        cx="24" 
        cy="28" 
        r="10" 
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.6"
      />
      
      {/* Motif central - chevrons de rang */}
      <g transform="translate(24, 28)">
        {/* Chevron supérieur */}
        <path 
          d="M-4 -6 L0 -8 L4 -6" 
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        
        {/* Chevron central */}
        <path 
          d="M-6 -2 L0 -4 L6 -2" 
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        
        {/* Chevron inférieur */}
        <path 
          d="M-4 2 L0 0 L4 2" 
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        
        {/* Étoile centrale minimaliste */}
        <circle 
          cx="0" 
          cy="4" 
          r="2" 
          fill={color}
        />
        
        {/* Croix de discipline */}
        <path 
          d="M-1 4 L1 4 M0 3 L0 5" 
          stroke="#DFD9CB"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>
      
      {/* Gravure périphérique - marques de discipline */}
      <g transform="translate(24, 28)">
        {/* Points cardinaux */}
        <circle cx="0" cy="-12" r="1" fill={color} fillOpacity="0.7"/>
        <circle cx="12" cy="0" r="1" fill={color} fillOpacity="0.7"/>
        <circle cx="0" cy="12" r="1" fill={color} fillOpacity="0.7"/>
        <circle cx="-12" cy="0" r="1" fill={color} fillOpacity="0.7"/>
        
        {/* Marques intermédiaires */}
        <rect x="-0.5" y="-10.5" width="1" height="2" fill={color} fillOpacity="0.5"/>
        <rect x="9.5" y="-0.5" width="2" height="1" fill={color} fillOpacity="0.5"/>
        <rect x="-0.5" y="9.5" width="1" height="2" fill={color} fillOpacity="0.5"/>
        <rect x="-10.5" y="-0.5" width="2" height="1" fill={color} fillOpacity="0.5"/>
      </g>
      
      {/* Brillance métallique */}
      <ellipse 
        cx="20" 
        cy="22" 
        rx="3" 
        ry="6" 
        fill="#DFD9CB"
        fillOpacity="0.3"
        transform="rotate(-30 20 22)"
      />
      
      {/* Bordure externe de finition */}
      <circle 
        cx="24" 
        cy="28" 
        r="15" 
        fill="none"
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity="0.4"
      />
    </svg>
  );
};

export default MedalLogo;
