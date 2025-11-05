'use client';

import { SleepStages } from '@/types/sleep.types';

interface SleepQualityMetricsProps {
  stages: SleepStages;
  totalDuration: number; // in hours
}

export default function SleepQualityMetrics({ stages, totalDuration }: SleepQualityMetricsProps) {
  const totalMinutes = totalDuration * 60;

  // Calculate percentages
  const getPercentage = (minutes: number): number => {
    if (totalMinutes === 0) return 0;
    return Math.round((minutes / totalMinutes) * 100);
  };

  // Format minutes to hours and minutes
  const formatTime = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
  };

  const metrics = [
    {
      label: 'Deep',
      icon: '🌙',
      minutes: stages.deep,
      percentage: getPercentage(stages.deep),
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-700 dark:text-indigo-300',
    },
    {
      label: 'REM',
      icon: '✨',
      minutes: stages.rem,
      percentage: getPercentage(stages.rem),
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
    },
    {
      label: 'Light',
      icon: '☁️',
      minutes: stages.light,
      percentage: getPercentage(stages.light),
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      label: 'Awake',
      icon: '👁️',
      minutes: stages.awake,
      percentage: getPercentage(stages.awake),
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Sleep Stages
      </h3>
      
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className={`${metric.bgColor} rounded-lg p-3 transition-transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{metric.icon}</span>
                <span className={`text-xs font-medium ${metric.textColor}`}>
                  {metric.label}
                </span>
              </div>
              <span className={`text-xs font-semibold ${metric.textColor}`}>
                {metric.percentage}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
              <div
                className={`${metric.color} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${metric.percentage}%` }}
              />
            </div>
            
            <div className={`text-sm font-bold ${metric.textColor}`}>
              {formatTime(metric.minutes)}
            </div>
          </div>
        ))}
      </div>

      {/* Sleep Quality Insights */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-semibold">Tip:</span> Aim for 15-25% deep sleep and 20-25% REM sleep for optimal rest.
        </p>
      </div>
    </div>
  );
}
