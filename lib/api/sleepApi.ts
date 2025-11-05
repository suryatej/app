import { SleepTodayResponse, SleepHistoryResponse, SleepSession, SleepGoal, SleepStatistics } from '@/types/sleep.types';

/**
 * Mock API for sleep tracking
 * In production, these would be real API calls to a backend service
 * that integrates with HealthKit or other sleep tracking services
 */

// Mock data - Today's sleep
const mockTodaySleep: SleepSession = {
  id: 'sleep-001',
  userId: 'user-123',
  date: new Date().toISOString().split('T')[0],
  startTime: new Date(new Date().setHours(23, 15, 0, 0) - 24 * 60 * 60 * 1000).toISOString(),
  endTime: new Date(new Date().setHours(7, 30, 0, 0)).toISOString(),
  duration: 8.25,
  quality: 'good',
  stages: {
    deep: 95,
    rem: 120,
    light: 260,
    awake: 20,
  },
  source: 'healthkit',
  synced: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock data - Sleep history (last 7 days)
const mockSleepHistory: SleepSession[] = [
  {
    id: 'sleep-001',
    userId: 'user-123',
    date: new Date(Date.now()).toISOString().split('T')[0],
    startTime: new Date(Date.now() - 8.25 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now()).toISOString(),
    duration: 8.25,
    quality: 'good',
    stages: { deep: 95, rem: 120, light: 260, awake: 20 },
    source: 'healthkit',
    synced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sleep-002',
    userId: 'user-123',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000 - 7.5 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    duration: 7.5,
    quality: 'good',
    stages: { deep: 85, rem: 110, light: 240, awake: 15 },
    source: 'healthkit',
    synced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sleep-003',
    userId: 'user-123',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 - 6.75 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 6.75,
    quality: 'fair',
    stages: { deep: 65, rem: 90, light: 220, awake: 30 },
    source: 'healthkit',
    synced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sleep-004',
    userId: 'user-123',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 8.5 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 8.5,
    quality: 'excellent',
    stages: { deep: 110, rem: 135, light: 255, awake: 10 },
    source: 'healthkit',
    synced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sleep-005',
    userId: 'user-123',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 7.25 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 7.25,
    quality: 'good',
    stages: { deep: 80, rem: 105, light: 235, awake: 15 },
    source: 'healthkit',
    synced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sleep-006',
    userId: 'user-123',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 9 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 9.0,
    quality: 'excellent',
    stages: { deep: 120, rem: 145, light: 260, awake: 15 },
    source: 'healthkit',
    synced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'sleep-007',
    userId: 'user-123',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 - 5.5 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 5.5,
    quality: 'poor',
    stages: { deep: 45, rem: 70, light: 180, awake: 35 },
    source: 'healthkit',
    synced: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock sleep goal
const mockSleepGoal: SleepGoal = {
  userId: 'user-123',
  minHours: 7,
  maxHours: 9,
  targetHours: 8,
};

/**
 * Fetch today's sleep data
 */
export const fetchTodaySleep = async (): Promise<SleepTodayResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    return {
      status: 'SUCCESS',
      data: {
        session: mockTodaySleep,
        goal: mockSleepGoal,
      },
    };
  } catch (error) {
    return {
      status: 'ERROR',
      message: 'Failed to fetch today\'s sleep data',
    };
  }
};

/**
 * Fetch sleep history for a given period
 */
export const fetchSleepHistory = async (
  period: 'today' | 'week' | 'month'
): Promise<SleepHistoryResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));

  try {
    let sessions: SleepSession[] = [];
    
    switch (period) {
      case 'today':
        sessions = [mockTodaySleep];
        break;
      case 'week':
        sessions = mockSleepHistory;
        break;
      case 'month':
        // For month, duplicate the week data (mock)
        sessions = [...mockSleepHistory, ...mockSleepHistory, ...mockSleepHistory, ...mockSleepHistory];
        break;
    }

    // Calculate statistics
    const statistics = calculateMockStatistics(sessions);

    return {
      status: 'SUCCESS',
      data: {
        sessions,
        statistics,
      },
    };
  } catch (error) {
    return {
      status: 'ERROR',
      message: `Failed to fetch ${period} sleep data`,
    };
  }
};

/**
 * Calculate statistics from sessions (mock implementation)
 */
const calculateMockStatistics = (sessions: SleepSession[]): SleepStatistics => {
  if (sessions.length === 0) {
    return {
      averageDuration: 0,
      consistency: 0,
      qualityScore: 0,
      weeklyTrend: 'stable',
    };
  }

  const averageDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length;
  const qualityMap = { excellent: 100, good: 75, fair: 50, poor: 25 };
  const qualityScore = sessions.reduce((sum, s) => sum + qualityMap[s.quality], 0) / sessions.length;

  return {
    averageDuration: parseFloat(averageDuration.toFixed(2)),
    consistency: 72,
    qualityScore: Math.round(qualityScore),
    weeklyTrend: 'stable',
    bestSleep: sessions.find(s => s.quality === 'excellent'),
    worstSleep: sessions.find(s => s.quality === 'poor'),
  };
};

/**
 * Add manual sleep entry (for future use)
 */
export const addManualSleepEntry = async (
  entry: Omit<SleepSession, 'id' | 'userId' | 'synced' | 'createdAt' | 'updatedAt'>
): Promise<SleepTodayResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));

  try {
    const newSession: SleepSession = {
      ...entry,
      id: `sleep-${Date.now()}`,
      userId: 'user-123',
      synced: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      status: 'SUCCESS',
      data: {
        session: newSession,
        goal: mockSleepGoal,
      },
    };
  } catch (error) {
    return {
      status: 'ERROR',
      message: 'Failed to add sleep entry',
    };
  }
};

/**
 * Update sleep goal
 */
export const updateSleepGoal = async (goal: Partial<SleepGoal>): Promise<{ status: string; data?: SleepGoal }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    const updatedGoal = { ...mockSleepGoal, ...goal };
    return {
      status: 'SUCCESS',
      data: updatedGoal,
    };
  } catch (error) {
    return {
      status: 'ERROR',
    };
  }
};
