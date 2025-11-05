'use client';

import React from 'react';
import WaterProgressRing from './WaterProgressRing';
import WaterIntakeHistory from './WaterIntakeHistory';
import QuickLogButton from './QuickLogButton';
import ServingSizeSelector from './ServingSizeSelector';
import useWaterTracking from './useWaterTracking';
import toast, { Toaster } from 'react-hot-toast';

interface WaterIntakeCardProps {
  className?: string;
}

const WaterIntakeCard: React.FC<WaterIntakeCardProps> = ({ className = '' }) => {
  const {
    todayEntries,
    currentTotal,
    dailyGoal,
    progressPercentage,
    showUndoToast,
    isCelebrating,
    isModalOpen,
    lastLoggedEntry,
    servingSizes,
    isLoading,
    logWater,
    undoLastEntry,
    deleteEntry,
    setModalOpen,
  } = useWaterTracking();

  const handleLogButtonClick = () => {
    setModalOpen(true);
  };

  const handleServingSelect = async (servingType: any, customAmount?: number) => {
    try {
      await logWater(servingType, customAmount);
    } catch (error) {
      console.error('Failed to log water:', error);
    }
  };

  const getGlassesProgress = () => {
    const glasses = Math.floor(currentTotal / 8); // Assuming 8oz glasses
    const totalGlasses = Math.ceil(dailyGoal / 8);
    return `${glasses}/${totalGlasses}`;
  };

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 min-h-[400px] ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            Water Intake
          </h3>
          {isCelebrating && (
            <div className="animate-bounce text-2xl">🎉</div>
          )}
        </div>

        {/* Progress Section */}
        <div className="flex flex-col items-center mb-6">
          <WaterProgressRing 
            percentage={progressPercentage}
            size={160}
            className="mb-4"
          />
          
          <div className="text-center">
            <div className="font-bold text-2xl text-blue-600 dark:text-blue-400 mb-1">
              {getGlassesProgress()} glasses
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {currentTotal}oz of {dailyGoal}oz goal
            </div>
          </div>
        </div>

        {/* Quick Log Button */}
        <div className="mb-6">
          <QuickLogButton
            onClick={handleLogButtonClick}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* History */}
        <WaterIntakeHistory
          entries={todayEntries}
          onDeleteEntry={deleteEntry}
        />

        {/* Undo Toast */}
        {showUndoToast && lastLoggedEntry && (
          <div className="fixed bottom-4 left-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center justify-between z-40">
            <span className="text-sm">
              Logged {lastLoggedEntry.amount}oz {lastLoggedEntry.servingType}
            </span>
            <button
              onClick={undoLastEntry}
              className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
            >
              Undo
            </button>
          </div>
        )}
      </div>

      {/* Serving Size Modal */}
      <ServingSizeSelector
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={handleServingSelect}
        servingSizes={servingSizes}
      />

      {/* Toast Container */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
};

export default WaterIntakeCard;