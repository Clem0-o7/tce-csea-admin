// middleware.js
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    try {
      const { pathname } = req.nextUrl;
      
      // Always allow these paths
      if (
        pathname === '/admin/login' ||
        pathname.startsWith('/api/auth/') ||
        pathname.includes('/_next/')
      ) {
        return NextResponse.next();
      }

      // Check authentication for admin routes
      if (pathname.startsWith('/admin')) {
        const token = req.nextauth.token;
        if (!token) {
          return NextResponse.redirect(new URL('/admin/login', req.url));
        }
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public paths
        if (
          req.nextUrl.pathname === '/admin/login' ||
          req.nextUrl.pathname.startsWith('/api/auth/')
        ) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};