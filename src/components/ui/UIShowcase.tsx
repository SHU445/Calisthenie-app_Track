import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter,
  WorkoutCard,
  Input, 
  TimeInput, 
  SearchInput, 
  Textarea,
  Badge, 
  DifficultyBadge, 
  RankBadge, 
  StatusBadge, 
  CategoryBadge 
} from './';
import { 
  PlayIcon, 
  PauseIcon, 
  UserIcon, 
  ClockIcon,
  FireIcon,
  TrophyIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const UIShowcase: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <div className="p-8 bg-martial-primary-bg min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-display font-black text-martial-highlight mb-4">
            Design System Martial
          </h1>
          <p className="text-lg text-martial-steel max-w-3xl mx-auto">
            Composants atomiques avec ambiance martiale : discipline, intensité, ordre.
            Interface moderne alliant ergonomie et esthétique militaire.
          </p>
        </header>

        {/* Boutons */}
        <section>
          <h2 className="text-2xl font-display font-bold text-martial-highlight mb-6">
            Boutons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Variants */}
            <Card>
              <CardHeader>
                <CardTitle>Variants</CardTitle>
                <CardDescription>
                  Différents styles pour diverses actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="primary" leftIcon={<PlayIcon className="w-4 h-4" />}>
                  Action Principale
                </Button>
                <Button variant="secondary" fullWidth>
                  Action Secondaire
                </Button>
                <Button variant="success" rightIcon={<CheckCircleIcon className="w-4 h-4" />}>
                  Succès
                </Button>
                <Button variant="cta" size="lg" weight="black">
                  COMMENCER LA SÉANCE
                </Button>
                <Button variant="ghost">
                  Fantôme
                </Button>
                <Button variant="emergency" size="sm">
                  URGENCE
                </Button>
              </CardContent>
            </Card>

            {/* Tailles */}
            <Card>
              <CardHeader>
                <CardTitle>Tailles</CardTitle>
                <CardDescription>
                  Du compact au héroïque
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button size="sm">Petit</Button>
                <Button size="md">Moyen</Button>
                <Button size="lg">Grand</Button>
                <Button size="xl" weight="black">Héros</Button>
                <Button size="icon" variant="secondary">
                  <UserIcon className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>

            {/* États */}
            <Card>
              <CardHeader>
                <CardTitle>États</CardTitle>
                <CardDescription>
                  Chargement et interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button loading>
                  Chargement...
                </Button>
                <Button disabled>
                  Désactivé
                </Button>
                <Button variant="primary" leftIcon={<PauseIcon className="w-4 h-4" />}>
                  Avec icône
                </Button>
                <Button variant="cta" rightIcon={<FireIcon className="w-4 h-4" />}>
                  CTA + Icône
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cartes */}
        <section>
          <h2 className="text-2xl font-display font-bold text-martial-highlight mb-6">
            Cartes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Carte standard */}
            <Card variant="default">
              <CardHeader>
                <CardTitle>Carte Standard</CardTitle>
                <CardDescription>
                  Contenu de base avec ombres martiaux
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-martial-steel">
                  Interface épurée avec esthétique militaire.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Action</Button>
              </CardFooter>
            </Card>

            {/* Carte interactive */}
            <Card variant="interactive" glowOnHover>
              <CardHeader>
                <CardTitle>Carte Interactive</CardTitle>
                <CardDescription>
                  Hover avec effet de lueur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-martial-steel">
                  Survol pour révéler les interactions.
                </p>
              </CardContent>
            </Card>

            {/* Carte héros */}
            <Card variant="hero" texture="metal">
              <CardHeader>
                <CardTitle>Dashboard Héros</CardTitle>
                <CardDescription>
                  Texture métallique subtile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-martial-danger-accent rounded-full flex items-center justify-center">
                    <TrophyIcon className="w-6 h-6 text-martial-highlight" />
                  </div>
                  <div>
                    <div className="text-2xl font-display font-bold text-martial-highlight">85%</div>
                    <div className="text-sm text-martial-steel">Progression</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carte d'exercice */}
            <WorkoutCard 
              difficulty="advanced" 
              category="CALLISTHENICS"
              className="col-span-full md:col-span-2"
            >
              <CardHeader>
                <CardTitle>Pompes Explosives</CardTitle>
                <CardDescription>
                  Exercice de haute intensité pour développer la puissance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-display font-bold text-martial-highlight">4</div>
                    <div className="text-sm text-martial-steel">Séries</div>
                  </div>
                  <div>
                    <div className="text-lg font-display font-bold text-martial-highlight">8-12</div>
                    <div className="text-sm text-martial-steel">Reps</div>
                  </div>
                  <div>
                    <div className="text-lg font-display font-bold text-martial-highlight">90s</div>
                    <div className="text-sm text-martial-steel">Repos</div>
                  </div>
                  <div>
                    <div className="text-lg font-display font-bold text-martial-highlight">15min</div>
                    <div className="text-sm text-martial-steel">Durée</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="cta" fullWidth>
                  COMMENCER L'EXERCICE
                </Button>
              </CardFooter>
            </WorkoutCard>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-2xl font-display font-bold text-martial-highlight mb-6">
            Champs de Saisie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Inputs Standard</CardTitle>
                <CardDescription>
                  Champs avec focus martial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Nom d'utilisateur"
                  placeholder="Entrez votre nom"
                  leftIcon={<UserIcon className="w-5 h-5" />}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                
                <Input
                  label="Mot de passe"
                  type="password"
                  placeholder="••••••••"
                  showPasswordToggle
                  required
                />
                
                <Input
                  variant="tactical"
                  label="Objectif du jour"
                  placeholder="Définir l'objectif..."
                  helperText="Bordure tactique rouge"
                />
                
                <SearchInput placeholder="Rechercher un exercice..." />
                
                <TimeInput 
                  label="Heure de début"
                  helperText="Format 24h"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>États & Validation</CardTitle>
                <CardDescription>
                  Feedback visuel martial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Email"
                  state="error"
                  errorMessage="Format d'email invalide"
                  placeholder="user@example.com"
                />
                
                <Input
                  label="Poids corporel"
                  state="success"
                  rightIcon={<span className="text-xs">kg</span>}
                  placeholder="70"
                />
                
                <Input
                  label="Répétitions"
                  state="warning"
                  helperText="Ajustez selon votre niveau"
                  placeholder="12"
                />
                
                <Textarea
                  variant="tactical"
                  label="Notes d'entraînement"
                  placeholder="Observations, sensations, améliorations..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  helperText="Zone de notes personnelles"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-display font-bold text-martial-highlight mb-6">
            Badges & Indicateurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Difficultés */}
            <Card>
              <CardHeader>
                <CardTitle>Niveaux de Difficulté</CardTitle>
                <CardDescription>
                  Chevrons de progression
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <DifficultyBadge level="beginner" />
                <DifficultyBadge level="intermediate" />
                <DifficultyBadge level="advanced" />
                <DifficultyBadge level="expert" />
              </CardContent>
            </Card>

            {/* Rangs */}
            <Card>
              <CardHeader>
                <CardTitle>Système de Rangs</CardTitle>
                <CardDescription>
                  Style tampons militaires
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <RankBadge rank="F" />
                <RankBadge rank="D" />
                <RankBadge rank="C" />
                <RankBadge rank="B" />
                <RankBadge rank="A" />
                <RankBadge rank="S" />
                <RankBadge rank="SS" />
              </CardContent>
            </Card>

            {/* Statuts */}
            <Card>
              <CardHeader>
                <CardTitle>États & Statuts</CardTitle>
                <CardDescription>
                  Indicateurs fonctionnels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <StatusBadge status="active" />
                <StatusBadge status="completed" />
                <StatusBadge status="pending" />
                <StatusBadge status="failed" />
                <StatusBadge status="locked" />
              </CardContent>
            </Card>

            {/* Variants supplémentaires */}
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Variants Spéciaux</CardTitle>
                <CardDescription>
                  Effets et styles avancés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="rank" style="stencil">STENCIL</Badge>
                  <Badge variant="elite" style="metallic">ÉLITE</Badge>
                  <Badge variant="danger" style="pulse">ALERTE</Badge>
                  <Badge variant="success" chevronCount={3}>MAÎTRISE</Badge>
                  <Badge variant="warning" style="chevron">PROGRESSION</Badge>
                  <CategoryBadge>Cardio</CategoryBadge>
                  <CategoryBadge>Force</CategoryBadge>
                  <CategoryBadge>Endurance</CategoryBadge>
                  <Badge 
                    variant="ghost" 
                    removable 
                    onRemove={() => alert('Badge supprimé')}
                  >
                    Supprimable
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <Card variant="hero" texture="grain">
            <CardHeader>
              <CardTitle>Directives d'Usage</CardTitle>
              <CardDescription>
                Principes de design martial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-display font-semibold text-martial-highlight mb-3">
                    Philosophie Martiale
                  </h4>
                  <ul className="space-y-2 text-sm text-martial-steel">
                    <li>• <strong>Discipline :</strong> Grille 8px, cohérence visuelle</li>
                    <li>• <strong>Intensité :</strong> Contrastes élevés, effets de focus</li>
                    <li>• <strong>Ordre :</strong> Hiérarchie claire, spacing précis</li>
                    <li>• <strong>Efficacité :</strong> Actions rapides, feedback immédiat</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-display font-semibold text-martial-highlight mb-3">
                    Microcopy & Ton
                  </h4>
                  <ul className="space-y-2 text-sm text-martial-steel">
                    <li>• <strong>Direct :</strong> "Commencer", "Terminer", "Valider"</li>
                    <li>• <strong>Commandant :</strong> Verbes d'action, impératif</li>
                    <li>• <strong>Motivant :</strong> "Discipline. Répète.", "Mission accomplie"</li>
                    <li>• <strong>Précis :</strong> Feedback spécifique et immédiat</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="cta" size="lg" weight="black" fullWidth>
                EXPLORER LES MOCKUPS D'ÉCRANS
              </Button>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default UIShowcase;
