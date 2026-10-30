import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { lireSessionUser, USER_COOKIE } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookie = cookies().get(USER_COOKIE)?.value;
  const userId = lireSessionUser(cookie);
  
  if (!userId) return NextResponse.json({ user: null }, { status: 401 });

  const { rows } = await query('SELECT id, prenom, email FROM users WHERE id = $1', [userId]);
  if (!rows[0]) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json({ user: rows[0] });
}
