import { WaterIntakeResponse, WaterHistoryResponse, WaterGoalSettings, WaterIntakeEntry } from '@/types/water.types';

const API_BASE = '/api/water';

// Mock data for development
const mockUser = 'user-123';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const logWaterIntake = async (data: {
  amount: number;
  servingType: string;
  timestamp: string;
}): Promise<WaterIntakeResponse> => {
  await delay(300); // Simulate network delay
  
  try {
    // In development, use mock data
    const entry: WaterIntakeEntry = {
      id: `entry-${Date.now()}`,
      userId: mockUser,
      amount: data.amount,
      servingType: data.servingType,
      timestamp: data.timestamp,
      date: data.timestamp.split('T')[0],
      synced: true,
      createdAt: data.timestamp,
      updatedAt: data.timestamp,
    };

    // Get current total from localStorage
    const storedEntries = localStorage.getItem('waterEntries');
    const todayEntries: WaterIntakeEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
    const today = new Date().toISOString().split('T')[0];
    const todayOnly = todayEntries.filter(e => e.date === today);
    
    // Add new entry
    const updatedEntries = [...todayEntries, entry];
    localStorage.setItem('waterEntries', JSON.stringify(updatedEntries));
    
    const todayTotal = todayOnly.reduce((sum, e) => sum + e.amount, 0) + data.amount;
    const goalProgress = Math.min((todayTotal / 64) * 100, 100); // 64oz daily goal

    return {
      success: true,
      data: {
        entry,
        todayTotal,
        goalProgress,
        pointsEarned: 5, // Mock points
      },
      message: 'Water intake logged successfully'
    };
  } catch (error) {
    throw new Error('Failed to log water intake');
  }
};

export const getTodayIntake = async (): Promise<WaterHistoryResponse> => {
  await delay(200);
  
  try {
    const storedEntries = localStorage.getItem('waterEntries');
    const allEntries: WaterIntakeEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
    
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = allEntries.filter(entry => entry.date === today);
    
    const dailyTotal = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const goalProgress = Math.min((dailyTotal / 64) * 100, 100);
    
    return {
      success: true,
      data: {
        entries: todayEntries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        dailyTotal,
        goalProgress,
        streak: 5, // Mock streak
      }
    };
  } catch (error) {
    throw new Error('Failed to fetch water intake data');
  }
};

export const deleteWaterEntry = async (entryId: string): Promise<{ success: boolean }> => {
  await delay(150);
  
  try {
    const storedEntries = localStorage.getItem('waterEntries');
    const allEntries: WaterIntakeEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
    
    const updatedEntries = allEntries.filter(entry => entry.id !== entryId);
    localStorage.setItem('waterEntries', JSON.stringify(updatedEntries));
    
    return { success: true };
  } catch (error) {
    throw new Error('Failed to delete water entry');
  }
};

export const updateWaterEntry = async (
  entryId: string,
  data: Partial<WaterIntakeEntry>
): Promise<WaterIntakeResponse> => {
  await delay(200);
  
  try {
    const storedEntries = localStorage.getItem('waterEntries');
    const allEntries: WaterIntakeEntry[] = storedEntries ? JSON.parse(storedEntries) : [];
    
    const entryIndex = allEntries.findIndex(entry => entry.id === entryId);
    if (entryIndex === -1) {
      throw new Error('Entry not found');
    }
    
    const updatedEntry = { ...allEntries[entryIndex], ...data, updatedAt: new Date().toISOString() };
    allEntries[entryIndex] = updatedEntry;
    
    localStorage.setItem('waterEntries', JSON.stringify(allEntries));
    
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = allEntries.filter(entry => entry.date === today);
    const todayTotal = todayEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const goalProgress = Math.min((todayTotal / 64) * 100, 100);
    
    return {
      success: true,
      data: {
        entry: updatedEntry,
        todayTotal,
        goalProgress,
      }
    };
  } catch (error) {
    throw new Error('Failed to update water entry');
  }
};

export const getWaterSettings = async (): Promise<WaterGoalSettings> => {
  await delay(100);
  
  try {
    const storedSettings = localStorage.getItem('waterSettings');
    const defaultSettings: WaterGoalSettings = {
      userId: mockUser,
      dailyGoalOz: 64,
      unit: 'oz',
      reminderEnabled: true,
      reminderIntervalMinutes: 120,
    };
    
    return storedSettings ? { ...defaultSettings, ...JSON.parse(storedSettings) } : defaultSettings;
  } catch (error) {
    return {
      userId: mockUser,
      dailyGoalOz: 64,
      unit: 'oz',
      reminderEnabled: true,
      reminderIntervalMinutes: 120,
    };
  }
};

export const updateWaterSettings = async (
  settings: Partial<WaterGoalSettings>
): Promise<WaterGoalSettings> => {
  await delay(150);
  
  try {
    const currentSettings = await getWaterSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    
    localStorage.setItem('waterSettings', JSON.stringify(updatedSettings));
    
    return updatedSettings;
  } catch (error) {
    throw new Error('Failed to update water settings');
  }
};