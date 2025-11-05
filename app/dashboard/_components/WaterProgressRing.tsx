'use client';

import React from 'react';

interface WaterProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

const WaterProgressRing: React.FC<WaterProgressRingProps> = ({
  percentage,
  size = 160,
  strokeWidth = 8,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      data-testid="water-progress-ring"
      data-progress={percentage.toFixed(0)}
    >
      {/* SVG Progress Ring */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-blue-100 dark:text-blue-900"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-blue-500 dark:text-blue-400 transition-all duration-300 ease-out"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl mb-1">💧</div>
        <div className="font-bold text-3xl text-blue-600 dark:text-blue-400">
          {percentage.toFixed(0)}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          of goal
        </div>
      </div>
    </div>
  );
};

export default WaterProgressRing;