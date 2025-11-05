import { create } from 'zustand';
import { 
  MeditationTimerState, 
  MeditationSession,
  MeditationStats,
  DurationType,
  defaultDurations 
} from '@/types/meditation.types';

interface MeditationStoreActions {
  // Session management
  setCurrentSession: (session: MeditationSession | null) => void;
  setSessions: (sessions: MeditationSession[]) => void;
  addSession: (session: MeditationSession) => void;
  removeSession: (sessionId: string) => void;
  
  // Timer state management
  setIsActive: (isActive: boolean) => void;
  setIsPaused: (isPaused: boolean) => void;
  setIsFullScreen: (isFullScreen: boolean) => void;
  setRemainingTime: (time: number) => void;
  setSelectedDuration: (duration: number) => void;
  setStartTime: (time: Date | null) => void;
  
  // UI state management
  setLoading: (loading: boolean) => void;
  setDurationSelectorOpen: (isOpen: boolean) => void;
  setSessionSummaryOpen: (isOpen: boolean) => void;
  setShowConfirmStop: (show: boolean) => void;
  setCelebrating: (celebrating: boolean) => void;
  
  // Stats management
  setStats: (stats: MeditationStats) => void;
  
  // Settings management
  setSoundEnabled: (enabled: boolean) => void;
  setVibrateEnabled: (enabled: boolean) => void;
  setAmbientMode: (enabled: boolean) => void;
  
  // Helpers
  resetTimer: () => void;
}

type MeditationStore = MeditationTimerState & MeditationStoreActions;

export const useMeditationStore = create<MeditationStore>((set, get) => ({
  // Initial timer states
  isActive: false,
  isPaused: false,
  isFullScreen: false,
  remainingTime: 0,
  selectedDuration: 0,
  startTime: null,
  
  // Initial UI states
  isLoading: false,
  isDurationSelectorOpen: false,
  isSessionSummaryOpen: false,
  showConfirmStop: false,
  isCelebrating: false,
  
  // Initial data states
  currentSession: null,
  recentSessions: [],
  stats: {
    currentStreak: 0,
    longestStreak: 0,
    totalSessions: 0,
    totalMinutes: 0,
    averageSessionLength: 0,
    lastSessionDate: null,
    weeklyGoal: 5,
    weeklyProgress: 0,
  },
  
  // Configuration
  durations: defaultDurations,
  soundEnabled: true,
  vibrateEnabled: true,
  ambientMode: true,

  // Actions
  setCurrentSession: (session) => set({ currentSession: session }),
  
  setSessions: (sessions) => {
    const recentSessions = sessions.slice(0, 10);
    set({ recentSessions });
  },
  
  addSession: (session) => {
    const { recentSessions } = get();
    const updatedSessions = [session, ...recentSessions].slice(0, 10);
    set({ recentSessions: updatedSessions });
  },
  
  removeSession: (sessionId) => {
    const { recentSessions } = get();
    const updatedSessions = recentSessions.filter(s => s.id !== sessionId);
    set({ recentSessions: updatedSessions });
  },
  
  setIsActive: (isActive) => set({ isActive }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setIsFullScreen: (isFullScreen) => set({ isFullScreen }),
  setRemainingTime: (time) => set({ remainingTime: time }),
  setSelectedDuration: (duration) => set({ selectedDuration: duration }),
  setStartTime: (time) => set({ startTime: time }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  setDurationSelectorOpen: (isOpen) => set({ isDurationSelectorOpen: isOpen }),
  setSessionSummaryOpen: (isOpen) => set({ isSessionSummaryOpen: isOpen }),
  setShowConfirmStop: (show) => set({ showConfirmStop: show }),
  setCelebrating: (celebrating) => set({ isCelebrating: celebrating }),
  
  setStats: (stats) => set({ stats }),
  
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setVibrateEnabled: (enabled) => set({ vibrateEnabled: enabled }),
  setAmbientMode: (enabled) => set({ ambientMode: enabled }),
  
  resetTimer: () => set({
    isActive: false,
    isPaused: false,
    isFullScreen: false,
    currentSession: null,
    remainingTime: 0,
    selectedDuration: 0,
    startTime: null,
    showConfirmStop: false,
  }),
}));
