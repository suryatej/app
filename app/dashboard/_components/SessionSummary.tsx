'use client';

import React from 'react';
import { MeditationStats } from '@/types/meditation.types';

interface SessionSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  completedDuration: number;
  stats: MeditationStats;
  isCelebrating: boolean;
  className?: string;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({
  isOpen,
  onClose,
  completedDuration,
  stats,
  isCelebrating,
  className = '',
}) => {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  };

  const getMotivationalMessage = (): string => {
    const messages = [
      'Great session! Keep up the mindful practice.',
      'Well done! Your consistency is building.',
      'Excellent work! Inner peace achieved.',
      'Amazing! You\'re growing your practice.',
      'Wonderful session! Keep breathing.',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center transform transition-all ${
            isCelebrating ? 'scale-105' : 'scale-100'
          } ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success Icon */}
          <div className={`inline-block mb-4 ${isCelebrating ? 'animate-bounce' : ''}`}>
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <span className="text-5xl">✨</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Session Complete!
          </h2>

          {/* Motivational Message */}
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {getMotivationalMessage()}
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                {formatDuration(completedDuration)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Completed
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                {stats.currentStreak}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Day Streak
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                {stats.totalSessions}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Sessions
              </div>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                {stats.totalMinutes}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Minutes
              </div>
            </div>
          </div>

          {/* Streak Achievement */}
          {stats.currentStreak > 0 && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-3 mb-6">
              <div className="text-sm font-semibold">
                🔥 {stats.currentStreak} day streak! Keep it going!
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionSummary;
