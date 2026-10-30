import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { lireSessionUser, USER_COOKIE } from '@/lib/auth';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookie = cookies().get(USER_COOKIE)?.value;
  const userId = lireSessionUser(cookie);
  if (!userId) return NextResponse.json({ erreur: 'Non autorisé.' }, { status: 401 });

  try {
    const { rows } = await query(
      'SELECT categorie, actif, quantite, prix_achat_moyen, updated_at FROM investissements_user WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
    return NextResponse.json({ investissements: rows });
  } catch (e) {
    return NextResponse.json({ erreur: 'Erreur serveur.' }, { status: 500 });
  }
}
