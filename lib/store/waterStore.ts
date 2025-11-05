import { create } from 'zustand';
import { WaterIntakeEntry, WaterTrackingState, ServingType, defaultServingSizes } from '@/types/water.types';

interface WaterStoreActions {
  // Entry management
  setEntries: (entries: WaterIntakeEntry[]) => void;
  addEntry: (entry: WaterIntakeEntry) => void;
  updateEntry: (entryId: string, updatedEntry: WaterIntakeEntry) => void;
  removeEntry: (entryId: string) => void;
  
  // State management
  setDailyTotal: (total: number) => void;
  setDailyGoal: (goal: number) => void;
  setModalOpen: (isOpen: boolean) => void;
  setShowUndoToast: (show: boolean) => void;
  setLastLoggedEntry: (entry: WaterIntakeEntry | null) => void;
  setCelebrating: (celebrating: boolean) => void;
  setLoading: (loading: boolean) => void;
  
  // Computed helpers
  getCurrentTotal: () => number;
  getProgressPercentage: () => number;
  
  // Day reset
  resetDay: () => void;
}

type WaterStore = WaterTrackingState & WaterStoreActions;

export const useWaterStore = create<WaterStore>((set, get) => ({
  // Initial state
  isLoading: false,
  isModalOpen: false,
  showUndoToast: false,
  isCelebrating: false,
  lastLoggedEntry: null,
  todayEntries: [],
  dailyGoal: 64, // 64 ounces default
  currentTotal: 0,
  progressPercentage: 0,
  servingSizes: defaultServingSizes,
  unit: 'oz',

  // Actions
  setEntries: (entries) => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = entries.filter(entry => entry.date === today);
    const currentTotal = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const { dailyGoal } = get();
    const progressPercentage = Math.min((currentTotal / dailyGoal) * 100, 100);
    
    set({
      todayEntries,
      currentTotal,
      progressPercentage,
    });
  },

  addEntry: (entry) => {
    const { todayEntries, dailyGoal } = get();
    const updatedEntries = [...todayEntries, entry];
    const currentTotal = updatedEntries.reduce((sum, e) => sum + e.amount, 0);
    const progressPercentage = Math.min((currentTotal / dailyGoal) * 100, 100);
    
    set({
      todayEntries: updatedEntries,
      currentTotal,
      progressPercentage,
    });
  },

  updateEntry: (entryId, updatedEntry) => {
    const { todayEntries, dailyGoal } = get();
    const updatedEntries = todayEntries.map(entry => 
      entry.id === entryId ? updatedEntry : entry
    );
    const currentTotal = updatedEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const progressPercentage = Math.min((currentTotal / dailyGoal) * 100, 100);
    
    set({
      todayEntries: updatedEntries,
      currentTotal,
      progressPercentage,
    });
  },

  removeEntry: (entryId) => {
    const { todayEntries, dailyGoal } = get();
    const updatedEntries = todayEntries.filter(entry => entry.id !== entryId);
    const currentTotal = updatedEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const progressPercentage = Math.min((currentTotal / dailyGoal) * 100, 100);
    
    set({
      todayEntries: updatedEntries,
      currentTotal,
      progressPercentage,
    });
  },

  setDailyTotal: (total) => {
    const { dailyGoal } = get();
    const progressPercentage = Math.min((total / dailyGoal) * 100, 100);
    set({
      currentTotal: total,
      progressPercentage,
    });
  },

  setDailyGoal: (goal) => {
    const { currentTotal } = get();
    const progressPercentage = Math.min((currentTotal / goal) * 100, 100);
    set({
      dailyGoal: goal,
      progressPercentage,
    });
  },

  setModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setShowUndoToast: (show) => set({ showUndoToast: show }),
  setLastLoggedEntry: (entry) => set({ lastLoggedEntry: entry }),
  setCelebrating: (celebrating) => set({ isCelebrating: celebrating }),
  setLoading: (loading) => set({ isLoading: loading }),

  getCurrentTotal: () => {
    const { todayEntries } = get();
    return todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
  },

  getProgressPercentage: () => {
    const { currentTotal, dailyGoal } = get();
    return Math.min((currentTotal / dailyGoal) * 100, 100);
  },

  resetDay: () => {
    set({
      todayEntries: [],
      currentTotal: 0,
      progressPercentage: 0,
      lastLoggedEntry: null,
      showUndoToast: false,
      isCelebrating: false,
    });
  },
}));