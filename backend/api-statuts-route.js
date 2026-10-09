import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Le client envoie les références qu'il a en local, on renvoie leur statut actuel.
// Aucune donnée personnelle n'est renvoyée.
export async function POST(request) {
  let corps;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête invalide.' }, { status: 400 });
  }

  const references = Array.isArray(corps?.references)
    ? corps.references.filter((r) => typeof r === 'string' && /^EX-[A-Z0-9]{6,8}$/.test(r)).slice(0, 50)
    : [];
  if (references.length === 0) return NextResponse.json({ commandes: [] });

  try {
    const { data, error } = await supabase()
      .from('commandes')
      .select('reference, statut, type, crypto, reseau, montant_fcfa, created_at')
      .in('reference', references);
    if (error) throw error;
    return NextResponse.json({ commandes: data });
  } catch (e) {
    console.error('Erreur lecture statuts :', e);
    return NextResponse.json({ erreur: 'Erreur du serveur.' }, { status: 500 });
  }
}
