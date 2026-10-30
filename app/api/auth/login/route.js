import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { creerSessionUser, USER_COOKIE } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ erreur: 'Email et mot de passe requis.' }, { status: 400 });
    }

    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return NextResponse.json({ erreur: 'Email ou mot de passe incorrect.' }, { status: 401 });
    }

    const token = creerSessionUser(user.id);
    const reponse = NextResponse.json({ ok: true });
    reponse.cookies.set(USER_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return reponse;
  } catch (e) {
    console.error('Erreur login:', e);
    return NextResponse.json({ erreur: 'Erreur serveur.' }, { status: 500 });
  }
}
