'use client';

import Link from 'next/link';

interface TermsCheckboxProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function TermsCheckbox({
  id = 'agreeToTerms',
  name = 'agreeToTerms',
  checked,
  onChange,
  error,
  disabled = false,
  className = '',
}: TermsCheckboxProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex items-center h-5">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className={`
              w-4 h-4 rounded
              border-gray-300 dark:border-gray-600
              text-blue-600 
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
              disabled:opacity-50 disabled:cursor-not-allowed
              cursor-pointer
              ${error ? 'border-red-500' : ''}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        </div>
        <div className="flex-1">
          <label
            htmlFor={id}
            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none"
          >
            I agree to the{' '}
            <Link
              href="/legal/terms"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href="/legal/privacy"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
          </label>
        </div>
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 ml-7 text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
