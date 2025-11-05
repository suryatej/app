import { create } from 'zustand';
import { SleepSession, SleepGoal, SleepStatistics, SleepTrackingState } from '@/types/sleep.types';
import { fetchTodaySleep, fetchSleepHistory } from '@/lib/api/sleepApi';
import { calculateSleepStatistics, calculateSleepProgress, isSleepGoalMet } from '@/lib/utils/sleepCalculations';

interface SleepStoreActions {
  // State setters
  setLoading: (loading: boolean) => void;
  setPeriod: (period: 'today' | 'week' | 'month') => void;
  setActiveView: (view: 'overview' | 'history' | 'analytics') => void;
  setTodaySleep: (sleep: SleepSession | null) => void;
  setSleepHistory: (history: SleepSession[]) => void;
  setStatistics: (stats: SleepStatistics) => void;
  setGoal: (goal: SleepGoal) => void;
  
  // Data fetching
  fetchSleepData: (period: 'today' | 'week' | 'month') => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Computations
  calculateStatistics: () => void;
  updateGoalProgress: () => void;
  
  // Manual entry
  addManualEntry: (session: Omit<SleepSession, 'id' | 'userId' | 'synced' | 'createdAt' | 'updatedAt'>) => Promise<void>;
}

type SleepStore = SleepTrackingState & SleepStoreActions;

// Default goal
const defaultGoal: SleepGoal = {
  userId: 'user-123',
  minHours: 7,
  maxHours: 9,
  targetHours: 8,
};

// Default statistics
const defaultStatistics: SleepStatistics = {
  averageDuration: 0,
  consistency: 0,
  qualityScore: 0,
  weeklyTrend: 'stable',
};

export const useSleepStore = create<SleepStore>((set, get) => ({
  // Initial state
  isLoading: false,
  selectedPeriod: 'today',
  activeView: 'overview',
  todaySleep: null,
  sleepHistory: [],
  statistics: defaultStatistics,
  goal: defaultGoal,
  goalProgress: 0,
  isGoalMet: false,

  // State setters
  setLoading: (loading) => set({ isLoading: loading }),
  
  setPeriod: (period) => {
    set({ selectedPeriod: period });
    // Automatically fetch data for new period
    get().fetchSleepData(period);
  },
  
  setActiveView: (view) => set({ activeView: view }),
  
  setTodaySleep: (sleep) => {
    set({ todaySleep: sleep });
    get().updateGoalProgress();
  },
  
  setSleepHistory: (history) => set({ sleepHistory: history }),
  
  setStatistics: (stats) => set({ statistics: stats }),
  
  setGoal: (goal) => {
    set({ goal });
    get().updateGoalProgress();
  },

  // Fetch sleep data based on period
  fetchSleepData: async (period) => {
    set({ isLoading: true });
    
    try {
      if (period === 'today') {
        // Fetch today's sleep data
        const response = await fetchTodaySleep();
        
        if (response.status === 'SUCCESS' && response.data) {
          set({
            todaySleep: response.data.session,
            goal: response.data.goal,
            sleepHistory: [response.data.session],
          });
          get().updateGoalProgress();
        }
      } else {
        // Fetch history for week or month
        const response = await fetchSleepHistory(period);
        
        if (response.status === 'SUCCESS' && response.data) {
          const { sessions, statistics } = response.data;
          set({
            sleepHistory: sessions,
            statistics,
            todaySleep: sessions[0] || null,
          });
          get().updateGoalProgress();
        }
      }
    } catch (error) {
      console.error('Failed to fetch sleep data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Refresh current data
  refreshData: async () => {
    const { selectedPeriod } = get();
    await get().fetchSleepData(selectedPeriod);
  },

  // Calculate statistics from current history
  calculateStatistics: () => {
    const { sleepHistory } = get();
    if (sleepHistory.length === 0) {
      set({ statistics: defaultStatistics });
      return;
    }
    
    const stats = calculateSleepStatistics(sleepHistory);
    set({ statistics: stats });
  },

  // Update goal progress
  updateGoalProgress: () => {
    const { todaySleep, goal } = get();
    
    if (!todaySleep) {
      set({ goalProgress: 0, isGoalMet: false });
      return;
    }
    
    const progress = calculateSleepProgress(todaySleep.duration, goal);
    const goalMet = isSleepGoalMet(todaySleep.duration, goal);
    
    set({
      goalProgress: Math.round(progress),
      isGoalMet: goalMet,
    });
  },

  // Add manual sleep entry (future feature)
  addManualEntry: async (session) => {
    set({ isLoading: true });
    
    try {
      // This would call the API to add a manual entry
      // For now, we'll just add it to the local state
      const newSession: SleepSession = {
        ...session,
        id: `sleep-${Date.now()}`,
        userId: 'user-123',
        synced: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const { sleepHistory } = get();
      set({
        todaySleep: newSession,
        sleepHistory: [newSession, ...sleepHistory],
      });
      
      get().updateGoalProgress();
      get().calculateStatistics();
    } catch (error) {
      console.error('Failed to add manual entry:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
