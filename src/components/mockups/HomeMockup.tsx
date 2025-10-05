import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter,
  DifficultyBadge,
  StatusBadge,
  RankBadge 
} from '../ui';
import { ChevronLogo } from '../logos';
import {
  Bars3Icon,
  XMarkIcon,
  PlayIcon,
  ClockIcon,
  FireIcon,
  TrophyIcon,
  ChartBarIcon,
  UserIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  BoltIcon,
  StarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const HomeMockup: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Données de progression simulées
  const userStats = {
    name: "SOLDAT ALEX",
    rank: "B" as const,
    dailyProgress: 85,
    weeklyStreak: 7,
    totalWorkouts: 142,
    nextWorkout: {
      name: "FORCE EXPLOSIVE",
      duration: "25 min",
      difficulty: "advanced" as const,
      exercises: 6,
      calories: 280,
      scheduled: "14:30"
    }
  };

  const quickStats = [
    { label: "Séances", value: userStats.totalWorkouts, icon: PlayIcon, color: "text-martial-danger-accent" },
    { label: "Série Active", value: `${userStats.weeklyStreak}j`, icon: FireIcon, color: "text-martial-warning" },
    { label: "Prochain Rang", value: "RANG A", icon: TrophyIcon, color: "text-martial-steel" },
  ];

  const recentWorkouts = [
    { name: "Cardio Militaire", completed: true, duration: "20 min", difficulty: "intermediate" as const },
    { name: "Force Upper", completed: true, duration: "30 min", difficulty: "advanced" as const },
    { name: "Endurance Core", completed: false, duration: "25 min", difficulty: "beginner" as const },
  ];

  const CircularProgress = ({ percentage, size = 120 }: { percentage: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(174, 182, 189, 0.2)"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#9E1B1B"
            strokeWidth="4"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: "drop-shadow(0 0 8px rgba(158, 27, 27, 0.6))"
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-display font-black text-martial-highlight">
              {percentage}%
            </div>
            <div className="text-xs text-martial-steel uppercase tracking-wide">
              OBJECTIF
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-martial-primary-bg text-martial-highlight">
      {/* Header Mobile + Desktop */}
      <header className="martial-header-mobile md:hidden sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <ChevronLogo size={32} variant="danger" />
          <h1 className="font-display font-bold text-martial-highlight">
            CALLISTHENIE TRACKER
          </h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-martial-steel hover:text-martial-highlight transition-colors"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Navigation Desktop */}
      <nav className="hidden md:flex martial-navbar sticky top-0 z-50">
        <div className="martial-container h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ChevronLogo size={36} variant="danger" />
            <span className="font-display font-bold text-xl text-martial-highlight">
              CALLISTHENIE TRACKER
            </span>
          </div>
          
          <div className="flex items-center space-x-8">
            <a href="#" className="text-martial-steel hover:text-martial-highlight transition-colors font-display font-semibold">
              ACCUEIL
            </a>
            <a href="#" className="text-martial-steel hover:text-martial-highlight transition-colors font-display font-semibold">
              EXERCICES
            </a>
            <a href="#" className="text-martial-steel hover:text-martial-highlight transition-colors font-display font-semibold">
              PROGRÈS
            </a>
            <div className="flex items-center space-x-3">
              <UserIcon className="w-5 h-5 text-martial-steel" />
              <span className="text-martial-steel text-sm">{userStats.name}</span>
              <RankBadge rank={userStats.rank} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-martial-overlay backdrop-blur-martial">
          <div className="absolute right-0 top-16 h-full w-80 bg-martial-surface-1 border-l border-martial-steel/20 p-6">
            <nav className="space-y-6">
              <div className="border-b border-martial-steel/20 pb-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="w-8 h-8 text-martial-steel" />
                  <div>
                    <div className="font-display font-bold text-martial-highlight">{userStats.name}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <RankBadge rank={userStats.rank} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <a href="#" className="flex items-center space-x-3 p-3 rounded-md martial-hover">
                  <PlayIcon className="w-5 h-5 text-martial-steel" />
                  <span className="font-display font-semibold">ENTRAÎNEMENTS</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-md martial-hover">
                  <BookOpenIcon className="w-5 h-5 text-martial-steel" />
                  <span className="font-display font-semibold">EXERCICES</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-md martial-hover">
                  <ChartBarIcon className="w-5 h-5 text-martial-steel" />
                  <span className="font-display font-semibold">PROGRÈS</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="martial-container py-8 space-y-8">
        {/* Hero Dashboard */}
        <section className="martial-hero-dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progression Quotidienne */}
            <div className="lg:col-span-1">
              <div className="text-center space-y-4">
                <h2 className="font-display font-black text-2xl text-martial-highlight uppercase tracking-tight">
                  Mission du Jour
                </h2>
                <CircularProgress percentage={userStats.dailyProgress} />
                <div className="space-y-2">
                  <div className="text-martial-steel text-sm">
                    <strong className="text-martial-highlight">2/3</strong> objectifs atteints
                  </div>
                  <div className="text-xs text-martial-steel">
                    Prochaine étape : <strong className="text-martial-danger-accent">CARDIO INTENSE</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Prochain Entraînement */}
            <div className="lg:col-span-2">
              <Card variant="interactive" className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{userStats.nextWorkout.name}</CardTitle>
                      <CardDescription>
                        Programmé à <strong>{userStats.nextWorkout.scheduled}</strong>
                      </CardDescription>
                    </div>
                    <DifficultyBadge level={userStats.nextWorkout.difficulty} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <ClockIcon className="w-6 h-6 text-martial-steel mx-auto mb-2" />
                      <div className="text-lg font-display font-bold text-martial-highlight">
                        {userStats.nextWorkout.duration}
                      </div>
                      <div className="text-xs text-martial-steel">DURÉE</div>
                    </div>
                    <div className="text-center">
                      <BookOpenIcon className="w-6 h-6 text-martial-steel mx-auto mb-2" />
                      <div className="text-lg font-display font-bold text-martial-highlight">
                        {userStats.nextWorkout.exercises}
                      </div>
                      <div className="text-xs text-martial-steel">EXERCICES</div>
                    </div>
                    <div className="text-center">
                      <FireIcon className="w-6 h-6 text-martial-steel mx-auto mb-2" />
                      <div className="text-lg font-display font-bold text-martial-highlight">
                        {userStats.nextWorkout.calories}
                      </div>
                      <div className="text-xs text-martial-steel">CALORIES</div>
                    </div>
                    <div className="text-center">
                      <BoltIcon className="w-6 h-6 text-martial-steel mx-auto mb-2" />
                      <div className="text-lg font-display font-bold text-martial-highlight">
                        HAUTE
                      </div>
                      <div className="text-xs text-martial-steel">INTENSITÉ</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="cta" 
                    size="lg" 
                    weight="black" 
                    fullWidth
                    rightIcon={<PlayIcon className="w-5 h-5" />}
                  >
                    COMMENCER LA SÉANCE
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} variant="stats">
                  <CardContent className="flex items-center space-x-4 p-6">
                    <div className={`p-3 rounded-lg bg-martial-surface-1 ${stat.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-martial-highlight">
                        {stat.value}
                      </div>
                      <div className="text-sm text-martial-steel uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Entraînements Récents */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-bold text-martial-highlight uppercase tracking-tight">
              Historique des Missions
            </h2>
            <Button variant="ghost" size="sm" rightIcon={<ArrowRightIcon className="w-4 h-4" />}>
              Voir tout
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentWorkouts.map((workout, index) => (
              <Card key={index} variant="exercise" className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-md ${
                      workout.completed 
                        ? 'bg-martial-success/20 text-martial-success' 
                        : 'bg-martial-steel/20 text-martial-steel'
                    }`}>
                      {workout.completed ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : (
                        <ClockIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-martial-highlight">
                        {workout.name}
                      </div>
                      <div className="text-sm text-martial-steel">
                        {workout.duration} • <DifficultyBadge level={workout.difficulty} />
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={workout.completed ? 'completed' : 'pending'} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <Card variant="hero" texture="grain">
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>
                Accès direct aux fonctionnalités principales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="secondary" className="h-20 flex-col space-y-2">
                  <BookOpenIcon className="w-6 h-6" />
                  <span className="text-xs">EXERCICES</span>
                </Button>
                <Button variant="secondary" className="h-20 flex-col space-y-2">
                  <CalendarDaysIcon className="w-6 h-6" />
                  <span className="text-xs">PLANNING</span>
                </Button>
                <Button variant="secondary" className="h-20 flex-col space-y-2">
                  <ChartBarIcon className="w-6 h-6" />
                  <span className="text-xs">STATS</span>
                </Button>
                <Button variant="secondary" className="h-20 flex-col space-y-2">
                  <TrophyIcon className="w-6 h-6" />
                  <span className="text-xs">RANGS</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Citation Motivante */}
        <section>
          <Card variant="emergency" className="text-center p-8">
            <blockquote className="font-display font-black text-xl text-martial-highlight mb-4 uppercase tracking-wide">
              "Discipline. Répète."
            </blockquote>
            <cite className="text-martial-steel text-sm">
              — Philosophie de l'entraînement martial
            </cite>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default HomeMockup;
