import { SleepSession, SleepStatistics, SleepStages, HealthKitSleepSample, SleepGoal } from '@/types/sleep.types';

/**
 * Calculate comprehensive sleep statistics from an array of sleep sessions
 */
export const calculateSleepStatistics = (sessions: SleepSession[]): SleepStatistics => {
  if (sessions.length === 0) {
    return {
      averageDuration: 0,
      consistency: 0,
      qualityScore: 0,
      weeklyTrend: 'stable',
    };
  }

  // Calculate average duration
  const averageDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;

  // Calculate consistency (lower variance = higher consistency)
  const variance = sessions.reduce((sum, s) => {
    return sum + Math.pow(s.duration - averageDuration, 2);
  }, 0) / sessions.length;
  const consistency = Math.max(0, 100 - (variance * 10));

  // Calculate quality score
  const qualityMap = { excellent: 100, good: 75, fair: 50, poor: 25 };
  const qualityScore = sessions.reduce((sum, s) => sum + qualityMap[s.quality], 0) / sessions.length;

  // Determine trend (compare first half vs second half)
  const midpoint = Math.floor(sessions.length / 2);
  const recentSessions = sessions.slice(0, midpoint);
  const olderSessions = sessions.slice(midpoint);
  
  const recentAvg = recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length;
  const olderAvg = olderSessions.reduce((sum, s) => sum + s.duration, 0) / olderSessions.length;
  
  const weeklyTrend = recentAvg > olderAvg + 0.5 ? 'improving' 
    : recentAvg < olderAvg - 0.5 ? 'declining' 
    : 'stable';

  // Find best and worst sleep
  const sortedByQuality = [...sessions].sort((a, b) => {
    const qualityOrder = { excellent: 4, good: 3, fair: 2, poor: 1 };
    return qualityOrder[b.quality] - qualityOrder[a.quality];
  });

  return {
    averageDuration,
    consistency: Math.round(consistency),
    qualityScore: Math.round(qualityScore),
    weeklyTrend,
    bestSleep: sortedByQuality[0],
    worstSleep: sortedByQuality[sortedByQuality.length - 1],
  };
};

/**
 * Parse sleep stages from HealthKit samples
 */
export const parseSleepStages = (samples: HealthKitSleepSample[]): SleepStages => {
  const stages: SleepStages = {
    deep: 0,
    rem: 0,
    light: 0,
    awake: 0,
  };

  samples.forEach(sample => {
    switch (sample.value) {
      case 'Deep':
        stages.deep += sample.duration;
        break;
      case 'REM':
        stages.rem += sample.duration;
        break;
      case 'Light':
      case 'Asleep':
        stages.light += sample.duration;
        break;
      case 'Awake':
        stages.awake += sample.duration;
        break;
    }
  });

  return stages;
};

/**
 * Get color gradient class based on sleep quality
 */
export const getSleepQualityColor = (quality: 'excellent' | 'good' | 'fair' | 'poor'): string => {
  const colors = {
    excellent: 'from-purple-500 to-indigo-500',
    good: 'from-blue-500 to-cyan-500',
    fair: 'from-yellow-500 to-orange-500',
    poor: 'from-red-500 to-pink-500',
  };
  return colors[quality];
};

/**
 * Determine sleep quality based on duration and sleep stages
 */
export const determineSleepQuality = (
  duration: number,
  stages: SleepStages
): 'excellent' | 'good' | 'fair' | 'poor' => {
  const totalMinutes = duration * 60;
  
  // Calculate percentages
  const deepPercent = (stages.deep / totalMinutes) * 100;
  const remPercent = (stages.rem / totalMinutes) * 100;
  
  // Optimal duration range check (7-9 hours)
  if (duration >= 7 && duration <= 9) {
    // Excellent: Good duration with quality stages
    if (deepPercent >= 15 && remPercent >= 20) return 'excellent';
    
    // Good: Good duration with acceptable stages
    if (deepPercent >= 10 && remPercent >= 15) return 'good';
    
    // Fair: Good duration but poor stages
    return 'fair';
  }
  
  // Outside optimal range
  if (duration >= 6 && duration < 7) return 'fair';
  if (duration > 9 && duration <= 10) return 'fair';
  
  return 'poor';
};

/**
 * Calculate progress percentage towards sleep goal
 */
export const calculateSleepProgress = (duration: number, goal: SleepGoal): number => {
  const { minHours, maxHours, targetHours } = goal;
  
  if (duration < minHours) {
    // Below minimum: 0-50% progress
    return (duration / minHours) * 50;
  } else if (duration >= minHours && duration <= maxHours) {
    // In optimal range: 50-100% progress
    return 50 + ((duration - minHours) / (maxHours - minHours)) * 50;
  } else {
    // Over maximum: decrease from 100%
    return Math.max(50, 100 - Math.min((duration - maxHours) * 10, 50));
  }
};

/**
 * Format duration for display
 */
export const formatSleepDuration = (hours: number): string => {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

/**
 * Format time for display (e.g., "11:30 PM")
 */
export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

/**
 * Calculate total sleep time in hours from stages
 */
export const calculateTotalSleepTime = (stages: SleepStages): number => {
  const totalMinutes = stages.deep + stages.rem + stages.light;
  return totalMinutes / 60;
};

/**
 * Get sleep stage percentage
 */
export const getStagePercentage = (stageMinutes: number, totalDuration: number): number => {
  if (totalDuration === 0) return 0;
  return Math.round((stageMinutes / (totalDuration * 60)) * 100);
};

/**
 * Check if sleep goal is met
 */
export const isSleepGoalMet = (duration: number, goal: SleepGoal): boolean => {
  return duration >= goal.minHours && duration <= goal.maxHours;
};

/**
 * Get trend icon based on trend direction
 */
export const getTrendIcon = (trend: 'improving' | 'declining' | 'stable'): string => {
  const icons = {
    improving: '📈',
    declining: '📉',
    stable: '➡️',
  };
  return icons[trend];
};

/**
 * Get quality badge color
 */
export const getQualityBadgeColor = (quality: 'excellent' | 'good' | 'fair' | 'poor'): string => {
  const colors = {
    excellent: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    good: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    fair: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    poor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };
  return colors[quality];
};
