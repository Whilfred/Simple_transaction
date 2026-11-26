import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        c.id as conversation_id, 
        c.user_id,
        c.commande_id, 
        cmd.reference, 
        cmd.type, 
        COALESCE(u.prenom, cmd.prenom, 'Client') as prenom,
        (SELECT contenu FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as dernier_message,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND expediteur = 'user' AND lu = false) as non_lus
      FROM conversations c
      LEFT JOIN commandes cmd ON c.commande_id = cmd.id
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.updated_at DESC
    `);

    return NextResponse.json({ conversations: res.rows });
  } catch (error) {
    console.error('Erreur API Admin GET:', error);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { conversationId, contenu } = await request.json();

    if (!conversationId || !contenu) {
      return NextResponse.json({ erreur: 'Données manquantes' }, { status: 400 });
    }

    const newMessage = await query(
      'INSERT INTO messages (conversation_id, expediteur, contenu) VALUES ($1, $2, $3) RETURNING *',
      [conversationId, 'admin', contenu]
    );

    await query('UPDATE conversations SET updated_at = now() WHERE id = $1', [conversationId]);

    return NextResponse.json({ message: newMessage.rows[0] });
  } catch (error) {
    console.error('Erreur API Admin POST:', error);
    return NextResponse.json({ erreur: 'Erreur serveur' }, { status: 500 });
  }
}
