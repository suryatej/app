'use client';

import Link from 'next/link';
import { useRegisterForm } from './useRegisterForm';
import { EmailInput } from '../../_components/EmailInput';
import { PasswordInput } from '../../_components/PasswordInput';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { PasswordRequirements } from './PasswordRequirements';
import { TermsCheckbox } from './TermsCheckbox';

export function RegisterForm() {
  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleBlur,
    handleSubmit,
  } = useRegisterForm();

  return (
    <div className="w-full max-w-md mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start your wellness journey today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* General Error */}
          {errors.general && (
            <div
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              role="alert"
            >
              <p className="text-sm text-red-800 dark:text-red-200">
                {errors.general}
              </p>
            </div>
          )}

          {/* Email Input */}
          <EmailInput
            value={formData.email}
            onChange={(value) => updateField('email', value)}
            onBlur={() => handleBlur('email')}
            error={errors.email}
            disabled={isSubmitting}
            required
            autoComplete="email"
          />

          {/* Password Input */}
          <div className="space-y-3">
            <PasswordInput
              id="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={(value) => updateField('password', value)}
              onBlur={() => handleBlur('password')}
              error={errors.password}
              disabled={isSubmitting}
              required
              autoComplete="new-password"
            />

            {/* Password Strength Meter */}
            {formData.password && (
              <PasswordStrengthMeter password={formData.password} />
            )}

            {/* Password Requirements */}
            <PasswordRequirements password={formData.password} />
          </div>

          {/* Confirm Password Input */}
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={(value) => updateField('confirmPassword', value)}
            onBlur={() => handleBlur('confirmPassword')}
            error={errors.confirmPassword}
            disabled={isSubmitting}
            required
            autoComplete="new-password"
          />

          {/* Terms Checkbox */}
          <TermsCheckbox
            checked={formData.agreeToTerms}
            onChange={(checked) => updateField('agreeToTerms', checked)}
            error={errors.agreeToTerms}
            disabled={isSubmitting}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Creating account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
