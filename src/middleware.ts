import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check for auth token
    const token = request.cookies.get('admin-token');
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // In production, you would verify the JWT token here
    // For now, we'll just check if the token exists
    try {
      // Simple token validation (in production, use JWT verification)
      const tokenValue = token.value;
      if (!tokenValue || tokenValue.length < 10) {
        throw new Error('Invalid token');
      }
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
