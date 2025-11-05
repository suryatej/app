# 14 - Register with Email - Implementation Planning

## User Story

As a new user, I want to register for an account using my email address and password, so that I can create a personal profile and start tracking my wellness journey.

## Pre-conditions

- User has navigated from /auth/welcome in "register" mode
- No existing session is active
- User has not previously registered with the email address

## Design

### Visual Layout

The email registration screen features:
- **Header**: Back button and "Create Account" title
- **Form Section**: Clean, vertical form layout with clear labels
- **Progress Indicator**: Subtle visual feedback during submission
- **Password Strength Meter**: Real-time feedback on password quality
- **Terms Agreement**: Checkbox with links to legal documents
- **Submit Button**: Prominent CTA button
- **Sign-in Link**: Option to switch to sign-in for existing users

### Color and Typography

- **Background Colors**: 
  - Primary: bg-white dark:bg-gray-900
  - Card: bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
  - Input: bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600

- **Typography**:
  - Page Title: font-sans text-3xl font-bold text-gray-900 dark:text-white
  - Labels: font-sans text-sm font-medium text-gray-700 dark:text-gray-300
  - Input Text: font-sans text-base text-gray-900 dark:text-white
  - Helper Text: text-xs text-gray-500 dark:text-gray-400
  - Error Text: text-xs text-red-600 dark:text-red-400

- **Component-Specific**:
  - Input Fields: border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500
  - Submit Button: bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
  - Password Strength: bg-gray-200 with colored fill (red → yellow → green)

### Interaction Patterns

- **Input Field Interaction**: 
  - Focus: Border color change, ring effect (2px blue)
  - Validation: Real-time on blur, icon feedback (checkmark/error)
  - Error: Red border, shake animation, error message below
  - Success: Green border, checkmark icon
  - Accessibility: Labels linked, error announcements

- **Password Field Interaction**:
  - Show/Hide Toggle: Eye icon button in field
  - Strength Meter: Animated progress bar below field
  - Requirements Checklist: Dynamic check/cross icons
  - Real-time Validation: Updates as user types
  - Accessibility: Strength announced to screen readers

- **Form Submission**:
  - Loading: Spinner in button, disabled state
  - Success: Brief success message, redirect to dashboard
  - Error: Error banner at top, field-specific errors
  - Validation: Client-side validation before submission

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
  - Input to helper text: mt-1
  - Button padding: px-6 py-3
  - Section spacing: mb-8
  ```

### Responsive Behavior

- **Desktop (lg: 1024px+)**:
  ```
  - Form: max-w-md centered
  - Two-column for name fields (optional)
  - Full-size inputs: py-3 px-4
  - Large submit button
  ```

- **Tablet (md: 768px - 1023px)**:
  ```
  - Form: max-w-sm centered
  - Single column layout
  - Standard input sizing
  - Full-width submit button
  ```

- **Mobile (sm: < 768px)**:
  ```
  - Full-width form with minimal margins
  - Stacked layout
  - Larger touch targets (min 44px)
  - Sticky submit button at bottom (optional)
  ```

## Technical Requirements

### Component Structure

```
src/app/auth/register/
├── page.tsx                           # Main registration page
└── _components/
    ├── RegisterForm.tsx               # Main form component
    ├── EmailInput.tsx                 # Email field with validation
    ├── PasswordInput.tsx              # Password field with show/hide
    ├── PasswordStrengthMeter.tsx      # Visual strength indicator
    ├── PasswordRequirements.tsx       # Requirements checklist
    ├── TermsCheckbox.tsx              # Terms agreement checkbox
    └── useRegisterForm.ts             # Form logic and validation hook
```

### Required Components

- RegisterForm ✅
- EmailInput ✅
- PasswordInput ✅
- PasswordStrengthMeter ✅
- PasswordRequirements ✅
- TermsCheckbox ✅
- useRegisterForm (hook) ✅

### State Management Requirements

```typescript
// Form State
interface RegisterFormState {
  // Form Data
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  
  // UI States
  isSubmitting: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  passwordStrength: PasswordStrength;
  
  // Validation States
  errors: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    submit?: string;
  };
  touched: {
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
  };
}

// Password Strength
type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

interface PasswordRequirement {
  label: string;
  met: boolean;
  regex?: RegExp;
}

// Actions
interface RegisterFormActions {
  updateField: (field: string, value: string | boolean) => void;
  togglePasswordVisibility: (field: 'password' | 'confirmPassword') => void;
  validateField: (field: string) => boolean;
  handleSubmit: () => Promise<void>;
  reset: () => void;
}
```

### Form Schema

```typescript
// lib/schemas/registerSchema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
```

## Acceptance Criteria

### Layout & Content

1. Registration Form Layout
   ```
   - Back button (top left) → returns to /auth/welcome
   - Page title "Create Account" centered
   - Form fields in vertical stack:
     * Email address field
     * Password field with show/hide toggle
     * Password strength meter
     * Password requirements list
     * Confirm password field
     * Terms and conditions checkbox with links
   - "Create Account" submit button (full-width)
   - Sign-in link at bottom ("Already have an account? Sign in")
   ```

2. Password Requirements Display
   ```
   - At least 8 characters
   - One uppercase letter (A-Z)
   - One lowercase letter (a-z)
   - One number (0-9)
   - One special character (!@#$%^&*)
   - Each requirement shows check/cross icon dynamically
   ```

3. Visual Feedback Elements
   ```
   - Loading spinner in submit button during submission
   - Success checkmark for validated fields
   - Error icons and messages for invalid fields
   - Password strength bar (red → yellow → green)
   - Disabled state for submit until valid
   ```

### Functionality

1. Email Validation

   - [ ] Email field accepts valid email format
   - [ ] Invalid email shows error message on blur
   - [ ] Duplicate email shows specific error from API
   - [ ] Email is trimmed and lowercase on submit
   - [ ] Field is required and validated before submission

2. Password Validation

   - [ ] Password must meet all requirements (length, complexity)
   - [ ] Show/hide toggle works for password field
   - [ ] Password strength meter updates in real-time
   - [ ] Requirements checklist updates as user types
   - [ ] Password is masked by default
   - [ ] Copy/paste is allowed

3. Confirm Password Validation

   - [ ] Confirm password must match password field
   - [ ] Error shown if passwords don't match
   - [ ] Validation triggers on blur and on password change
   - [ ] Show/hide toggle works independently

4. Terms Agreement

   - [ ] Terms checkbox must be checked to submit
   - [ ] Links to Terms of Service and Privacy Policy work
   - [ ] Error shown if attempting to submit without agreement
   - [ ] Checkbox is keyboard accessible

5. Form Submission

   - [ ] Submit button disabled when form is invalid
   - [ ] Loading state shown during API call
   - [ ] Success redirects to dashboard with welcome toast
   - [ ] API errors displayed clearly at top of form
   - [ ] Network errors show retry option
   - [ ] Form data is cleared on successful submission

6. Accessibility
   - [ ] All fields have associated labels
   - [ ] Error messages are announced to screen readers
   - [ ] Form can be completed using keyboard only
   - [ ] Tab order is logical
   - [ ] Focus management on errors

### Navigation Rules

- Back button returns to /auth/welcome in register mode
- "Already have an account? Sign in" link goes to /auth/login
- Successful registration redirects to /dashboard
- Authenticated users accessing this page are redirected to /dashboard
- Form state is preserved during validation errors

### Error Handling

- **Validation Errors**: Show field-specific error messages below each field
- **API Errors**: 
  - Email exists: "This email is already registered. Please sign in."
  - Network error: "Unable to create account. Please check your connection."
  - Server error: "Something went wrong. Please try again later."
- **Rate Limiting**: "Too many attempts. Please try again in a few minutes."

## Modified Files

```
```
src/app/auth/register/
├── page.tsx ✅
└── _components/
    ├── RegisterForm.tsx ✅
    ├── PasswordStrengthMeter.tsx ✅
    ├── PasswordRequirements.tsx ✅
    ├── TermsCheckbox.tsx ✅
    └── useRegisterForm.ts ✅

src/app/auth/_components/
├── EmailInput.tsx ✅
└── PasswordInput.tsx ✅

lib/
├── api/
│   └── authApi.ts ✅
├── schemas/
│   └── registerSchema.ts ✅
├── store/
│   └── authStore.ts ✅
└── utils/
    └── passwordStrength.ts ✅

types/
└── auth.types.ts ✅

tests/e2e/
└── auth-register.spec.ts ✅
```
```

## Status

✅ COMPLETED

1. Setup & Configuration

   - [x] Install form validation library (Zod)
   - [x] Create registration form schema
   - [x] Set up API endpoint types
   - [x] Create password strength utility

2. Layout Implementation

   - [x] Create registration page layout
   - [x] Implement responsive form container
   - [x] Add header with back button
   - [x] Create form structure with proper spacing

3. Component Implementation

   - [x] Build EmailInput with validation
   - [x] Implement PasswordInput with show/hide toggle
   - [x] Create PasswordStrengthMeter component
   - [x] Build PasswordRequirements checklist
   - [x] Implement TermsCheckbox component
   - [x] Create RegisterForm wrapper

4. Form Logic & Validation

   - [x] Implement useRegisterForm hook
   - [x] Add real-time field validation
   - [x] Add password strength calculation
   - [x] Implement form submission logic
   - [x] Add error handling and display

5. API Integration

   - [x] Create register API endpoint
   - [x] Implement user creation logic
   - [x] Add duplicate email check
   - [x] Set up session creation on success
   - [x] Add proper error responses

6. Testing
   - [x] Form validation (all requirements)
   - [x] Password strength calculation
   - [x] API integration (success/error cases)
   - [x] Responsive layout
   - [x] Accessibility compliance
   - [x] Error message display

## Dependencies

- Form validation library (Zod or Yup)
- Password strength calculation utility
- Authentication API endpoints
- Session management system
- Toast notification system (react-hot-toast)

## Related Stories

- [Story 18] - Choose Authentication Method (entry point)
- [Story 15] - Sign In with Email (alternative flow)
- [Story 16] - Register with Social Media (alternative registration)

## Notes

### Technical Considerations

1. **Password Security**: 
   - Never log or store passwords in plain text
   - Use HTTPS for all authentication requests
   - Implement rate limiting on registration endpoint
   - Consider adding CAPTCHA for bot prevention

2. **Validation Strategy**:
   - Client-side validation for UX (immediate feedback)
   - Server-side validation for security (never trust client)
   - Use consistent validation rules on both sides

3. **Email Verification**: 
   - Consider adding email verification flow
   - Send verification email after registration
   - Allow users to resend verification email
   - Grace period before requiring verification

4. **Password Strength**:
   - Use established algorithm (zxcvbn or similar)
   - Provide visual and text feedback
   - Don't block weak passwords but warn users
   - Consider suggesting password generators

5. **Performance**:
   - Debounce email uniqueness check
   - Debounce password strength calculation
   - Optimize re-renders during typing

### Business Requirements

- Minimize friction in registration process
- Clear communication of password requirements
- Build trust with clear privacy policy access
- Encourage strong password creation without being frustrating
- Provide clear path to sign-in for existing users

### API Integration

#### Type Definitions

```typescript
// types/auth.types.ts

interface RegisterRequest {
  email: string;
  password: string;
}

interface RegisterResponse {
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

interface User {
  id: string;
  email: string;
  name?: string;
  provider: 'email';
  createdAt: string;
  emailVerified: boolean;
}

interface Session {
  token: string;
  expiresAt: string;
  refreshToken: string;
}
```

#### API Implementation

```typescript
// lib/api/authApi.ts

export async function registerWithEmail(
  email: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || 'REGISTRATION_FAILED',
          message: data.message || 'Registration failed',
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
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect. Please check your internet connection.',
      },
    };
  }
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return data.available;
  } catch (error) {
    return true; // Assume available if check fails
  }
}
```

### Password Strength Utility

```typescript
// lib/utils/passwordStrength.ts

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number; // 0-4
  feedback: string[];
  percentage: number; // 0-100 for progress bar
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  else feedback.push('Use 12+ characters for better security');

  // Complexity checks
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Add special characters');

  // Adjust for common patterns
  if (/^[a-zA-Z]+$/.test(password)) score--; // Only letters
  if (/^[0-9]+$/.test(password)) score--; // Only numbers
  if (/(.)\1{2,}/.test(password)) score--; // Repeated characters

  // Normalize score to 0-4
  score = Math.max(0, Math.min(4, score));

  const strengthMap: Record<number, PasswordStrength> = {
    0: 'weak',
    1: 'weak',
    2: 'fair',
    3: 'good',
    4: 'strong',
  };

  return {
    strength: strengthMap[score],
    score,
    feedback,
    percentage: (score / 4) * 100,
  };
}

export function getPasswordRequirements(password: string): PasswordRequirement[] {
  return [
    {
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      label: 'One uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      label: 'One lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      label: 'One number',
      met: /[0-9]/.test(password),
    },
    {
      label: 'One special character',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];
}
```

### Custom Hook Implementation

```typescript
// app/auth/register/_components/useRegisterForm.ts

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { registerSchema, type RegisterFormData } from '@/lib/schemas/registerSchema';
import { registerWithEmail } from '@/lib/api/authApi';
import { useAuthStore } from '@/lib/store/authStore';
import { calculatePasswordStrength } from '@/lib/utils/passwordStrength';
import toast from 'react-hot-toast';

export const useRegisterForm = () => {
  const router = useRouter();
  const { setUser, setSession } = useAuthStore();

  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [state, setState] = useState({
    isSubmitting: false,
    showPassword: false,
    showConfirmPassword: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Password strength
  const passwordStrength = calculatePasswordStrength(formData.password);

  // Update field
  const updateField = useCallback((field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback((field: 'password' | 'confirmPassword') => {
    const stateKey = field === 'password' ? 'showPassword' : 'showConfirmPassword';
    setState((prev) => ({ ...prev, [stateKey]: !prev[stateKey] }));
  }, []);

  // Validate field
  const validateField = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    try {
      registerSchema.parse(formData);
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
      registerSchema.parse(formData);
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
      const result = await registerWithEmail(formData.email, formData.password);

      if (result.success && result.data) {
        setUser(result.data.user);
        setSession(result.data.session);
        toast.success('Account created successfully!');
        router.push('/dashboard');
      } else if (result.error) {
        if (result.error.field) {
          setErrors({ [result.error.field]: result.error.message });
        } else {
          toast.error(result.error.message);
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  }, [formData, router, setUser, setSession]);

  return {
    formData,
    state,
    errors,
    touched,
    passwordStrength,
    updateField,
    togglePasswordVisibility,
    validateField,
    handleSubmit,
  };
};
```

## Testing Requirements

### Integration Tests (Target: 80% Coverage)

1. Form Validation Tests

```typescript
// tests/e2e/auth-register.spec.ts
import { test, expect } from '@playwright/test';

describe('Email Registration', () => {
  test('should display registration form', async ({ page }) => {
    await page.goto('/auth/register');
    
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/^password$/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    await expect(page.getByRole('checkbox', { name: /terms/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth/register');
    
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('invalid-email');
    await emailInput.blur();
    
    await expect(page.getByText(/valid email address/i)).toBeVisible();
  });

  test('should show password requirements', async ({ page }) => {
    await page.goto('/auth/register');
    
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
    await expect(page.getByText(/one uppercase letter/i)).toBeVisible();
    await expect(page.getByText(/one lowercase letter/i)).toBeVisible();
    await expect(page.getByText(/one number/i)).toBeVisible();
    await expect(page.getByText(/one special character/i)).toBeVisible();
  });

  test('should update password strength meter', async ({ page }) => {
    await page.goto('/auth/register');
    
    const passwordInput = page.getByLabel(/^password$/i);
    
    // Weak password
    await passwordInput.fill('weak');
    await expect(page.getByTestId('password-strength')).toHaveAttribute('data-strength', 'weak');
    
    // Strong password
    await passwordInput.fill('Strong@Pass123');
    await expect(page.getByTestId('password-strength')).toHaveAttribute('data-strength', 'strong');
  });

  test('should validate password confirmation', async ({ page }) => {
    await page.goto('/auth/register');
    
    await page.getByLabel(/^password$/i).fill('Password123!');
    await page.getByLabel(/confirm password/i).fill('Different123!');
    await page.getByLabel(/confirm password/i).blur();
    
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('should require terms agreement', async ({ page }) => {
    await page.goto('/auth/register');
    
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('Password123!');
    await page.getByLabel(/confirm password/i).fill('Password123!');
    
    // Try to submit without checking terms
    await page.getByRole('button', { name: /create account/i }).click();
    
    await expect(page.getByText(/agree to the terms/i)).toBeVisible();
  });

  test('should successfully register new user', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Fill form
    await page.getByLabel(/email/i).fill('newuser@example.com');
    await page.getByLabel(/^password$/i).fill('SecurePass123!');
    await page.getByLabel(/confirm password/i).fill('SecurePass123!');
    await page.getByRole('checkbox', { name: /terms/i }).check();
    
    // Submit
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/account created successfully/i)).toBeVisible();
  });

  test('should show error for existing email', async ({ page }) => {
    await page.goto('/auth/register');
    
    await page.getByLabel(/email/i).fill('existing@example.com');
    await page.getByLabel(/^password$/i).fill('Password123!');
    await page.getByLabel(/confirm password/i).fill('Password123!');
    await page.getByRole('checkbox', { name: /terms/i }).check();
    
    await page.getByRole('button', { name: /create account/i }).click();
    
    await expect(page.getByText(/email is already registered/i)).toBeVisible();
  });
});
```

2. Interaction Tests

```typescript
describe('Registration Form Interactions', () => {
  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/auth/register');
    
    const passwordInput = page.getByLabel(/^password$/i);
    const toggleButton = page.getByTestId('toggle-password-visibility');
    
    // Initially password type
    await expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click to show
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click to hide
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should navigate to sign in page', async ({ page }) => {
    await page.goto('/auth/register');
    
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/auth/login');
  });

  test('should navigate back to welcome page', async ({ page }) => {
    await page.goto('/auth/register');
    
    await page.getByRole('button', { name: /back/i }).click();
    await expect(page).toHaveURL('/auth/welcome');
  });
});
```

3. Accessibility Tests

```typescript
describe('Registration Accessibility', () => {
  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Tab through form
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/email/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/^password$/i)).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/confirm password/i)).toBeFocused();
  });

  test('should announce errors to screen readers', async ({ page }) => {
    await page.goto('/auth/register');
    
    const emailInput = page.getByLabel(/email/i);
    await emailInput.fill('invalid');
    await emailInput.blur();
    
    const errorMessage = page.getByRole('alert');
    await expect(errorMessage).toBeVisible();
  });
});
```

4. Edge Cases

```typescript
describe('Registration Edge Cases', () => {
  test('should handle very long email addresses', async ({ page }) => {
    await page.goto('/auth/register');
    
    const longEmail = 'a'.repeat(50) + '@example.com';
    await page.getByLabel(/email/i).fill(longEmail);
    await page.getByLabel(/^password$/i).fill('Password123!');
    await page.getByLabel(/confirm password/i).fill('Password123!');
    await page.getByRole('checkbox', { name: /terms/i }).check();
    
    await page.getByRole('button', { name: /create account/i }).click();
    
    // Should handle gracefully
    await expect(page).toHaveURL('/dashboard');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate offline
    await page.context().setOffline(true);
    
    await page.goto('/auth/register');
    
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/^password$/i).fill('Password123!');
    await page.getByLabel(/confirm password/i).fill('Password123!');
    await page.getByRole('checkbox', { name: /terms/i }).check();
    
    await page.getByRole('button', { name: /create account/i }).click();
    
    await expect(page.getByText(/check your internet/i)).toBeVisible();
  });
});
```
