# 16 - Register with Social Media - Implementation Planning

## User Story

As a new user, I want to register using my social media accounts (Google, Apple, Facebook), so that I can quickly create an account without filling out lengthy forms.

## Pre-conditions

- User has navigated from /auth/welcome in "register" mode
- No active session exists
- User has an active account with Google, Apple, or Facebook
- OAuth providers are configured in the application

## Design

### Visual Layout

The social media registration flow uses the same UI from the welcome screen but with specific handling for the registration flow:
- **Provider Selection**: From /auth/welcome with register mode active
- **OAuth Popup/Redirect**: Native provider authentication screen
- **Permission Screen**: Provider's consent screen for data access
- **Profile Completion** (if needed): Optional form to complete missing profile data
- **Success Screen**: Brief confirmation before redirect to dashboard

### Color and Typography

Social authentication uses provider-specific branding:

- **Google Button**:
  - Background: bg-white border border-gray-300 hover:bg-gray-50
  - Text: text-gray-700 font-medium
  - Icon: Google's official logo with proper spacing

- **Apple Button**:
  - Background: bg-black hover:bg-gray-900
  - Text: text-white font-medium
  - Icon: Apple's official logo

- **Facebook Button**:
  - Background: bg-[#1877F2] hover:bg-[#0C63D4]
  - Text: text-white font-medium
  - Icon: Facebook's official logo

- **Profile Completion Form**:
  - Same styling as email registration form
  - Clean, minimal fields
  - Optional field indicators

### Interaction Patterns

- **Social Button Interaction**: 
  - Hover: Background transition, subtle scale (1.02)
  - Click: Initiates OAuth popup or redirect
  - Loading: Spinner overlay, disabled state
  - Provider-specific: Maintains brand guidelines
  - Accessibility: Proper labeling, keyboard access

- **OAuth Flow**:
  - Click → Loading state
  - Open provider popup/redirect
  - User authenticates with provider
  - Provider redirects back with code
  - App exchanges code for tokens
  - Create/update user account
  - Redirect to dashboard or profile completion

- **Profile Completion** (if needed):
  - Pre-filled data from social provider
  - Edit only if needed
  - Clear "Skip" option if data is optional
  - Same form patterns as email registration

### Measurements and Spacing

- **OAuth Callback Page**:
  ```
  - Centered loading spinner
  - Status message below
  - Min height: 100vh
  - Padding: p-8
  ```

- **Profile Completion**:
  ```
  - Same as registration form
  - max-w-md centered
  - space-y-6 between sections
  ```

### Responsive Behavior

Social authentication is mobile-optimized:

- **Desktop**: OAuth popup window (600x700px)
- **Tablet/Mobile**: Full-page OAuth redirect
- Responsive button sizing across devices
- Touch-friendly interaction areas

## Technical Requirements

### Component Structure

```
src/app/auth/
├── welcome/
│   └── _components/
│       └── SocialAuthButtons.tsx      # Reused from Story 18
├── callback/
│   ├── google/
│   │   └── page.tsx                   # Google OAuth callback
│   ├── apple/
│   │   └── page.tsx                   # Apple OAuth callback
│   └── facebook/
│       └── page.tsx                   # Facebook OAuth callback
└── complete-profile/
    ├── page.tsx                       # Profile completion (if needed)
    └── _components/
        ├── ProfileCompletionForm.tsx
        └── useProfileCompletion.ts

lib/
├── auth/
│   ├── providers.ts                   # Provider configurations
│   ├── oauth.ts                       # OAuth flow utilities
│   └── socialAuth.ts                  # Social authentication logic
└── api/
    └── authApi.ts                     # API methods for social auth
```

### Required Components

- SocialAuthButtons ⬜ (from Story 18)
- Google OAuth Callback ⬜
- Apple OAuth Callback ⬜
- Facebook OAuth Callback ⬜
- ProfileCompletionForm ⬜
- useProfileCompletion (hook) ⬜

### State Management Requirements

```typescript
// OAuth Flow State
interface OAuthState {
  // Provider being used
  provider: 'google' | 'apple' | 'facebook' | null;
  
  // OAuth flow states
  isAuthenticating: boolean;
  isExchangingCode: boolean;
  isCreatingAccount: boolean;
  
  // OAuth data
  code: string | null;
  state: string | null;
  
  // Profile data from provider
  profileData: SocialProfileData | null;
  
  // Completion state
  needsProfileCompletion: boolean;
  
  // Error state
  error: OAuthError | null;
}

interface SocialProfileData {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  emailVerified: boolean;
  provider: string;
  providerId: string;
}

interface OAuthError {
  code: string;
  message: string;
  provider: string;
  details?: string;
}
```

### OAuth Configuration

```typescript
// lib/auth/providers.ts

export interface OAuthProvider {
  id: string;
  name: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scope: string;
  clientId: string;
  redirectUri: string;
  pkce?: boolean; // For providers requiring PKCE
}

export const oauthProviders: Record<string, OAuthProvider> = {
  google: {
    id: 'google',
    name: 'Google',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scope: 'openid email profile',
    clientId: process.env.GOOGLE_CLIENT_ID!,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/google`,
  },
  apple: {
    id: 'apple',
    name: 'Apple',
    authorizationUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    userInfoUrl: '', // Apple provides user info in the token response
    scope: 'name email',
    clientId: process.env.APPLE_CLIENT_ID!,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/apple`,
    pkce: true,
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    authorizationUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userInfoUrl: 'https://graph.facebook.com/me',
    scope: 'public_profile email',
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/facebook`,
  },
};
```

## Acceptance Criteria

### Layout & Content

1. Social Registration Flow
   ```
   Step 1: User clicks social provider on /auth/welcome (register mode)
   Step 2: OAuth popup/redirect opens with provider's auth screen
   Step 3: User grants permissions on provider's screen
   Step 4: Redirect to callback URL with authorization code
   Step 5: App exchanges code for tokens and fetches user data
   Step 6a: If profile complete → Create account → Redirect to dashboard
   Step 6b: If profile incomplete → Show profile completion form
   Step 7: User completes profile (if needed) → Create account
   Step 8: Success message → Redirect to dashboard
   ```

2. OAuth Callback Screen
   ```
   - Centered loading spinner
   - "Completing registration..." message
   - Provider logo/name
   - No user interaction needed (automatic)
   ```

3. Profile Completion Form (if needed)
   ```
   - Header: "Complete Your Profile"
   - Pre-filled fields from social provider
   - Editable name field (if provided)
   - Email display (read-only, verified)
   - Optional: Avatar selection
   - "Complete Registration" button
   - "Skip for now" option (if all fields optional)
   ```

### Functionality

1. Google OAuth Registration

   - [ ] Google button initiates OAuth flow
   - [ ] Opens Google consent screen
   - [ ] Requests email and profile permissions
   - [ ] Handles successful authorization
   - [ ] Fetches user profile from Google API
   - [ ] Creates new user account
   - [ ] Sets session and redirects to dashboard

2. Apple OAuth Registration

   - [ ] Apple button initiates OAuth flow
   - [ ] Opens Apple ID sign-in screen
   - [ ] Uses PKCE for security
   - [ ] Handles successful authorization
   - [ ] Extracts user data from token response
   - [ ] Creates new user account
   - [ ] Sets session and redirects to dashboard

3. Facebook OAuth Registration

   - [ ] Facebook button initiates OAuth flow
   - [ ] Opens Facebook login dialog
   - [ ] Requests email and public_profile permissions
   - [ ] Handles successful authorization
   - [ ] Fetches user profile from Graph API
   - [ ] Creates new user account
   - [ ] Sets session and redirects to dashboard

4. Profile Completion (if needed)

   - [ ] Shows form if required data missing
   - [ ] Pre-fills available data from provider
   - [ ] Validates required fields
   - [ ] Allows editing of pre-filled data
   - [ ] Saves profile and creates account
   - [ ] Skips if all data is optional and provided

5. Error Handling

   - [ ] User cancels OAuth flow → Return to welcome with message
   - [ ] Provider denies permissions → Show error and retry option
   - [ ] Account already exists → Link accounts or show conflict error
   - [ ] Network errors → Show error with retry
   - [ ] Invalid/expired tokens → Restart OAuth flow

6. Account Linking

   - [ ] Detect if email from provider matches existing account
   - [ ] Offer to link social provider to existing account
   - [ ] Or suggest signing in with existing method

### Navigation Rules

- Clicking social provider button on /auth/welcome initiates OAuth flow
- OAuth success redirects to callback URL (/auth/callback/{provider})
- Callback URL processes code and redirects to:
  - /dashboard if registration complete
  - /auth/complete-profile if additional data needed
- Profile completion success redirects to /dashboard
- OAuth errors redirect to /auth/welcome with error message
- Cancelled OAuth returns to /auth/welcome

### Error Handling

- **User Cancellation**: "Sign up cancelled. Choose a method to continue."
- **Permission Denied**: "We need permission to access your email. Please try again."
- **Account Exists**: "An account with this email already exists. Please sign in."
- **Provider Error**: "Unable to connect to {Provider}. Please try again."
- **Network Error**: "Connection failed. Please check your internet and retry."
- **Invalid State**: "Invalid request. Please start the sign-up process again."

## Modified Files

```
src/app/auth/callback/
├── google/
│   └── page.tsx ⬜
├── apple/
│   └── page.tsx ⬜
└── facebook/
    └── page.tsx ⬜

src/app/auth/complete-profile/
├── page.tsx ⬜
└── _components/
    ├── ProfileCompletionForm.tsx ⬜
    └── useProfileCompletion.ts ⬜

lib/
├── auth/
│   ├── providers.ts ⬜
│   ├── oauth.ts ⬜
│   └── socialAuth.ts ⬜
├── api/
│   └── authApi.ts ⬜ (add social auth methods)
└── types/
    └── auth.types.ts ⬜ (add social auth types)

.env.local ⬜ (add provider credentials)
```

## Status

🟨 IN PROGRESS

1. Setup & Configuration

   - [ ] Register apps with Google, Apple, Facebook
   - [ ] Obtain OAuth client IDs and secrets
   - [ ] Configure OAuth redirect URIs
   - [ ] Add environment variables
   - [ ] Set up provider configurations

2. OAuth Flow Implementation

   - [ ] Create OAuth utility functions
   - [ ] Implement authorization URL generation
   - [ ] Add PKCE support for Apple
   - [ ] Implement token exchange logic
   - [ ] Create callback handlers for each provider

3. Callback Pages

   - [ ] Build Google callback page
   - [ ] Build Apple callback page
   - [ ] Build Facebook callback page
   - [ ] Add loading states
   - [ ] Implement error handling

4. User Profile Handling

   - [ ] Create profile data extraction utilities
   - [ ] Implement profile completion form
   - [ ] Add profile validation
   - [ ] Build account creation logic
   - [ ] Handle duplicate accounts

5. API Integration

   - [ ] Create social auth API endpoints
   - [ ] Implement token exchange endpoints
   - [ ] Add user creation/update logic
   - [ ] Set up session management
   - [ ] Add account linking logic

6. Testing
   - [ ] OAuth flow for each provider
   - [ ] Token exchange and validation
   - [ ] Profile completion flow
   - [ ] Error scenarios (cancellation, denial, etc.)
   - [ ] Account linking scenarios
   - [ ] Mobile vs desktop flows

## Dependencies

- OAuth provider accounts and app configurations:
  - Google Cloud Console (Google OAuth)
  - Apple Developer Account (Sign in with Apple)
  - Facebook for Developers (Facebook Login)
- PKCE implementation for Apple
- Session management system
- Toast notification system (react-hot-toast)
- Account linking logic

## Related Stories

- [Story 18] - Choose Authentication Method (entry point)
- [Story 17] - Sign In with Social Media (existing user flow)
- [Story 14] - Register with Email (alternative registration)

## Notes

### Technical Considerations

1. **OAuth Provider Setup**:
   - **Google**: Requires verified domain, OAuth consent screen configuration
   - **Apple**: Requires Apple Developer account ($99/year), service ID configuration
   - **Facebook**: Requires app review for production use, privacy policy URL

2. **Security**:
   - Use state parameter to prevent CSRF attacks
   - Implement PKCE for Apple (required)
   - Validate redirect URIs strictly
   - Securely store client secrets (server-side only)
   - Use HTTPS in production

3. **Account Linking**:
   - Match accounts by email address
   - Allow users to link multiple providers
   - Handle edge cases (email change, multiple accounts)
   - Store provider ID for future sign-ins

4. **Data Privacy**:
   - Request minimal permissions (only email and basic profile)
   - Clearly communicate what data is accessed
   - Comply with provider policies and terms
   - Include privacy policy link

5. **Mobile Considerations**:
   - Use full-page redirects on mobile (not popups)
   - Test deep linking on mobile apps (future)
   - Handle app switching smoothly

### Business Requirements

- Reduce registration friction for target audience (millennials/Gen Z)
- Provide trusted authentication methods
- Maintain consistent branding while respecting provider guidelines
- Enable quick onboarding (< 1 minute)
- Build trust through recognizable provider brands

### OAuth Provider Registration Steps

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Configure OAuth consent screen
6. Add authorized redirect URIs
7. Copy Client ID and Client Secret

#### Apple Sign In Setup

1. Go to [Apple Developer](https://developer.apple.com/)
2. Create a new Services ID
3. Configure Sign in with Apple
4. Add return URLs
5. Create private key for authentication
6. Copy Service ID and configure JWT signing

#### Facebook Login Setup

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URIs
5. Add privacy policy URL
6. Submit for app review (for production)
7. Copy App ID and App Secret

### API Integration

#### Type Definitions

```typescript
// types/auth.types.ts

interface SocialAuthRequest {
  provider: 'google' | 'apple' | 'facebook';
  code: string;
  state: string;
  codeVerifier?: string; // For PKCE
}

interface SocialAuthResponse {
  success: boolean;
  data?: {
    user: User;
    session: Session;
    needsProfileCompletion: boolean;
    profileData?: SocialProfileData;
  };
  error?: {
    code: string;
    message: string;
    provider: string;
  };
}

interface SocialProfileData {
  email: string;
  emailVerified: boolean;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  provider: string;
  providerId: string;
}

interface ProfileCompletionRequest {
  name?: string;
  avatar?: string;
  provider: string;
  providerId: string;
  accessToken: string;
}
```

#### OAuth Utility Implementation

```typescript
// lib/auth/oauth.ts

import { oauthProviders } from './providers';

interface OAuthParams {
  provider: 'google' | 'apple' | 'facebook';
  state: string;
  codeVerifier?: string;
}

export function generateOAuthUrl({ provider, state, codeVerifier }: OAuthParams): string {
  const config = oauthProviders[provider];
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scope,
    state: state,
  });

  // Add PKCE for Apple
  if (config.pkce && codeVerifier) {
    const codeChallenge = generateCodeChallenge(codeVerifier);
    params.append('code_challenge', codeChallenge);
    params.append('code_challenge_method', 'S256');
  }

  // Provider-specific parameters
  if (provider === 'apple') {
    params.append('response_mode', 'form_post');
  }

  return `${config.authorizationUrl}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  provider: string,
  code: string,
  codeVerifier?: string
): Promise<{ accessToken: string; idToken?: string }> {
  const config = oauthProviders[provider];
  
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: process.env[`${provider.toUpperCase()}_CLIENT_SECRET`]!,
    code: code,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code',
  });

  if (codeVerifier) {
    body.append('code_verifier', codeVerifier);
  }

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    idToken: data.id_token,
  };
}

export async function fetchUserProfile(
  provider: string,
  accessToken: string
): Promise<SocialProfileData> {
  const config = oauthProviders[provider];

  // Apple provides user info in the ID token, decode it
  if (provider === 'apple') {
    return decodeAppleIdToken(accessToken);
  }

  // Fetch from user info endpoint
  const url = provider === 'facebook' 
    ? `${config.userInfoUrl}?fields=id,name,email,picture&access_token=${accessToken}`
    : config.userInfoUrl;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  const data = await response.json();

  // Normalize data across providers
  return normalizeProfileData(provider, data);
}

function normalizeProfileData(provider: string, data: any): SocialProfileData {
  switch (provider) {
    case 'google':
      return {
        email: data.email,
        emailVerified: data.verified_email,
        name: data.name,
        firstName: data.given_name,
        lastName: data.family_name,
        avatar: data.picture,
        provider: 'google',
        providerId: data.id,
      };
    
    case 'facebook':
      return {
        email: data.email,
        emailVerified: true, // Facebook always verifies emails
        name: data.name,
        avatar: data.picture?.data?.url,
        provider: 'facebook',
        providerId: data.id,
      };
    
    case 'apple':
      return {
        email: data.email,
        emailVerified: data.email_verified === 'true',
        name: data.name,
        provider: 'apple',
        providerId: data.sub,
      };
    
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// PKCE helpers
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

function generateCodeChallenge(verifier: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(hash));
}

function base64UrlEncode(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
```

### Custom Hook for Social Auth

```typescript
// lib/auth/useSocialAuth.ts

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateOAuthUrl, generateCodeVerifier } from './oauth';
import { useAuthStore } from '@/lib/store/authStore';

export const useSocialAuth = () => {
  const router = useRouter();
  const { setLoading, setError } = useAuthStore();
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null);

  const initiateOAuth = useCallback(async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      setLoading(provider);

      // Generate state for CSRF protection
      const state = crypto.randomUUID();
      sessionStorage.setItem('oauth_state', state);

      // Generate code verifier for PKCE (Apple)
      let verifier: string | undefined;
      if (provider === 'apple') {
        verifier = generateCodeVerifier();
        sessionStorage.setItem('code_verifier', verifier);
        setCodeVerifier(verifier);
      }

      // Generate OAuth URL
      const oauthUrl = generateOAuthUrl({
        provider,
        state,
        codeVerifier: verifier,
      });

      // Redirect to OAuth provider
      window.location.href = oauthUrl;

    } catch (error) {
      setError({
        code: 'OAUTH_INIT_FAILED',
        message: `Failed to start ${provider} authentication`,
        provider,
      });
      setLoading(null);
    }
  }, [setLoading, setError]);

  return {
    initiateOAuth,
    codeVerifier,
  };
};
```

## Testing Requirements

### Integration Tests (Target: 80% Coverage)

1. OAuth Flow Tests

```typescript
// tests/e2e/auth-social-register.spec.ts
import { test, expect } from '@playwright/test';

describe('Social Media Registration', () => {
  test('should display social auth buttons on welcome screen', async ({ page }) => {
    await page.goto('/auth/welcome');
    
    // Switch to register mode
    await page.getByRole('tab', { name: /register/i }).click();
    
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue with apple/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /continue with facebook/i })).toBeVisible();
  });

  test('should initiate Google OAuth flow', async ({ page, context }) => {
    await page.goto('/auth/welcome');
    await page.getByRole('tab', { name: /register/i }).click();
    
    // Mock OAuth provider
    const popupPromise = page.waitForEvent('popup');
    await page.getByRole('button', { name: /continue with google/i }).click();
    
    const popup = await popupPromise;
    await expect(popup.url()).toContain('accounts.google.com');
  });

  // Note: Full OAuth testing requires mocking or test provider accounts
  test('should handle OAuth callback with valid code', async ({ page }) => {
    // Simulate OAuth callback
    await page.goto('/auth/callback/google?code=test_code&state=test_state');
    
    // Should show loading state
    await expect(page.getByText(/completing registration/i)).toBeVisible();
    
    // Should redirect to dashboard after processing
    await page.waitForURL('/dashboard', { timeout: 5000 });
  });
});
```

2. Profile Completion Tests

```typescript
describe('Profile Completion', () => {
  test('should show profile completion form if data missing', async ({ page }) => {
    // Simulate OAuth callback with incomplete profile
    await page.goto('/auth/complete-profile?provider=google');
    
    await expect(page.getByRole('heading', { name: /complete your profile/i })).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /complete registration/i })).toBeVisible();
  });

  test('should pre-fill available data from provider', async ({ page }) => {
    await page.goto('/auth/complete-profile?provider=google');
    
    const emailField = page.getByLabel(/email/i);
    await expect(emailField).toHaveValue(/.+@.+/); // Should be pre-filled
    await expect(emailField).toBeDisabled(); // Should be read-only
  });

  test('should complete registration with profile data', async ({ page }) => {
    await page.goto('/auth/complete-profile?provider=google');
    
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByRole('button', { name: /complete registration/i }).click();
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/account created/i)).toBeVisible();
  });
});
```

3. Error Handling Tests

```typescript
describe('OAuth Error Handling', () => {
  test('should handle user cancellation', async ({ page }) => {
    await page.goto('/auth/callback/google?error=access_denied');
    
    await expect(page).toHaveURL('/auth/welcome');
    await expect(page.getByText(/cancelled/i)).toBeVisible();
  });

  test('should handle invalid state parameter', async ({ page }) => {
    await page.goto('/auth/callback/google?code=test&state=invalid');
    
    await expect(page.getByText(/invalid request/i)).toBeVisible();
  });

  test('should handle account already exists', async ({ page }) => {
    // Simulate OAuth with email that's already registered
    await page.goto('/auth/callback/google?code=existing_user_code&state=test');
    
    await expect(page.getByText(/account .* already exists/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });
});
```

4. Account Linking Tests

```typescript
describe('Account Linking', () => {
  test('should offer to link social account to existing email account', async ({ page }) => {
    // User has email account, tries to register with social using same email
    await page.goto('/auth/callback/google?code=link_account&state=test');
    
    await expect(page.getByText(/link.*account/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /link accounts/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /use different email/i })).toBeVisible();
  });
});
```

### Test Environment Setup

```typescript
// tests/fixtures/oauth-mock.ts

export const mockOAuthProviders = {
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenResponse: {
      access_token: 'mock_google_token',
      id_token: 'mock_google_id_token',
      expires_in: 3600,
    },
    userProfile: {
      id: 'google_123',
      email: 'test@gmail.com',
      verified_email: true,
      name: 'Test User',
      given_name: 'Test',
      family_name: 'User',
      picture: 'https://example.com/avatar.jpg',
    },
  },
  // Similar mocks for Apple and Facebook
};
```
