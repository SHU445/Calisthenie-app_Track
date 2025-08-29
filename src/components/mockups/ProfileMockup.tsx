import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter,
  Badge,
  RankBadge,
  StatusBadge,
  DifficultyBadge 
} from '../ui';
import { ChevronLogo } from '../logos';
import {
  UserIcon,
  TrophyIcon,
  FireIcon,
  ClockIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ShareIcon,
  DocumentArrowDownIcon,
  CogIcon,
  StarIcon,
  CheckCircleIcon,
  BoltIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ProfileMockup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'records' | 'achievements'>('overview');
  const [showShareModal, setShowShareModal] = useState(false);

  // Données utilisateur simulées
  const userProfile = {
    name: "ALEX MARTIN",
    rank: "A" as const,
    level: 47,
    avatar: "/api/placeholder/120/120",
    joinDate: "2023-01-15",
    totalWorkouts: 142,
    totalDuration: 3420, // minutes
    currentStreak: 15,
    bestStreak: 28,
    totalCalories: 18750,
    favoriteCategory: "Force"
  };

  // Personal Records
  const personalRecords = [
    {
      exercise: "Pompes Consécutives",
      record: 67,
      date: "2024-01-10",
      improvement: "+12",
      category: "Force"
    },
    {
      exercise: "Planche (Durée)",
      record: "4:32",
      date: "2024-01-08",
      improvement: "+45s",
      category: "Core"
    },
    {
      exercise: "Squats en Série",
      record: 145,
      date: "2024-01-05",
      improvement: "+23",
      category: "Jambes"
    },
    {
      exercise: "Burpees/Minute",
      record: 18,
      date: "2023-12-28",
      improvement: "+3",
      category: "Cardio"
    },
    {
      exercise: "Tractions Totales",
      record: 89,
      date: "2023-12-25",
      improvement: "+15",
      category: "Dos"
    }
  ];

  // Timeline des activités
  const timeline = [
    {
      id: '1',
      date: '2024-01-10',
      type: 'record',
      title: 'NOUVEAU RECORD PERSONNEL',
      description: 'Pompes consécutives : 67 répétitions (+12)',
      icon: TrophyIcon,
      color: 'text-martial-warning'
    },
    {
      id: '2',
      date: '2024-01-10',
      type: 'workout',
      title: 'ENTRAÎNEMENT FORCE EXPLOSIVE',
      description: 'Séance intense de 45 minutes - 320 calories brûlées',
      icon: BoltIcon,
      color: 'text-martial-danger-accent'
    },
    {
      id: '3',
      date: '2024-01-09',
      type: 'streak',
      title: 'SÉRIE DE 15 JOURS',
      description: 'Entraînement quotidien maintenu pendant 15 jours consécutifs',
      icon: FireIcon,
      color: 'text-martial-warning'
    },
    {
      id: '4',
      date: '2024-01-08',
      type: 'record',
      title: 'AMÉLIORATION PLANCHE',
      description: 'Durée planche : 4:32 (+45 secondes)',
      icon: ClockIcon,
      color: 'text-martial-warning'
    },
    {
      id: '5',
      date: '2024-01-07',
      type: 'badge',
      title: 'BADGE DÉBLOQUÉ',
      description: 'Maître de la Planche - 100 planches réalisées',
      icon: ShieldCheckIcon,
      color: 'text-martial-success'
    }
  ];

  // Badges militaires
  const militaryBadges = [
    {
      id: '1',
      name: 'COMMANDANT DE FORCE',
      description: 'Maîtrise des exercices de force',
      icon: '⚡',
      rarity: 'legendary',
      progress: 100,
      unlocked: true,
      date: '2024-01-01'
    },
    {
      id: '2',
      name: 'ENDURANCE DE TITAN',
      description: '50 séances cardio complétées',
      icon: '🔥',
      rarity: 'epic',
      progress: 100,
      unlocked: true,
      date: '2023-12-15'
    },
    {
      id: '3',
      name: 'DISCIPLINE DE FER',
      description: '30 jours d\'entraînement consécutifs',
      icon: '🛡️',
      rarity: 'rare',
      progress: 100,
      unlocked: true,
      date: '2023-11-20'
    },
    {
      id: '4',
      name: 'MAÎTRE DU CORE',
      description: '1000 minutes de core training',
      icon: '💪',
      rarity: 'epic',
      progress: 85,
      unlocked: false,
      date: null
    },
    {
      id: '5',
      name: 'LÉGENDE MARTIALE',
      description: 'Atteindre le rang S',
      icon: '👑',
      rarity: 'legendary',
      progress: 65,
      unlocked: false,
      date: null
    }
  ];

  const stats = [
    { label: "Entraînements", value: userProfile.totalWorkouts, icon: BoltIcon },
    { label: "Heures Total", value: Math.round(userProfile.totalDuration / 60), icon: ClockIcon },
    { label: "Série Actuelle", value: `${userProfile.currentStreak}j`, icon: FireIcon },
    { label: "Calories", value: userProfile.totalCalories.toLocaleString(), icon: TrophyIcon },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-martial-warning text-martial-warning';
      case 'epic': return 'border-martial-danger-accent text-martial-danger-accent';
      case 'rare': return 'border-martial-steel text-martial-steel';
      default: return 'border-martial-steel text-martial-steel';
    }
  };

  const ShareModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-martial-overlay backdrop-blur-martial">
      <Card variant="hero" className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Partager le Profil</CardTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowShareModal(false)}
            >
              <XMarkIcon className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="secondary" fullWidth>
            <ShareIcon className="w-5 h-5 mr-2" />
            PARTAGER SUR RÉSEAU SOCIAL
          </Button>
          <Button variant="secondary" fullWidth>
            <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
            EXPORTER EN PDF
          </Button>
          <Button variant="ghost" fullWidth>
            Copier le lien du profil
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-martial-primary-bg text-martial-highlight">
      {/* Header */}
      <header className="martial-navbar sticky top-0 z-40">
        <div className="martial-container h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ChevronLogo size={32} variant="danger" />
            <h1 className="font-display font-bold text-xl text-martial-highlight">
              PROFIL OPÉRATEUR
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setShowShareModal(true)}>
              <ShareIcon className="w-5 h-5 mr-2" />
              PARTAGER
            </Button>
            <Button variant="ghost">
              <CogIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="martial-container py-8 space-y-8">
        {/* Profile Header */}
        <Card variant="hero" texture="metal">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar & Basic Info */}
              <div className="text-center md:text-left">
                <div className="w-32 h-32 bg-martial-surface-1 rounded-lg mb-4 flex items-center justify-center mx-auto md:mx-0">
                  <UserIcon className="w-16 h-16 text-martial-steel" />
                </div>
                <h2 className="text-2xl font-display font-black text-martial-highlight mb-2">
                  {userProfile.name}
                </h2>
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                  <RankBadge rank={userProfile.rank} />
                  <Badge variant="elite">NIVEAU {userProfile.level}</Badge>
                </div>
                <p className="text-martial-steel text-sm">
                  Opérateur depuis {formatDate(userProfile.joinDate)}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <IconComponent className="w-6 h-6 text-martial-steel mx-auto mb-2" />
                        <div className="text-xl font-display font-bold text-martial-highlight">
                          {stat.value}
                        </div>
                        <div className="text-xs text-martial-steel uppercase tracking-wide">
                          {stat.label}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress to Next Rank */}
                <div className="mt-6 p-4 bg-martial-surface-hover rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-display font-semibold text-martial-highlight">
                      PROGRESSION RANG S
                    </span>
                    <span className="text-sm text-martial-steel">65%</span>
                  </div>
                  <div className="martial-progress">
                    <div className="martial-progress-bar" style={{ width: '65%' }} />
                  </div>
                  <p className="text-xs text-martial-steel mt-2">
                    147 points jusqu'au prochain rang
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-martial-surface-1 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: ChartBarIcon },
            { id: 'timeline', label: 'Timeline', icon: CalendarDaysIcon },
            { id: 'records', label: 'Records', icon: TrophyIcon },
            { id: 'achievements', label: 'Badges', icon: ShieldCheckIcon }
          ].map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-display font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-martial-danger-accent text-martial-highlight shadow-lg'
                    : 'text-martial-steel hover:text-martial-highlight hover:bg-martial-surface-hover'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <Card variant="default">
              <CardHeader>
                <CardTitle>Activité Récente</CardTitle>
                <CardDescription>Dernières actions et performances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.slice(0, 3).map(item => {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg bg-martial-surface-hover ${item.color}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-display font-semibold text-martial-highlight text-sm">
                            {item.title}
                          </div>
                          <div className="text-martial-steel text-xs">
                            {item.description}
                          </div>
                          <div className="text-martial-steel text-xs mt-1">
                            {formatDate(item.date)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" fullWidth onClick={() => setActiveTab('timeline')}>
                  VOIR TOUTE LA TIMELINE
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Top Records */}
            <Card variant="default">
              <CardHeader>
                <CardTitle>Records Personnels</CardTitle>
                <CardDescription>Meilleures performances par catégorie</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {personalRecords.slice(0, 3).map((record, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-display font-semibold text-martial-highlight text-sm">
                          {record.exercise}
                        </div>
                        <div className="text-martial-steel text-xs">
                          {record.category} • {formatDate(record.date)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-display font-bold text-martial-highlight">
                          {record.record}
                        </div>
                        <div className="text-xs text-martial-success">
                          {record.improvement}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" fullWidth onClick={() => setActiveTab('records')}>
                  VOIR TOUS LES RECORDS
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {activeTab === 'timeline' && (
          <Card variant="default">
            <CardHeader>
              <CardTitle>Timeline Complète</CardTitle>
              <CardDescription>Historique détaillé de toutes vos activités</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timeline.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.id} className="relative flex items-start space-x-4">
                      {/* Timeline line */}
                      {index !== timeline.length - 1 && (
                        <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-martial-steel/20" />
                      )}
                      
                      <div className={`p-3 rounded-lg bg-martial-surface-hover ${item.color} relative z-10`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-bold text-martial-highlight">
                            {item.title}
                          </h4>
                          <time className="text-sm text-martial-steel">
                            {formatDate(item.date)}
                          </time>
                        </div>
                        <p className="text-martial-steel text-sm mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6">
            <Card variant="stats">
              <CardHeader>
                <CardTitle>Records Personnels</CardTitle>
                <CardDescription>Toutes vos meilleures performances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalRecords.map((record, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-martial-surface-hover rounded-lg border border-martial-steel/20 hover:border-martial-danger-accent/30 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-display font-bold text-martial-highlight">
                          {record.exercise}
                        </h4>
                        <Badge variant="category" size="xs">{record.category}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-display font-black text-martial-highlight">
                          {record.record}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-martial-success font-bold">
                            {record.improvement}
                          </div>
                          <div className="text-xs text-martial-steel">
                            {formatDate(record.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <Card variant="hero">
              <CardHeader>
                <CardTitle>Badges Militaires</CardTitle>
                <CardDescription>Récompenses et accomplissements débloqués</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {militaryBadges.map(badge => (
                    <div 
                      key={badge.id}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        badge.unlocked 
                          ? `${getBadgeRarityColor(badge.rarity)} bg-martial-surface-hover` 
                          : 'border-martial-steel/30 bg-martial-surface-1 opacity-60'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{badge.icon}</div>
                        <h4 className="font-display font-bold text-martial-highlight mb-2">
                          {badge.name}
                        </h4>
                        <p className="text-sm text-martial-steel mb-4">
                          {badge.description}
                        </p>
                        
                        {badge.unlocked ? (
                          <div>
                            <StatusBadge status="completed" />
                            {badge.date && (
                              <div className="text-xs text-martial-steel mt-2">
                                Débloqué le {formatDate(badge.date)}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="text-sm text-martial-steel mb-2">
                              Progression: {badge.progress}%
                            </div>
                            <div className="martial-progress">
                              <div 
                                className="martial-progress-bar" 
                                style={{ width: `${badge.progress}%` }} 
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Share Modal */}
      {showShareModal && <ShareModal />}
    </div>
  );
};

export default ProfileMockup;
