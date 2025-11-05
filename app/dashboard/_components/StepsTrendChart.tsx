'use client';

import React from 'react';
import { StepsData } from '@/types/steps.types';

interface StepsTrendChartProps {
  weeklyData: StepsData[];
  dailyGoal: number;
  className?: string;
}

const StepsTrendChart: React.FC<StepsTrendChartProps> = ({
  weeklyData,
  dailyGoal,
  className = '',
}) => {
  if (!weeklyData || weeklyData.length === 0) {
    return null;
  }

  // Normalize data to chart height (0-100)
  const maxSteps = Math.max(...weeklyData.map(d => d.stepCount), dailyGoal);
  const chartHeight = 48; // Height in pixels
  
  const getBarHeight = (steps: number) => {
    return (steps / maxSteps) * chartHeight;
  };

  const getDayLabel = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const isGoalMet = (steps: number) => {
    return steps >= dailyGoal;
  };

  return (
    <div className={className} data-testid="steps-trend-chart">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Last 7 Days
        </h4>
        <div className="text-xs text-gray-500 dark:text-gray-500">
          Goal: {(dailyGoal / 1000).toFixed(0)}k
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between gap-2" style={{ height: `${chartHeight + 20}px` }}>
        {weeklyData.map((day, index) => {
          const barHeight = getBarHeight(day.stepCount);
          const goalMet = isGoalMet(day.stepCount);
          const today = isToday(day.date);

          return (
            <div
              key={day.id || index}
              className="flex-1 flex flex-col items-center justify-end gap-1"
            >
              {/* Bar */}
              <div
                className={`w-full rounded-t transition-all duration-300 ${
                  goalMet
                    ? 'bg-green-500 dark:bg-green-400'
                    : 'bg-green-200 dark:bg-green-800'
                } ${today ? 'ring-2 ring-green-600 dark:ring-green-300' : ''}`}
                style={{ height: `${barHeight}px`, minHeight: '4px' }}
                title={`${day.stepCount.toLocaleString()} steps on ${day.date}`}
              />
              
              {/* Day Label */}
              <div
                className={`text-[10px] ${
                  today
                    ? 'font-bold text-green-600 dark:text-green-400'
                    : 'text-gray-500 dark:text-gray-500'
                }`}
              >
                {getDayLabel(day.date)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500 dark:bg-green-400" />
          <span>Goal met</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-200 dark:bg-green-800" />
          <span>In progress</span>
        </div>
      </div>
    </div>
  );
};

export default StepsTrendChart;
