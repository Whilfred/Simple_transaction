import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { lireSessionUser, USER_COOKIE } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    // 1. Vérifier l'utilisateur
    const cookie = cookies().get(USER_COOKIE)?.value;
    const userId = lireSessionUser(cookie);
    if (!userId) return NextResponse.json({ erreur: 'Non autorisé.' }, { status: 401 });

    const { categorie, actif, quantite, prixUnitaireFcfa } = await request.json();
    if (!categorie || !actif || !quantite || !prixUnitaireFcfa) {
      return NextResponse.json({ erreur: 'Données manquantes.' }, { status: 400 });
    }

    // 2. Enregistrer l'investissement (On ajoute à la quantité existante si déjà possédé)
    const totalInvesti = quantite * prixUnitaireFcfa;

    await query(
      `INSERT INTO investissements_user (user_id, categorie, actif, quantite, prix_achat_moyen)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, categorie, actif) 
       DO UPDATE SET 
         quantite = investissements_user.quantite + $4,
         updated_at = now()`,
      [userId, categorie, actif, quantite, prixUnitaireFcfa]
    );

    // (Optionnel) Enregistrer la transaction financière dans ton historique de commande
    // await query('INSERT INTO commandes (...) ...');

    return NextResponse.json({ ok: true, totalInvesti });
  } catch (e) {
    console.error('Erreur achat:', e);
    return NextResponse.json({ erreur: 'Erreur serveur.' }, { status: 500 });
  }
}
