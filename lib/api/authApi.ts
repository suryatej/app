// Authentication API

import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from '@/types/auth.types';

// Base API URL - in production this should come from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Register a new user with email and password
 */
export async function registerWithEmail(
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password } as RegisterRequest),
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Handle non-JSON responses (e.g., 404 HTML pages)
      return {
        success: false,
        error: {
          code: 'API_NOT_AVAILABLE',
          message: 'Authentication service is not available. Please contact support.',
        },
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || 'REGISTRATION_FAILED',
          message: data.message || 'Registration failed. Please try again.',
          field: data.field,
        },
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to the server. Please check your internet connection.',
      },
    };
  }
}

/**
 * Check if an email is available for registration
 */
export async function checkEmailAvailability(email: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.available === true;
  } catch (error) {
    console.error('Email check error:', error);
    // If check fails, allow form to proceed (backend will validate)
    return true;
  }
}

/**
 * Sign in with email and password
 */
export async function loginWithEmail(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, rememberMe } as LoginRequest),
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Handle non-JSON responses (e.g., 404 HTML pages)
      return {
        success: false,
        error: {
          code: 'API_NOT_AVAILABLE',
          message: 'Authentication service is not available. Please contact support.',
        },
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || 'LOGIN_FAILED',
          message: data.message || 'Invalid email or password. Please try again.',
          field: data.field,
        },
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect to the server. Please check your internet connection.',
      },
    };
  }
}

/**
 * Refresh the current session
 */
export async function refreshSession(): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for refresh token
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Handle non-JSON responses (e.g., 404 HTML pages)
      return {
        success: false,
        error: {
          code: 'API_NOT_AVAILABLE',
          message: 'Authentication service is not available.',
        },
      };
    }

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || 'REFRESH_FAILED',
          message: data.message || 'Session expired. Please sign in again.',
        },
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
      },
    };
  } catch (error) {
    console.error('Refresh session error:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to refresh session.',
      },
    };
  }
}

/**
 * Logout the current user
 */
export async function logout(): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return { success: response.ok };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
}
