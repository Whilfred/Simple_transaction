import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  let corps;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête invalide.' }, { status: 400 });
  }

  const references = Array.isArray(corps?.references)
    ? corps.references
        .filter((r) => typeof r === 'string' && /^EX-[A-Z0-9]{6,8}$/.test(r))
        .slice(0, 50)
    : [];

  if (references.length === 0) return NextResponse.json({ commandes: [] });

  try {
    const { rows } = await query(
      `SELECT reference, statut, type, crypto, reseau, montant_fcfa, created_at
       FROM commandes
       WHERE reference = ANY($1::text[])`,
      [references]
    );
    return NextResponse.json({ commandes: rows });
  } catch (e) {
    console.error('Erreur lecture statuts :', e);
    return NextResponse.json({ erreur: 'Erreur du serveur.' }, { status: 500 });
  }
}
