// Design System - Ambiance Martiale
// Tokens de couleurs, typographies et espacements

export const designTokens = {
  // === PALETTE MARTIALE ===
  colors: {
    // Couleurs principales
    'primary-bg': '#0B0F12',      // near-black (arrière-plan principal)
    'surface-1': '#13171A',       // gunmetal (surfaces, cartes)
    'steel': '#AEB6BD',           // muted steel (accents, texte secondaire)
    'danger-accent': '#9E1B1B',   // deep crimson (alertes, CTA)
    'highlight': '#DFD9CB',       // off-white warm (texte principal)
    
    // Variations fonctionnelles
    'surface-hover': '#1A1F23',   // surface-1 éclaircie pour hover
    'steel-light': '#BCC4CB',     // steel plus clair
    'steel-dark': '#9BA3AA',      // steel plus sombre
    'danger-light': '#B53E3E',    // danger plus clair pour hover
    'danger-dark': '#7A1515',     // danger plus sombre
    
    // États des composants
    'success': '#2D5A2D',         // vert militaire pour succès
    'warning': '#8B6914',         // jaune olive pour avertissements
    'info': '#1F3A5F',            // bleu sombre pour informations
    
    // Transparences
    'overlay': 'rgba(11, 15, 18, 0.85)',     // overlay modal
    'surface-alpha': 'rgba(19, 23, 26, 0.8)', // surface semi-transparente
  },

  // === TYPOGRAPHIE ===
  typography: {
    // Familles de polices
    display: "'Bebas Neue', 'Oswald', 'Bebas Neue Condensed', sans-serif",
    body: "'Inter', 'Poppins', system-ui, sans-serif",
    
    // Tailles (mobile-first)
    fontSize: {
      'xs': ['12px', { lineHeight: '16px', letterSpacing: '0.025em' }],
      'sm': ['14px', { lineHeight: '20px', letterSpacing: '0.02em' }],
      'base': ['16px', { lineHeight: '24px', letterSpacing: '0.01em' }],
      'lg': ['18px', { lineHeight: '28px', letterSpacing: '0.01em' }],
      'xl': ['20px', { lineHeight: '30px', letterSpacing: '0em' }],
      '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em' }],
      '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
      '4xl': ['36px', { lineHeight: '40px', letterSpacing: '-0.025em' }],
      '5xl': ['48px', { lineHeight: '52px', letterSpacing: '-0.03em' }],
      '6xl': ['60px', { lineHeight: '64px', letterSpacing: '-0.035em' }],
    },
    
    // Poids de police
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    },
  },

  // === ESPACEMENT (Grille 8px) ===
  spacing: {
    'xs': '4px',     // 0.5 * 8px
    'sm': '8px',     // 1 * 8px (base)
    'md': '16px',    // 2 * 8px
    'lg': '24px',    // 3 * 8px
    'xl': '32px',    // 4 * 8px
    '2xl': '40px',   // 5 * 8px
    '3xl': '48px',   // 6 * 8px
    '4xl': '64px',   // 8 * 8px
    '5xl': '80px',   // 10 * 8px
    '6xl': '96px',   // 12 * 8px
  },

  // === GUTTERS ===
  gutters: {
    mobile: '16px',
    tablet: '24px',
    desktop: '32px',
  },

  // === BORDER RADIUS ===
  borderRadius: {
    none: '0px',
    sm: '6px',       // léger pour cartes
    md: '8px',       // standard
    lg: '12px',      // cartes importantes
    xl: '16px',      // conteneurs principaux
    '2xl': '24px',   // CTA/boutons héros
    full: '9999px',  // circular
  },

  // === OMBRES MARTIALES ===
  shadows: {
    'sm': '0 2px 4px rgba(11, 15, 18, 0.1)',
    'md': '0 4px 8px rgba(11, 15, 18, 0.15)',
    'lg': '0 8px 16px rgba(11, 15, 18, 0.2)',
    'xl': '0 12px 24px rgba(11, 15, 18, 0.25)',
    '2xl': '0 16px 32px rgba(11, 15, 18, 0.3)',
    'inner': 'inset 0 2px 4px rgba(11, 15, 18, 0.1)',
    'glow-danger': '0 0 16px rgba(158, 27, 27, 0.4)',
    'glow-steel': '0 0 12px rgba(174, 182, 189, 0.3)',
  },

  // === ANIMATIONS & TRANSITIONS ===
  animations: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
    easing: {
      'ease-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      'ease-in': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
      'ease-in-out': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    },
  },

  // === BREAKPOINTS ===
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // === Z-INDEX ===
  zIndex: {
    auto: 'auto',
    base: '0',
    docked: '10',
    dropdown: '1000',
    sticky: '1100',
    banner: '1200',
    overlay: '1300',
    modal: '1400',
    popover: '1500',
    skipLink: '1600',
    toast: '1700',
    tooltip: '1800',
  },
};

// Export individuel pour faciliter l'utilisation
export const colors = designTokens.colors;
export const typography = designTokens.typography;
export const spacing = designTokens.spacing;
export const shadows = designTokens.shadows;
export const borderRadius = designTokens.borderRadius;
export const breakpoints = designTokens.breakpoints;

export default designTokens;
