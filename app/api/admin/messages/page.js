'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [chargementMessages, setChargementMessages] = useState(false);
  
  // Nouvel état pour stocker les infos du client
  const [clientInfos, setClientInfos] = useState(null);

  const messagesEndRef = useRef(null);

  // États pour la recherche et le filtre
  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState('tous');

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

  const chargerMessages = async (convId) => {
    setChargementMessages(true);
    try {
      const res = await fetch(`/api/admin/messages/${convId}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        
        setTimeout(async () => {
          const refreshConvs = await fetch('/api/admin/messages');
          const refreshData = await refreshConvs.json();
          if (refreshData.conversations) setConversations(refreshData.conversations);
        }, 200);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setChargementMessages(false);
    }
  };

  // 🔥 NOUVEAU : Charger les infos client lors du clic
  const handleClickConversation = async (conv) => {
    setActiveConv(conv);
    setClientInfos(null);
    chargerMessages(conv.conversation_id);

    if (conv.user_id) {
      try {
        const res = await fetch(`/api/admin/users/${conv.user_id}`);
        const data = await res.json();
        if (data.user) setClientInfos(data);
      } catch (error) {
        console.error("Erreur chargement client", error);
      }
    }
  };

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
      chargerMessages(activeConv.conversation_id);
      chargerConversations();
    } catch (error) {
      console.error(error);
    }
  };

  const conversationsFiltrees = conversations.filter((conv) => {
    const matchTexte = 
      (conv.prenom || '').toLowerCase().includes(recherche.toLowerCase()) || 
      (conv.dernier_message || '').toLowerCase().includes(recherche.toLowerCase());
    
    const matchFiltre = filtre === 'tous' ? true : conv.non_lus > 0;

    return matchTexte && matchFiltre;
  });

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', backgroundColor: '#f0f2f5' }}>
      
      {/* 1. Colonne de gauche (Discussions) */}
      <div style={{ width: '320px', backgroundColor: 'white', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 15px 0' }}>Discussions ({conversationsFiltrees.length})</h2>
          
          <input
            type="text"
            placeholder="Rechercher un nom, un message..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '20px', border: '1px solid #ccc', marginBottom: '10px', outline: 'none' }}
          />

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setFiltre('tous')}
              style={{ flex: 1, padding: '6px', borderRadius: '5px', border: 'none', backgroundColor: filtre === 'tous' ? '#007bff' : '#eee', color: filtre === 'tous' ? 'white' : 'black', cursor: 'pointer', fontSize: '13px' }}
            >
              Tous
            </button>
            <button 
              onClick={() => setFiltre('non_lus')}
              style={{ flex: 1, padding: '6px', borderRadius: '5px', border: 'none', backgroundColor: filtre === 'non_lus' ? '#007bff' : '#eee', color: filtre === 'non_lus' ? 'white' : 'black', cursor: 'pointer', fontSize: '13px' }}
            >
              Non lus
            </button>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversationsFiltrees.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '20px', fontSize: '14px' }}>Aucune discussion trouvée.</p>
          ) : (
            conversationsFiltrees.map((conv) => (
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
            ))
          )}
        </div>
      </div>

      {/* 2. Zone centrale (Chat) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#efeae2' }}>
        {activeConv ? (
          <>
            <div style={{ padding: '15px 20px', backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
              <h3 style={{ margin: 0 }}>{activeConv.prenom || 'Client'}</h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                {activeConv.reference ? `Commande: ${activeConv.reference} (${activeConv.type})` : 'Discussion générale'}
              </p>
            </div>

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {chargementMessages ? (
                <p style={{ textAlign: 'center', color: '#888' }}>Chargement...</p>
              ) : messages.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888' }}>Aucun message.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} style={{ alignSelf: msg.expediteur === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                    <div style={{ backgroundColor: msg.expediteur === 'admin' ? '#dcf8c6' : 'white', color: 'black', padding: '10px 15px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
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

      {/* 3. 🔥 NOUVELLE COLONNE : Infos Client */}
      {activeConv && clientInfos && (
        <div style={{ width: '300px', backgroundColor: 'white', borderLeft: '1px solid #ddd', padding: '20px', overflowY: 'auto' }}>
          <h3 style={{ marginTop: 0 }}>Informations Client</h3>
          
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 10px 0' }}><strong>Nom :</strong> {clientInfos.user.prenom}</p>
            <p style={{ margin: '0 0 10px 0' }}><strong>Email :</strong> {clientInfos.user.email}</p>
          </div>

          <h4 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Commandes ({clientInfos.commandes.length})</h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {clientInfos.commandes.length === 0 ? (
              <p style={{ color: '#888', fontSize: '13px' }}>Aucune commande.</p>
            ) : (
              clientInfos.commandes.map((cmd) => (
                <div key={cmd.id} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '8px', fontSize: '13px', backgroundColor: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px' }}>
                    <span>{cmd.type.toUpperCase()}</span>
                    <span style={{ color: cmd.statut === 'en_attente' ? '#ff9800' : '#4caf50' }}>{cmd.statut}</span>
                  </div>
                  <div style={{ marginTop: '5px' }}>
                    {cmd.crypto} {cmd.montant_fcfa ? `- ${cmd.montant_fcfa} FCFA` : ''}
                  </div>
                  <div style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
                    Réf: {cmd.reference}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}
