# Mock Authentication - Test Credentials

This file contains mock credentials for testing the authentication flow during development.

## Mock Users

### Test User 1
- **Email**: `test@example.com`
- **Password**: `Test123!@#`
- **Name**: Test User

### Test User 2
- **Email**: `demo@healthify.com`
- **Password**: `Demo123!@#`
- **Name**: Demo User

## How to Use

1. Navigate to the login page: `http://localhost:3000/auth/login`
2. Enter one of the mock credentials above
3. Click "Sign In"
4. You will be redirected to the dashboard

## Registration

You can also register new users:
1. Navigate to: `http://localhost:3000/auth/register`
2. Enter any email and a password that meets the requirements:
   - At least 8 characters
   - Contains lowercase letter (a-z)
   - Contains uppercase letter (A-Z)
   - Contains number (0-9)
   - Contains special character (!@#$%^&*)
3. Accept terms and conditions
4. Click "Create Account"

## Features

- ✅ Mock login with predefined users
- ✅ Mock registration (users stored in memory for session)
- ✅ Session management
- ✅ Remember me functionality
- ✅ Proper error handling
- ✅ Email validation
- ✅ Duplicate email detection

## Important Notes

⚠️ **Development Only**: This is a mock implementation for development and testing purposes.

⚠️ **No Persistence**: Registered users are stored in memory and will be lost when the server restarts.

⚠️ **No Security**: Passwords are not hashed. This is for testing only.

⚠️ **Replace in Production**: Before deploying to production, replace these mock endpoints with actual authentication logic using a proper authentication service (e.g., NextAuth.js, Supabase Auth, Firebase Auth).

## Next Steps

For production deployment, consider:
1. Implementing proper authentication with NextAuth.js or similar
2. Using a real database for user storage
3. Implementing password hashing (bcrypt, argon2)
4. Adding email verification
5. Implementing password reset functionality
6. Adding rate limiting to prevent brute force attacks
7. Using secure session management with HTTP-only cookies
