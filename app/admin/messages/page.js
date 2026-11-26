'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [chargementMessages, setChargementMessages] = useState(false);
  const messagesEndRef = useRef(null);

  // 1. Charger la liste des discussions
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

  // 2. Charger les messages d'une discussion
  const chargerMessages = async (convId) => {
    setChargementMessages(true);
    try {
      const res = await fetch(`/api/admin/messages/${convId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setChargementMessages(false);
    }
  };

  // Quand on clique sur une discussion
  const handleClickConversation = (conv) => {
    setActiveConv(conv);
    chargerMessages(conv.conversation_id);
  };

  // 3. Envoyer une réponse
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
      
      // Recharger les messages et la liste des discussions
      chargerMessages(activeConv.conversation_id);
      chargerConversations();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi");
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', backgroundColor: '#f0f2f5' }}>
      
      {/* Colonne de gauche : Liste des conversations */}
      <div style={{ width: '350px', backgroundColor: 'white', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #ddd', fontSize: '18px', fontWeight: 'bold' }}>
          Discussions ({conversations.length})
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.map((conv) => (
            <div
              key={conv.conversation_id}
              onClick={() => handleClickConversation(conv)}
              style={{
                padding: '15px 20px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                backgroundColor: activeConv?.conversation_id === conv.conversation_id ? '#e6f7ff' : 'white',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ fontSize: '16px' }}>{conv.prenom || 'Client'}</strong>
                {conv.non_lus > 0 && (
                  <span style={{ backgroundColor: '#25D366', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '12px', fontWeight: 'bold' }}>
                    {conv.non_lus}
                  </span>
                )}
              </div>
              
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                {conv.reference ? `${conv.reference} - ${conv.crypto}` : 'Discussion générale'}
              </div>
              
              <div style={{ fontSize: '14px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {conv.dernier_message || 'Aucun message'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zone de droite : Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#efeae2' }}>
        {activeConv ? (
          <>
            {/* En-tête du chat */}
            <div style={{ padding: '15px 20px', backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
              <h3 style={{ margin: 0 }}>{activeConv.prenom || 'Client'}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                {activeConv.reference ? `Commande: ${activeConv.reference} (${activeConv.type})` : 'Discussion générale'}
              </p>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chargementMessages ? (
                <p style={{ textAlign: 'center', color: '#888' }}>Chargement des messages...</p>
              ) : messages.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888' }}>Aucun message.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} style={{ alignSelf: msg.expediteur === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                    <div style={{ 
                      backgroundColor: msg.expediteur === 'admin' ? '#dcf8c6' : 'white', 
                      color: 'black', 
                      padding: '10px 15px', 
                      borderRadius: '8px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                      {msg.contenu}
                    </div>
                    <span style={{ fontSize: '11px', color: '#888', display: 'block', marginTop: '2px', textAlign: msg.expediteur === 'admin' ? 'right' : 'left' }}>
                      {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <form onSubmit={envoyerMessage} style={{ padding: '15px', backgroundColor: '#f0f0f0', borderTop: '1px solid #ddd', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={nouveauMessage}
                onChange={(e) => setNouveauMessage(e.target.value)}
                placeholder="Tapez un message..."
                style={{ flex: 1, padding: '12px 15px', borderRadius: '25px', border: '1px solid #ccc', outline: 'none', fontSize: '15px' }}
              />
              <button type="submit" style={{ padding: '10px 25px', borderRadius: '25px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                Envoyer
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#888' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p style={{ marginTop: '15px', fontSize: '18px' }}>Sélectionnez une discussion pour voir les messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
