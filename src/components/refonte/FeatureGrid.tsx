'use client';

import React from 'react';
import { FeatureCard } from './FeatureCard';
import { IconType } from 'react-icons';

interface Feature {
  icon: IconType;
  title: string;
  description: string;
  color?: string;
}

interface FeatureGridProps {
  features: Feature[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({ 
  features, 
  title = "Ce dont vous avez besoin :",
  subtitle = "Une suite complète d'outils pour optimiser vos entraînements de calisthénie",
  className = '' 
}) => {
  return (
    <section className={`py-16 sm:py-20 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-martial-highlight mb-3 sm:mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-martial-steel max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Features Grid - 2-col desktop, 1-col mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              className="animate-zoom-in"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
