import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const conversationId = params.id;

    if (!conversationId) {
      return NextResponse.json({ erreur: 'ID de conversation manquant' }, { status: 400 });
    }

    // 🔥 NOUVEAU : On marque les messages de l'utilisateur comme "lus"
    await query(
      "UPDATE messages SET lu = true WHERE conversation_id = $1 AND expediteur = 'user' AND lu = false",
      [conversationId]
    );

    // Récupérer les messages
    const messagesRes = await query(
      'SELECT id, expediteur, contenu, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [conversationId]
    );

    return NextResponse.json({ messages: messagesRes.rows });
  } catch (error) {
    console.error('Erreur API Admin GET messages (id):', error);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}
