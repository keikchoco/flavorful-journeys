import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, API routes, and assets
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/assets/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // Get authentication state from cookies (simple check)
  const idToken = request.cookies.get('firebase-id-token')?.value;
  const userId = request.cookies.get('firebase-user-id')?.value;
  
  // Simple authentication check
  const isAuthenticated = !!(idToken && userId);
  
  // Route definitions
  const publicRoutes = ['/', '/login', '/faq'];
  const userRoutes = ['/user'];
  const adminRoutes = ['/admin'];
  
  // Check route types
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  const isUserRoute = userRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isLoginRoute = pathname === '/login';
  
  // Protection logic
  
  // 1. Redirect unauthenticated users from protected routes
  if ((isUserRoute || isAdminRoute) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // 2. For admin routes, let the page component handle admin verification
  // This avoids the Node.js compatibility issues in middleware
  
  // 3. Redirect authenticated users from login page to user dashboard
  // Admin check will happen on the client side
  if (isLoginRoute && isAuthenticated) {
    const redirectTo = request.nextUrl.searchParams.get('redirect');
    
    if (redirectTo && redirectTo !== '/login') {
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }
    
    // Always redirect to user dashboard first, then client-side will redirect admins
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }
  
  // 4. Redirect authenticated users from home to user dashboard
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/user/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};