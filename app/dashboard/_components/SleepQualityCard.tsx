'use client';

import { useSleepTracking } from './useSleepTracking';
import SleepProgressRing from './SleepProgressRing';
import SleepQualityMetrics from './SleepQualityMetrics';
import SleepStatistics from './SleepStatistics';

export default function SleepQualityCard() {
  const {
    isLoading,
    todaySleep,
    sleepHistory,
    statistics,
    goal,
    goalProgress,
    isGoalMet,
    selectedPeriod,
    changePeriod,
    formatDuration,
    formatTimeDisplay,
    getBadgeColor,
    getSleepSummary,
  } = useSleepTracking();

  const summary = getSleepSummary();

  // Period selector buttons
  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ] as const;

  if (isLoading && !todaySleep) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 min-h-[500px]">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="flex justify-center">
            <div className="w-40 h-40 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">😴</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Sleep Quality
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {summary.hasSleep ? 'Track your rest and recovery' : 'No sleep data yet'}
              </p>
            </div>
          </div>

          {/* Quality Badge */}
          {summary.hasSleep && (
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(summary.quality)}`}>
              {summary.quality.charAt(0).toUpperCase() + summary.quality.slice(1)}
            </div>
          )}
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => changePeriod(period.value)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedPeriod === period.value
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {!summary.hasSleep ? (
          // No Data State
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💤</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Sleep Data Available
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              Sleep data will appear here once you start tracking your sleep with Apple Health or add manual entries.
            </p>
          </div>
        ) : (
          <>
            {/* Progress Ring Section */}
            <div className="flex flex-col items-center py-4">
              <SleepProgressRing
                duration={summary.duration}
                goal={goal.targetHours}
                quality={summary.quality}
                progress={goalProgress}
                size="md"
              />
              
              {/* Goal Status Message */}
              <div className="mt-4 text-center">
                <p className={`text-sm font-medium ${
                  isGoalMet 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {summary.message}
                </p>
                {todaySleep && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatTimeDisplay(todaySleep.startTime)} - {formatTimeDisplay(todaySleep.endTime)}
                  </p>
                )}
              </div>
            </div>

            {/* Sleep Stages */}
            {todaySleep && selectedPeriod === 'today' && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <SleepQualityMetrics
                  stages={todaySleep.stages}
                  totalDuration={todaySleep.duration}
                />
              </div>
            )}

            {/* Statistics (Week/Month View) */}
            {selectedPeriod !== 'today' && sleepHistory.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <SleepStatistics statistics={statistics} />
              </div>
            )}

            {/* Sleep History Summary */}
            {sleepHistory.length > 1 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Recent Sleep
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last {Math.min(sleepHistory.length, 7)} nights
                  </span>
                </div>
                
                <div className="space-y-2">
                  {sleepHistory.slice(0, 7).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(session.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className={`px-2 py-0.5 rounded text-xs font-medium ${getBadgeColor(session.quality)}`}>
                          {session.quality}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatDuration(session.duration)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
