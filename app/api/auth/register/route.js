import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { prenom, email, password } = await request.json();
    if (!prenom || !email || !password) {
      return NextResponse.json({ erreur: 'Tous les champs sont requis.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ erreur: 'Le mot de passe doit faire 8 caractères minimum.' }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);
    await query('INSERT INTO users (prenom, email, password_hash) VALUES ($1, $2, $3)', [
      prenom,
      email.toLowerCase(),
      hash,
    ]);

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    if (e.code === '23505') {
      return NextResponse.json({ erreur: 'Cet email est déjà utilisé.' }, { status: 409 });
    }
    console.error('Erreur register:', e);
    return NextResponse.json({ erreur: 'Erreur serveur.' }, { status: 500 });
  }
}
