'use client';

import { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [chargement, setChargement] = useState(true);
  const messagesEndRef = useRef(null);

  const chargerMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerMessages();
    const interval = setInterval(chargerMessages, 5000); // Rafraîchir toutes les 5s
    return () => clearInterval(interval);
  }, []);

  const envoyerMessage = async (e) => {
    e.preventDefault();
    if (!nouveauMessage.trim()) return;

    const contenu = nouveauMessage;
    setNouveauMessage('');

    // Optimistic UI (Affichage immédiat)
    setMessages((prev) => [...prev, { id: Date.now(), expediteur: 'user', contenu, created_at: new Date().toISOString() }]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenu }),
      });
      chargerMessages();
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour formater les dates (Aujourd'hui, Hier, etc.)
  const formatDateSeparator = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return "Hier";
    
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  if (chargement) return <div style={{ textAlign: 'center', padding: '20px' }}>Chargement de la discussion...</div>;

  // On regroupe les messages par jour pour afficher les séparateurs
  let dernierJour = null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#efeae2' }}>
      
      {/* En-tête du chat (optionnel, style WhatsApp) */}
      <div style={{ padding: '15px 20px', backgroundColor: '#f0f2f5', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#25D366', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '18px', fontWeight: 'bold' }}>
          S
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#111' }}>Support ExCrypt</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#667781' }}>En ligne</p>
        </div>
      </div>

      {/* Zone des messages */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>Aucun message. Écrivez-nous pour commencer !</p>
        ) : (
          messages.map((msg) => {
            const jourDuMessage = new Date(msg.created_at).toDateString();
            const afficherSeparateur = jourDuMessage !== dernierJour;
            dernierJour = jourDuMessage;

            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                
                {/* Séparateur de date */}
                {afficherSeparateur && (
                  <div style={{ textAlign: 'center', margin: '15px 0' }}>
                    <span style={{ backgroundColor: '#e1f3fb', color: '#54656f', fontSize: '12px', padding: '5px 12px', borderRadius: '8px', fontWeight: '500', textTransform: 'capitalize' }}>
                      {formatDateSeparator(msg.created_at)}
                    </span>
                  </div>
                )}

                {/* Bulle de message */}
                <div style={{ alignSelf: msg.expediteur === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{ 
                    backgroundColor: msg.expediteur === 'user' ? '#d9fdd3' : '#ffffff', 
                    color: '#111', 
                    padding: '8px 12px', 
                    borderRadius: '8px',
                    borderTopRightRadius: msg.expediteur === 'user' ? '0' : '8px',
                    borderTopLeftRadius: msg.expediteur === 'admin' ? '0' : '8px',
                    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                    position: 'relative',
                    fontSize: '15px',
                    lineHeight: '1.4'
                  }}>
                    {msg.contenu}
                    
                    {/* Heure du message */}
                    <div style={{ fontSize: '11px', color: '#667781', textAlign: 'right', marginTop: '4px', marginLeft: '10px' }}>
                      {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <form onSubmit={envoyerMessage} style={{ padding: '10px 20px', backgroundColor: '#f0f2f5', borderTop: '1px solid #ddd', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={nouveauMessage}
          onChange={(e) => setNouveauMessage(e.target.value)}
          placeholder="Tapez un message"
          style={{ flex: 1, padding: '12px 20px', borderRadius: '25px', border: 'none', outline: 'none', fontSize: '15px', backgroundColor: 'white' }}
        />
        <button type="submit" style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#00a884', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}
