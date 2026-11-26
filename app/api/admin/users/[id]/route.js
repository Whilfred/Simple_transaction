import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const userId = params.id;

    if (!userId) {
      return NextResponse.json({ erreur: 'ID utilisateur manquant' }, { status: 400 });
    }

    // 1. Récupérer les infos de l'utilisateur
    const userRes = await query('SELECT id, prenom, email FROM users WHERE id = $1', [userId]);
    
    if (userRes.rows.length === 0) {
      return NextResponse.json({ erreur: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // 2. Récupérer TOUTES les commandes (avec toutes les colonnes utiles)
    const commandesRes = await query(
      `SELECT 
        id, reference, type, crypto, reseau, 
        montant_fcfa, statut, created_at,
        adresse_reception, adresse_depot,
        indicatif, numero, operateur
       FROM commandes 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    return NextResponse.json({ 
      user: userRes.rows[0],
      commandes: commandesRes.rows
    });
  } catch (error) {
    console.error('Erreur API Admin GET user:', error);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}
