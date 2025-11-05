'use client';

import { useMemo } from 'react';
import { getPasswordRequirements } from '@/lib/utils/passwordStrength';

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

export function PasswordRequirements({ password, className = '' }: PasswordRequirementsProps) {
  const requirements = useMemo(() => getPasswordRequirements(password), [password]);

  return (
    <div className={`w-full ${className}`}>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        Password must contain:
      </p>
      <ul className="space-y-1">
        {requirements.map((requirement, index) => (
          <li
            key={index}
            className="flex items-center gap-2 text-xs"
          >
            <span
              className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                requirement.met
                  ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              }`}
              aria-label={requirement.met ? 'Requirement met' : 'Requirement not met'}
            >
              {requirement.met ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3 h-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-2 h-2"
                >
                  <circle cx="8" cy="8" r="3" />
                </svg>
              )}
            </span>
            <span
              className={
                requirement.met
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-500 dark:text-gray-400'
              }
            >
              {requirement.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
