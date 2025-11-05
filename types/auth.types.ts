// Authentication Types

// User
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  provider: 'email' | 'google' | 'apple' | 'facebook';
}

// Session
export interface Session {
  token: string;
  expiresAt: string;
  refreshToken: string;
}

// Register
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  data?: {
    user: User;
    session: Session;
  };
  error?: {
    code: string;
    message: string;
    field?: string;
  };
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    session: Session;
  };
  error?: {
    code: string;
    message: string;
    field?: string;
  };
}

// Auth State
export type AuthMode = 'signin' | 'register';
export type AuthProvider = 'email' | 'google' | 'apple' | 'facebook';

export interface AuthError {
  code: string;
  message: string;
  provider?: AuthProvider;
}

export interface AuthState {
  authMode: AuthMode;
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: AuthError | null;
}
