'use client';

import React, { useState, useEffect } from 'react';
import { ServingType } from '@/types/water.types';

interface ServingSizeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (servingType: ServingType, customAmount?: number) => void;
  servingSizes: ServingType[];
}

const ServingSizeSelector: React.FC<ServingSizeSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  servingSizes,
}) => {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCustomAmount('');
      setShowCustomInput(false);
    }
  }, [isOpen]);

  const handleServingSelect = (servingType: ServingType) => {
    if (servingType.id === '6') { // Custom option
      setShowCustomInput(true);
      return;
    }
    
    onSelect(servingType);
    onClose();
  };

  const handleCustomSubmit = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0 && amount <= 100) { // Reasonable limit
      const customServing: ServingType = {
        id: 'custom',
        name: 'Custom',
        amount,
        icon: '⚙️'
      };
      onSelect(customServing, amount);
      onClose();
    }
  };

  // Handle Enter key press in input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomSubmit();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {showCustomInput ? 'Custom Amount' : 'Select Serving Size'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {showCustomInput ? (
          /* Custom amount input */
          <div className="space-y-4">
            <div>
              <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter amount (oz)
              </label>
              <input
                id="customAmount"
                type="number"
                min="1"
                max="100"
                step="0.1"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="e.g., 20"
                autoFocus
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCustomInput(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleCustomSubmit}
                disabled={!customAmount || parseFloat(customAmount) <= 0 || parseFloat(customAmount) > 100 || isNaN(parseFloat(customAmount))}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Log Water
              </button>
            </div>
          </div>
        ) : (
          /* Serving size grid */
          <div className="grid grid-cols-2 gap-4">
            {servingSizes.map((serving) => (
              <button
                key={serving.id}
                onClick={() => handleServingSelect(serving)}
                className="flex flex-col items-center justify-center p-4 min-h-[100px] bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900 border-2 border-transparent hover:border-blue-500 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div className="text-2xl mb-2">{serving.icon}</div>
                <div className="font-medium text-gray-900 dark:text-white text-sm">
                  {serving.name}
                </div>
                {serving.amount > 0 && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {serving.amount} oz
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServingSizeSelector;