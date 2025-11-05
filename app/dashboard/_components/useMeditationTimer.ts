'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useMeditationStore } from '@/lib/store/meditationStore';
import {
  startMeditationSession,
  completeMeditationSession,
  getMeditationHistory,
  getMeditationStats,
} from '@/lib/api/meditationApi';
import { playSound, sendNotification, triggerVibration } from '@/lib/utils/notificationUtils';
import { formatTimerDisplay } from '@/lib/utils/timerUtils';

const useMeditationTimer = () => {
  const store = useMeditationStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Load history and stats on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [historyResponse, statsResponse] = await Promise.all([
          getMeditationHistory({ limit: 10 }),
          getMeditationStats(),
        ]);
        store.setSessions(historyResponse.data.sessions);
        store.setStats(statsResponse.data);
      } catch (err) {
        setError('Failed to load meditation data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Timer tick function
  const tick = useCallback(() => {
    if (!startTimeRef.current || !store.selectedDuration) return;

    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const remaining = Math.max(0, store.selectedDuration - elapsed);

    store.setRemainingTime(remaining);

    if (remaining === 0) {
      completeSession();
    }
  }, [store.selectedDuration]);

  // Start timer interval
  const startTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(tick, 1000);
  }, [tick]);

  // Stop timer interval
  const stopTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start session
  const startSession = useCallback(async (duration: number) => {
    try {
      const startTime = new Date().toISOString();
      const response = await startMeditationSession({
        duration,
        startTime,
      });

      store.setCurrentSession(response.data.session);
      store.setSelectedDuration(duration);
      store.setRemainingTime(duration);
      store.setIsActive(true);
      store.setIsPaused(false);
      store.setIsFullScreen(true);

      startTimeRef.current = Date.now();
      startTimerInterval();
    } catch (err) {
      setError('Failed to start meditation session');
      throw err;
    }
  }, [startTimerInterval]);

  // Pause session
  const pauseSession = useCallback(() => {
    store.setIsPaused(true);
    stopTimerInterval();
  }, [stopTimerInterval]);

  // Resume session
  const resumeSession = useCallback(() => {
    if (!store.remainingTime) return;

    store.setIsPaused(false);
    startTimeRef.current = Date.now() - (store.selectedDuration - store.remainingTime) * 1000;
    startTimerInterval();
  }, [store.remainingTime, store.selectedDuration, startTimerInterval]);

  // Stop session early
  const stopSession = useCallback(async () => {
    if (!store.currentSession) return;

    stopTimerInterval();
    
    const completedDuration = store.selectedDuration - store.remainingTime;
    
    try {
      await completeMeditationSession(store.currentSession.id, {
        completedDuration,
        endTime: new Date().toISOString(),
      });

      // Refresh data
      const [historyResponse, statsResponse] = await Promise.all([
        getMeditationHistory({ limit: 10 }),
        getMeditationStats(),
      ]);

      store.setSessions(historyResponse.data.sessions);
      store.setStats(statsResponse.data);
    } catch (err) {
      setError('Failed to save meditation session');
      console.error(err);
    } finally {
      store.resetTimer();
    }
  }, [store.currentSession, store.selectedDuration, store.remainingTime, stopTimerInterval]);

  // Complete session
  const completeSession = useCallback(async () => {
    if (!store.currentSession) return;

    stopTimerInterval();

    try {
      const response = await completeMeditationSession(store.currentSession.id, {
        completedDuration: store.selectedDuration,
        endTime: new Date().toISOString(),
      });

      // Play completion sound
      if (store.soundEnabled) {
        playSound('/sounds/meditation-complete.mp3');
      }

      // Trigger vibration
      if (store.vibrateEnabled) {
        triggerVibration([200, 100, 200]);
      }

      // Send notification
      if ('Notification' in window && Notification.permission === 'granted') {
        sendNotification('Meditation Complete! 🧘', {
          body: `Great job! You completed ${store.selectedDuration / 60} minutes of meditation.`,
          icon: '/icon-meditation.png',
        });
      }

      // Update stats and show summary
      store.setStats(response.data.stats);
      store.setSessionSummaryOpen(true);
      store.setCelebrating(true);

      setTimeout(() => {
        store.setCelebrating(false);
        store.setSessionSummaryOpen(false);
        store.resetTimer();
      }, 5000);

      // Refresh history
      const historyResponse = await getMeditationHistory({ limit: 10 });
      store.setSessions(historyResponse.data.sessions);
    } catch (err) {
      setError('Failed to complete meditation session');
      console.error(err);
    }
  }, [store.currentSession, store.selectedDuration, store.soundEnabled, store.vibrateEnabled, stopTimerInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimerInterval();
    };
  }, [stopTimerInterval]);

  return {
    // State
    isLoading,
    error,
    isActive: store.isActive,
    isPaused: store.isPaused,
    isFullScreen: store.isFullScreen,
    remainingTime: store.remainingTime,
    formattedTime: formatTimerDisplay(store.remainingTime),
    currentSession: store.currentSession,
    recentSessions: store.recentSessions,
    stats: store.stats,
    isDurationSelectorOpen: store.isDurationSelectorOpen,
    isSessionSummaryOpen: store.isSessionSummaryOpen,
    isCelebrating: store.isCelebrating,
    showConfirmStop: store.showConfirmStop,
    durations: store.durations,
    soundEnabled: store.soundEnabled,
    vibrateEnabled: store.vibrateEnabled,
    
    // Actions
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    setDurationSelectorOpen: store.setDurationSelectorOpen,
    setShowConfirmStop: store.setShowConfirmStop,
    clearError: () => setError(null),
  };
};

export default useMeditationTimer;
