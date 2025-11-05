'use client';

import React from 'react';

interface BreathingCircleProps {
  className?: string;
}

const BreathingCircle: React.FC<BreathingCircleProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer breathing circle */}
      <div className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full bg-indigo-200/30 dark:bg-indigo-800/30 animate-breathing" />
      
      {/* Middle circle */}
      <div className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full bg-indigo-300/40 dark:bg-indigo-700/40 animate-breathing-delay" />
      
      {/* Inner circle with icon */}
      <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-full bg-indigo-500/50 dark:bg-indigo-600/50 flex items-center justify-center">
        <span className="text-3xl md:text-5xl">🧘</span>
      </div>
      
      <style jsx>{`
        @keyframes breathing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
        }
        
        @keyframes breathing-delay {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.4;
          }
        }
        
        .animate-breathing {
          animation: breathing 4s ease-in-out infinite;
        }
        
        .animate-breathing-delay {
          animation: breathing-delay 4s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default BreathingCircle;
