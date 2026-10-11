// middleware.js
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'excrypt_admin';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protection des pages admin sauf /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookie = request.cookies.get(COOKIE_NAME)?.value;
    if (!cookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
