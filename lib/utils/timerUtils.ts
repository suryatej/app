import { MeditationSession } from '@/types/meditation.types';

/**
 * Calculate remaining time from start timestamp
 * More accurate than relying on setInterval alone
 */
export const calculateRemainingTime = (
  startTimestamp: number,
  durationSeconds: number
): number => {
  const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
  return Math.max(0, durationSeconds - elapsed);
};

/**
 * Format seconds to MM:SS display
 */
export const formatTimerDisplay = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Determine time of day from current hour
 */
export const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

/**
 * Calculate current streak from session history
 */
export const calculateStreak = (sessions: MeditationSession[]): number => {
  if (sessions.length === 0) return 0;

  const sortedSessions = sessions
    .filter(s => s.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const session of sortedSessions) {
    const sessionDate = new Date(session.date);
    sessionDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff > streak) {
      break;
    }
  }

  return streak;
};

/**
 * Request wake lock to prevent screen from sleeping
 */
export const requestWakeLock = async (): Promise<WakeLockSentinel | null> => {
  if ('wakeLock' in navigator) {
    try {
      const wakeLock = await (navigator as any).wakeLock.request('screen');
      return wakeLock;
    } catch (err) {
      console.error('Wake Lock request failed:', err);
      return null;
    }
  }
  return null;
};

/**
 * Release wake lock
 */
export const releaseWakeLock = async (
  wakeLock: WakeLockSentinel | null
): Promise<void> => {
  if (wakeLock) {
    try {
      await wakeLock.release();
    } catch (err) {
      console.error('Wake Lock release failed:', err);
    }
  }
};
