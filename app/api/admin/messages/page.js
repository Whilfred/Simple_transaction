'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function AdminMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const messagesEndRef = useRef(null);

  // 1. Charger la liste des conversations
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
    // Rafraîchir toutes les 10 secondes
    const interval = setInterval(chargerConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  // 2. Charger les messages de la conversation sélectionnée
  useEffect(() => {
    if (!activeConv) return;

    const chargerMessages = async () => {
      try {
        const res = await fetch(`/api/messages?commandeId=${activeConv.commande_id}`);
        const data = await res.json();
        if (data.messages) {
          setMessages(data.messages);
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      } catch (error) {
        console.error(error);
      }
    };

    chargerMessages();
    const interval = setInterval(chargerMessages, 5000); // Rafraîchir les messages
    return () => clearInterval(interval);
  }, [activeConv]);

  // 3. Envoyer une réponse
  const envoyerMessage = async (e) => {
    e.preventDefault();
    if (!nouveauMessage.trim() || !activeConv) return;

    const contenu = nouveauMessage;
    setNouveauMessage('');

    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConv.conversation_id, contenu }),
      });
      
      if (res.ok) {
        // Recharger les messages
        const refreshRes = await fetch(`/api/messages?commandeId=${activeConv.commande_id}`);
        const refreshData = await refreshRes.json();
        setMessages(refreshData.messages);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi");
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', backgroundColor: '#f0f2f5' }}>
      {/* Colonne de gauche : Liste des conversations */}
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
              {conv.reference} - {conv.crypto}
            </div>
            <div style={{ fontSize: '0.9em', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {conv.dernier_message || 'Aucun message'}
            </div>
          </div>
        ))}
      </div>

      {/* Zone de droite : Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeConv ? (
          <>
            {/* En-tête du chat */}
            <div style={{ padding: '15px', backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
              <h3 style={{ margin: 0 }}>{activeConv.prenom}</h3>
              <p style={{ margin: 0, fontSize: '0.9em', color: '#666' }}>
                Commande: {activeConv.reference} ({activeConv.type})
              </p>
            </div>

            {/* Messages */}
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

            {/* Zone de saisie */}
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
