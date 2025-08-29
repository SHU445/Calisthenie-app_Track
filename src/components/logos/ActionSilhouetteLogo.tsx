import React from 'react';

interface ActionSilhouetteLogoProps {
  size?: number;
  className?: string;
  variant?: 'danger' | 'steel' | 'highlight';
}

const ActionSilhouetteLogo: React.FC<ActionSilhouetteLogoProps> = ({ 
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
        {/* Gradient de profondeur */}
        <linearGradient id={`silhouetteGradient-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: color, stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.6 }} />
        </linearGradient>
        
        {/* Éclairage en contre-jour */}
        <radialGradient id={`backlightGradient-${variant}`} cx="80%" cy="20%" r="60%">
          <stop offset="0%" style={{ stopColor: '#DFD9CB', stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.1 }} />
        </radialGradient>
      </defs>
      
      {/* Arrière-plan contre-jour */}
      <circle 
        cx="24" 
        cy="24" 
        r="22" 
        fill={`url(#backlightGradient-${variant})`}
      />
      
      {/* Silhouette en mouvement - pompe explosive */}
      <g transform="translate(24, 24)">
        {/* Corps principal */}
        <path 
          d="M-8 -4 L-6 -8 L2 -8 L4 -4 L4 0 L6 4 L4 8 L-6 8 L-8 4 Z" 
          fill={`url(#silhouetteGradient-${variant})`}
        />
        
        {/* Tête */}
        <circle 
          cx="0" 
          cy="-12" 
          r="3" 
          fill={color}
        />
        
        {/* Bras en tension */}
        <path 
          d="M-8 -2 L-14 -6 L-16 -4 L-12 0 L-8 0" 
          fill={color}
        />
        
        <path 
          d="M4 -2 L10 -6 L12 -4 L8 0 L4 0" 
          fill={color}
        />
        
        {/* Jambes dynamiques */}
        <path 
          d="M-2 8 L-4 16 L-2 18 L0 16 L2 18 L4 16 L2 8" 
          fill={color}
        />
        
        {/* Lignes de mouvement */}
        <path 
          d="M-18 -8 L-14 -10 M-18 -4 L-14 -6 M-18 0 L-14 -2" 
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.6"
          strokeLinecap="round"
        />
        
        <path 
          d="M10 -8 L14 -10 M10 -4 L14 -6 M10 0 L14 -2" 
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.6"
          strokeLinecap="round"
        />
      </g>
      
      {/* Effet de puissance - chevrons d'énergie */}
      <path 
        d="M4 40 L8 36 L12 40" 
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.7"
        strokeLinecap="square"
      />
      
      <path 
        d="M36 40 L40 36 L44 40" 
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.7"
        strokeLinecap="square"
      />
      
      {/* Cercle de focus */}
      <circle 
        cx="24" 
        cy="24" 
        r="22" 
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.4"
        strokeDasharray="4,4"
      />
    </svg>
  );
};

export default ActionSilhouetteLogo;
