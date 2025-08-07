import { RankInfo } from '@/types';

export const RANKS: RankInfo[] = [
  {
    rank: 'F',
    name: 'Niveau de base',
    description: 'Les exercices de ce niveau sont accessibles à presque tout le monde et servent de point de départ pour les personnes débutant la calisthénie (aucune expérience sportive préalable).',
    timeframe: 'Immédiat',
    skills: ['Pompes', 'Rowing inversé'],
    color: '#22C55E' // Vert frais (débutant accessible)
  },
  {
    rank: 'D',
    name: 'Niveau débutant',
    description: 'Les exercices de ce niveau peuvent être réalisés en 1 à 2 mois et constituent des prérequis fondamentaux avant le début de l\'entraînement.',
    timeframe: '1 à 2 mois',
    skills: ['Tractions', 'Dips', 'Elbow lever', 'L-sit', 'Frogstand'],
    color: '#06B6D4' // Cyan turquoise
  },
  {
    rank: 'C',
    name: 'Niveau débutant avancé',
    description: 'Les exercices de ce niveau peuvent être réalisés en 2 à 6 mois et constituent les progressions de base des compétences avancées.',
    timeframe: '2 à 6 mois',
    skills: ['Pike push-up', 'Tuck front lever', 'Handstand'],
    color: '#3B82F6' // Bleu vif
  },
  {
    rank: 'B',
    name: 'Niveau intermédiaire',
    description: 'Les exercices de ce niveau peuvent être réalisés en 6 à 15 mois et constituent les progressions intermédiaires des compétences avancées.',
    timeframe: '6 à 15 mois',
    skills: ['Tuck planche', 'Handstand push-up', 'Adv. Tuck planche', 'Adv. Tuck front lever', 'Muscle-up', 'V-sit', 'One-arm push-up'],
    color: '#6366F1' // Indigo (violet-bleu)
  },
  {
    rank: 'A',
    name: 'Intermédiaire supérieur',
    description: 'Les exercices de ce niveau peuvent être réalisés en 15 à 36 mois et constituent soit la progression finale des compétences avancées, soit la compétence finale elle-même.',
    timeframe: '15 à 36 mois',
    skills: ['Straddle planche', 'Straddle front lever', 'Full front lever', '90 deg push-up', 'One-arm pull-up', 'Manna'],
    color: '#E67E22' // Orange bronze (prestige)
  },
  {
    rank: 'S',
    name: 'Avancé',
    description: 'Les exercices de ce niveau sont généralement réalisés en 3 à 5 ans et nécessitent un effort et un entraînement constants. Ce sont les compétences rêvées de nombreuses personnes.',
    timeframe: '3 à 5 ans',
    skills: ['Full planche', 'Touch front lever'],
    color: '#C0392B' // Rouge prestigieux
  },
  {
    rank: 'SS',
    name: 'Élite',
    description: 'Les exercices de ce niveau peuvent prendre jusqu\'à 5 ans ou moins, selon la génétique et l\'effort. Les personnes capables de réaliser ces compétences ont véritablement dépassé les attentes.',
    timeframe: 'Jusqu\'à 5 ans+',
    skills: ['Dragon planche', 'Maltese', 'Full planche push-up', 'Croix de Fer'],
    color: '#8E44AD' // Violet royal (élite absolue)
  }
];

export const getRankByCode = (rank: string): RankInfo | undefined => {
  return RANKS.find(r => r.rank === rank);
};

export const getRankColor = (rank: string): string => {
  const rankInfo = getRankByCode(rank);
  return rankInfo?.color || '#274460';
};

export const getRankName = (rank: string): string => {
  const rankInfo = getRankByCode(rank);
  return rankInfo?.name || 'Inconnu';
}; 