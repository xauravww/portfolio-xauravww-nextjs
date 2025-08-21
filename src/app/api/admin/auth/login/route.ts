import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    //console logs both username and password
    console.log('Username:', username);
    console.log('Password:', password);

    // Check against environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPasswordHash = process.env.ADMIN_PASSWORD;

    //console logs these as well
    console.log('Admin Username:', adminUsername);
    console.log('Admin Password Hash:', adminPasswordHash);

    if (!adminUsername || !adminPasswordHash) {
      return NextResponse.json(
        { error: 'Admin credentials not configured' },
        { status: 500 }
      );
    }

    if (username.trim() !== adminUsername.trim()) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // For demo purposes, we'll use a simple password check
    // In production, you should properly hash and verify passwords
    let isValidPassword = false;
    
    // Check if adminPasswordHash is a bcrypt hash (starts with $2)
    if (adminPasswordHash.startsWith('$2')) {
      // It's a bcrypt hash, use bcrypt.compare
      isValidPassword = await bcrypt.compare(password, adminPasswordHash);
    } else {
      // It's plain text, do direct comparison (development only)
      isValidPassword = password === adminPasswordHash;
    }
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    // Redirect to dashboard after successful login
    const response = NextResponse.redirect(new URL('/admin/dashboard', request.url));
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
  return response;
}
