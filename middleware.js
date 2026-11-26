import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 1. Protection Admin
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!request.cookies.get('excrypt_admin')?.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 2. Protection Investisseur
  const isInvestirPublic = pathname === '/investir/login' || pathname === '/investir/register';
  if (pathname.startsWith('/investir') && !isInvestirPublic) {
    if (!request.cookies.get('excrypt_user')?.value) {
      return NextResponse.redirect(new URL('/investir/login', request.url));
    }
  }

  // 3. Protection des pages principales
  const isPageProtegee = 
    pathname === '/accueil' || 
    pathname === '/dashboard' || 
    pathname === '/acheter' || 
    pathname === '/vendre' || 
    pathname === '/messages';

  if (isPageProtegee) {
    const sessionCookie = request.cookies.get('excrypt_user')?.value;
    if (!sessionCookie) {
      // Pas connecté -> on redirige vers /login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Si connecté et va sur login/register -> accueil
  if (pathname === '/login' || pathname === '/register') {
    const sessionCookie = request.cookies.get('excrypt_user')?.value;
    if (sessionCookie) {
      return NextResponse.redirect(new URL('/accueil', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
