'use client';

import React, { useState, useEffect } from 'react';
import { DurationType } from '@/types/meditation.types';

interface DurationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (duration: number) => void;
  durations: DurationType[];
  className?: string;
}

const DurationSelector: React.FC<DurationSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  durations,
  className = '',
}) => {
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowCustomInput(false);
      setCustomMinutes('');
    }
  }, [isOpen]);

  const handleDurationSelect = (duration: DurationType) => {
    if (duration.id === '5') {
      setShowCustomInput(true);
    } else {
      onSelect(duration.duration);
      onClose();
    }
  };

  const handleCustomSubmit = () => {
    const mins = parseInt(customMinutes, 10);
    if (mins >= 1 && mins <= 60) {
      onSelect(mins * 60);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customMinutes) {
      handleCustomSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Select Duration
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Duration Grid */}
          {!showCustomInput ? (
            <div className="grid grid-cols-2 gap-4">
              {durations.map((duration) => (
                <button
                  key={duration.id}
                  onClick={() => handleDurationSelect(duration)}
                  className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                    duration.recommended
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 hover:border-indigo-600'
                      : 'bg-gray-50 dark:bg-gray-700 border-transparent hover:border-indigo-500'
                  }`}
                >
                  <div className="text-3xl mb-2">{duration.icon}</div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {duration.name}
                  </div>
                  {duration.duration > 0 && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {duration.duration / 60} minutes
                    </div>
                  )}
                  {duration.recommended && (
                    <div className="mt-1">
                      <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                        Recommended
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter minutes (1-60)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., 10"
                  autoFocus
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCustomInput(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customMinutes || parseInt(customMinutes) < 1 || parseInt(customMinutes) > 60}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                  Start
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DurationSelector;
