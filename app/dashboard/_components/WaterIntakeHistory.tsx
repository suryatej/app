'use client';

import React from 'react';
import { WaterIntakeEntry } from '@/types/water.types';
import { format } from 'date-fns';

interface WaterIntakeHistoryProps {
  entries: WaterIntakeEntry[];
  onDeleteEntry: (entryId: string) => void;
  className?: string;
}

const WaterIntakeHistory: React.FC<WaterIntakeHistoryProps> = ({
  entries,
  onDeleteEntry,
  className = '',
}) => {
  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'h:mm a');
    } catch {
      return 'Invalid time';
    }
  };

  const handleDelete = (entryId: string, servingType: string, amount: number) => {
    if (window.confirm(`Delete ${amount}oz ${servingType} entry?`)) {
      onDeleteEntry(entryId);
    }
  };

  if (entries.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-4xl mb-2">💧</div>
        <p className="text-gray-500 dark:text-gray-400">
          No water logged today
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Start by logging your first glass!
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
        Today&apos;s Intake
      </h4>
      
      <div className="max-h-[200px] overflow-y-auto space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-lg">
                {entry.servingType === 'Glass' && '🥛'}
                {entry.servingType === 'Bottle' && '🍾'}
                {entry.servingType === 'Large Bottle' && '💧'}
                {entry.servingType === 'Cup' && '☕'}
                {entry.servingType === 'Small Glass' && '🥃'}
                {entry.servingType === 'Custom' && '⚙️'}
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {entry.amount}oz {entry.servingType}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(entry.timestamp)}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => handleDelete(entry.id, entry.servingType, entry.amount)}
              className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
              aria-label={`Delete ${entry.amount}oz ${entry.servingType} entry`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      {entries.length > 0 && (
        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total: {entries.reduce((sum, entry) => sum + entry.amount, 0)}oz today
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterIntakeHistory;