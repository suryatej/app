'use client';

import React from 'react';
import { formatDistance, formatCalories, formatActiveMinutes } from '@/lib/utils/stepsCalculations';

interface StepsStatisticsProps {
  distance: number;
  calories: number;
  activeMinutes: number;
  floors?: number;
  className?: string;
}

const StepsStatistics: React.FC<StepsStatisticsProps> = ({
  distance,
  calories,
  activeMinutes,
  floors,
  className = '',
}) => {
  const stats = [
    {
      icon: '📊',
      label: 'Distance',
      value: formatDistance(distance),
      ariaLabel: 'Distance walked',
    },
    {
      icon: '🔥',
      label: 'Calories',
      value: formatCalories(calories),
      ariaLabel: 'Calories burned',
    },
    {
      icon: '⏱️',
      label: 'Active',
      value: formatActiveMinutes(activeMinutes),
      ariaLabel: 'Active minutes',
    },
  ];

  // Add floors if provided
  if (floors !== undefined && floors > 0) {
    stats.push({
      icon: '🪜',
      label: 'Floors',
      value: `${floors}`,
      ariaLabel: 'Floors climbed',
    });
  }

  return (
    <div className={`grid grid-cols-3 gap-4 ${className}`} data-testid="steps-statistics">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center"
          aria-label={stat.ariaLabel}
        >
          {/* Icon */}
          <div className="text-2xl mb-1" aria-hidden="true">
            {stat.icon}
          </div>
          
          {/* Value */}
          <div className="text-base font-semibold text-gray-700 dark:text-gray-300">
            {stat.value}
          </div>
          
          {/* Label */}
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepsStatistics;
