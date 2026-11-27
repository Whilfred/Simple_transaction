'use client';

import { useState, useEffect, useRef } from 'react';

// Styles en objet pour éviter les bugs de Next.js
// Styles en objet pour éviter les bugs de Next.js
const css = {
  conteneur: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100dvh - 142px)', // header (~68px) + barre du bas (~74px)
    width: '100%',
    margin: 0,
    backgroundColor: '#eef2f0',
    backgroundImage:
      'radial-gradient(rgba(0,168,132,0.07) 1px, transparent 1px)',
    backgroundSize: '18px 18px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  entete: {
    padding: '10px 18px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
    zIndex: 10,
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #25D366 0%, #00a884 100%)',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: '600',
    flexShrink: 0,
  },
  enteteTitre: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#111b21',
  },
  enteteStatut: {
    margin: '1px 0 0 0',
    fontSize: '13px',
    color: '#00a884',
    fontWeight: '500',
  },
  zoneMessages: {
    flex: 1,
    minHeight: 0, // indispensable pour que le scroll reste dans la zone
    padding: '12px 14px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  separateurDate: {
    textAlign: 'center',
    margin: '10px 0 8px',
  },
  badgeDate: {
    backgroundColor: 'rgba(84, 101, 111, 0.55)',
    color: '#ffffff',
    fontSize: '13px',
    padding: '3px 12px',
    borderRadius: '999px',
    fontWeight: '500',
    textTransform: 'capitalize',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
  },
  bulleWrapper: (isUser) => ({
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    maxWidth: '78%',
  }),
  bulle: (isUser) => ({
    backgroundColor: isUser ? '#d9fdd3' : '#ffffff',
    color: '#111b21',
    padding: '7px 12px 5px',
    borderRadius: '18px',
    borderBottomRightRadius: isUser ? '5px' : '18px', // petite "queue" façon Telegram
    borderBottomLeftRadius: isUser ? '18px' : '5px',
    boxShadow: '0 1px 1px rgba(0,0,0,0.10)',
    fontSize: '15.5px',
    lineHeight: '1.35',
    wordBreak: 'break-word',
  }),
  heure: {
    fontSize: '11.5px',
    color: '#667781',
    textAlign: 'right',
    marginTop: '1px',
    marginLeft: '14px',
  },
  zoneSaisie: {
    padding: '8px 12px 10px',
    backgroundColor: 'transparent', // l'input flotte sur le fond
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexShrink: 0, // la saisie ne se fait jamais écraser
  },
  input: {
    flex: 1,
    padding: '13px 18px',
    borderRadius: '22px',
    border: 'none',
    outline: 'none',
    fontSize: '15.5px',
    color: '#111b21',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    minWidth: 0,
  },
  boutonEnvoyer: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #25D366 0%, #00a884 100%)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 6px rgba(0,168,132,0.35)',
  },
};

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

    // Affichage immédiat
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
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#888' }}>Chargement de la discussion...</p>
      </div>
    );
  }

  let dernierJour = null;

  return (
    <div style={css.conteneur}>
      
      {/* En-tête */}
      <div style={css.entete}>
        <div style={css.avatar}>S</div>
        <div>
          <h3 style={css.enteteTitre}>Support ExCrypt</h3>
          <p style={css.enteteStatut}>En ligne</p>
        </div>
      </div>

      {/* Messages */}
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
                
                {/* Date */}
                {afficherSeparateur && (
                  <div style={css.separateurDate}>
                    <span style={css.badgeDate}>
                      {formatDateSeparator(msg.created_at)}
                    </span>
                  </div>
                )}

                {/* Bulle */}
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

      {/* Saisie */}
      <form onSubmit={envoyerMessage} style={css.zoneSaisie}>
        <input
          type="text"
          value={nouveauMessage}
          onChange={(e) => setNouveauMessage(e.target.value)}
          placeholder="Tapez un message..."
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
