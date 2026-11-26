'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const messagesEndRef = useRef(null);

  const chargerConversations = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (data.conversations) setConversations(data.conversations);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    chargerConversations();
    const interval = setInterval(chargerConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  // Charger les messages quand on clique sur une conversation
  const chargerMessages = async (convId) => {
    try {
      // On utilise l'API admin dédiée
      const res = await fetch(`/api/admin/messages/${convId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!activeConv) return;
    chargerMessages(activeConv.conversation_id);
    
    // Optionnel : rafraîchir les messages toutes les 5s
    const interval = setInterval(() => chargerMessages(activeConv.conversation_id), 5000);
    return () => clearInterval(interval);
  }, [activeConv]);

  const envoyerMessage = async (e) => {
    e.preventDefault();
    if (!nouveauMessage.trim() || !activeConv) return;

    const contenu = nouveauMessage;
    setNouveauMessage('');

    try {
      await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConv.conversation_id, contenu }),
      });
      
      // Recharger immédiatement les messages
      chargerMessages(activeConv.conversation_id);
      chargerConversations(); // Mettre à jour le dernier message dans la liste de gauche
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', backgroundColor: '#f0f2f5' }}>
      {/* Colonne de gauche */}
      <div style={{ width: '300px', backgroundColor: 'white', borderRight: '1px solid #ddd', overflowY: 'auto' }}>
        <div style={{ padding: '15px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
          Discussions ({conversations.length})
        </div>
        {conversations.map((conv) => (
          <div
            key={conv.conversation_id}
            onClick={() => setActiveConv(conv)}
            style={{
              padding: '15px',
              borderBottom: '1px solid #eee',
              cursor: 'pointer',
              backgroundColor: activeConv?.conversation_id === conv.conversation_id ? '#e6f7ff' : 'transparent',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <strong>{conv.prenom}</strong>
              {conv.non_lus > 0 && (
                <span style={{ backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '12px' }}>
                  {conv.non_lus}
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.8em', color: '#666', marginBottom: '5px' }}>
              {conv.reference ? `${conv.reference} - ${conv.crypto}` : 'Discussion générale'}
            </div>
            <div style={{ fontSize: '0.9em', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {conv.dernier_message || 'Aucun message'}
            </div>
          </div>
        ))}
      </div>

      {/* Zone de droite */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeConv ? (
          <>
            <div style={{ padding: '15px', backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
              <h3 style={{ margin: 0 }}>{activeConv.prenom}</h3>
              <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>
                {activeConv.reference ? `Commande: ${activeConv.reference} (${activeConv.type})` : 'Discussion générale'}
              </p>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ alignSelf: msg.expediteur === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                  <div style={{ backgroundColor: msg.expediteur === 'admin' ? '#007bff' : 'white', color: msg.expediteur === 'admin' ? 'white' : 'black', padding: '10px 15px', borderRadius: '15px', borderBottomRightRadius: msg.expediteur === 'admin' ? '2px' : '15px', borderBottomLeftRadius: msg.expediteur === 'user' ? '2px' : '15px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                    {msg.contenu}
                  </div>
                  <span style={{ fontSize: '0.7em', color: '#888', display: 'block', marginTop: '2px', textAlign: msg.expediteur === 'admin' ? 'right' : 'left' }}>
                    {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={envoyerMessage} style={{ padding: '15px', backgroundColor: 'white', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={nouveauMessage}
                onChange={(e) => setNouveauMessage(e.target.value)}
                placeholder="Répondre..."
                style={{ flex: 1, padding: '10px 15px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none' }}
              />
              <button type="submit" style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                Envoyer
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#888' }}>
            Sélectionnez une discussion pour voir les messages
          </div>
        )}
      </div>
    </div>
  );
}
