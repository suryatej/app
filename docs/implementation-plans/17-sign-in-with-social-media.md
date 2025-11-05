# 17 - Sign In with Social Media - Implementation Planning

## User Story

As a registered user, I want to sign in using my social media accounts (Google, Apple, Facebook), so that I can quickly access my wellness data without remembering another password.

## Pre-conditions

- User has previously registered with Google, Apple, or Facebook
- User has navigated from /auth/welcome in "signin" mode
- No active session exists
- User's social account is already linked to a Healthify account

## Design

### Visual Layout

The social sign-in flow reuses the same UI from the welcome screen but handles returning users:
- **Provider Selection**: From /auth/welcome with signin mode active
- **OAuth Popup/Redirect**: Native provider authentication screen
- **Quick Authentication**: Faster than registration (no profile completion)
- **Success**: Immediate redirect to dashboard with "Welcome back" message

### Color and Typography

Uses the same social button styling as registration (Story 16):

- **Google, Apple, Facebook Buttons**: Same as Story 16
- **Loading States**: Same patterns
- **Success States**: Brief confirmation toast

### Interaction Patterns

- **Social Button Interaction**: Same as Story 16
  - Hover, click, loading states
  - Provider-specific branding
  
- **OAuth Flow for Sign-In**:
  - Click → Loading state
  - Open provider popup/redirect
  - User authenticates (may auto-approve if recently authenticated)
  - Provider redirects back with code
  - App exchanges code for tokens
  - Look up existing user by provider ID
  - Create session
  - Redirect to dashboard

- **Faster Authentication**:
  - No profile completion needed
  - Auto-approval by provider if recently authenticated
  - Remember me handled by OAuth provider
  - Immediate access to dashboard

### Measurements and Spacing

Same as registration flow (Story 16).

### Responsive Behavior

Same OAuth callback handling as registration, optimized for mobile and desktop.

## Technical Requirements

### Component Structure

```
src/app/auth/
├── welcome/
│   └── _components/
│       └── SocialAuthButtons.tsx      # Reused from Story 18
├── callback/
│   ├── google/
│   │   └── page.tsx                   # Handles both register & signin
│   ├── apple/
│   │   └── page.tsx                   # Handles both register & signin
│   └── facebook/
│       └── page.tsx                   # Handles both register & signin

lib/
├── auth/
│   ├── socialAuth.ts                  # Distinguish register vs signin
│   └── oauth.ts                       # Shared OAuth utilities
└── api/
    └── authApi.ts                     # Social sign-in methods
```

### Required Components

Most components are reused from Story 16:
- SocialAuthButtons ⬜ (from Story 18)
- OAuth Callback Pages ⬜ (enhanced from Story 16)
- Social Auth Logic ⬜ (distinguish register vs signin)

### State Management Requirements

Same OAuth state management as Story 16, with additional logic to determine if the user is signing in or registering based on whether an account exists.

```typescript
// Enhanced OAuth State
interface OAuthState {
  provider: 'google' | 'apple' | 'facebook' | null;
  isAuthenticating: boolean;
  mode: 'signin' | 'register'; // Determined by auth context
  
  // Same as Story 16
  isExchangingCode: boolean;
  code: string | null;
  state: string | null;
  profileData: SocialProfileData | null;
  error: OAuthError | null;
}
```

### Authentication Flow Logic

```typescript
// lib/auth/socialAuth.ts

interface AuthFlowResult {
  isExistingUser: boolean;
  user?: User;
  needsRegistration: boolean;
  needsProfileCompletion: boolean;
}

export async function determineSocialAuthFlow(
  provider: string,
  providerId: string,
  email: string
): Promise<AuthFlowResult> {
  // Check if user exists with this provider ID
  const existingUser = await findUserByProviderId(provider, providerId);
  
  if (existingUser) {
    // User exists - sign in flow
    return {
      isExistingUser: true,
      user: existingUser,
      needsRegistration: false,
      needsProfileCompletion: false,
    };
  }
  
  // Check if user exists with this email (potential account linking)
  const userByEmail = await findUserByEmail(email);
  
  if (userByEmail) {
    // User exists with email but different provider
    // This is an account linking scenario
    return {
      isExistingUser: true,
      user: userByEmail,
      needsRegistration: false,
      needsProfileCompletion: false,
      // Additional logic for account linking confirmation
    };
  }
  
  // New user - registration flow
  return {
    isExistingUser: false,
    needsRegistration: true,
    needsProfileCompletion: false, // Will be determined after fetching profile
  };
}
```

## Acceptance Criteria

### Layout & Content

1. Social Sign-In Flow
   ```
   Step 1: User clicks social provider on /auth/welcome (signin mode)
   Step 2: OAuth popup/redirect opens with provider's auth screen
   Step 3: User authenticates (may be automatic if recently logged in)
   Step 4: Provider redirects to callback URL with authorization code
   Step 5: App exchanges code for tokens
   Step 6: App looks up user by provider ID
   Step 7: Create session for existing user
   Step 8: "Welcome back!" message → Redirect to dashboard
   ```

2. OAuth Callback Screen
   ```
   - Same loading screen as registration
   - "Signing you in..." message
   - Provider logo
   - Automatic processing
   ```

3. Account Linking Scenario
   ```
   If email exists but provider is different:
   - "Link your {Provider} account?"
   - "An account with this email already exists."
   - Options:
     * "Link and sign in" → Links provider and signs in
     * "Use different account" → Restart OAuth with different account
     * "Sign in differently" → Return to sign-in options
   ```

### Functionality

1. Google Sign-In

   - [ ] Google button initiates OAuth flow
   - [ ] Opens Google sign-in screen
   - [ ] Handles successful authentication
   - [ ] Looks up user by Google provider ID
   - [ ] If user found, creates session and signs in
   - [ ] If user not found, treats as new registration (Story 16)
   - [ ] Redirects to dashboard with success message

2. Apple Sign-In

   - [ ] Apple button initiates OAuth flow
   - [ ] Opens Apple ID sign-in
   - [ ] Uses PKCE for security
   - [ ] Handles successful authentication
   - [ ] Looks up user by Apple provider ID
   - [ ] If user found, creates session and signs in
   - [ ] If user not found, treats as new registration
   - [ ] Redirects to dashboard

3. Facebook Sign-In

   - [ ] Facebook button initiates OAuth flow
   - [ ] Opens Facebook login dialog
   - [ ] Handles successful authentication
   - [ ] Looks up user by Facebook provider ID
   - [ ] If user found, creates session and signs in
   - [ ] If user not found, treats as new registration
   - [ ] Redirects to dashboard

4. Account Linking

   - [ ] Detects if email exists with different provider
   - [ ] Offers to link social provider to existing account
   - [ ] Requires confirmation before linking
   - [ ] Updates user record with additional provider
   - [ ] Signs in after successful linking
   - [ ] Allows cancellation/different account selection

5. Auto Sign-In

   - [ ] If user recently authenticated with provider, auto-approves
   - [ ] Shows loading state briefly
   - [ ] Completes sign-in without additional prompts
   - [ ] Updates last login timestamp

6. Error Handling

   - [ ] User cancels OAuth → Return to welcome
   - [ ] Provider error → Show error and retry option
   - [ ] Account not found → Redirect to registration flow
   - [ ] Network errors → Show error with retry
   - [ ] Invalid/expired tokens → Restart OAuth

### Navigation Rules

- Clicking social provider button on /auth/welcome (signin mode) initiates OAuth
- OAuth success redirects to callback URL
- Callback URL determines if user exists:
  - Existing user → Create session → Redirect to /dashboard
  - New user → Follow registration flow (Story 16)
  - Email conflict → Show account linking prompt
- OAuth errors redirect to /auth/welcome with error message

### Error Handling

- **User Not Found**: Automatically redirect to registration flow
- **User Cancellation**: "Sign in cancelled. Choose a method to continue."
- **Provider Error**: "Unable to connect to {Provider}. Please try again."
- **Network Error**: "Connection failed. Please check your internet."
- **Account Linking Conflict**: "Link your {Provider} account to sign in?"

## Modified Files

```
src/app/auth/callback/
├── google/
│   └── page.tsx ⬜ (enhance to handle both flows)
├── apple/
│   └── page.tsx ⬜ (enhance to handle both flows)
└── facebook/
    └── page.tsx ⬜ (enhance to handle both flows)

lib/
├── auth/
│   ├── socialAuth.ts ⬜ (add flow determination logic)
│   └── accountLinking.ts ⬜ (new - account linking logic)
├── api/
│   └── authApi.ts ⬜ (add social sign-in methods)
└── types/
    └── auth.types.ts ⬜ (add account linking types)

src/app/auth/link-account/
└── page.tsx ⬜ (new - account linking confirmation)
```

## Status

🟨 IN PROGRESS

1. Setup & Configuration

   - [ ] Reuse OAuth provider configurations from Story 16
   - [ ] Ensure all provider credentials are set
   - [ ] Configure callback URLs for sign-in flow
   - [ ] No additional setup needed (uses Story 16 setup)

2. OAuth Flow Enhancement

   - [ ] Enhance callback handlers to detect existing users
   - [ ] Add user lookup by provider ID
   - [ ] Implement sign-in vs registration logic
   - [ ] Add account linking detection
   - [ ] Create account linking confirmation flow

3. Callback Page Updates

   - [ ] Update Google callback to handle sign-in
   - [ ] Update Apple callback to handle sign-in
   - [ ] Update Facebook callback to handle sign-in
   - [ ] Add "Signing you in..." loading message
   - [ ] Implement seamless flow for existing users

4. Account Linking

   - [ ] Create account linking prompt page
   - [ ] Add link confirmation logic
   - [ ] Update user record with additional provider
   - [ ] Handle linking errors
   - [ ] Test multi-provider accounts

5. Session Management

   - [ ] Create session on successful sign-in
   - [ ] Update last login timestamp
   - [ ] Set appropriate session duration
   - [ ] Handle "remember me" via provider
   - [ ] Implement session refresh if needed

6. Testing
   - [ ] Sign-in flow for each provider
   - [ ] Existing user detection
   - [ ] Account linking scenarios
   - [ ] New user fallback to registration
   - [ ] Error scenarios
   - [ ] Auto sign-in behavior

## Dependencies

- OAuth provider configurations (from Story 16)
- User lookup by provider ID in database
- Account linking logic
- Session management system
- Toast notification system (react-hot-toast)

## Related Stories

- [Story 18] - Choose Authentication Method (entry point)
- [Story 16] - Register with Social Media (new user flow)
- [Story 15] - Sign In with Email (alternative sign-in)

## Notes

### Technical Considerations

1. **OAuth Provider Reuse**:
   - Uses same OAuth configuration as Story 16
   - Same callback URLs for both register and sign-in
   - Logic determines flow based on user existence

2. **User Lookup**:
   - Primary: Lookup by provider ID (fastest, most accurate)
   - Secondary: Lookup by email (for account linking)
   - Store provider ID in user record for quick lookup

3. **Account Linking**:
   - Automatically detect account conflicts
   - Require explicit user confirmation before linking
   - Allow users to link multiple providers to one account
   - Store all provider IDs in user record

4. **Security**:
   - Same security measures as Story 16
   - Validate tokens before user lookup
   - Prevent account takeover via provider linking
   - Require re-authentication for sensitive operations

5. **Performance**:
   - Optimize user lookup queries
   - Cache provider IDs for faster authentication
   - Minimize database queries in OAuth flow
   - Prefetch dashboard data during authentication

### Business Requirements

- Seamless sign-in for returning users
- Minimize clicks and friction
- Support multiple sign-in methods per account
- Clear messaging for account linking
- Fast authentication (< 3 seconds ideal)

### API Integration

#### Type Definitions

```typescript
// types/auth.types.ts

interface SocialSignInRequest {
  provider: 'google' | 'apple' | 'facebook';
  code: string;
  state: string;
  codeVerifier?: string;
}

interface SocialSignInResponse {
  success: boolean;
  data?: {
    user: User;
    session: Session;
    isNewUser: boolean; // False for sign-in, true if fell back to registration
  };
  error?: {
    code: string;
    message: string;
    provider: string;
    requiresLinking?: boolean; // True if account linking needed
    existingProvider?: string; // Provider user is already registered with
  };
}

interface AccountLinkingRequest {
  userId: string;
  provider: string;
  providerId: string;
  accessToken: string;
}

interface AccountLinkingResponse {
  success: boolean;
  user?: User;
  error?: {
    code: string;
    message: string;
  };
}

interface UserProvider {
  provider: 'email' | 'google' | 'apple' | 'facebook';
  providerId: string;
  linkedAt: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  providers: UserProvider[]; // Support multiple providers
  primaryProvider: string; // Original registration method
  lastLoginAt: string;
}
```

#### Social Sign-In Implementation

```typescript
// lib/api/authApi.ts

export async function signInWithSocial(
  provider: string,
  code: string,
  state: string,
  codeVerifier?: string
): Promise<SocialSignInResponse> {
  try {
    const response = await fetch('/api/auth/social/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider, code, state, codeVerifier }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || 'SIGNIN_FAILED',
          message: data.message || 'Sign in failed',
          provider: provider,
          requiresLinking: data.requiresLinking,
          existingProvider: data.existingProvider,
        },
      };
    }

    return {
      success: true,
      data: {
        user: data.user,
        session: data.session,
        isNewUser: data.isNewUser || false,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect. Please check your connection.',
        provider: provider,
      },
    };
  }
}

export async function linkSocialAccount(
  provider: string,
  providerId: string,
  accessToken: string
): Promise<AccountLinkingResponse> {
  try {
    const response = await fetch('/api/auth/link-provider', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider, providerId, accessToken }),
      credentials: 'include', // Requires existing session
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || 'LINKING_FAILED',
          message: data.message || 'Account linking failed',
        },
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: 'Unable to link account.',
      },
    };
  }
}
```

#### Enhanced Callback Handler

```typescript
// app/auth/callback/google/page.tsx (example)

'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithSocial } from '@/lib/api/authApi';
import { useAuthStore } from '@/lib/store/authStore';
import toast from 'react-hot-toast';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setSession } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      // Handle errors from provider
      if (error) {
        if (error === 'access_denied') {
          toast.error('Sign in cancelled');
          router.push('/auth/welcome');
          return;
        }
        setError('Authentication failed. Please try again.');
        return;
      }

      // Validate required parameters
      if (!code || !state) {
        setError('Invalid callback parameters');
        return;
      }

      // Validate state (CSRF protection)
      const savedState = sessionStorage.getItem('oauth_state');
      if (state !== savedState) {
        setError('Invalid request. Please try again.');
        return;
      }

      // Get code verifier if using PKCE
      const codeVerifier = sessionStorage.getItem('code_verifier') || undefined;

      try {
        // Call sign-in API
        const result = await signInWithSocial('google', code, state, codeVerifier);

        if (result.success && result.data) {
          setUser(result.data.user);
          setSession(result.data.session);
          
          // Clean up session storage
          sessionStorage.removeItem('oauth_state');
          sessionStorage.removeItem('code_verifier');

          // Show appropriate message
          if (result.data.isNewUser) {
            toast.success('Account created successfully!');
          } else {
            toast.success('Welcome back!');
          }

          router.push('/dashboard');
        } else if (result.error) {
          // Handle account linking scenario
          if (result.error.requiresLinking) {
            router.push(`/auth/link-account?provider=google&existingProvider=${result.error.existingProvider}`);
            return;
          }

          setError(result.error.message);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      }
    };

    handleCallback();
  }, [searchParams, router, setUser, setSession]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth/welcome')}
            className="text-blue-600 hover:text-blue-700"
          >
            Return to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}
```

### Account Linking Flow

```typescript
// lib/auth/accountLinking.ts

export interface AccountLinkingPrompt {
  email: string;
  newProvider: string;
  existingProvider: string;
  action: 'link' | 'cancel' | 'different_account';
}

export async function promptAccountLinking(
  email: string,
  newProvider: string,
  existingProvider: string
): Promise<AccountLinkingPrompt> {
  return {
    email,
    newProvider,
    existingProvider,
    action: 'link', // Default action, user can change
  };
}

export async function executeAccountLinking(
  userId: string,
  provider: string,
  providerId: string,
  accessToken: string
): Promise<boolean> {
  try {
    // Verify the access token is valid
    const isValid = await verifyProviderToken(provider, accessToken);
    if (!isValid) {
      throw new Error('Invalid provider token');
    }

    // Add provider to user record
    await addProviderToUser(userId, provider, providerId);

    return true;
  } catch (error) {
    console.error('Account linking failed:', error);
    return false;
  }
}

async function addProviderToUser(
  userId: string,
  provider: string,
  providerId: string
): Promise<void> {
  // Database operation to add provider to user's providers array
  // Example with hypothetical ORM:
  /*
  await db.user.update({
    where: { id: userId },
    data: {
      providers: {
        push: {
          provider,
          providerId,
          linkedAt: new Date().toISOString(),
        },
      },
    },
  });
  */
}
```

## Testing Requirements

### Integration Tests (Target: 80% Coverage)

1. Social Sign-In Tests

```typescript
// tests/e2e/auth-social-signin.spec.ts
import { test, expect } from '@playwright/test';

describe('Social Media Sign In', () => {
  test('should sign in existing user with Google', async ({ page }) => {
    await page.goto('/auth/welcome');
    
    // Ensure signin mode is active (default)
    const signInTab = page.getByRole('tab', { name: /sign in/i });
    await expect(signInTab).toHaveAttribute('aria-selected', 'true');
    
    // Click Google button
    await page.getByRole('button', { name: /continue with google/i }).click();
    
    // Mock OAuth flow and callback
    await page.goto('/auth/callback/google?code=existing_user_code&state=test_state');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test('should fall back to registration for new user', async ({ page }) => {
    await page.goto('/auth/welcome');
    
    await page.getByRole('button', { name: /continue with google/i }).click();
    
    // Mock OAuth callback with new user
    await page.goto('/auth/callback/google?code=new_user_code&state=test_state');
    
    // Should follow registration flow
    // May show profile completion or go directly to dashboard
    await expect(page).toHaveURL(/\/(dashboard|complete-profile)/);
  });

  test('should handle all social providers', async ({ page }) => {
    await page.goto('/auth/welcome');
    
    // Test each provider button
    for (const provider of ['Google', 'Apple', 'Facebook']) {
      const button = page.getByRole('button', { name: new RegExp(provider, 'i') });
      await expect(button).toBeVisible();
      await expect(button).toBeEnabled();
    }
  });
});
```

2. Account Linking Tests

```typescript
describe('Account Linking', () => {
  test('should prompt to link account when email exists', async ({ page }) => {
    // User has email account, tries to sign in with Google using same email
    await page.goto('/auth/callback/google?code=linking_required&state=test');
    
    await expect(page).toHaveURL('/auth/link-account');
    await expect(page.getByText(/link.*google.*account/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /link and sign in/i })).toBeVisible();
  });

  test('should link accounts and sign in', async ({ page }) => {
    await page.goto('/auth/link-account?provider=google');
    
    await page.getByRole('button', { name: /link and sign in/i }).click();
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/account linked/i)).toBeVisible();
  });

  test('should allow using different account', async ({ page }) => {
    await page.goto('/auth/link-account?provider=google');
    
    await page.getByRole('button', { name: /use different account/i }).click();
    
    // Should restart OAuth with option to choose different account
    await expect(page).toHaveURL('/auth/welcome');
  });
});
```

3. Auto Sign-In Tests

```typescript
describe('Auto Sign-In', () => {
  test('should auto-approve if recently authenticated with provider', async ({ page }) => {
    // First sign-in
    await page.goto('/auth/welcome');
    await page.getByRole('button', { name: /continue with google/i }).click();
    await page.goto('/auth/callback/google?code=test&state=test');
    await expect(page).toHaveURL('/dashboard');
    
    // Sign out
    await page.getByRole('button', { name: /sign out/i }).click();
    
    // Try to sign in again (should be faster)
    await page.goto('/auth/welcome');
    await page.getByRole('button', { name: /continue with google/i }).click();
    
    // May auto-approve without showing provider screen
    await expect(page).toHaveURL('/dashboard', { timeout: 3000 });
  });
});
```

4. Error Handling Tests

```typescript
describe('Sign-In Error Handling', () => {
  test('should handle user cancellation', async ({ page }) => {
    await page.goto('/auth/callback/google?error=access_denied&state=test');
    
    await expect(page).toHaveURL('/auth/welcome');
    await expect(page.getByText(/cancelled/i)).toBeVisible();
  });

  test('should handle provider errors', async ({ page }) => {
    await page.goto('/auth/callback/google?error=server_error&state=test');
    
    await expect(page.getByText(/unable to connect/i)).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await page.context().setOffline(true);
    
    await page.goto('/auth/callback/google?code=test&state=test');
    
    await expect(page.getByText(/check your internet/i)).toBeVisible();
  });
});
```

5. Multi-Provider Tests

```typescript
describe('Multiple Provider Support', () => {
  test('should support signing in with different providers', async ({ page }) => {
    // Sign in with Google
    await page.goto('/auth/welcome');
    await page.getByRole('button', { name: /google/i }).click();
    await page.goto('/auth/callback/google?code=test&state=test');
    await expect(page).toHaveURL('/dashboard');
    
    // Sign out
    await page.getByRole('button', { name: /sign out/i }).click();
    
    // Sign in with Facebook (if linked)
    await page.goto('/auth/welcome');
    await page.getByRole('button', { name: /facebook/i }).click();
    await page.goto('/auth/callback/facebook?code=test&state=test');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show all linked providers in settings', async ({ page }) => {
    await page.goto('/dashboard');
    // Assuming there's a settings page showing linked accounts
    await page.goto('/settings/account');
    
    await expect(page.getByText(/linked accounts/i)).toBeVisible();
    await expect(page.getByText(/google/i)).toBeVisible();
  });
});
```
