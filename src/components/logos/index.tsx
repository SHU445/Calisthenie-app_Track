// Export des logos martiaux
export { default as ChevronLogo } from './ChevronLogo';
export { default as ActionSilhouetteLogo } from './ActionSilhouetteLogo';
export { default as MedalLogo } from './MedalLogo';

// Types partagés
export type LogoVariant = 'danger' | 'steel' | 'highlight';

export interface BaseLogoProps {
  size?: number;
  className?: string;
  variant?: LogoVariant;
}
