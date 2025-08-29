// Export des mockups d'écrans martiaux
export { default as HomeMockup } from './HomeMockup';
export { default as WorkoutPlayerMockup } from './WorkoutPlayerMockup';
export { default as LibraryMockup } from './LibraryMockup';
export { default as ScheduleEditorDemo, ScheduleEditorModal } from './ScheduleEditorModal';
export { default as ProfileMockup } from './ProfileMockup';

// Export des showcases
export { default as UIShowcase } from '../ui/UIShowcase';
export { default as LogoShowcase } from '../logos/LogoShowcase';

// Types utiles
export interface MockupProps {
  className?: string;
  onAction?: (action: string, data?: any) => void;
}
