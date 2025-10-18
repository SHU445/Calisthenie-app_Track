'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  RadialLinearScale,
  ArcElement,
} from 'chart.js';
import { Line, Bar, PolarArea } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { useThemeStore } from '@/stores/themeStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  RadialLinearScale,
  ArcElement
);

interface ExerciseStats {
  exerciseId: string;
  exerciseName: string;
  maxValue: number;
  totalValue: number;
  totalSets: number;
  averageValue: number;
  averageSets: number;
  type: 'repetitions' | 'temps';
  data: { date: string; value: number; sets: number }[];
}

interface DistributionData {
  labels: string[];
  values: number[];
  sets: number[];
}

interface ProgressChartsProps {
  exerciseStats: ExerciseStats[];
  singleExercise: boolean;
  distributionData?: DistributionData;
}

const ProgressCharts = ({ exerciseStats, singleExercise, distributionData }: ProgressChartsProps) => {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === 'dark';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#E5E7EB' : '#374151',
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#374151' : '#F9FAFB',
        titleColor: isDark ? '#E5E7EB' : '#111827',
        bodyColor: isDark ? '#E5E7EB' : '#111827',
        borderColor: isDark ? '#6B7280' : '#D1D5DB',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
          displayFormats: {
            day: 'dd/MM',
          },
        },
        grid: {
          color: isDark ? '#374151' : '#E5E7EB',
        },
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? '#374151' : '#E5E7EB',
        },
        ticks: {
          color: isDark ? '#9CA3AF' : '#6B7280',
        },
      },
    },
  };

  const colors = [
    { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgb(59, 130, 246)' }, // Bleu vif distinct
    { bg: 'rgba(34, 197, 94, 0.8)', border: 'rgb(34, 197, 94)' }, // Vert emeraude
    { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgb(239, 68, 68)' }, // Rouge corail
    { bg: 'rgba(245, 158, 11, 0.8)', border: 'rgb(245, 158, 11)' }, // Orange ambre
    { bg: 'rgba(147, 51, 234, 0.8)', border: 'rgb(147, 51, 234)' }, // Violet profond
    { bg: 'rgba(6, 182, 212, 0.8)', border: 'rgb(6, 182, 212)' }, // Cyan turquoise
    { bg: 'rgba(236, 72, 153, 0.8)', border: 'rgb(236, 72, 153)' }, // Rose fuchsia
    { bg: 'rgba(156, 163, 175, 0.8)', border: 'rgb(156, 163, 175)' }, // Gris neutre
  ];

  const renderValueChart = (stats: ExerciseStats, colorIndex: number) => {
    const data = {
      labels: stats.data.map(d => d.date),
      datasets: [
        {
          label: `${stats.exerciseName} (${stats.type === 'temps' ? 'secondes' : 'répétitions'})`,
          data: stats.data.map(d => ({ x: d.date, y: d.value })),
          backgroundColor: colors[colorIndex % colors.length].bg,
          borderColor: colors[colorIndex % colors.length].border,
          borderWidth: 2,
          tension: stats.type === 'repetitions' ? 0.4 : 0,
          pointBackgroundColor: colors[colorIndex % colors.length].border,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
        },
      ],
    };

    if (stats.type === 'repetitions') {
      return (
        <Line 
          data={data} 
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: true,
                text: singleExercise ? 'Évolution des répétitions' : `${stats.exerciseName} - Répétitions`,
                color: isDark ? '#E5E7EB' : '#374151',
              },
            },
          }} 
        />
      );
    } else {
      return (
        <Line 
          data={data} 
          options={{
            ...chartOptions,
            plugins: {
              ...chartOptions.plugins,
              title: {
                display: true,
                text: singleExercise ? 'Évolution du temps de hold' : `${stats.exerciseName} - Temps de hold`,
                color: isDark ? '#E5E7EB' : '#374151',
              },
            },
          }} 
        />
      );
    }
  };


  const renderSetsLineChart = (stats: ExerciseStats, colorIndex: number) => {
    const data = {
      labels: stats.data.map(d => d.date),
      datasets: [
        {
          label: `${stats.exerciseName} - Séries`,
          data: stats.data.map(d => ({ x: d.date, y: d.sets })),
          backgroundColor: colors[colorIndex % colors.length].bg,
          borderColor: colors[colorIndex % colors.length].border,
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: colors[colorIndex % colors.length].border,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          fill: false,
        },
      ],
    };

    return (
      <Line 
        data={data} 
        options={{
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            title: {
              display: true,
              text: singleExercise ? 'Évolution des séries' : `${stats.exerciseName} - Séries`,
              color: isDark ? '#E5E7EB' : '#374151',
            },
          },
        }} 
      />
    );
  };

  const renderDistributionChart = (data: number[], labels: string[], title: string, unit: string) => {
    const polarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const,
          labels: {
            color: isDark ? '#E5E7EB' : '#374151',
            usePointStyle: true,
            padding: 20,
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#374151' : '#F9FAFB',
          titleColor: isDark ? '#E5E7EB' : '#111827',
          bodyColor: isDark ? '#E5E7EB' : '#111827',
          borderColor: isDark ? '#6B7280' : '#D1D5DB',
          borderWidth: 1,
          callbacks: {
            label: (context: any) => {
              const value = context.raw || context.parsed || 0;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
              return `${context.label}: ${value} ${unit} (${percentage}%)`;
            }
          }
        },
        title: {
          display: true,
          text: title,
          color: isDark ? '#E5E7EB' : '#374151',
          font: {
            size: 16,
            weight: 'bold' as const,
          },
          padding: {
            bottom: 20
          }
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          grid: {
            color: isDark ? '#374151' : '#E5E7EB',
          },
          pointLabels: {
            color: isDark ? '#9CA3AF' : '#6B7280',
          },
          ticks: {
            color: isDark ? '#9CA3AF' : '#6B7280',
            backdropColor: 'transparent',
          },
        },
      },
    };

    const chartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: colors.map(c => c.bg),
          borderColor: colors.map(c => c.border),
          borderWidth: 2,
        },
      ],
    };

    return (
      <PolarArea 
        data={chartData} 
        options={polarOptions}
      />
    );
  };

  if (singleExercise && exerciseStats.length === 1) {
    // Pour un seul exercice : valeurs et séries en courbes côte à côte
    const stats = exerciseStats[0];
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          {renderValueChart(stats, 0)}
        </div>
        <div className="h-80">
          {renderSetsLineChart(stats, 0)}
        </div>
      </div>
    );
  } else {
    // Pour plusieurs exercices : graphiques individuels + graphiques de répartition
    return (
      <div className="space-y-8">
        {/* Graphiques de répartition polar area */}
        {distributionData && distributionData.labels.length > 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-lg shadow-md p-6">
              <div className="h-80">
                {renderDistributionChart(
                  distributionData.values, 
                  distributionData.labels, 
                  'Répartition des Répétitions/Temps',
                  'total'
                )}
              </div>
            </div>
            <div className="rounded-lg shadow-md p-6">
              <div className="h-80">
                {renderDistributionChart(
                  distributionData.sets, 
                  distributionData.labels, 
                  'Répartition des Séries',
                  'séries'
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Graphiques individuels par exercice */}
        <div className="space-y-6">
          {exerciseStats.map((stats, index) => (
            <div key={stats.exerciseId} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64">
                {renderValueChart(stats, index)}
              </div>
              <div className="h-64">
                {renderSetsLineChart(stats, index)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default ProgressCharts; 