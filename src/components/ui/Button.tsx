import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles martiaux
  "inline-flex items-center justify-center font-display font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-martial-primary-bg disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        // Bouton primaire - rouge crimson pour les actions principales
        primary: "bg-martial-danger-accent hover:bg-martial-danger-light text-martial-highlight focus:ring-martial-danger-accent shadow-lg hover:shadow-glow-danger active:animate-scale-press",
        
        // Bouton secondaire - surface avec bordure
        secondary: "bg-martial-surface-1 hover:bg-martial-surface-hover text-martial-highlight border border-martial-steel/30 focus:ring-martial-steel hover:border-martial-steel/50",
        
        // Bouton success - vert militaire
        success: "bg-martial-success hover:bg-martial-success/90 text-martial-highlight focus:ring-martial-success",
        
        // Bouton CTA héros - version renforcée
        cta: "bg-martial-danger-accent hover:bg-martial-danger-light text-martial-highlight focus:ring-martial-danger-accent shadow-xl hover:shadow-glow-danger active:animate-scale-press",
        
        // Bouton fantôme - transparent avec bordure
        ghost: "bg-transparent hover:bg-martial-surface-hover text-martial-steel hover:text-martial-highlight border border-martial-steel/20 hover:border-martial-steel/40 focus:ring-martial-steel",
        
        // Bouton de destruction
        destructive: "bg-martial-danger-accent hover:bg-martial-danger-dark text-martial-highlight focus:ring-martial-danger-accent",
        
        // Bouton d'urgence/alerte
        emergency: "bg-martial-danger-accent hover:bg-martial-danger-light text-martial-highlight focus:ring-martial-danger-accent animate-martial-pulse",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-md",
        md: "h-11 px-4 py-2 text-base rounded-md",
        lg: "h-13 px-6 py-3 text-lg rounded-lg",
        xl: "h-16 px-8 py-4 text-xl rounded-2xl", // Pour les CTA héros
        icon: "h-11 w-11 rounded-md", // Boutons carrés pour icônes
      },
      weight: {
        normal: "font-semibold",
        bold: "font-bold",
        black: "font-black tracking-tight", // Pour les titres de CTA
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      weight: "normal",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    weight,
    fullWidth,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, weight, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Icône gauche */}
        {leftIcon && !loading && (
          <span className="mr-2 flex-shrink-0">
            {leftIcon}
          </span>
        )}
        
        {/* Indicateur de chargement */}
        {loading && (
          <span className="mr-2 flex-shrink-0">
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          </span>
        )}
        
        {/* Contenu */}
        <span className="flex-1">
          {children}
        </span>
        
        {/* Icône droite */}
        {rightIcon && !loading && (
          <span className="ml-2 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
