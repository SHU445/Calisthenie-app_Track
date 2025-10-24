'use client';

import React from 'react';
import { IconType } from 'react-icons';

interface StatItem {
  label: string;
  value: string | number;
  icon: IconType;
}

interface StatsRowProps {
  stats: StatItem[];
  className?: string;
}

export const StatsRow: React.FC<StatsRowProps> = ({ stats, className = '' }) => {
  return (
    <section className={`py-16 sm:py-20 bg-martial-surface-1/50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl w-full">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index} 
                  className="text-center animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-martial-danger-accent rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
                    <IconComponent className="h-8 w-8 text-martial-highlight" />
                  </div>
                  <div className="text-3xl font-bold text-martial-highlight mb-2">
                    {stat.value}
                  </div>
                  <div className="text-martial-steel text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsRow;
