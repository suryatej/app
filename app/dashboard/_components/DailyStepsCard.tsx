'use client';

import React, { useState, useEffect } from 'react';
import StepsProgressRing from './StepsProgressRing';
import StepsCounter from './StepsCounter';
import StepsStatistics from './StepsStatistics';
import StepsTrendChart from './StepsTrendChart';
import { StepsData } from '@/types/steps.types';
import { calculateDistance, calculateCalories, calculateActiveMinutes, calculateProgress } from '@/lib/utils/stepsCalculations';

interface DailyStepsCardProps {
  className?: string;
}

const DailyStepsCard: React.FC<DailyStepsCardProps> = ({ className = '' }) => {
  // Mock data for Phase 1 - will be replaced with actual state management in Phase 2
  const [currentSteps, setCurrentSteps] = useState(7342);
  const dailyGoal = 8000;

  // Calculate derived metrics
  const distance = calculateDistance(currentSteps);
  const calories = calculateCalories(currentSteps, 70); // Using 70kg as default weight
  const activeMinutes = calculateActiveMinutes(currentSteps);
  const progressPercentage = calculateProgress(currentSteps, dailyGoal);

  // Mock weekly data
  const weeklyData: StepsData[] = [
    {
      id: 'steps-2025-10-29',
      userId: 'user-123',
      date: '2025-10-29',
      stepCount: 5234,
      distance: 2.15,
      calories: 175,
      activeMinutes: 42,
      timestamp: '2025-10-29T23:59:59Z',
      source: 'phone',
      synced: true,
      createdAt: '2025-10-29T00:00:00Z',
      updatedAt: '2025-10-29T23:59:59Z',
    },
    {
      id: 'steps-2025-10-30',
      userId: 'user-123',
      date: '2025-10-30',
      stepCount: 8921,
      distance: 3.89,
      calories: 298,
      activeMinutes: 71,
      timestamp: '2025-10-30T23:59:59Z',
      source: 'phone',
      synced: true,
      createdAt: '2025-10-30T00:00:00Z',
      updatedAt: '2025-10-30T23:59:59Z',
    },
    {
      id: 'steps-2025-10-31',
      userId: 'user-123',
      date: '2025-10-31',
      stepCount: 10567,
      distance: 4.62,
      calories: 353,
      activeMinutes: 85,
      timestamp: '2025-10-31T23:59:59Z',
      source: 'phone',
      synced: true,
      createdAt: '2025-10-31T00:00:00Z',
      updatedAt: '2025-10-31T23:59:59Z',
    },
    {
      id: 'steps-2025-11-01',
      userId: 'user-123',
      date: '2025-11-01',
      stepCount: 9234,
      distance: 4.03,
      calories: 308,
      activeMinutes: 74,
      timestamp: '2025-11-01T23:59:59Z',
      source: 'phone',
      synced: true,
      createdAt: '2025-11-01T00:00:00Z',
      updatedAt: '2025-11-01T23:59:59Z',
    },
    {
      id: 'steps-2025-11-02',
      userId: 'user-123',
      date: '2025-11-02',
      stepCount: 6789,
      distance: 2.96,
      calories: 227,
      activeMinutes: 54,
      timestamp: '2025-11-02T23:59:59Z',
      source: 'phone',
      synced: true,
      createdAt: '2025-11-02T00:00:00Z',
      updatedAt: '2025-11-02T23:59:59Z',
    },
    {
      id: 'steps-2025-11-03',
      userId: 'user-123',
      date: '2025-11-03',
      stepCount: 11234,
      distance: 4.91,
      calories: 375,
      activeMinutes: 90,
      timestamp: '2025-11-03T23:59:59Z',
      source: 'phone',
      synced: true,
      createdAt: '2025-11-03T00:00:00Z',
      updatedAt: '2025-11-03T23:59:59Z',
    },
    {
      id: 'steps-2025-11-04',
      userId: 'user-123',
      date: '2025-11-04',
      stepCount: currentSteps,
      distance: distance,
      calories: calories,
      activeMinutes: activeMinutes,
      timestamp: new Date().toISOString(),
      source: 'phone',
      synced: false,
      createdAt: '2025-11-04T00:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  ];

  // Simulate step counting for demo purposes (Phase 1 only)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSteps((prev) => {
        // Randomly increment steps (5-25 steps every 10 seconds during active hours)
        const now = new Date();
        const hour = now.getHours();
        const isActiveHour = hour >= 7 && hour <= 22;
        const increment = isActiveHour ? Math.floor(Math.random() * 20) + 5 : 0;
        
        const newSteps = prev + increment;
        // Cap at reasonable maximum for demo
        return newSteps > 15000 ? prev : newSteps;
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const isGoalAchieved = currentSteps >= dailyGoal;

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 min-h-[420px] ${className}`}
      data-testid="daily-steps-card"
      aria-label="Daily steps tracking card"
      role="region"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
          Daily Steps
        </h3>
        {isGoalAchieved && (
          <div className="animate-bounce text-2xl" data-testid="celebration-banner">🎉</div>
        )}
      </div>

      {/* Progress Section */}
      <div className="flex flex-col items-center mb-6">
        <StepsProgressRing 
          percentage={progressPercentage}
          size={160}
          className="mb-4"
        />
        
        <StepsCounter
          count={currentSteps}
          goal={dailyGoal}
        />
      </div>

      {/* Statistics */}
      <div className="mb-6">
        <StepsStatistics
          distance={distance}
          calories={calories}
          activeMinutes={activeMinutes}
        />
      </div>

      {/* Trend Chart */}
      <StepsTrendChart
        weeklyData={weeklyData}
        dailyGoal={dailyGoal}
      />

      {/* Last Updated */}
      <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
        Updates automatically • Last sync: just now
      </div>
    </div>
  );
};

export default DailyStepsCard;
