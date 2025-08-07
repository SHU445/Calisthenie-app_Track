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
        'roboto': ['Roboto', 'sans-serif'],
        'oswald': ['Oswald', 'sans-serif'],
      },
      colors: {
        sport: {
          // Palette Océan Profond
          primary: '#1E3A5F', // Bleu marine profond
          secondary: '#2E5E8E', // Bleu océan moyen
          accent: '#47B7CC', // Turquoise lumineux
          success: '#10B981', // Vert océanique
          warning: '#F59E0B', // Orangé doux
          danger: '#EF4444', // Rouge corail
          dark: '#0C1E33', // Bleu très sombre
          'dark-light': '#162A44', // Bleu nuit
          'gray-light': '#162A44', // Bleu nuit
          'gray-lighter': '#274460', // Bleu-gris clair
          gold: '#D4AF37', // Or doux
          silver: '#BCCCDC', // Argent pâle
          bronze: '#CD7C2F', // Bronze chaud
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'sport-gradient': 'linear-gradient(135deg, #1E3A5F 0%, #2E5E8E 50%, #47B7CC 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
} 