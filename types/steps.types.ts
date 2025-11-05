export interface StepsData {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  stepCount: number;
  distance: number; // in miles
  calories: number; // kcal burned
  activeMinutes: number;
  floors?: number; // stairs climbed (optional)
  timestamp: string; // ISO 8601
  source: 'phone' | 'watch' | 'healthkit' | 'googlefit' | 'manual';
  synced: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StepsGoal {
  userId: string;
  dailyGoal: number; // default: 8000-10000
  weeklyGoal: number;
  unit: 'steps';
  autoAdjust: boolean; // AI-based goal adjustment
  notificationsEnabled: boolean;
  notificationTime: string; // HH:mm format
}

export interface StepsTrackingState {
  // UI States
  isLoading: boolean;
  isTracking: boolean;
  lastSyncTime: Date | null;
  showCelebration: boolean;
  achievementLevel: 'none' | 'bronze' | 'silver' | 'gold';
  
  // Data States
  todaySteps: StepsData | null;
  weeklyData: StepsData[]; // Last 7 days
  currentStepCount: number;
  currentDistance: number;
  currentCalories: number;
  currentActiveMinutes: number;
  
  // Goal States
  dailyGoal: number;
  progressPercentage: number; // 0-100
  goalAchieved: boolean;
  streakDays: number; // Consecutive days goal achieved
  
  // Permission States
  permissionGranted: boolean;
  permissionRequested: boolean;
}

export interface StepsHistoryQuery {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  aggregation?: 'daily' | 'weekly' | 'monthly';
}

export interface StepsResponse {
  success: boolean;
  data: {
    today: StepsData;
    weeklyData: StepsData[];
    dailyGoal: number;
    progressPercentage: number;
    streakDays: number;
    pointsEarned?: number;
  };
  message?: string;
}

export interface StepsSyncRequest {
  stepCount: number;
  distance: number;
  calories: number;
  activeMinutes: number;
  timestamp: string;
  source: string;
}
