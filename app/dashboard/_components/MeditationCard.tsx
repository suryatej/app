'use client';

import React from 'react';
import useMeditationTimer from './useMeditationTimer';
import MeditationTimer from './MeditationTimer';
import MeditationHistory from './MeditationHistory';
import DurationSelector from './DurationSelector';
import SessionSummary from './SessionSummary';
import { deleteMeditationSession, getMeditationHistory, getMeditationStats } from '@/lib/api/meditationApi';
import toast from 'react-hot-toast';

interface MeditationCardProps {
  className?: string;
}

const MeditationCard: React.FC<MeditationCardProps> = ({ className = '' }) => {
  const {
    isLoading,
    error,
    isActive,
    isPaused,
    remainingTime,
    formattedTime,
    recentSessions,
    stats,
    isDurationSelectorOpen,
    isSessionSummaryOpen,
    isCelebrating,
    showConfirmStop,
    durations,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    setDurationSelectorOpen,
    setShowConfirmStop,
    clearError,
  } = useMeditationTimer();

  const handleStartClick = () => {
    setDurationSelectorOpen(true);
  };

  const handleDurationSelect = async (duration: number) => {
    try {
      await startSession(duration);
      toast.success('Meditation started');
    } catch (err) {
      toast.error('Failed to start meditation');
      console.error(err);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteMeditationSession(sessionId);
      
      // Refresh data
      const [historyResponse, statsResponse] = await Promise.all([
        getMeditationHistory({ limit: 10 }),
        getMeditationStats(),
      ]);
      
      // Update store (this would typically be done through the hook)
      toast.success('Session deleted');
    } catch (err) {
      toast.error('Failed to delete session');
      console.error(err);
    }
  };

  const handleSessionSummaryClose = () => {
    // The hook handles closing after timeout
  };

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 min-h-[400px] flex flex-col ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            Meditation
          </h3>
          {isCelebrating && (
            <div className="animate-bounce text-2xl">✨</div>
          )}
        </div>

        {/* Stats Section */}
        <div className="flex flex-col items-center mb-6">
          {/* Streak Display */}
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">🧘</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
              {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current Streak
            </div>
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-2 gap-4 w-full mb-6">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.totalMinutes}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Minutes
              </div>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {stats.totalSessions}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Sessions
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartClick}
          disabled={isLoading || isActive}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed mb-6"
        >
          {isActive ? 'Session in Progress...' : 'Start Meditation'}
        </button>

        {/* History Section */}
        <div className="flex-1">
          <MeditationHistory
            sessions={recentSessions}
            onDeleteSession={handleDeleteSession}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              <button
                onClick={clearError}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Duration Selector Modal */}
      <DurationSelector
        isOpen={isDurationSelectorOpen}
        onClose={() => setDurationSelectorOpen(false)}
        onSelect={handleDurationSelect}
        durations={durations}
      />

      {/* Timer Full Screen */}
      <MeditationTimer
        isActive={isActive}
        isPaused={isPaused}
        remainingTime={remainingTime}
        formattedTime={formattedTime}
        onPause={pauseSession}
        onResume={resumeSession}
        onStop={stopSession}
        showConfirmStop={showConfirmStop}
        setShowConfirmStop={setShowConfirmStop}
      />

      {/* Session Summary Modal */}
      <SessionSummary
        isOpen={isSessionSummaryOpen}
        onClose={handleSessionSummaryClose}
        completedDuration={remainingTime === 0 ? stats.averageSessionLength * 60 : 0}
        stats={stats}
        isCelebrating={isCelebrating}
      />
    </>
  );
};

export default MeditationCard;
