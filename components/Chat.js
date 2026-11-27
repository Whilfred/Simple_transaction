'use client';

import { useState, useEffect, useRef } from 'react';

const css = {
  conteneur: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100dvh - 60px)', // Prend l'espace entre le header et la barre du bas
    width: '100%',
    maxWidth: '800px', 
    margin: '0 auto',
    backgroundColor: '#efeae2',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  entete: {
    padding: '12px 16px',
    backgroundColor: '#f0f2f5',
    borderBottom: '1px solid #d1d7db',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
    zIndex: 10,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#25D366',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  enteteTitre: { margin: 0, fontSize: '16px', fontWeight: '600', color: '#111b21' },
  enteteStatut: { margin: '2px 0 0 0', fontSize: '12px', color: '#667781' },
  zoneMessages: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto', 
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    WebkitOverflowScrolling: 'touch', 
  },
  separateurDate: { textAlign: 'center', margin: '12px 0' },
  badgeDate: {
    backgroundColor: '#e1f3fb',
    color: '#54656f',
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '8px',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  bulleWrapper: (isUser) => ({
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    maxWidth: '85%',
  }),
  bulle: (isUser) => ({
    backgroundColor: isUser ? '#d9fdd3' : '#ffffff',
    color: '#111b21',
    padding: '8px 12px',
    borderRadius: '8px',
    borderTopRightRadius: isUser ? '0' : '8px',
    borderTopLeftRadius: isUser ? '8px' : '0',
    boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
    fontSize: '15px',
    lineHeight: '1.4',
    wordBreak: 'break-word',
  }),
  heure: { fontSize: '11px', color: '#667781', textAlign: 'right', marginTop: '4px', marginLeft: '10px' },
  
  // 🔥 SEULE MODIFICATION ICI : On s'assure que la zone de saisie est bien visible
  zoneSaisie: {
    padding: '10px 12px',
    backgroundColor: '#f0f2f5',
    borderTop: '1px solid #d1d7db',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexShrink: 0, 
    paddingBottom: '12px', 
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '24px',
    border: 'none',
    outline: 'none',
    fontSize: '16px', 
    backgroundColor: 'white',
    minWidth: 0, 
  },
  boutonEnvoyer: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    backgroundColor: '#00a884',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  }
};

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [chargement, setChargement] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const chargerMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerMessages();
    const interval = setInterval(chargerMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!chargement) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chargement]);

  const envoyerMessage = async (e) => {
    e.preventDefault();
    if (!nouveauMessage.trim()) return;

    const contenu = nouveauMessage;
    setNouveauMessage('');

    setMessages((prev) => [...prev, { id: Date.now(), expediteur: 'user', contenu, created_at: new Date().toISOString() }]);

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

  const formatDateSeparator = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return "Hier";
    
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  if (chargement) {
    return (
      <div style={{ display: 'flex', height: '100dvh', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#888' }}>Chargement de la discussion...</p>
      </div>
    );
  }

  let dernierJour = null;

  return (
    <div style={css.conteneur}>
      
      <div style={css.entete}>
        <div style={css.avatar}>S</div>
        <div>
          <h3 style={css.enteteTitre}>Support ExCrypt</h3>
          <p style={css.enteteStatut}>En ligne</p>
        </div>
      </div>

      <div style={css.zoneMessages}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
            Aucun message. Écrivez-nous pour commencer !
          </p>
        ) : (
          messages.map((msg) => {
            const jourDuMessage = new Date(msg.created_at).toDateString();
            const afficherSeparateur = jourDuMessage !== dernierJour;
            dernierJour = jourDuMessage;

            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                {afficherSeparateur && (
                  <div style={css.separateurDate}>
                    <span style={css.badgeDate}>
                      {formatDateSeparator(msg.created_at)}
                    </span>
                  </div>
                )}

                <div style={css.bulleWrapper(msg.expediteur === 'user')}>
                  <div style={css.bulle(msg.expediteur === 'user')}>
                    {msg.contenu}
                    <div style={css.heure}>
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

      <form onSubmit={envoyerMessage} style={css.zoneSaisie}>
        <input
          type="text"
          value={nouveauMessage}
          onChange={(e) => setNouveauMessage(e.target.value)}
          placeholder="Tapez un message"
          style={css.input}
        />
        <button type="submit" style={css.boutonEnvoyer}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </form>
    </div>
  );
}
