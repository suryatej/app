'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWaterStore } from '@/lib/store/waterStore';
import { logWaterIntake, getTodayIntake, deleteWaterEntry } from '@/lib/api/waterApi';
import { ServingType, WaterIntakeEntry } from '@/types/water.types';
import toast from 'react-hot-toast';

const useWaterTracking = () => {
  const store = useWaterStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load today's intake on mount
  useEffect(() => {
    const loadTodayIntake = async () => {
      setIsLoading(true);
      try {
        const response = await getTodayIntake();
        store.setEntries(response.data.entries);
        store.setDailyTotal(response.data.dailyTotal);
      } catch (err) {
        setError('Failed to load water intake data');
        console.error(err);
        toast.error('Failed to load water data');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodayIntake();
  }, [store]);

  // Reset at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      const timeout = setTimeout(() => {
        store.resetDay();
        toast.success('New day started! Keep up the hydration!');
        checkMidnight(); // Schedule next check
      }, timeUntilMidnight);

      return () => clearTimeout(timeout);
    };

    const cleanup = checkMidnight();
    return cleanup;
  }, [store]);

  const logWater = useCallback(async (servingType: ServingType, customAmount?: number) => {
    const amount = customAmount || servingType.amount;
    
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const tempEntry: WaterIntakeEntry = {
      id: `temp-${Date.now()}`,
      userId: 'current-user',
      amount,
      servingType: servingType.name,
      timestamp: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
      synced: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Check if this will complete the goal
    const currentTotal = store.getCurrentTotal();
    const willCompleteGoal = (currentTotal + amount) >= store.dailyGoal && currentTotal < store.dailyGoal;

    // Optimistic update
    store.addEntry(tempEntry);
    store.setLastLoggedEntry(tempEntry);
    store.setShowUndoToast(true);

    try {
      const response = await logWaterIntake({
        amount,
        servingType: servingType.name,
        timestamp: tempEntry.timestamp,
      });

      // Replace temp entry with real one
      store.updateEntry(tempEntry.id, response.data.entry);
      
      // Show success toast
      toast.success(`${amount}oz logged! 💧`);
      
      // Check if goal reached
      if (willCompleteGoal) {
        store.setCelebrating(true);
        toast.success('🎉 Daily goal reached! Great job staying hydrated!', {
          duration: 4000,
        });
        setTimeout(() => store.setCelebrating(false), 3000);
      }

      return response.data.entry;
    } catch (err) {
      // Rollback on error
      store.removeEntry(tempEntry.id);
      setError('Failed to log water intake');
      toast.error('Failed to log water intake');
      throw err;
    } finally {
      // Hide undo toast after 5 seconds
      setTimeout(() => {
        store.setShowUndoToast(false);
        store.setLastLoggedEntry(null);
      }, 5000);
    }
  }, [store]);

  const undoLastEntry = useCallback(async () => {
    const lastEntry = store.lastLoggedEntry;
    if (!lastEntry) return;

    try {
      await deleteWaterEntry(lastEntry.id);
      store.removeEntry(lastEntry.id);
      store.setShowUndoToast(false);
      store.setLastLoggedEntry(null);
      toast.success('Entry undone');
    } catch (err) {
      setError('Failed to undo water entry');
      toast.error('Failed to undo entry');
      throw err;
    }
  }, [store]);

  const deleteEntry = useCallback(async (entryId: string) => {
    const originalEntries = [...store.todayEntries];
    const entryToDelete = originalEntries.find(e => e.id === entryId);
    
    if (!entryToDelete) return;
    
    // Optimistic delete
    store.removeEntry(entryId);
    toast.success('Entry deleted');

    try {
      await deleteWaterEntry(entryId);
    } catch (err) {
      // Rollback on error
      store.setEntries(originalEntries);
      setError('Failed to delete water entry');
      toast.error('Failed to delete entry');
      throw err;
    }
  }, [store]);

  const calculateProgress = useCallback(() => {
    const percentage = (store.currentTotal / store.dailyGoal) * 100;
    return Math.min(percentage, 100);
  }, [store.currentTotal, store.dailyGoal]);

  return {
    // State
    isLoading,
    error,
    todayEntries: store.todayEntries,
    currentTotal: store.currentTotal,
    dailyGoal: store.dailyGoal,
    progressPercentage: calculateProgress(),
    showUndoToast: store.showUndoToast,
    isCelebrating: store.isCelebrating,
    isModalOpen: store.isModalOpen,
    lastLoggedEntry: store.lastLoggedEntry,
    servingSizes: store.servingSizes,
    
    // Actions
    logWater,
    undoLastEntry,
    deleteEntry,
    setModalOpen: store.setModalOpen,
    clearError: () => setError(null),
  };
};

export default useWaterTracking;