import React, { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  // Base styles martiaux
  "bg-martial-surface-1 border border-martial-steel/20 transition-all duration-300",
  {
    variants: {
      variant: {
        // Carte standard
        default: "rounded-lg shadow-martial-lg hover:shadow-martial-xl",
        
        // Carte avec hover interactif
        interactive: "rounded-lg shadow-martial-lg hover:shadow-glow-danger hover:border-martial-danger-accent/50 cursor-pointer",
        
        // Carte d'exercice avec difficulty tags
        exercise: "rounded-lg shadow-martial-lg hover:shadow-martial-xl hover:border-martial-steel/40 group",
        
        // Carte de héros/dashboard
        hero: "rounded-lg shadow-martial-xl border-martial-steel/30 bg-gradient-to-br from-martial-surface-1 to-martial-primary-bg",
        
        // Carte de statistiques
        stats: "rounded-md shadow-martial-md border-martial-steel/10 bg-martial-surface-hover/50",
        
        // Carte de profil
        profile: "rounded-lg shadow-martial-lg border-martial-danger-accent/20 bg-gradient-to-b from-martial-surface-1 to-martial-surface-hover",
        
        // Carte de progression
        progress: "rounded-lg shadow-martial-lg border-martial-success/20 bg-martial-surface-1",
        
        // Carte critique/urgente
        emergency: "rounded-lg shadow-glow-danger border-martial-danger-accent/50 bg-martial-surface-1 animate-martial-pulse",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      texture: {
        none: "",
        metal: "texture-metal",
        grain: "texture-grain",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      texture: "none",
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
  glowOnHover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    padding,
    texture,
    glowOnHover = false,
    children,
    ...props 
  }, ref) => {
    return (
      <div
        className={cn(
          cardVariants({ variant, padding, texture }),
          glowOnHover && "hover:shadow-glow-steel",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Composants dérivés pour une utilisation pratique
const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display font-bold text-lg text-martial-highlight leading-tight tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-martial-steel text-sm leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 border-t border-martial-steel/20", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Cartes spécialisées pour l'application
const WorkoutCard = forwardRef<HTMLDivElement, CardProps & {
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
}>(({ difficulty, category, children, ...props }, ref) => {
  const difficultyColors = {
    beginner: 'text-martial-success',
    intermediate: 'text-martial-warning', 
    advanced: 'text-martial-danger-accent',
    expert: 'text-martial-danger-dark',
  };

  return (
    <Card 
      ref={ref}
      variant="exercise"
      {...props}
    >
      {/* Difficulty indicator */}
      {difficulty && (
        <div className="absolute top-4 right-4 flex items-center gap-1">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={cn(
                "martial-chevron w-2 h-2",
                i < ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(difficulty) + 1
                  ? difficultyColors[difficulty]
                  : 'border-martial-steel/30'
              )}
            />
          ))}
        </div>
      )}
      
      {/* Category badge */}
      {category && (
        <div className="absolute top-4 left-4">
          <span className="martial-badge martial-badge-rank text-xs">
            {category}
          </span>
        </div>
      )}
      
      <div className="relative">
        {children}
      </div>
    </Card>
  );
});
WorkoutCard.displayName = "WorkoutCard";

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  WorkoutCard,
  cardVariants 
};
