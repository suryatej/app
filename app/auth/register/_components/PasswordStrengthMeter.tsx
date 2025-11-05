'use client';

import { useMemo } from 'react';
import { calculatePasswordStrength, getPasswordStrengthColor, getPasswordStrengthTextColor } from '@/lib/utils/passwordStrength';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export function PasswordStrengthMeter({ password, className = '' }: PasswordStrengthMeterProps) {
  const strengthResult = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Password strength
        </span>
        <span className={`text-xs font-medium ${getPasswordStrengthTextColor(strengthResult.strength)}`}>
          {strengthResult.feedback}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${getPasswordStrengthColor(strengthResult.strength)} transition-all duration-300 ease-out`}
          style={{ width: `${strengthResult.percentage}%` }}
          role="progressbar"
          aria-valuenow={strengthResult.percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Password strength: ${strengthResult.strength}`}
        />
      </div>
    </div>
  );
}
