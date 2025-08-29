import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter,
  Input,
  TimeInput,
  Badge 
} from '../ui';
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';

interface ScheduleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: ScheduleData) => void;
}

interface TimeSlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  day: string;
  type: 'workout' | 'rest' | 'meal';
  color: string;
}

interface ScheduleData {
  dayStartTime: string;
  dayEndTime: string;
  timeSlots: TimeSlot[];
}

const ScheduleEditorModal: React.FC<ScheduleEditorModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    dayStartTime: '06:00',
    dayEndTime: '22:00',
    timeSlots: [
      {
        id: '1',
        name: 'Entraînement Matinal',
        startTime: '07:00',
        endTime: '08:00',
        day: 'monday',
        type: 'workout',
        color: '#9E1B1B'
      },
      {
        id: '2',
        name: 'Cardio Intense',
        startTime: '18:00',
        endTime: '19:00',
        day: 'wednesday',
        type: 'workout',
        color: '#9E1B1B'
      },
      {
        id: '3',
        name: 'Recovery Session',
        startTime: '10:00',
        endTime: '11:00',
        day: 'sunday',
        type: 'rest',
        color: '#2D5A2D'
      }
    ]
  });

  const [draggedSlot, setDraggedSlot] = useState<TimeSlot | null>(null);
  const [newSlot, setNewSlot] = useState({
    name: '',
    startTime: '09:00',
    endTime: '10:00',
    type: 'workout' as TimeSlot['type']
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const daysOfWeek = [
    { id: 'monday', label: 'LUN', fullName: 'Lundi' },
    { id: 'tuesday', label: 'MAR', fullName: 'Mardi' },
    { id: 'wednesday', label: 'MER', fullName: 'Mercredi' },
    { id: 'thursday', label: 'JEU', fullName: 'Jeudi' },
    { id: 'friday', label: 'VEN', fullName: 'Vendredi' },
    { id: 'saturday', label: 'SAM', fullName: 'Samedi' },
    { id: 'sunday', label: 'DIM', fullName: 'Dimanche' }
  ];

  const timeSlotTypes = [
    { value: 'workout', label: 'Entraînement', color: '#9E1B1B' },
    { value: 'rest', label: 'Récupération', color: '#2D5A2D' },
    { value: 'meal', label: 'Nutrition', color: '#8B6914' }
  ];

  // Générer les heures de la journée
  const generateTimeSlots = () => {
    const slots = [];
    const start = parseInt(scheduleData.dayStartTime.split(':')[0]);
    const end = parseInt(scheduleData.dayEndTime.split(':')[0]);
    
    for (let hour = start; hour <= end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  // Validation
  const validateSchedule = (): string[] => {
    const errors: string[] = [];
    
    if (scheduleData.dayStartTime >= scheduleData.dayEndTime) {
      errors.push('L\'heure de fin doit être après l\'heure de début');
    }

    // Vérifier les conflits d'horaires
    const slotsByDay = scheduleData.timeSlots.reduce((acc, slot) => {
      if (!acc[slot.day]) acc[slot.day] = [];
      acc[slot.day].push(slot);
      return acc;
    }, {} as Record<string, TimeSlot[]>);

    Object.entries(slotsByDay).forEach(([day, slots]) => {
      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          const slot1 = slots[i];
          const slot2 = slots[j];
          
          if (
            (slot1.startTime < slot2.endTime && slot1.endTime > slot2.startTime) ||
            (slot2.startTime < slot1.endTime && slot2.endTime > slot1.startTime)
          ) {
            errors.push(`Conflit d'horaire ${daysOfWeek.find(d => d.id === day)?.fullName}: ${slot1.name} et ${slot2.name}`);
          }
        }
      }
    });

    return errors;
  };

  // Drag & Drop handlers
  const handleDragStart = (slot: TimeSlot) => {
    setDraggedSlot(slot);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, day: string, timeSlot: string) => {
    e.preventDefault();
    if (!draggedSlot) return;

    const updatedSlots = scheduleData.timeSlots.map(slot => 
      slot.id === draggedSlot.id 
        ? { ...slot, day, startTime: timeSlot, endTime: addOneHour(timeSlot) }
        : slot
    );

    setScheduleData(prev => ({ ...prev, timeSlots: updatedSlots }));
    setDraggedSlot(null);
  };

  const addOneHour = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const newHours = (hours + 1) % 24;
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Ajouter un nouveau créneau
  const addNewSlot = () => {
    if (!newSlot.name.trim()) return;

    const newTimeSlot: TimeSlot = {
      id: Date.now().toString(),
      name: newSlot.name,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      day: 'monday',
      type: newSlot.type,
      color: timeSlotTypes.find(t => t.value === newSlot.type)?.color || '#9E1B1B'
    };

    setScheduleData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newTimeSlot]
    }));

    setNewSlot({
      name: '',
      startTime: '09:00',
      endTime: '10:00',
      type: 'workout'
    });
  };

  // Supprimer un créneau
  const removeSlot = (slotId: string) => {
    setScheduleData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter(slot => slot.id !== slotId)
    }));
  };

  // Sauvegarder avec validation
  const handleSave = () => {
    const errors = validateSchedule();
    setValidationErrors(errors);
    
    if (errors.length === 0) {
      onSave(scheduleData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-martial-overlay backdrop-blur-martial">
      <div className="schedule-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="flex items-center space-x-3">
            <CalendarDaysIcon className="w-6 h-6 text-martial-danger-accent" />
            <div>
              <h2 className="text-xl font-display font-bold text-martial-highlight">
                ÉDITEUR DE PLANNING
              </h2>
              <p className="text-sm text-martial-steel">
                Configuration des horaires d'entraînement
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
          </Button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Configuration générale */}
          <Card variant="stats">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClockIcon className="w-5 h-5 mr-2" />
                Configuration Journalière
              </CardTitle>
              <CardDescription>
                Définir les heures de début et fin de journée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <TimeInput
                  label="Heure de début"
                  value={scheduleData.dayStartTime}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, dayStartTime: e.target.value }))}
                />
                <TimeInput
                  label="Heure de fin"
                  value={scheduleData.dayEndTime}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, dayEndTime: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ajouter nouveau créneau */}
          <Card variant="interactive">
            <CardHeader>
              <CardTitle>Ajouter un Créneau</CardTitle>
              <CardDescription>
                Créer un nouveau créneau d'entraînement ou de récupération
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  label="Nom du créneau"
                  placeholder="ex: Cardio matinal"
                  value={newSlot.name}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, name: e.target.value }))}
                />
                <TimeInput
                  label="Début"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                />
                <TimeInput
                  label="Fin"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                />
                <div>
                  <label className="block text-sm font-display font-semibold text-martial-highlight mb-2 uppercase tracking-wide">
                    Type
                  </label>
                  <select
                    value={newSlot.type}
                    onChange={(e) => setNewSlot(prev => ({ ...prev, type: e.target.value as TimeSlot['type'] }))}
                    className="martial-input"
                  >
                    {timeSlotTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  variant="primary" 
                  onClick={addNewSlot}
                  disabled={!newSlot.name.trim()}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  AJOUTER LE CRÉNEAU
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Planning hebdomadaire avec drag & drop */}
          <Card variant="hero">
            <CardHeader>
              <CardTitle>Planning Hebdomadaire</CardTitle>
              <CardDescription>
                Glisser-déposer les créneaux sur le planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header des jours */}
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    <div className="font-display font-bold text-martial-steel text-sm uppercase">
                      Heures
                    </div>
                    {daysOfWeek.map(day => (
                      <div key={day.id} className="text-center">
                        <div className="font-display font-bold text-martial-highlight">{day.label}</div>
                        <div className="text-xs text-martial-steel">{day.fullName}</div>
                      </div>
                    ))}
                  </div>

                  {/* Grille horaire */}
                  <div className="space-y-1">
                    {generateTimeSlots().map(timeSlot => (
                      <div key={timeSlot} className="grid grid-cols-8 gap-2">
                        <div className="text-sm text-martial-steel font-mono py-2">
                          {timeSlot}
                        </div>
                        {daysOfWeek.map(day => {
                          const slotInCell = scheduleData.timeSlots.find(
                            slot => slot.day === day.id && slot.startTime === timeSlot
                          );

                          return (
                            <div
                              key={`${day.id}-${timeSlot}`}
                              className="h-12 border border-martial-steel/20 rounded-md p-1 relative"
                              onDragOver={handleDragOver}
                              onDrop={(e) => handleDrop(e, day.id, timeSlot)}
                            >
                              {slotInCell && (
                                <div
                                  draggable
                                  onDragStart={() => handleDragStart(slotInCell)}
                                  className="h-full rounded-sm p-1 text-xs font-bold text-martial-highlight cursor-move flex items-center justify-between transition-transform hover:scale-105"
                                  style={{ backgroundColor: slotInCell.color }}
                                >
                                  <span className="truncate">{slotInCell.name}</span>
                                  <Bars3Icon className="w-3 h-3 opacity-50" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des créneaux existants */}
          <Card variant="default">
            <CardHeader>
              <CardTitle>Créneaux Configurés</CardTitle>
              <CardDescription>
                Gérer les créneaux existants
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scheduleData.timeSlots.length === 0 ? (
                <div className="text-center py-8 text-martial-steel">
                  Aucun créneau configuré
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduleData.timeSlots.map(slot => (
                    <div 
                      key={slot.id}
                      className="flex items-center justify-between p-3 rounded-md bg-martial-surface-hover border border-martial-steel/20"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-sm"
                          style={{ backgroundColor: slot.color }}
                        />
                        <div>
                          <div className="font-display font-semibold text-martial-highlight">
                            {slot.name}
                          </div>
                          <div className="text-sm text-martial-steel">
                            {daysOfWeek.find(d => d.id === slot.day)?.fullName} • {slot.startTime} - {slot.endTime}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="category" size="xs">
                          {timeSlotTypes.find(t => t.value === slot.type)?.label}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSlot(slot.id)}
                        >
                          <TrashIcon className="w-4 h-4 text-martial-danger-accent" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Card variant="emergency">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <ExclamationTriangleIcon className="w-6 h-6 text-martial-danger-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-display font-bold text-martial-highlight mb-2">
                      Erreurs de Validation
                    </div>
                    <ul className="space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="text-sm text-martial-steel">
                          • {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <Button variant="ghost" onClick={onClose}>
            ANNULER
          </Button>
          <Button 
            variant="cta" 
            onClick={handleSave}
            rightIcon={<CheckCircleIcon className="w-5 h-5" />}
          >
            ENREGISTRER LE PLANNING
          </Button>
        </div>
      </div>
    </div>
  );
};

// Composant de démo pour afficher la modal
const ScheduleEditorDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (schedule: ScheduleData) => {
    console.log('Planning sauvegardé:', schedule);
    // Ici on sauvegarderait en base de données
  };

  return (
    <div className="p-8 bg-martial-primary-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-display font-black text-martial-highlight mb-4">
            ÉDITEUR DE PLANNING D'ENTRAÎNEMENT
          </h1>
          <p className="text-lg text-martial-steel max-w-2xl mx-auto mb-8">
            Modal centrée avec gestion des horaires, drag & drop hebdomadaire, 
            et validation complète pour organiser vos séances d'entraînement.
          </p>
          
          <Button 
            variant="cta" 
            size="lg" 
            onClick={() => setIsModalOpen(true)}
            rightIcon={<CalendarDaysIcon className="w-5 h-5" />}
          >
            OUVRIR L'ÉDITEUR DE PLANNING
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="stats">
            <CardContent className="text-center p-6">
              <ClockIcon className="w-8 h-8 text-martial-danger-accent mx-auto mb-3" />
              <h3 className="font-display font-bold text-martial-highlight mb-2">
                Configuration Horaire
              </h3>
              <p className="text-sm text-martial-steel">
                Définition des heures de début et fin de journée d'entraînement
              </p>
            </CardContent>
          </Card>

          <Card variant="stats">
            <CardContent className="text-center p-6">
              <Bars3Icon className="w-8 h-8 text-martial-danger-accent mx-auto mb-3" />
              <h3 className="font-display font-bold text-martial-highlight mb-2">
                Drag & Drop
              </h3>
              <p className="text-sm text-martial-steel">
                Interface intuitive pour organiser les créneaux sur la semaine
              </p>
            </CardContent>
          </Card>

          <Card variant="stats">
            <CardContent className="text-center p-6">
              <CheckCircleIcon className="w-8 h-8 text-martial-danger-accent mx-auto mb-3" />
              <h3 className="font-display font-bold text-martial-highlight mb-2">
                Validation
              </h3>
              <p className="text-sm text-martial-steel">
                Détection automatique des conflits et validation des horaires
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <ScheduleEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default ScheduleEditorDemo;
export { ScheduleEditorModal };
