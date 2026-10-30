import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protection Admin
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!request.cookies.get('excrypt_admin')?.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protection Investisseur
  const isInvestirPublic = pathname === '/investir/login' || pathname === '/investir/register';
  if (pathname.startsWith('/investir') && !isInvestirPublic) {
    if (!request.cookies.get('excrypt_user')?.value) {
      return NextResponse.redirect(new URL('/investir/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/investir/:path*'],
};
