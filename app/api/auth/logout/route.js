import { NextResponse } from 'next/server';
import { USER_COOKIE } from '@/lib/auth';

export async function POST() {
  const reponse = NextResponse.json({ ok: true });
  
  // On écrase le cookie avec une date d'expiration passée
  reponse.cookies.set(USER_COOKIE, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return reponse;
}
