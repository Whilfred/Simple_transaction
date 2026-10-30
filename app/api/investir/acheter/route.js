import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { lireSessionUser, USER_COOKIE } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const cookie = cookies().get(USER_COOKIE)?.value;
    const userId = lireSessionUser(cookie);
    
    if (!userId) {
      return NextResponse.json({ erreur: 'Non autorisé (session expirée).' }, { status: 401 });
    }

    const { categorie, actif, quantite, prixUnitaireFcfa } = await request.json();
    
    if (!categorie || !actif || !quantite || !prixUnitaireFcfa) {
      return NextResponse.json({ erreur: 'Données manquantes.' }, { status: 400 });
    }

    // L'achat (mise à jour ou insertion)
    await query(
      `INSERT INTO investissements_user (user_id, categorie, actif, quantite, prix_achat_moyen)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, categorie, actif) 
       DO UPDATE SET 
         quantite = investissements_user.quantite + EXCLUDED.quantite,
         updated_at = now()`,
      [userId, categorie, actif, quantite, prixUnitaireFcfa]
    );

    return NextResponse.json({ ok: true });
    
  } catch (e) {
    console.error('Erreur achat:', e);
    // On renvoie le vrai message d'erreur pour le voir dans le navigateur
    return NextResponse.json({ erreur: e.message }, { status: 500 });
  }
}
