'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [chargementMessages, setChargementMessages] = useState(false);
  const [clientInfos, setClientInfos] = useState(null);
  
  const messagesEndRef = useRef(null);

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

  // Fonction pour formater les statuts en couleurs
  const getStatutBadge = (statut) => {
    const styles = {
      en_attente: { bg: '#fff3cd', color: '#856404' },
      paiement_recu: { bg: '#cce5ff', color: '#004085' },
      en_cours: { bg: '#d1ecf1', color: '#0c5460' },
      termine: { bg: '#d4edda', color: '#155724' },
      annule: { bg: '#f8d7da', color: '#721c24' },
    };
    const s = styles[statut] || { bg: '#eee', color: '#333' };
    return (
      <span style={{ backgroundColor: s.bg, color: s.color, padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
        {statut.replace('_', ' ')}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)', backgroundColor: '#f8f9fa', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. COLONNE GAUCHE : LISTE DES DISCUSSIONS */}
      <div style={{ width: '320px', backgroundColor: '#ffffff', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 15px 0', color: '#1a1a1a' }}>
            Messages
          </h2>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              style={{ width: '100%', padding: '10px 15px 10px 35px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: '#f1f3f4', fontSize: '14px', outline: 'none' }}
            />
            <span style={{ position: 'absolute', left: '10px', top: '10px', color: '#888' }}>🔍</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setFiltre('tous')}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: filtre === 'tous' ? '#1a1a1a' : '#f1f3f4', color: filtre === 'tous' ? 'white' : '#333', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
            >
              Tous
            </button>
            <button 
              onClick={() => setFiltre('non_lus')}
              style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', backgroundColor: filtre === 'non_lus' ? '#1a1a1a' : '#f1f3f4', color: filtre === 'non_lus' ? 'white' : '#333', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}
            >
              Non lus
            </button>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversationsFiltrees.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#888', marginTop: '20px', fontSize: '14px' }}>Aucune discussion.</p>
          ) : (
            conversationsFiltrees.map((conv) => (
              <div
                key={conv.conversation_id}
                onClick={() => handleClickConversation(conv)}
                style={{
                  padding: '15px 20px',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  backgroundColor: activeConv?.conversation_id === conv.conversation_id ? '#f0f7ff' : 'transparent',
                  borderLeft: activeConv?.conversation_id === conv.conversation_id ? '4px solid #007bff' : '4px solid transparent',
                  transition: 'background-color 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <strong style={{ fontSize: '15px', color: '#1a1a1a' }}>{conv.prenom || 'Client'}</strong>
                  {conv.non_lus > 0 && (
                    <span style={{ backgroundColor: '#007bff', color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 'bold' }}>
                      {conv.non_lus}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                  {conv.reference ? `${conv.reference} - ${conv.crypto}` : 'Général'}
                </div>
                <div style={{ fontSize: '13px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {conv.dernier_message || 'Nouveau message'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. COLONNE CENTRALE : CHAT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
        {activeConv ? (
          <>
            <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                {activeConv.prenom?.charAt(0).toUpperCase() || 'C'}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{activeConv.prenom || 'Client'}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>
                  {activeConv.reference ? `Commande: ${activeConv.reference}` : 'Discussion générale'}
                </p>
              </div>
            </div>

            <div style={{ flex: 1, padding: '20px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#f8f9fa' }}>
              {chargementMessages ? (
                <p style={{ textAlign: 'center', color: '#888' }}>Chargement...</p>
              ) : messages.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888' }}>Aucun message pour le moment.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} style={{ alignSelf: msg.expediteur === 'admin' ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                    <div style={{ 
                      backgroundColor: msg.expediteur === 'admin' ? '#007bff' : '#ffffff', 
                      color: msg.expediteur === 'admin' ? 'white' : '#1a1a1a', 
                      padding: '12px 18px', 
                      borderRadius: msg.expediteur === 'admin' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                      border: msg.expediteur === 'admin' ? 'none' : '1px solid #e0e0e0',
                      fontSize: '14px',
                      lineHeight: '1.4'
                    }}>
                      {msg.contenu}
                    </div>
                    <span style={{ fontSize: '11px', color: '#999', display: 'block', marginTop: '4px', textAlign: msg.expediteur === 'admin' ? 'right' : 'left' }}>
                      {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={envoyerMessage} style={{ padding: '15px 20px', backgroundColor: 'white', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={nouveauMessage}
                onChange={(e) => setNouveauMessage(e.target.value)}
                placeholder="Écrivez un message..."
                style={{ flex: 1, padding: '15px', borderRadius: '25px', border: '1px solid #ddd', backgroundColor: '#f1f3f4', outline: 'none', fontSize: '14px' }}
              />
              <button type="submit" style={{ padding: '0 25px', borderRadius: '25px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                Envoyer
              </button>
            </form>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#aaa' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p style={{ marginTop: '20px', fontSize: '18px', fontWeight: '500' }}>Sélectionnez une discussion</p>
          </div>
        )}
      </div>

      {/* 3. COLONNE DROITE : INFOS CLIENT */}
      {activeConv && (
        <div style={{ width: '340px', backgroundColor: '#ffffff', borderLeft: '1px solid #e0e0e0', padding: '20px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 20px 0', color: '#1a1a1a' }}>Détails du client</h3>
          
          {clientInfos ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#e6f2ff', color: '#007bff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                  {clientInfos.user.prenom?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px' }}>{clientInfos.user.prenom}</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{clientInfos.user.email}</p>
                </div>
              </div>

              <h4 style={{ fontSize: '14px', fontWeight: '600', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px', color: '#333' }}>
                Historique ({clientInfos.commandes.length})
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {clientInfos.commandes.length === 0 ? (
                  <p style={{ color: '#888', fontSize: '13px' }}>Aucune transaction.</p>
                ) : (
                  clientInfos.commandes.map((cmd) => (
                    <div key={cmd.id} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                      
                      {/* En-tête : Type et Statut */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
                          {cmd.type === 'achat' ? '🛒 Achat' : '💰 Vente'} - {cmd.crypto} ({cmd.reseau})
                        </span>
                        {getStatutBadge(cmd.statut)}
                      </div>

                      {/* Montant */}
                      {cmd.montant_fcfa && (
                        <div style={{ fontSize: '15px', color: '#007bff', fontWeight: 'bold', marginBottom: '10px' }}>
                          {Number(cmd.montant_fcfa).toLocaleString('fr-FR')} FCFA
                        </div>
                      )}

                      {/* Coordonnées Mobile Money */}
                      <div style={{ fontSize: '12px', color: '#444', backgroundColor: '#f9f9f9', padding: '8px', borderRadius: '6px', marginBottom: '10px' }}>
                        <strong>📱 Mobile Money :</strong> {cmd.operateur} <br />
                        <strong>Numéro :</strong> {cmd.indicatif} {cmd.numero}
                      </div>

                      {/* Adresses (Reception pour Achat, Depot pour Vente) */}
                      <div style={{ fontSize: '12px', color: '#444', marginBottom: '10px' }}>
                        {cmd.type === 'achat' && cmd.adresse_reception && (
                          <div style={{ wordBreak: 'break-all' }}>
                            <strong>📍 Adresse de réception :</strong> <br />
                            <span style={{ fontFamily: 'monospace', backgroundColor: '#eee', padding: '2px 4px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                              {cmd.adresse_reception}
                            </span>
                          </div>
                        )}
                        {cmd.type === 'vente' && cmd.adresse_depot && (
                          <div style={{ wordBreak: 'break-all' }}>
                            <strong>📥 Adresse de dépôt :</strong> <br />
                            <span style={{ fontFamily: 'monospace', backgroundColor: '#eee', padding: '2px 4px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                              {cmd.adresse_depot}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pied de carte : Référence et Date */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', borderTop: '1px solid #eee', paddingTop: '8px', marginTop: '8px' }}>
                        <span>Réf: {cmd.reference}</span>
                        <span>{new Date(cmd.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <p style={{ color: '#888', fontSize: '14px' }}>Chargement des informations...</p>
          )}
        </div>
      )}
      
    </div>
  );
}
