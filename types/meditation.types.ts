export interface MeditationSession {
  id: string;
  userId: string;
  duration: number; // in seconds
  completedDuration: number; // actual time completed
  startTime: string; // ISO 8601
  endTime: string | null; // ISO 8601
  date: string; // YYYY-MM-DD format
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  completed: boolean;
  notes?: string;
  synced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DurationType {
  id: string;
  name: string;
  duration: number; // in seconds
  icon: string;
  recommended?: boolean;
}

export interface MeditationStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalMinutes: number;
  averageSessionLength: number;
  lastSessionDate: string | null;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface MeditationTimerState {
  // Timer States
  isActive: boolean;
  isPaused: boolean;
  isFullScreen: boolean;
  remainingTime: number; // in seconds
  selectedDuration: number; // in seconds
  startTime: Date | null;
  
  // UI States
  isLoading: boolean;
  isDurationSelectorOpen: boolean;
  isSessionSummaryOpen: boolean;
  showConfirmStop: boolean;
  isCelebrating: boolean;
  
  // Data States
  currentSession: MeditationSession | null;
  recentSessions: MeditationSession[];
  stats: MeditationStats;
  
  // Configuration
  durations: DurationType[];
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  ambientMode: boolean;
}

export interface SessionResponse {
  success: boolean;
  data: {
    session: MeditationSession;
    stats: MeditationStats;
    pointsEarned?: number;
    achievements?: string[];
  };
  message?: string;
}

export interface HistoryResponse {
  success: boolean;
  data: {
    sessions: MeditationSession[];
    stats: MeditationStats;
  };
}

export interface MeditationSettings {
  userId: string;
  defaultDuration: number;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
  reminderEnabled: boolean;
  reminderTime: string; // HH:MM format
  ambientMode: boolean;
}

// Default Durations
export const defaultDurations: DurationType[] = [
  { id: '1', name: 'Quick', duration: 300, icon: '⚡', recommended: true }, // 5 min
  { id: '2', name: 'Standard', duration: 600, icon: '🧘', recommended: true }, // 10 min
  { id: '3', name: 'Deep', duration: 900, icon: '🌙' }, // 15 min
  { id: '4', name: 'Extended', duration: 1200, icon: '⭐' }, // 20 min
  { id: '5', name: 'Custom', duration: 0, icon: '⚙️' }
];
