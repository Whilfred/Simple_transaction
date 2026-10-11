// app/api/admin/logout/route.js
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/admin';

export async function POST() {
  const reponse = NextResponse.json({ ok: true });
  reponse.cookies.set(ADMIN_COOKIE, '', { path: '/', maxAge: 0 });
  return reponse;
}
