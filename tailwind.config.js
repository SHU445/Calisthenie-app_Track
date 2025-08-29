/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Typographie martiale
        'display': ['Bebas Neue', 'Oswald', 'Bebas Neue Condensed', 'sans-serif'],
        'body': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        // Compatibilité avec l'ancien système
        'roboto': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        'oswald': ['Bebas Neue', 'Oswald', 'sans-serif'],
      },
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
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '40px',
        '3xl': '48px',
        '4xl': '64px',
        '5xl': '80px',
        '6xl': '96px',
      },
      colors: {
        // Nouvelle palette martiale
        martial: {
          'primary-bg': '#0B0F12',      // near-black
          'surface-1': '#13171A',       // gunmetal
          'surface-hover': '#1A1F23',   // gunmetal hover
          'steel': '#AEB6BD',           // muted steel
          'steel-light': '#BCC4CB',     // steel light
          'steel-dark': '#9BA3AA',      // steel dark
          'danger-accent': '#9E1B1B',   // deep crimson
          'danger-light': '#B53E3E',    // danger hover
          'danger-dark': '#7A1515',     // danger pressed
          'highlight': '#DFD9CB',       // off-white warm
          'success': '#2D5A2D',         // vert militaire
          'warning': '#8B6914',         // jaune olive
          'info': '#1F3A5F',            // bleu sombre
          'overlay': 'rgba(11, 15, 18, 0.85)',
          'surface-alpha': 'rgba(19, 23, 26, 0.8)',
        },
        // Alias pour compatibilité (mapping sport -> martial)
        sport: {
          primary: '#13171A',           // surface-1
          secondary: '#1A1F23',         // surface-hover
          accent: '#9E1B1B',            // danger-accent
          success: '#2D5A2D',           // success
          warning: '#8B6914',           // warning
          danger: '#9E1B1B',            // danger-accent
          dark: '#0B0F12',              // primary-bg
          'dark-light': '#13171A',      // surface-1
          'gray-light': '#13171A',      // surface-1
          'gray-lighter': '#1A1F23',    // surface-hover
          gold: '#8B6914',              // warning (or olive)
          silver: '#AEB6BD',            // steel
          bronze: '#7A1515',            // danger-dark
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'martial-gradient': 'linear-gradient(135deg, #0B0F12 0%, #13171A 50%, #1A1F23 100%)',
        'sport-gradient': 'linear-gradient(135deg, #0B0F12 0%, #13171A 50%, #1A1F23 100%)', // Alias
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'martial-sm': '0 2px 4px rgba(11, 15, 18, 0.1)',
        'martial-md': '0 4px 8px rgba(11, 15, 18, 0.15)',
        'martial-lg': '0 8px 16px rgba(11, 15, 18, 0.2)',
        'martial-xl': '0 12px 24px rgba(11, 15, 18, 0.25)',
        'martial-2xl': '0 16px 32px rgba(11, 15, 18, 0.3)',
        'martial-inner': 'inset 0 2px 4px rgba(11, 15, 18, 0.1)',
        'glow-danger': '0 0 16px rgba(158, 27, 27, 0.4)',
        'glow-steel': '0 0 12px rgba(174, 182, 189, 0.3)',
        // Alias pour compatibilité
        'sport': '0 8px 16px rgba(11, 15, 18, 0.2)',
        'sport-lg': '0 12px 24px rgba(11, 15, 18, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'scale-press': 'scalePress 0.15s ease-out',
        'timer-pulse': 'timerPulse 1s ease-in-out infinite',
        'card-flip': 'cardFlip 0.6s ease-in-out',
        'parallax-slow': 'parallax 20s linear infinite',
      },
      keyframes: {
        scalePress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.96)' },
          '100%': { transform: 'scale(1)' },
        },
        timerPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        parallax: {
          '0%': { transform: 'translateX(-50px)' },
          '100%': { transform: 'translateX(50px)' },
        },
      },
    },
  },
  plugins: [],
} 