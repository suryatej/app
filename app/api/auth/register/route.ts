import { NextRequest, NextResponse } from 'next/server';

// Mock user database (shared with login)
const MOCK_USERS = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'Test123!@#',
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
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        {
          code: 'INVALID_INPUT',
          message: 'Email and password are required',
          field: !email ? 'email' : 'password',
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      return NextResponse.json(
        {
          code: 'EMAIL_EXISTS',
          message: 'This email is already registered. Please sign in.',
          field: 'email',
        },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: `${MOCK_USERS.length + 1}`,
      email: email.toLowerCase(),
      password, // In real app, this would be hashed
      name: email.split('@')[0], // Use email username as name
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: false,
      provider: 'email' as const,
    };

    // Add to mock database
    MOCK_USERS.push(newUser);

    // Generate mock session
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const session = {
      token: `mock-token-${newUser.id}-${Date.now()}`,
      expiresAt,
      refreshToken: `mock-refresh-${newUser.id}-${Date.now()}`,
    };

    // Return successful response
    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
          emailVerified: newUser.emailVerified,
          provider: newUser.provider,
        },
        session,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        code: 'SERVER_ERROR',
        message: 'An unexpected error occurred. Please try again.',
      },
      { status: 500 }
    );
  }
}
