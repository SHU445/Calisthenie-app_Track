'use client';

import React from 'react';
import { IconType } from 'react-icons';

interface FeatureCardProps {
  icon: IconType;
  title: string;
  description: string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: IconComponent, 
  title, 
  description, 
  color = 'text-martial-danger-accent',
  className = '',
  style 
}) => {
  return (
    <div className={`group martial-card-theme p-6 sm:p-8 animate-zoom-in ${className}`} style={style}>
      <div className="flex items-start space-x-4">
        {/* Icon */}
        <div className={`p-3 rounded-lg bg-martial-surface-hover flex-shrink-0 group-hover:scale-110 transition-transform duration-200 martial-icon-theme`}>
          <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${color}`} />
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-martial-highlight mb-2 sm:mb-3 group-hover:text-accent transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-martial-steel leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
