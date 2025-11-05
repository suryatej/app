'use client';

import { useEffect, useState } from 'react';

interface SleepProgressRingProps {
  duration: number;
  goal: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  progress: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function SleepProgressRing({
  duration,
  goal,
  quality,
  progress,
  size = 'md',
}: SleepProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-36 h-36',
      strokeWidth: 10,
      radius: 60,
      fontSize: 'text-2xl',
      labelSize: 'text-xs',
    },
    md: {
      container: 'w-40 h-40 md:w-48 md:h-48',
      strokeWidth: 12,
      radius: 70,
      fontSize: 'text-3xl md:text-4xl',
      labelSize: 'text-sm',
    },
    lg: {
      container: 'w-48 h-48 md:w-56 md:h-56',
      strokeWidth: 14,
      radius: 80,
      fontSize: 'text-4xl md:text-5xl',
      labelSize: 'text-base',
    },
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  // Quality color gradients
  const qualityColors = {
    excellent: {
      gradient: 'from-purple-500 to-indigo-500',
      stroke: '#8b5cf6',
      glow: 'shadow-purple-500/50',
    },
    good: {
      gradient: 'from-blue-500 to-cyan-500',
      stroke: '#3b82f6',
      glow: 'shadow-blue-500/50',
    },
    fair: {
      gradient: 'from-yellow-500 to-orange-500',
      stroke: '#f59e0b',
      glow: 'shadow-yellow-500/50',
    },
    poor: {
      gradient: 'from-red-500 to-pink-500',
      stroke: '#ef4444',
      glow: 'shadow-red-500/50',
    },
  };

  const colors = qualityColors[quality];

  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);

    return () => clearTimeout(timer);
  }, [progress]);

  // Format duration for display
  const formatDuration = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`relative ${config.container}`}>
        {/* Background Circle */}
        <svg
          className="transform -rotate-90"
          width="100%"
          height="100%"
          viewBox={`0 0 ${config.radius * 2 + config.strokeWidth * 2} ${config.radius * 2 + config.strokeWidth * 2}`}
        >
          <circle
            cx={config.radius + config.strokeWidth}
            cy={config.radius + config.strokeWidth}
            r={config.radius}
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          
          {/* Progress Circle */}
          <circle
            cx={config.radius + config.strokeWidth}
            cy={config.radius + config.strokeWidth}
            r={config.radius}
            stroke={colors.stroke}
            strokeWidth={config.strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: 'drop-shadow(0 0 8px currentColor)',
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold ${config.fontSize} bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
            {formatDuration(duration)}
          </div>
          <div className={`${config.labelSize} text-gray-500 dark:text-gray-400 mt-1`}>
            Goal: {goal}h
          </div>
        </div>
      </div>

      {/* Progress Percentage */}
      <div className="mt-4 text-center">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {Math.round(animatedProgress)}% Complete
        </div>
      </div>
    </div>
  );
}
