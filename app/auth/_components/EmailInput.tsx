'use client';

import { forwardRef } from 'react';

interface EmailInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  (
    {
      id = 'email',
      name = 'email',
      value,
      onChange,
      onBlur,
      error,
      disabled = false,
      placeholder = 'Enter your email',
      autoComplete = 'email',
      required = false,
      className = '',
    },
    ref
  ) => {
    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Email address {required && <span className="text-red-500">*</span>}
        </label>
        <input
          ref={ref}
          id={id}
          name={name}
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-gray-50 dark:bg-gray-700
            border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:bg-white dark:focus:bg-gray-600
            focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-150
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && (
          <p
            id={`${id}-error`}
            className="mt-1 text-xs text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

EmailInput.displayName = 'EmailInput';
