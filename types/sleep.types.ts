export interface SleepSession {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  duration: number; // in hours
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  stages: SleepStages;
  source: 'healthkit' | 'manual';
  synced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SleepStages {
  deep: number;      // minutes
  rem: number;       // minutes
  light: number;     // minutes
  awake: number;     // minutes
}

export interface SleepGoal {
  userId: string;
  minHours: number;  // default: 7
  maxHours: number;  // default: 9
  targetHours: number; // default: 8
}

export interface SleepStatistics {
  averageDuration: number; // hours
  consistency: number; // 0-100 score
  qualityScore: number; // 0-100 score
  weeklyTrend: 'improving' | 'declining' | 'stable';
  bestSleep?: SleepSession;
  worstSleep?: SleepSession;
}

export interface SleepTrackingState {
  // UI States
  isLoading: boolean;
  selectedPeriod: 'today' | 'week' | 'month';
  activeView: 'overview' | 'history' | 'analytics';
  
  // Data States
  todaySleep: SleepSession | null;
  sleepHistory: SleepSession[];
  statistics: SleepStatistics;
  goal: SleepGoal;
  
  // Computed States
  goalProgress: number; // percentage
  isGoalMet: boolean;
}

export interface SleepTodayResponse {
  status: 'SUCCESS' | 'ERROR';
  data?: {
    session: SleepSession;
    goal: SleepGoal;
  };
  message?: string;
}

export interface SleepHistoryResponse {
  status: 'SUCCESS' | 'ERROR';
  data?: {
    sessions: SleepSession[];
    statistics: SleepStatistics;
  };
  message?: string;
}

export interface SleepManualEntry {
  date: string;
  startTime: string;
  endTime: string;
  quality?: 'excellent' | 'good' | 'fair' | 'poor';
  stages?: Partial<SleepStages>;
}

// HealthKit Types (for future integration)
export interface HealthKitSleepSession {
  id: string;
  startDate: string;
  endDate: string;
  value: number; // duration in hours
  sourceBundle: string;
  sourceName: string;
  samples?: HealthKitSleepSample[];
}

export interface HealthKitSleepSample {
  value: 'InBed' | 'Asleep' | 'Awake' | 'Deep' | 'REM' | 'Light';
  startDate: string;
  endDate: string;
  duration: number; // minutes
}
