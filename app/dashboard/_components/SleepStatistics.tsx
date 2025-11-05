'use client';

import { SleepStatistics as SleepStats } from '@/types/sleep.types';

interface SleepStatisticsProps {
  statistics: SleepStats;
}

export default function SleepStatistics({ statistics }: SleepStatisticsProps) {
  const { averageDuration, consistency, qualityScore, weeklyTrend } = statistics;

  // Format average duration
  const formatDuration = (hours: number): string => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  // Get trend display
  const getTrendDisplay = () => {
    const trendConfig = {
      improving: {
        icon: '📈',
        text: 'Improving',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
      },
      declining: {
        icon: '📉',
        text: 'Declining',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
      },
      stable: {
        icon: '➡️',
        text: 'Stable',
        color: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      },
    };
    return trendConfig[weeklyTrend];
  };

  const trend = getTrendDisplay();

  // Get score color based on value
  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const stats = [
    {
      label: 'Average Sleep',
      value: formatDuration(averageDuration),
      icon: '⏱️',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Consistency',
      value: `${consistency}%`,
      icon: '📊',
      color: getScoreColor(consistency),
      bgColor: 'bg-gray-50 dark:bg-gray-800/50',
    },
    {
      label: 'Quality Score',
      value: `${qualityScore}%`,
      icon: '⭐',
      color: getScoreColor(qualityScore),
      bgColor: 'bg-gray-50 dark:bg-gray-800/50',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Sleep Statistics
        </h3>
        
        {/* Trend Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${trend.bgColor}`}>
          <span className="text-sm">{trend.icon}</span>
          <span className={`text-xs font-medium ${trend.color}`}>
            {trend.text}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bgColor} rounded-lg p-4 transition-transform hover:scale-105`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </span>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-2">
          <span className="text-lg">💡</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
              Sleep Insight
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              {qualityScore >= 80
                ? 'Excellent! Your sleep quality is outstanding. Keep up the great habits!'
                : qualityScore >= 60
                ? 'Good progress! Try maintaining a consistent sleep schedule for better results.'
                : qualityScore >= 40
                ? 'Your sleep could improve. Consider a relaxing bedtime routine.'
                : 'Focus on getting 7-9 hours of sleep and establishing a regular schedule.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
