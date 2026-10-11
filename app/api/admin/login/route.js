// app/api/admin/login/route.js
import { NextResponse } from 'next/server';
import { verifierMotDePasse, creerSession, ADMIN_COOKIE, ADMIN_DUREE_MAX } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  let corps;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête invalide.' }, { status: 400 });
  }

  const motDePasse = String(corps?.motDePasse || '');
  if (!motDePasse) {
    return NextResponse.json({ erreur: 'Mot de passe requis.' }, { status: 400 });
  }

  if (!verifierMotDePasse(motDePasse)) {
    // Petit délai pour ralentir les attaques par force brute
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ erreur: 'Mot de passe incorrect.' }, { status: 401 });
  }

  const valeur = creerSession();
  const reponse = NextResponse.json({ ok: true });
  reponse.cookies.set(ADMIN_COOKIE, valeur, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_DUREE_MAX,
  });
  return reponse;
}
