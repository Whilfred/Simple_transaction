// app/api/admin/commandes/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { estAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

const STATUTS = ['en_attente', 'paiement_recu', 'en_cours', 'termine', 'annule'];

// GET /api/admin/commandes?statut=...&type=...&q=...&page=1&pageSize=30
export async function GET(request) {
  if (!estAdmin()) return NextResponse.json({ erreur: 'Non autorisé.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const statut = searchParams.get('statut') || 'tous';
  const type = searchParams.get('type') || 'tous';
  const q = (searchParams.get('q') || '').trim();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(5, parseInt(searchParams.get('pageSize') || '30', 10)));
  const offset = (page - 1) * pageSize;

  const conditions = [];
  const params = [];

  if (STATUTS.includes(statut)) {
    params.push(statut);
    conditions.push(`statut = $${params.length}`);
  }
  if (type === 'achat' || type === 'vente') {
    params.push(type);
    conditions.push(`type = $${params.length}`);
  }
  if (q) {
    params.push(`%${q}%`);
    conditions.push(`(reference ILIKE $${params.length} OR prenom ILIKE $${params.length} OR numero ILIKE $${params.length})`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const totalRes = await query(`SELECT COUNT(*)::int AS total FROM commandes ${where}`, params);
    const total = totalRes.rows[0].total;

    params.push(pageSize, offset);
    const { rows } = await query(
      `SELECT id, reference, type, statut, crypto, reseau, montant_fcfa,
              adresse_reception, adresse_depot, prenom, indicatif, numero, operateur,
              note_admin, created_at, updated_at
       FROM commandes
       ${where}
       ORDER BY created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return NextResponse.json({ commandes: rows, total, page, pageSize });
  } catch (e) {
    console.error('Erreur GET admin commandes :', e);
    return NextResponse.json({ erreur: 'Erreur du serveur.' }, { status: 500 });
  }
}

// PATCH /api/admin/commandes  { id, statut }
export async function PATCH(request) {
  if (!estAdmin()) return NextResponse.json({ erreur: 'Non autorisé.' }, { status: 401 });

  let corps;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête invalide.' }, { status: 400 });
  }

  const { id, statut } = corps || {};
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ erreur: 'ID manquant.' }, { status: 400 });
  }
  if (!STATUTS.includes(statut)) {
    return NextResponse.json({ erreur: 'Statut invalide.' }, { status: 400 });
  }

  try {
    const { rows } = await query(
      `UPDATE commandes SET statut = $2 WHERE id = $1
       RETURNING id, reference, statut, updated_at`,
      [id, statut]
    );
    if (!rows.length) return NextResponse.json({ erreur: 'Commande introuvable.' }, { status: 404 });
    return NextResponse.json({ commande: rows[0] });
  } catch (e) {
    console.error('Erreur PATCH admin commandes :', e);
    return NextResponse.json({ erreur: 'Erreur du serveur.' }, { status: 500 });
  }
}
