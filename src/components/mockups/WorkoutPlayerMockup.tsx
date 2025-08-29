import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  DifficultyBadge,
  Badge 
} from '../ui';
import { ChevronLogo } from '../logos';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  FireIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const WorkoutPlayerMockup: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(45); // 45 secondes
  const [currentReps, setCurrentReps] = useState(8);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(1);

  // Données d'entraînement simulées
  const workout = {
    name: "FORCE EXPLOSIVE",
    totalExercises: 6,
    totalDuration: "25 min",
    difficulty: "advanced" as const,
    currentSet: 2,
    totalSets: 4,
  };

  const currentExercise = {
    name: "POMPES EXPLOSIVES",
    description: "Explosive push-ups avec décollage des mains",
    targetReps: 12,
    restTime: 60,
    instructions: [
      "Position pompe classique",
      "Descente contrôlée",
      "Poussée explosive avec décollage",
      "Réception en douceur"
    ]
  };

  const nextExercise = {
    name: "SQUATS JUMP",
    targetReps: 15,
    restTime: 45,
  };

  const exercises = [
    { name: "ÉCHAUFFEMENT", completed: true },
    { name: "POMPES EXPLOSIVES", active: true },
    { name: "SQUATS JUMP", upcoming: true },
    { name: "MOUNTAIN CLIMBERS", upcoming: true },
    { name: "BURPEES", upcoming: true },
    { name: "COOL DOWN", upcoming: true },
  ];

  // Progress calculation
  const overallProgress = ((currentExerciseIndex - 1) / workout.totalExercises) * 100;
  const setProgress = ((workout.currentSet - 1) / workout.totalSets) * 100;

  // Timer effect pour le décompte
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime > 0) {
      interval = setInterval(() => {
        setCurrentTime(time => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime]);

  // Format du timer
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer critique (< 10s)
  const isTimerCritical = currentTime <= 10 && currentTime > 0;

  // Progress bar avec chevrons
  const ProgressBarWithChevrons = ({ progress, className = "" }: { progress: number; className?: string }) => (
    <div className={`martial-progress ${className}`}>
      <div 
        className="martial-progress-bar" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-martial-primary-bg text-martial-highlight">
      {/* Header Compact */}
      <header className="martial-header-mobile sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon">
            <XMarkIcon className="w-6 h-6" />
          </Button>
          
          <div className="text-center">
            <div className="font-display font-bold text-martial-highlight text-sm">
              {workout.name}
            </div>
            <div className="text-xs text-martial-steel">
              Exercice {currentExerciseIndex}/{workout.totalExercises}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? (
              <SpeakerWaveIcon className="w-6 h-6" />
            ) : (
              <SpeakerXMarkIcon className="w-6 h-6" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Workout Area */}
      <main className="p-4 space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-martial-steel">Progression globale</span>
            <span className="font-display font-bold text-martial-highlight">
              {Math.round(overallProgress)}%
            </span>
          </div>
          <ProgressBarWithChevrons progress={overallProgress} />
        </div>

        {/* Large Timer */}
        <div className="text-center py-8">
          <div className={`text-center ${isTimerCritical ? 'timer-critical' : ''}`}>
            <div className={`${isTimerCritical ? 'martial-timer-critical' : 'martial-timer'} mb-4`}>
              {formatTime(currentTime)}
            </div>
            <div className="text-martial-steel text-sm uppercase tracking-wide">
              {currentTime > 0 ? 'TEMPS RESTANT' : 'TEMPS ÉCOULÉ'}
            </div>
          </div>
        </div>

        {/* Current Exercise Info */}
        <Card variant="hero" texture="metal">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{currentExercise.name}</CardTitle>
                <CardDescription>{currentExercise.description}</CardDescription>
              </div>
              <DifficultyBadge level={workout.difficulty} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-martial-highlight">
                  {currentExercise.targetReps}
                </div>
                <div className="text-xs text-martial-steel uppercase">REPS CIBLE</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-martial-highlight">
                  {workout.currentSet}/{workout.totalSets}
                </div>
                <div className="text-xs text-martial-steel uppercase">SÉRIE</div>
              </div>
            </div>
            
            {/* Set Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-martial-steel">Progression série</span>
                <span className="font-display font-bold text-martial-highlight">
                  {Math.round(setProgress)}%
                </span>
              </div>
              <ProgressBarWithChevrons progress={setProgress} />
            </div>
          </CardContent>
        </Card>

        {/* Rep Counter */}
        <Card variant="interactive">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-martial-steel text-sm uppercase tracking-wide">
                Répétitions Actuelles
              </div>
              <div className="flex items-center justify-center space-x-6">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
                >
                  <MinusIcon className="w-6 h-6" />
                </Button>
                
                <div className="text-4xl font-display font-black text-martial-highlight min-w-[80px]">
                  {currentReps}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentReps(currentReps + 1)}
                >
                  <PlusIcon className="w-6 h-6" />
                </Button>
              </div>
              
              {currentReps >= currentExercise.targetReps && (
                <Badge variant="success">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  OBJECTIF ATTEINT
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Big Control Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant={isPlaying ? "secondary" : "cta"}
            size="xl"
            weight="black"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-20"
          >
            {isPlaying ? (
              <>
                <PauseIcon className="w-8 h-8 mr-3" />
                PAUSE
              </>
            ) : (
              <>
                <PlayIcon className="w-8 h-8 mr-3" />
                START
              </>
            )}
          </Button>
          
          <Button
            variant="secondary"
            size="xl"
            weight="black"
            className="h-20"
          >
            <ArrowPathIcon className="w-8 h-8 mr-3" />
            RESET
          </Button>
        </div>

        {/* Navigation Controls */}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="ghost" disabled={currentExerciseIndex === 1}>
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            PRÉCÉDENT
          </Button>
          
          <Button variant="destructive">
            <StopIcon className="w-5 h-5 mr-2" />
            ARRÊTER
          </Button>
          
          <Button variant="ghost" disabled={currentExerciseIndex === workout.totalExercises}>
            SUIVANT
            <ChevronRightIcon className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Next Exercise Preview */}
        <Card variant="stats">
          <CardHeader>
            <CardTitle className="text-lg">Prochain Exercice</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display font-semibold text-martial-highlight">
                  {nextExercise.name}
                </div>
                <div className="text-sm text-martial-steel">
                  {nextExercise.targetReps} reps • {nextExercise.restTime}s repos
                </div>
              </div>
              <Button variant="ghost" size="sm">
                PRÉVISUALISER
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List Progress */}
        <Card variant="default">
          <CardHeader>
            <CardTitle className="text-lg">Plan d'Entraînement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                    exercise.active ? 'bg-martial-danger-accent/20 border border-martial-danger-accent/30' :
                    exercise.completed ? 'bg-martial-success/10' :
                    'bg-martial-surface-hover/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      exercise.completed ? 'bg-martial-success text-martial-highlight' :
                      exercise.active ? 'bg-martial-danger-accent text-martial-highlight' :
                      'bg-martial-steel/30 text-martial-steel'
                    }`}>
                      {exercise.completed ? '✓' : index + 1}
                    </div>
                    <span className={`font-display font-semibold ${
                      exercise.active ? 'text-martial-highlight' :
                      exercise.completed ? 'text-martial-success' :
                      'text-martial-steel'
                    }`}>
                      {exercise.name}
                    </span>
                  </div>
                  
                  {exercise.active && (
                    <Badge variant="danger" size="xs">EN COURS</Badge>
                  )}
                  {exercise.completed && (
                    <Badge variant="success" size="xs">TERMINÉ</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audio Cue Info */}
        <Card variant="stats">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SpeakerWaveIcon className="w-5 h-5 text-martial-steel" />
                <span className="text-sm text-martial-steel">
                  Signaux audio : {audioEnabled ? 'Activés' : 'Désactivés'}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? 'DÉSACTIVER' : 'ACTIVER'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Workout Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <ClockIcon className="w-6 h-6 text-martial-steel mx-auto mb-2" />
            <div className="text-lg font-display font-bold text-martial-highlight">12:30</div>
            <div className="text-xs text-martial-steel">TEMPS ÉCOULÉ</div>
          </div>
          <div className="text-center">
            <FireIcon className="w-6 h-6 text-martial-steel mx-auto mb-2" />
            <div className="text-lg font-display font-bold text-martial-highlight">142</div>
            <div className="text-xs text-martial-steel">CALORIES</div>
          </div>
          <div className="text-center">
            <CheckCircleIcon className="w-6 h-6 text-martial-steel mx-auto mb-2" />
            <div className="text-lg font-display font-bold text-martial-highlight">48</div>
            <div className="text-xs text-martial-steel">REPS TOTAL</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkoutPlayerMockup;
