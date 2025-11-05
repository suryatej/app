'use client';

import React from 'react';

interface QuickLogButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'floating';
  className?: string;
}

const QuickLogButton: React.FC<QuickLogButtonProps> = ({
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
}) => {
  const baseClasses = 'flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white rounded-lg px-6 py-3 hover:bg-blue-700 hover:shadow-md',
    floating: 'bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl hover:scale-105 fixed bottom-6 right-6 z-50',
  };

  return (
    <button
      onClick={onClick}
      disabled={false}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label="Log water intake"
      type="button"
    >
      {variant === 'floating' ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Log Water
        </>
      )}
    </button>
  );
};

export default QuickLogButton;