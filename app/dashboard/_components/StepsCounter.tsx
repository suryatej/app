'use client';

import React, { useEffect, useState } from 'react';
import { formatStepCount } from '@/lib/utils/stepsCalculations';

interface StepsCounterProps {
  count: number;
  goal: number;
  className?: string;
}

const StepsCounter: React.FC<StepsCounterProps> = ({
  count,
  goal,
  className = '',
}) => {
  const [displayCount, setDisplayCount] = useState(count);

  // Animate count changes
  useEffect(() => {
    if (displayCount === count) return;

    const difference = count - displayCount;
    const increment = difference > 0 ? Math.ceil(difference / 10) : Math.floor(difference / 10);
    
    const timer = setTimeout(() => {
      setDisplayCount(prev => {
        const next = prev + increment;
        // Stop at target or when we've passed it
        if ((increment > 0 && next >= count) || (increment < 0 && next <= count)) {
          return count;
        }
        return next;
      });
    }, 30);

    return () => clearTimeout(timer);
  }, [displayCount, count]);

  const isGoalAchieved = count >= goal;

  return (
    <div className={`text-center ${className}`}>
      {/* Step Count */}
      <div 
        className={`font-bold text-4xl md:text-5xl transition-colors duration-300 ${
          isGoalAchieved 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-gray-900 dark:text-white'
        }`}
        data-testid="steps-counter"
      >
        {formatStepCount(displayCount)}
      </div>
      
      {/* Goal Indicator */}
      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        of {formatStepCount(goal)} goal
      </div>
      
      {/* Achievement Badge */}
      {isGoalAchieved && (
        <div className="mt-2 inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 rounded-full px-3 py-1 text-xs font-semibold animate-bounce">
          <span>🎯</span>
          <span>Goal Achieved!</span>
        </div>
      )}
    </div>
  );
};

export default StepsCounter;
