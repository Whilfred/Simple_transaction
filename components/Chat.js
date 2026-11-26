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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  if (chargement) return <p>Chargement...</p>;

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', display: 'flex', flexDirection: 'column', height: '400px', backgroundColor: '#f9f9f9' }}>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>Aucun message. Écrivez-nous pour commencer !</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={{ alignSelf: msg.expediteur === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
              <div style={{ backgroundColor: msg.expediteur === 'user' ? '#007bff' : '#e2e2e2', color: msg.expediteur === 'user' ? 'white' : 'black', padding: '8px 12px', borderRadius: '12px' }}>
                {msg.contenu}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={envoyerMessage} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={nouveauMessage}
          onChange={(e) => setNouveauMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '10px 20px', borderRadius: '20px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
          Envoyer
        </button>
      </form>
    </div>
  );
}
