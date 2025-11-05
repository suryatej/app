'use client';

import React from 'react';
import { MeditationSession } from '@/types/meditation.types';
import { format } from 'date-fns';

interface MeditationHistoryProps {
  sessions: MeditationSession[];
  onDeleteSession?: (sessionId: string) => void;
  className?: string;
}

const MeditationHistory: React.FC<MeditationHistoryProps> = ({
  sessions,
  onDeleteSession,
  className = '',
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const getTimeOfDayEmoji = (timeOfDay: string): string => {
    switch (timeOfDay) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌆';
      case 'night': return '🌙';
      default: return '🧘';
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  if (sessions.length === 0) {
    return (
      <div className={`${className}`}>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Recent Sessions
        </h4>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🧘</div>
          <p className="text-sm">No meditation sessions yet</p>
          <p className="text-xs mt-1">Start your first session to build your practice</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Recent Sessions
      </h4>
      <div className="space-y-2 max-h-[180px] overflow-y-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
              session.completed
                ? 'bg-indigo-50 dark:bg-indigo-900/20'
                : 'bg-gray-50 dark:bg-gray-700/50'
            }`}
          >
            <div className="flex items-center space-x-3 flex-1">
              <span className="text-xl">{getTimeOfDayEmoji(session.timeOfDay)}</span>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDuration(session.completedDuration)}
                  </span>
                  {!session.completed && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      (partial)
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {session.timeOfDay} • {formatDate(session.date)}
                </div>
              </div>
            </div>
            {onDeleteSession && (
              <button
                onClick={() => onDeleteSession(session.id)}
                className="ml-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                aria-label="Delete session"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeditationHistory;
