'use client';

import React, { useEffect, useState } from 'react';
import BreathingCircle from './BreathingCircle';

interface MeditationTimerProps {
  isActive: boolean;
  isPaused: boolean;
  remainingTime: number;
  formattedTime: string;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  showConfirmStop: boolean;
  setShowConfirmStop: (show: boolean) => void;
  className?: string;
}

const MeditationTimer: React.FC<MeditationTimerProps> = ({
  isActive,
  isPaused,
  remainingTime,
  formattedTime,
  onPause,
  onResume,
  onStop,
  showConfirmStop,
  setShowConfirmStop,
  className = '',
}) => {
  const [isAmbientMode, setIsAmbientMode] = useState(false);
  const [ambientTimer, setAmbientTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Reset ambient mode when timer becomes active
    if (isActive && !isPaused) {
      setIsAmbientMode(false);
      
      // Set ambient mode after 10 seconds of inactivity
      const timer = setTimeout(() => {
        setIsAmbientMode(true);
      }, 10000);
      
      setAmbientTimer(timer);
      
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [isActive, isPaused]);

  const handleScreenTap = () => {
    if (isAmbientMode) {
      setIsAmbientMode(false);
      if (ambientTimer) clearTimeout(ambientTimer);
    }
  };

  const handleStopClick = () => {
    setShowConfirmStop(true);
  };

  const handleConfirmStop = () => {
    setShowConfirmStop(false);
    onStop();
  };

  const handleCancelStop = () => {
    setShowConfirmStop(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      if (isPaused) {
        onResume();
      } else {
        onPause();
      }
    } else if (e.key === 'Escape') {
      handleStopClick();
    }
  };

  if (!isActive) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-indigo-900 flex flex-col items-center justify-center transition-all ${
        isAmbientMode ? 'brightness-50' : ''
      } ${className}`}
      onClick={handleScreenTap}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label="Meditation Timer"
    >
      {/* Breathing Animation */}
      <div className="mb-8">
        <BreathingCircle />
      </div>

      {/* Timer Display */}
      <div
        className="font-mono text-7xl md:text-8xl font-bold text-indigo-600 dark:text-indigo-300 mb-12 leading-none tracking-tight"
        role="timer"
        aria-live="polite"
        aria-atomic="true"
      >
        {formattedTime}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs mb-12 px-4">
        <div className="h-2 bg-indigo-200 dark:bg-indigo-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-1000 ease-linear"
            style={{ width: `${(remainingTime / (remainingTime + 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex space-x-4">
        {!isPaused ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPause();
            }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
            aria-label="Pause meditation"
          >
            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onResume();
            }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
            aria-label="Resume meditation"
          >
            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStopClick();
          }}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center"
          aria-label="Stop meditation"
        >
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        </button>
      </div>

      {/* Paused Indicator */}
      {isPaused && (
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg">
          <span className="font-semibold">Paused</span>
        </div>
      )}

      {/* Ambient Mode Hint */}
      {!isAmbientMode && !isPaused && (
        <div className="absolute bottom-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Tap screen to keep display active</p>
          <p className="text-xs mt-1">Press Space to pause • Esc to stop</p>
        </div>
      )}

      {/* Confirm Stop Modal */}
      {showConfirmStop && (
        <>
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancelStop}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              End Session Early?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to stop? Your progress will still be saved.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelStop}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Continue
              </button>
              <button
                onClick={handleConfirmStop}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Stop
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MeditationTimer;
