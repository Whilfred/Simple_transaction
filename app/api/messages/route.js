import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { lireSessionUser, USER_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET : Récupérer les messages de l'utilisateur connecté
export async function GET() {
  try {
    const cookie = cookies().get(USER_COOKIE)?.value;
    const userId = lireSessionUser(cookie);

    if (!userId) return NextResponse.json({ erreur: 'Non autorisé' }, { status: 401 });

    // On cherche la conversation liée à CET utilisateur
    let convRes = await query('SELECT id FROM conversations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
    
    if (convRes.rows.length === 0) {
      // S'il n'y en a pas, on en crée une nouvelle
      const newConv = await query('INSERT INTO conversations (user_id) VALUES ($1) RETURNING id', [userId]);
      return NextResponse.json({ messages: [], conversationId: newConv.rows[0].id });
    }

    const conversationId = convRes.rows[0].id;

    // Récupérer les messages
    const messagesRes = await query(
      'SELECT id, expediteur, contenu, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC',
      [conversationId]
    );

    return NextResponse.json({ messages: messagesRes.rows, conversationId });
  } catch (error) {
    console.error('Erreur API GET messages:', error);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}

// POST : Envoyer un message
export async function POST(request) {
  try {
    const cookie = cookies().get(USER_COOKIE)?.value;
    const userId = lireSessionUser(cookie);

    if (!userId) return NextResponse.json({ erreur: 'Non autorisé' }, { status: 401 });

    const { contenu } = await request.json();

    if (!contenu) return NextResponse.json({ erreur: 'Le message est vide' }, { status: 400 });

    // Chercher ou créer la conversation
    let convRes = await query('SELECT id FROM conversations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
    let conversationId;

    if (convRes.rows.length === 0) {
      const newConv = await query('INSERT INTO conversations (user_id) VALUES ($1) RETURNING id', [userId]);
      conversationId = newConv.rows[0].id;
    } else {
      conversationId = convRes.rows[0].id;
    }

    // Insérer le message
    const newMessage = await query(
      'INSERT INTO messages (conversation_id, expediteur, contenu) VALUES ($1, $2, $3) RETURNING id, expediteur, contenu, created_at',
      [conversationId, 'user', contenu]
    );

    await query('UPDATE conversations SET updated_at = now() WHERE id = $1', [conversationId]);

    return NextResponse.json({ message: newMessage.rows[0] });
  } catch (error) {
    console.error('Erreur API POST messages:', error);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}
