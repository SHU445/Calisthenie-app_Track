import React, { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  // Base styles martiaux avec effet stencil
  "inline-flex items-center font-display font-bold uppercase tracking-widest transition-all duration-200",
  {
    variants: {
      variant: {
        // Badge de rang militaire - style principal
        rank: "text-martial-steel bg-martial-steel/10 border-2 border-martial-steel",
        
        // Badge de danger/alerte
        danger: "text-martial-danger-accent bg-martial-danger-accent/10 border-2 border-martial-danger-accent",
        
        // Badge de succès
        success: "text-martial-success bg-martial-success/10 border-2 border-martial-success",
        
        // Badge d'avertissement
        warning: "text-martial-warning bg-martial-warning/10 border-2 border-martial-warning",
        
        // Badge de difficulté avec chevrons
        difficulty: "text-martial-highlight bg-martial-surface-hover border-2 border-martial-steel/30",
        
        // Badge de catégorie
        category: "text-martial-steel bg-martial-surface-1 border border-martial-steel/20",
        
        // Badge de statut PRO/VIP
        elite: "text-martial-highlight bg-martial-danger-accent/20 border-2 border-martial-danger-accent",
        
        // Badge fantôme
        ghost: "text-martial-steel border-2 border-martial-steel/30 bg-transparent hover:bg-martial-steel/10",
        
        // Badge stampé (effet tampon)
        stamped: "text-martial-highlight bg-martial-surface-1 border-2 border-dashed border-martial-steel text-stamped",
      },
      size: {
        xs: "px-2 py-0.5 text-xs rounded-sm gap-1",
        sm: "px-2.5 py-1 text-xs rounded gap-1",
        md: "px-3 py-1.5 text-sm rounded-md gap-1.5",
        lg: "px-4 py-2 text-base rounded-lg gap-2",
      },
      style: {
        // Style par défaut
        default: "",
        
        // Style avec chevrons intégrés
        chevron: "relative pr-6",
        
        // Style avec effet métallique
        metallic: "texture-metal shadow-martial-sm",
        
        // Style avec effet pulsation
        pulse: "animate-martial-pulse",
        
        // Style avec effet stencil renforcé
        stencil: "border-dashed text-shadow-martial",
      },
    },
    defaultVariants: {
      variant: "rank",
      size: "sm",
      style: "default",
    },
  }
);

export interface BadgeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style'>,
    VariantProps<typeof badgeVariants> {
  chevronCount?: number; // Pour les badges de difficulté
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({
    className,
    variant,
    size,
    style,
    chevronCount,
    icon,
    removable = false,
    onRemove,
    children,
    ...props
  }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, size, style }), className)}
        ref={ref}
        {...props}
      >
        {/* Icône */}
        {icon && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}

        {/* Contenu */}
        <span className="flex-1">
          {children}
        </span>

        {/* Chevrons de difficulté */}
        {chevronCount && chevronCount > 0 && (
          <div className="flex items-center gap-0.5 ml-1">
            {Array.from({ length: chevronCount }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "martial-chevron w-2 h-2",
                  variant === 'danger' ? 'martial-chevron-danger' :
                  variant === 'warning' ? 'martial-chevron-warning' :
                  'martial-chevron-steel'
                )}
              />
            ))}
          </div>
        )}

        {/* Chevron décoratif pour le style chevron */}
        {style === 'chevron' && (
          <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
            <div className={cn(
              "martial-chevron w-2 h-2",
              variant === 'danger' ? 'martial-chevron-danger' :
              variant === 'warning' ? 'martial-chevron-warning' :
              'martial-chevron-steel'
            )} />
          </div>
        )}

        {/* Bouton de suppression */}
        {removable && onRemove && (
          <button
            onClick={onRemove}
            className="flex-shrink-0 ml-1 hover-theme-accent transition-theme"
            type="button"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Badge.displayName = "Badge";

// Badges spécialisés pour l'application
const DifficultyBadge = forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant' | 'chevronCount'> & {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}>(({ level, ...props }, ref) => {
  const levelConfig = {
    beginner: { label: 'Débutant', chevrons: 1, variant: 'success' as const },
    intermediate: { label: 'Intermédiaire', chevrons: 2, variant: 'warning' as const },
    advanced: { label: 'Avancé', chevrons: 3, variant: 'danger' as const },
    expert: { label: 'Expert', chevrons: 4, variant: 'elite' as const },
  };

  const config = levelConfig[level];

  return (
    <Badge
      ref={ref}
      variant={config.variant}
      chevronCount={config.chevrons}
      style="chevron"
      {...props}
    >
      {config.label}
    </Badge>
  );
});
DifficultyBadge.displayName = "DifficultyBadge";

const RankBadge = forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'> & {
  rank: 'F' | 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS';
}>(({ rank, ...props }, ref) => {
  const rankVariant = rank === 'S' || rank === 'SS' ? 'elite' : 
                     rank === 'A' || rank === 'B' ? 'warning' :
                     rank === 'C' || rank === 'D' ? 'success' : 'rank';

  return (
    <Badge
      ref={ref}
      variant={rankVariant}
      style="stencil"
      {...props}
    >
      RANG {rank}
    </Badge>
  );
});
RankBadge.displayName = "RankBadge";

const StatusBadge = forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'> & {
  status: 'active' | 'completed' | 'pending' | 'failed' | 'locked';
}>(({ status, ...props }, ref) => {
  const statusConfig = {
    active: { label: 'Actif', variant: 'success' as const, icon: '●' },
    completed: { label: 'Terminé', variant: 'success' as const, icon: '✓' },
    pending: { label: 'En attente', variant: 'warning' as const, icon: '◐' },
    failed: { label: 'Échec', variant: 'danger' as const, icon: '✗' },
    locked: { label: 'Verrouillé', variant: 'ghost' as const, icon: '🔒' },
  };

  const config = statusConfig[status];

  return (
    <Badge
      ref={ref}
      variant={config.variant}
      icon={<span>{config.icon}</span>}
      {...props}
    >
      {config.label}
    </Badge>
  );
});
StatusBadge.displayName = "StatusBadge";

const CategoryBadge = forwardRef<HTMLDivElement, Omit<BadgeProps, 'variant'>>(
  (props, ref) => (
    <Badge
      ref={ref}
      variant="category"
      size="xs"
      {...props}
    />
  )
);
CategoryBadge.displayName = "CategoryBadge";

export { 
  Badge, 
  DifficultyBadge, 
  RankBadge, 
  StatusBadge, 
  CategoryBadge,
  badgeVariants 
};
