export interface WaterIntakeEntry {
  id: string;
  userId: string;
  amount: number; // in ounces
  servingType: string;
  timestamp: string; // ISO 8601
  date: string; // YYYY-MM-DD
  synced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServingType {
  id: string;
  name: string;
  amount: number; // in ounces
  icon: string;
}

export interface WaterTrackingState {
  // UI States
  isLoading: boolean;
  isModalOpen: boolean;
  showUndoToast: boolean;
  isCelebrating: boolean;
  lastLoggedEntry: WaterIntakeEntry | null;
  
  // Data States
  todayEntries: WaterIntakeEntry[];
  dailyGoal: number; // in ounces (default: 64)
  currentTotal: number; // in ounces
  progressPercentage: number; // 0-100
  
  // Configuration
  servingSizes: ServingType[];
  unit: 'oz' | 'ml';
}

export interface WaterIntakeResponse {
  success: boolean;
  data: {
    entry: WaterIntakeEntry;
    todayTotal: number;
    goalProgress: number;
    pointsEarned?: number;
  };
  message?: string;
}

export interface WaterHistoryResponse {
  success: boolean;
  data: {
    entries: WaterIntakeEntry[];
    dailyTotal: number;
    goalProgress: number;
    streak: number;
  };
}

export interface WaterGoalSettings {
  userId: string;
  dailyGoalOz: number;
  unit: 'oz' | 'ml';
  reminderEnabled: boolean;
  reminderIntervalMinutes: number;
}

// Default Serving Sizes
export const defaultServingSizes: ServingType[] = [
  { id: '1', name: 'Glass', amount: 8, icon: '🥛' },
  { id: '2', name: 'Bottle', amount: 16, icon: '🍾' },
  { id: '3', name: 'Large Bottle', amount: 24, icon: '💧' },
  { id: '4', name: 'Cup', amount: 12, icon: '☕' },
  { id: '5', name: 'Small Glass', amount: 4, icon: '🥃' },
  { id: '6', name: 'Custom', amount: 0, icon: '⚙️' }
];