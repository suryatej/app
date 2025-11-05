import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const MOCK_USERS = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'Test123!@#', // In real app, this would be hashed
    name: 'Test User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailVerified: true,
    provider: 'email' as const,
  },
  {
    id: '2',
    email: 'demo@healthify.com',
    password: 'Demo123!@#',
    name: 'Demo User',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    emailVerified: true,
    provider: 'email' as const,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          code: 'INVALID_INPUT',
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }

    // Find user
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json(
        {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password. Please try again.',
        },
        { status: 401 }
      );
    }

    // Check password
    if (user.password !== password) {
      return NextResponse.json(
        {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password. Please try again.',
        },
        { status: 401 }
      );
    }

    // Generate mock session
    const sessionDuration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 24 hours
    const expiresAt = new Date(Date.now() + sessionDuration).toISOString();

    const session = {
      token: `mock-token-${user.id}-${Date.now()}`,
      expiresAt,
      refreshToken: rememberMe ? `mock-refresh-${user.id}-${Date.now()}` : '',
    };

    // Return successful response
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          emailVerified: user.emailVerified,
          provider: user.provider,
        },
        session,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
