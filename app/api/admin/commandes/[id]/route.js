// app/api/admin/commandes/[id]/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { estAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

// PUT /api/admin/commandes/[id]  { note_admin }
export async function PUT(request, { params }) {
  if (!estAdmin()) return NextResponse.json({ erreur: 'Non autorisé.' }, { status: 401 });

  let corps;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête invalide.' }, { status: 400 });
  }

  const note = String(corps?.note_admin || '').slice(0, 2000);
  const id = params.id;
  if (!id) return NextResponse.json({ erreur: 'ID manquant.' }, { status: 400 });

  try {
    const { rows } = await query(
      `UPDATE commandes SET note_admin = $2 WHERE id = $1
       RETURNING id, reference, note_admin, updated_at`,
      [id, note || null]
    );
    if (!rows.length) return NextResponse.json({ erreur: 'Commande introuvable.' }, { status: 404 });
    return NextResponse.json({ commande: rows[0] });
  } catch (e) {
    console.error('Erreur PUT note admin :', e);
    return NextResponse.json({ erreur: 'Erreur du serveur.' }, { status: 500 });
  }
}
