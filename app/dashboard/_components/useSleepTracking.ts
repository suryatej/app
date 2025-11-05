import { useEffect, useCallback } from 'react';
import { useSleepStore } from '@/lib/store/sleepStore';
import { SleepSession, SleepGoal } from '@/types/sleep.types';
import {
  determineSleepQuality,
  calculateSleepProgress,
  formatSleepDuration,
  formatTime,
  getStagePercentage,
  getSleepQualityColor,
  getQualityBadgeColor,
  getTrendIcon,
} from '@/lib/utils/sleepCalculations';

/**
 * Custom hook for sleep tracking functionality
 * Provides data and helper functions for sleep components
 */
export const useSleepTracking = () => {
  const store = useSleepStore();

  // Fetch initial sleep data on mount
  useEffect(() => {
    const initializeSleepData = async () => {
      try {
        await store.fetchSleepData(store.selectedPeriod);
      } catch (error) {
        console.error('Failed to initialize sleep data:', error);
      }
    };

    initializeSleepData();
  }, []); // Only run once on mount

  // Calculate sleep quality based on duration and stages
  const calculateQuality = useCallback((session: SleepSession): 'excellent' | 'good' | 'fair' | 'poor' => {
    return determineSleepQuality(session.duration, session.stages);
  }, []);

  // Calculate progress percentage
  const calculateProgress = useCallback((duration: number, goal: SleepGoal): number => {
    return calculateSleepProgress(duration, goal);
  }, []);

  // Format duration for display
  const formatDuration = useCallback((hours: number): string => {
    return formatSleepDuration(hours);
  }, []);

  // Format time for display
  const formatTimeDisplay = useCallback((isoString: string): string => {
    return formatTime(isoString);
  }, []);

  // Get stage percentage
  const getStagePercent = useCallback((stageMinutes: number, totalDuration: number): number => {
    return getStagePercentage(stageMinutes, totalDuration);
  }, []);

  // Get quality color gradient
  const getQualityColor = useCallback((quality: 'excellent' | 'good' | 'fair' | 'poor'): string => {
    return getSleepQualityColor(quality);
  }, []);

  // Get quality badge color
  const getBadgeColor = useCallback((quality: 'excellent' | 'good' | 'fair' | 'poor'): string => {
    return getQualityBadgeColor(quality);
  }, []);

  // Get trend icon
  const getTrend = useCallback((trend: 'improving' | 'declining' | 'stable'): string => {
    return getTrendIcon(trend);
  }, []);

  // Change period and fetch data
  const changePeriod = useCallback(async (period: 'today' | 'week' | 'month') => {
    store.setPeriod(period);
  }, [store]);

  // Refresh data
  const refresh = useCallback(async () => {
    await store.refreshData();
  }, [store]);

  // Get sleep data summary
  const getSleepSummary = useCallback(() => {
    const { todaySleep, goal, goalProgress, isGoalMet } = store;
    
    if (!todaySleep) {
      return {
        hasSleep: false,
        duration: 0,
        quality: 'poor' as const,
        progress: 0,
        goalMet: false,
        message: 'No sleep data available',
      };
    }

    return {
      hasSleep: true,
      duration: todaySleep.duration,
      quality: todaySleep.quality,
      progress: goalProgress,
      goalMet: isGoalMet,
      message: isGoalMet 
        ? '✨ Great sleep! Goal achieved!' 
        : `${formatSleepDuration(goal.targetHours - todaySleep.duration)} more to reach your goal`,
    };
  }, [store]);

  return {
    // Store state
    ...store,
    
    // Helper functions
    calculateQuality,
    calculateProgress,
    formatDuration,
    formatTimeDisplay,
    getStagePercent,
    getQualityColor,
    getBadgeColor,
    getTrend,
    
    // Actions
    changePeriod,
    refresh,
    getSleepSummary,
  };
};
