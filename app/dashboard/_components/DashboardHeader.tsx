'use client';

import { UserMenu } from './UserMenu';

export function DashboardHeader() {
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="text-2xl">🏥</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Healthify
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your Wellness Companion
              </p>
            </div>
          </div>

          {/* Right Side - User Menu */}
          <div className="flex items-center gap-4">
            {/* Notifications (placeholder for future) */}
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 relative focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Notifications"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
