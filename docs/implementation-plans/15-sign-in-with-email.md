# 15 - Sign In with Email - Implementation Planning

## User Story

As a registered user, I want to sign in using my email address and password, so that I can access my wellness data and continue tracking my health goals.

## Pre-conditions

- User has previously registered with email and password
- User has navigated from /auth/welcome in "signin" mode
- No active session exists
- User credentials exist in the database

## Design

### Visual Layout

The email sign-in screen features:
- **Header**: Back button and "Welcome Back" title
- **Form Section**: Simple, clean login form
- **Remember Me**: Optional checkbox to persist session
- **Forgot Password**: Link to password recovery flow
- **Submit Button**: Prominent "Sign In" CTA
- **Registration Link**: Option for new users to create account

### Color and Typography

- **Background Colors**: 
  - Primary: bg-white dark:bg-gray-900
  - Card: bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
  - Input: bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600

- **Typography**:
  - Page Title: font-sans text-3xl font-bold text-gray-900 dark:text-white
  - Subtitle: font-sans text-base text-gray-600 dark:text-gray-400
  - Labels: font-sans text-sm font-medium text-gray-700 dark:text-gray-300
  - Input Text: font-sans text-base text-gray-900 dark:text-white
  - Links: text-blue-600 hover:text-blue-700 dark:text-blue-400
  - Error Text: text-sm text-red-600 dark:text-red-400

- **Component-Specific**:
  - Input Fields: border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500
  - Sign In Button: bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300
  - Checkbox: accent-blue-600 focus:ring-2 focus:ring-blue-500

### Interaction Patterns

- **Input Field Interaction**: 
  - Focus: Border color change, ring effect
  - Error: Red border, shake animation, error message
  - Disabled: Opacity 50%, cursor not-allowed
  - Autofill: Maintain consistent styling
  - Accessibility: Label association, error announcements

- **Button Interaction**:
  - Hover: Background darken (150ms ease)
  - Click: Scale 0.98, subtle shadow
  - Loading: Spinner replaces text, full opacity
  - Disabled: Gray background, reduced opacity
  - Accessibility: Focus ring, keyboard activation

- **Remember Me Checkbox**:
  - Check/uncheck animation
  - Focus ring on keyboard navigation
  - Larger click target (min 44x44px)
  - Label is clickable

### Measurements and Spacing

- **Container**:
  ```
  min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8
  ```

- **Form Spacing**:
  ```
  - Form container: max-w-md w-full space-y-6
  - Field spacing: space-y-4
  - Label to input: mb-1
  - Input to error: mt-1
  - Remember me section: mt-4 mb-6
  - Button: w-full py-3
  - Links: mt-4
  ```

### Responsive Behavior

- **Desktop (lg: 1024px+)**:
  ```
  - Form: max-w-md centered
  - Standard input sizing: py-3 px-4
  - Remember me and forgot password on same line
  - Full visual spacing
  ```

- **Tablet (md: 768px - 1023px)**:
  ```
  - Form: max-w-sm centered
  - Standard spacing maintained
  - Remember me and forgot password inline
  ```

- **Mobile (sm: < 768px)**:
  ```
  - Full-width form with minimal margins
  - Remember me and forgot password stacked
  - Larger touch targets
  - Reduced spacing
  ```

## Technical Requirements

### Component Structure

```
src/app/auth/login/
├── page.tsx                           # Main sign-in page
└── _components/
    ├── LoginForm.tsx                  # Main form component
    ├── EmailInput.tsx                 # Email field (reusable)
    ├── PasswordInput.tsx              # Password field with show/hide
    ├── RememberMeCheckbox.tsx         # Session persistence option
    └── useLoginForm.ts                # Form logic and authentication hook

src/app/auth/forgot-password/
└── page.tsx                           # Password recovery page (future)
```

### Required Components

- LoginForm ⬜
- EmailInput ⬜ (reuse from register)
- PasswordInput ⬜ (reuse from register)
- RememberMeCheckbox ⬜
- useLoginForm (hook) ⬜

### State Management Requirements

```typescript
// Form State
interface LoginFormState {
  // Form Data
  email: string;
  password: string;
  rememberMe: boolean;
  
  // UI States
  isSubmitting: boolean;
  showPassword: boolean;
  
  // Error States
  errors: {
    email?: string;
    password?: string;
    submit?: string; // General auth errors
  };
  touched: {
    email: boolean;
    password: boolean;
  };
}

// Actions
interface LoginFormActions {
  updateField: (field: string, value: string | boolean) => void;
  togglePasswordVisibility: () => void;
  validateField: (field: string) => boolean;
  handleSubmit: () => Promise<void>;
  reset: () => void;
}
```

### Form Schema

```typescript
// lib/schemas/loginSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  
  password: z
    .string()
    .min(1, 'Password is required'),
  
  rememberMe: z
    .boolean()
    .optional()
    .default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

## Acceptance Criteria

### Layout & Content

1. Sign-In Form Layout
   ```
   - Back button (top left) → returns to /auth/welcome
   - Page title "Welcome Back" centered
   - Subtitle "Sign in to continue your wellness journey"
   - Form fields in vertical stack:
     * Email address field
     * Password field with show/hide toggle
   - Remember me checkbox (left) and Forgot password link (right)
   - "Sign In" submit button (full-width)
   - Registration link at bottom ("Don't have an account? Sign up")
   ```

2. Visual States
   ```
   - Empty state: Clean form ready for input
   - Loading state: Spinner in button, form disabled
   - Error state: Red border on fields, error messages
   - Success state: Brief confirmation, redirect to dashboard
   ```

### Functionality

1. Email Field

   - [ ] Email field accepts text input
   - [ ] Email validation on blur (format check)
   - [ ] Error message shown for invalid format
   - [ ] Field is required
   - [ ] Autofill works correctly
   - [ ] Email is trimmed and lowercase on submit

2. Password Field

   - [ ] Password field is masked by default
   - [ ] Show/hide toggle reveals/hides password
   - [ ] Field is required
   - [ ] No client-side password validation (just required)
   - [ ] Copy/paste is allowed
   - [ ] Autofill works correctly

3. Remember Me

   - [ ] Checkbox defaults to unchecked
   - [ ] Checking extends session duration
   - [ ] State persists selection during validation errors
   - [ ] Label is clickable
   - [ ] Keyboard accessible

4. Form Submission

   - [ ] Submit button disabled during loading
   - [ ] Loading spinner shown during authentication
   - [ ] Form fields disabled during submission
   - [ ] Successful login redirects to dashboard
   - [ ] Invalid credentials show clear error message
   - [ ] Network errors display with retry option
   - [ ] Multiple failed attempts handled appropriately

5. Forgot Password

   - [ ] Link is visible and accessible
   - [ ] Clicking navigates to password recovery flow
   - [ ] Link maintains context (email prefilled if entered)

6. Navigation

   - [ ] "Don't have an account? Sign up" navigates to /auth/register
   - [ ] Back button returns to /auth/welcome
   - [ ] Authenticated users redirected to /dashboard

### Navigation Rules

- Back button returns to /auth/welcome in signin mode
- "Don't have an account? Sign up" link goes to /auth/register
- "Forgot password?" link goes to /auth/forgot-password
- Successful sign-in redirects to /dashboard
- Authenticated users accessing this page are redirected to /dashboard
- Form state preserved during validation errors (not on successful login)

### Error Handling

- **Validation Errors**: 
  - Empty email: "Email is required"
  - Invalid email: "Please enter a valid email address"
  - Empty password: "Password is required"
  
- **Authentication Errors**:
  - Invalid credentials: "Invalid email or password. Please try again."
  - Account not found: "No account found with this email. Sign up?"
  - Account locked: "Your account has been locked. Please contact support."
  - Too many attempts: "Too many failed attempts. Please try again in 15 minutes."
  
- **Network Errors**:
  - Connection failed: "Unable to sign in. Please check your connection and try again."
  - Server error: "Something went wrong on our end. Please try again later."

## Modified Files

```
src/app/auth/login/
├── page.tsx ⬜
└── _components/
    ├── LoginForm.tsx ⬜
    ├── RememberMeCheckbox.tsx ⬜
    └── useLoginForm.ts ⬜

src/app/auth/_components/
├── EmailInput.tsx ⬜ (shared with register)
└── PasswordInput.tsx ⬜ (shared with register)

lib/
├── api/
│   └── authApi.ts ⬜ (add login method)
├── schemas/
│   └── loginSchema.ts ⬜
└── utils/
    └── sessionUtils.ts ⬜
```

## Status

🟨 IN PROGRESS

1. Setup & Configuration

   - [ ] Create login form schema
   - [ ] Set up login API endpoint types
   - [ ] Create session utility functions
   - [ ] Configure remember me session duration

2. Layout Implementation

   - [ ] Create login page layout
   - [ ] Implement responsive form container
   - [ ] Add header with back button
   - [ ] Create form structure with proper spacing

3. Component Implementation

   - [ ] Reuse EmailInput from register
   - [ ] Reuse PasswordInput from register
   - [ ] Create RememberMeCheckbox component
   - [ ] Build LoginForm wrapper
   - [ ] Add forgot password link

4. Form Logic & Validation

   - [ ] Implement useLoginForm hook
   - [ ] Add field validation
   - [ ] Implement authentication logic
   - [ ] Add error handling and display
   - [ ] Implement remember me functionality

5. API Integration

   - [ ] Create login API endpoint
   - [ ] Implement authentication logic
   - [ ] Add credential verification
   - [ ] Set up session creation
   - [ ] Handle remember me token generation
   - [ ] Add rate limiting for security

6. Testing
   - [ ] Form validation
   - [ ] Authentication flow (success/failure)
   - [ ] Remember me functionality
   - [ ] Forgot password navigation
   - [ ] Responsive layout
   - [ ] Accessibility compliance
   - [ ] Error scenarios (network, auth, etc.)

## Dependencies

- Form validation library (Zod)
- Authentication API endpoints
- Session management system
- Toast notification system (react-hot-toast)
- Password recovery flow (future)

## Related Stories

- [Story 18] - Choose Authentication Method (entry point)
- [Story 14] - Register with Email (new user alternative)
- [Story 17] - Sign In with Social Media (alternative sign-in)

## Notes

### Technical Considerations

1. **Security**:
   - Use HTTPS for all authentication requests
   - Implement rate limiting (e.g., 5 attempts per 15 minutes)
   - Hash passwords using bcrypt or Argon2
   - Never log or expose passwords in errors
   - Use secure session tokens (JWT with httpOnly cookies)

2. **Session Management**:
   - Standard session: 24 hours expiration
   - Remember me: 30 days expiration with refresh token
   - Implement token refresh mechanism
   - Clear session on explicit logout
   - Handle expired sessions gracefully

3. **Remember Me Implementation**:
   - Use separate long-lived refresh token
   - Store refresh token securely (httpOnly cookie)
   - Validate refresh token on each request
   - Allow users to revoke sessions

4. **Error Messages**:
   - Use generic messages for security ("Invalid email or password")
   - Don't reveal whether email exists in system
   - Log specific errors server-side for debugging
   - Rate limit error attempts

5. **Performance**:
   - Debounce validation checks
   - Optimize for fast submission
   - Prefetch dashboard on successful auth
   - Minimize re-renders during typing

### Business Requirements

- Frictionless sign-in experience for returning users
- Clear path to account recovery (forgot password)
- Option to stay signed in for convenience
- Encourage registration for users without accounts
- Build trust through secure, professional design

### API Integration

#### Type Definitions

```typescript
// types/auth.types.ts

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  success: boolean;
  data?: {
    user: User;
    session: Session;
  };
  error?: {
    code: string;
    message: string;
    remainingAttempts?: number;
    lockoutUntil?: string;
  };
}

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  provider: 'email' | 'google' | 'apple' | 'facebook';
  emailVerified: boolean;
  lastLoginAt: string;
}

interface Session {
  token: string;
  expiresAt: string;
  refreshToken?: string; // Only if rememberMe is true
}
```

#### API Implementation

```typescript
// lib/api/authApi.ts

export async function loginWithEmail(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<LoginResponse> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, rememberMe }),
      credentials: 'include', // Important for cookies
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || 'LOGIN_FAILED',
          message: data.message || 'Invalid email or password',
          remainingAttempts: data.remainingAttempts,
          lockoutUntil: data.lockoutUntil,
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
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect. Please check your internet connection.',
      },
    };
  }
}

export async function refreshSession(): Promise<LoginResponse> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: 'SESSION_EXPIRED',
          message: 'Your session has expired. Please sign in again.',
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
    return {
      success: false,
      error: {
        code: 'REFRESH_FAILED',
        message: 'Unable to refresh session.',
      },
    };
  }
}
```

### Session Management Utility

```typescript
// lib/utils/sessionUtils.ts

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export function calculateSessionExpiry(rememberMe: boolean): Date {
  const duration = rememberMe ? REMEMBER_ME_DURATION : SESSION_DURATION;
  return new Date(Date.now() + duration);
}

export function isSessionExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date();
}

export function getSessionTimeRemaining(expiresAt: string): number {
  const remaining = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, remaining);
}

export function shouldRefreshSession(expiresAt: string): boolean {
  const timeRemaining = getSessionTimeRemaining(expiresAt);
  const threshold = 60 * 60 * 1000; // 1 hour
  return timeRemaining < threshold && timeRemaining > 0;
}
```

### Custom Hook Implementation

```typescript
// app/auth/login/_components/useLoginForm.ts

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginSchema, type LoginFormData } from '@/lib/schemas/loginSchema';
import { loginWithEmail } from '@/lib/api/authApi';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';
import { z } from 'zod';

export const useLoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setSession } = useAuthStore();

  // Get redirect URL from query params (if user was redirected from protected page)
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [state, setState] = useState({
    isSubmitting: false,
    showPassword: false,
    remainingAttempts: null as number | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update field
  const updateField = useCallback((field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field] || errors.submit) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        delete newErrors.submit;
        return newErrors;
      });
    }
  }, [errors]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  // Validate field
  const validateField = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    try {
      loginSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((e) => e.path[0] === field);
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [field]: fieldError.message }));
          return false;
        }
      }
      return true;
    }
  }, [formData]);

  // Handle submit
  const handleSubmit = useCallback(async () => {
    // Validate all fields
    try {
      loginSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const result = await loginWithEmail(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      if (result.success && result.data) {
        setUser(result.data.user);
        setSession(result.data.session);
        toast.success('Welcome back!');
        router.push(redirectTo);
      } else if (result.error) {
        // Handle different error types
        if (result.error.code === 'ACCOUNT_LOCKED') {
          setErrors({ 
            submit: result.error.message 
          });
          setState((prev) => ({ 
            ...prev, 
            remainingAttempts: 0 
          }));
        } else if (result.error.remainingAttempts !== undefined) {
          setErrors({ 
            submit: result.error.message 
          });
          setState((prev) => ({ 
            ...prev, 
            remainingAttempts: result.error.remainingAttempts 
          }));
        } else {
          setErrors({ 
            submit: result.error.message 
          });
        }
      }
    } catch (error) {
      setErrors({ 
        submit: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [formData, router, redirectTo, setUser, setSession]);

  // Reset form
  const reset = useCallback(() => {
    setFormData({
      email: '',
      password: '',
      rememberMe: false,
    });
    setErrors({});
    setTouched({});
    setState({
      isSubmitting: false,
      showPassword: false,
      remainingAttempts: null,
    });
  }, []);

  return {
    formData,
    state,
    errors,
    touched,
    updateField,
    togglePasswordVisibility,
    validateField,
    handleSubmit,
    reset,
  };
};
```

### Rate Limiting Strategy

```typescript
// lib/utils/rateLimiter.ts

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

const loginRateLimitConfig: RateLimitConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 15 * 60 * 1000, // 15 minutes
};

// Server-side implementation
export function checkRateLimit(
  email: string,
  attempts: Map<string, { count: number; firstAttempt: number; blockedUntil?: number }>
): { allowed: boolean; remainingAttempts: number; blockedUntil?: Date } {
  const now = Date.now();
  const userAttempts = attempts.get(email);

  // Check if user is currently blocked
  if (userAttempts?.blockedUntil && userAttempts.blockedUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: new Date(userAttempts.blockedUntil),
    };
  }

  // Reset if window has passed
  if (userAttempts && now - userAttempts.firstAttempt > loginRateLimitConfig.windowMs) {
    attempts.delete(email);
    return {
      allowed: true,
      remainingAttempts: loginRateLimitConfig.maxAttempts,
    };
  }

  // Increment attempt count
  if (!userAttempts) {
    attempts.set(email, { count: 1, firstAttempt: now });
    return {
      allowed: true,
      remainingAttempts: loginRateLimitConfig.maxAttempts - 1,
    };
  }

  userAttempts.count++;
  
  // Block if max attempts reached
  if (userAttempts.count >= loginRateLimitConfig.maxAttempts) {
    userAttempts.blockedUntil = now + loginRateLimitConfig.blockDurationMs;
    return {
      allowed: false,
      remainingAttempts: 0,
      blockedUntil: new Date(userAttempts.blockedUntil),
    };
  }

  return {
    allowed: true,
    remainingAttempts: loginRateLimitConfig.maxAttempts - userAttempts.count,
  };
}
```

## Testing Requirements

### Integration Tests (Target: 80% Coverage)

1. Core Authentication Tests

```typescript
// tests/e2e/auth-login.spec.ts
import { test, expect } from '@playwright/test';

describe('Email Sign In', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/auth/login');
    
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /remember me/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should successfully sign in with valid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('ValidPass123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('WrongPassword123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
    await expect(page).toHaveURL('/auth/login');
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/email/i).blur();
    
    await expect(page.getByText(/valid email address/i)).toBeVisible();
  });
});
```

2. Remember Me Tests

```typescript
describe('Remember Me Functionality', () => {
  test('should persist session with remember me checked', async ({ page, context }) => {
    await page.goto('/auth/login');
    
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('ValidPass123!');
    await page.getByRole('checkbox', { name: /remember me/i }).check();
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page).toHaveURL('/dashboard');
    
    // Check that refresh token cookie is set
    const cookies = await context.cookies();
    const refreshToken = cookies.find(c => c.name === 'refreshToken');
    expect(refreshToken).toBeTruthy();
    expect(refreshToken?.expires).toBeGreaterThan(Date.now() / 1000 + 24 * 60 * 60);
  });

  test('should have shorter session without remember me', async ({ page, context }) => {
    await page.goto('/auth/login');
    
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('ValidPass123!');
    // Don't check remember me
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page).toHaveURL('/dashboard');
    
    const cookies = await context.cookies();
    const sessionToken = cookies.find(c => c.name === 'sessionToken');
    expect(sessionToken).toBeTruthy();
  });
});
```

3. Password Visibility Tests

```typescript
describe('Password Visibility Toggle', () => {
  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/auth/login');
    
    const passwordInput = page.getByLabel(/password/i);
    const toggleButton = page.getByTestId('toggle-password');
    
    // Initially masked
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click to show
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click to hide
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
```

4. Navigation Tests

```typescript
describe('Login Navigation', () => {
  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL('/auth/register');
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByRole('link', { name: /forgot password/i }).click();
    await expect(page).toHaveURL('/auth/forgot-password');
  });

  test('should navigate back to welcome page', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByRole('button', { name: /back/i }).click();
    await expect(page).toHaveURL('/auth/welcome');
  });

  test('should redirect authenticated users to dashboard', async ({ page }) => {
    // First login
    await page.goto('/auth/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('ValidPass123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/dashboard');
    
    // Try to access login again
    await page.goto('/auth/login');
    await expect(page).toHaveURL('/dashboard');
  });
});
```

5. Rate Limiting Tests

```typescript
describe('Rate Limiting', () => {
  test('should show remaining attempts after failed login', async ({ page }) => {
    await page.goto('/auth/login');
    
    for (let i = 0; i < 3; i++) {
      await page.getByLabel(/email/i).fill('test@example.com');
      await page.getByLabel(/password/i).fill('WrongPassword');
      await page.getByRole('button', { name: /sign in/i }).click();
      await page.waitForTimeout(500);
    }
    
    await expect(page.getByText(/attempts remaining/i)).toBeVisible();
  });

  test('should block user after max attempts', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Make 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await page.getByLabel(/email/i).fill('blocked@example.com');
      await page.getByLabel(/password/i).fill('WrongPassword');
      await page.getByRole('button', { name: /sign in/i }).click();
      await page.waitForTimeout(500);
    }
    
    await expect(page.getByText(/too many failed attempts/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeDisabled();
  });
});
```

6. Accessibility Tests

```typescript
describe('Login Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/email/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/password/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByRole('checkbox', { name: /remember me/i })).toBeFocused();
  });

  test('should announce errors to screen readers', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByRole('button', { name: /sign in/i }).click();
    
    const errorMessage = page.getByRole('alert');
    await expect(errorMessage).toBeVisible();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/auth/login');
    
    const emailInput = page.getByLabel(/email/i);
    await expect(emailInput).toHaveAttribute('aria-required', 'true');
    
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toHaveAttribute('aria-required', 'true');
  });
});
```

7. Edge Cases

```typescript
describe('Login Edge Cases', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    await page.context().setOffline(true);
    
    await page.goto('/auth/login');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('Password123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page.getByText(/check your internet/i)).toBeVisible();
  });

  test('should handle redirect parameter', async ({ page }) => {
    await page.goto('/auth/login?redirect=/settings');
    
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/password/i).fill('ValidPass123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page).toHaveURL('/settings');
  });

  test('should handle autofill correctly', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Simulate autofill
    await page.evaluate(() => {
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
      if (emailInput) emailInput.value = 'autofilled@example.com';
      if (passwordInput) passwordInput.value = 'AutofilledPass123!';
    });
    
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should process autofilled values
    await expect(page).toHaveURL('/dashboard');
  });
});
```
