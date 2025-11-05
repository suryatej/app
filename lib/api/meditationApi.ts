import { 
  SessionResponse, 
  HistoryResponse, 
  MeditationStats,
  MeditationSettings,
  MeditationSession 
} from '@/types/meditation.types';
import { getTimeOfDay } from '@/lib/utils/timerUtils';

const API_BASE = '/api/meditation';

// Mock data for development
const mockUser = 'user-123';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const startMeditationSession = async (data: {
  duration: number;
  startTime: string;
}): Promise<SessionResponse> => {
  await delay(300);
  
  try {
    const session: MeditationSession = {
      id: `session-${Date.now()}`,
      userId: mockUser,
      duration: data.duration,
      completedDuration: 0,
      startTime: data.startTime,
      endTime: null,
      date: data.startTime.split('T')[0],
      timeOfDay: getTimeOfDay(),
      completed: false,
      synced: true,
      createdAt: data.startTime,
      updatedAt: data.startTime,
    };

    // Store in localStorage
    const storedSessions = localStorage.getItem('meditationSessions');
    const sessions: MeditationSession[] = storedSessions ? JSON.parse(storedSessions) : [];
    sessions.push(session);
    localStorage.setItem('meditationSessions', JSON.stringify(sessions));

    const stats = await getMeditationStats();

    return {
      success: true,
      data: {
        session,
        stats: stats.data,
        pointsEarned: 0,
      },
      message: 'Meditation session started'
    };
  } catch (error) {
    throw new Error('Failed to start meditation session');
  }
};

export const completeMeditationSession = async (
  sessionId: string,
  data: {
    completedDuration: number;
    endTime: string;
  }
): Promise<SessionResponse> => {
  await delay(200);
  
  try {
    const storedSessions = localStorage.getItem('meditationSessions');
    const sessions: MeditationSession[] = storedSessions ? JSON.parse(storedSessions) : [];
    
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }

    // Update session
    const session = sessions[sessionIndex];
    session.completedDuration = data.completedDuration;
    session.endTime = data.endTime;
    session.completed = data.completedDuration >= 300; // 5 minutes minimum
    session.updatedAt = data.endTime;

    sessions[sessionIndex] = session;
    localStorage.setItem('meditationSessions', JSON.stringify(sessions));

    const stats = await getMeditationStats();
    const pointsEarned = session.completed ? 10 : 5;

    return {
      success: true,
      data: {
        session,
        stats: stats.data,
        pointsEarned,
      },
      message: 'Meditation session completed'
    };
  } catch (error) {
    throw new Error('Failed to complete meditation session');
  }
};

export const getMeditationHistory = async (params?: {
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}): Promise<HistoryResponse> => {
  await delay(200);
  
  try {
    const storedSessions = localStorage.getItem('meditationSessions');
    let sessions: MeditationSession[] = storedSessions ? JSON.parse(storedSessions) : [];

    // Filter by date if provided
    if (params?.startDate) {
      sessions = sessions.filter(s => s.date >= params.startDate!);
    }
    if (params?.endDate) {
      sessions = sessions.filter(s => s.date <= params.endDate!);
    }

    // Sort by date descending
    sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

    // Apply pagination
    const offset = params?.offset || 0;
    const limit = params?.limit || sessions.length;
    const paginatedSessions = sessions.slice(offset, offset + limit);

    const stats = await getMeditationStats();

    return {
      success: true,
      data: {
        sessions: paginatedSessions,
        stats: stats.data,
      }
    };
  } catch (error) {
    throw new Error('Failed to fetch meditation history');
  }
};

export const getMeditationStats = async (): Promise<{ success: boolean; data: MeditationStats }> => {
  await delay(100);
  
  try {
    const storedSessions = localStorage.getItem('meditationSessions');
    const sessions: MeditationSession[] = storedSessions ? JSON.parse(storedSessions) : [];
    
    const completedSessions = sessions.filter(s => s.completed);
    
    // Calculate stats
    const totalSessions = completedSessions.length;
    const totalMinutes = completedSessions.reduce((sum, s) => sum + Math.floor(s.completedDuration / 60), 0);
    const averageSessionLength = totalSessions > 0 ? Math.floor(totalMinutes / totalSessions) : 0;
    
    // Calculate current streak
    let currentStreak = 0;
    let longestStreak = 0;
    
    if (completedSessions.length > 0) {
      const sortedByDate = [...completedSessions].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let checkDate = new Date(today);
      let tempStreak = 0;
      
      // Calculate current streak
      for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0];
        const hasSession = sortedByDate.some(s => s.date === dateStr);
        
        if (hasSession) {
          tempStreak++;
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        } else {
          if (i === 0) {
            // Check yesterday for grace period
            checkDate.setDate(checkDate.getDate() - 1);
            continue;
          }
          break;
        }
        
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      currentStreak = tempStreak;
      
      // Calculate longest streak
      let maxStreak = 0;
      let streak = 0;
      let prevDate: Date | null = null;
      
      for (const session of sortedByDate.reverse()) {
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        
        if (!prevDate) {
          streak = 1;
        } else {
          const daysDiff = Math.floor((prevDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff === 1) {
            streak++;
          } else {
            maxStreak = Math.max(maxStreak, streak);
            streak = 1;
          }
        }
        
        prevDate = sessionDate;
      }
      
      longestStreak = Math.max(maxStreak, streak, longestStreak);
    }
    
    const lastSessionDate = completedSessions.length > 0 
      ? completedSessions[0].date 
      : null;
    
    // Calculate weekly progress
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
    weekStart.setHours(0, 0, 0, 0);
    
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const weekSessions = completedSessions.filter(s => s.date >= weekStartStr);
    
    const stats: MeditationStats = {
      currentStreak,
      longestStreak,
      totalSessions,
      totalMinutes,
      averageSessionLength,
      lastSessionDate,
      weeklyGoal: 5,
      weeklyProgress: weekSessions.length,
    };
    
    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    throw new Error('Failed to fetch meditation stats');
  }
};

export const deleteMeditationSession = async (
  sessionId: string
): Promise<{ success: boolean }> => {
  await delay(150);
  
  try {
    const storedSessions = localStorage.getItem('meditationSessions');
    const sessions: MeditationSession[] = storedSessions ? JSON.parse(storedSessions) : [];
    
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    localStorage.setItem('meditationSessions', JSON.stringify(updatedSessions));
    
    return { success: true };
  } catch (error) {
    throw new Error('Failed to delete meditation session');
  }
};

export const getMeditationSettings = async (): Promise<MeditationSettings> => {
  await delay(100);
  
  try {
    const storedSettings = localStorage.getItem('meditationSettings');
    const defaultSettings: MeditationSettings = {
      userId: mockUser,
      defaultDuration: 600, // 10 minutes
      soundEnabled: true,
      vibrateEnabled: true,
      reminderEnabled: false,
      reminderTime: '09:00',
      ambientMode: true,
    };
    
    return storedSettings ? { ...defaultSettings, ...JSON.parse(storedSettings) } : defaultSettings;
  } catch (error) {
    return {
      userId: mockUser,
      defaultDuration: 600,
      soundEnabled: true,
      vibrateEnabled: true,
      reminderEnabled: false,
      reminderTime: '09:00',
      ambientMode: true,
    };
  }
};

export const updateMeditationSettings = async (
  settings: Partial<MeditationSettings>
): Promise<MeditationSettings> => {
  await delay(150);
  
  try {
    const currentSettings = await getMeditationSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    
    localStorage.setItem('meditationSettings', JSON.stringify(updatedSettings));
    
    return updatedSettings;
  } catch (error) {
    throw new Error('Failed to update meditation settings');
  }
};
