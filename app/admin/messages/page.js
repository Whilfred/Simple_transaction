'use client';

import { useState, useEffect, useRef } from 'react';

// Espace pris par le header du haut + la barre du bas. À ajuster si la saisie est trop haute ou trop basse.
const DECALAGE = 142;

const VERT = '#00a884';
const VERT_CLAIR = '#25D366';
const DEGRADE = `linear-gradient(135deg, ${VERT_CLAIR} 0%, ${VERT} 100%)`;

const STATUTS = {
  en_attente: { bg: '#fff3cd', color: '#856404' },
  paiement_recu: { bg: '#cce5ff', color: '#004085' },
  en_cours: { bg: '#d1ecf1', color: '#0c5460' },
  termine: { bg: '#d4edda', color: '#155724' },
  annule: { bg: '#f8d7da', color: '#721c24' },
};

const css = {
  page: {
    position: 'relative',
    display: 'flex',
    height: `calc(100dvh - ${DECALAGE}px)`,
    minHeight: '360px',
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#111b21',
  },

  /* ---------- Liste ---------- */
  colListe: (mobile) => ({
    width: mobile ? '100%' : '330px',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRight: mobile ? 'none' : '1px solid #e3e8e5',
    minHeight: 0,
  }),
  listeEntete: {
    padding: '14px 16px 12px',
    borderBottom: '1px solid #eef1ef',
    flexShrink: 0,
  },
  listeTitre: {
    margin: '0 0 12px 0',
    fontSize: '18px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  compteur: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#667781',
    backgroundColor: '#f0f2f5',
    padding: '2px 8px',
    borderRadius: '999px',
  },
  recherche: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '10px 14px',
    borderRadius: '999px',
    border: '1px solid #e3e8e5',
    backgroundColor: '#f6f8f7',
    outline: 'none',
    fontSize: '16px', // 16px évite le zoom automatique sur iPhone
    color: '#111b21',
    marginBottom: '10px',
  },
  filtres: { display: 'flex', gap: '8px' },
  filtre: (actif) => ({
    flex: 1,
    padding: '8px',
    borderRadius: '999px',
    border: actif ? 'none' : '1px solid #e3e8e5',
    background: actif ? DEGRADE : '#ffffff',
    color: actif ? '#ffffff' : '#54656f',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 600,
  }),
  listeCorps: { flex: 1, minHeight: 0, overflowY: 'auto' },
  vide: {
    textAlign: 'center',
    color: '#8696a0',
    marginTop: '30px',
    fontSize: '14px',
  },
  conv: (actif) => ({
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #f1f4f2',
    cursor: 'pointer',
    backgroundColor: actif ? '#e7f8f1' : '#ffffff',
    borderLeft: actif ? `3px solid ${VERT}` : '3px solid transparent',
  }),
  avatar: (taille = 44) => ({
    width: `${taille}px`,
    height: `${taille}px`,
    borderRadius: '50%',
    background: DEGRADE,
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: `${Math.round(taille * 0.4)}px`,
    flexShrink: 0,
  }),
  convCorps: { flex: 1, minWidth: 0 },
  convLigne: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  convNom: {
    fontSize: '15.5px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  convRef: {
    fontSize: '12px',
    color: '#8696a0',
    margin: '1px 0 2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  convExtrait: {
    fontSize: '13.5px',
    color: '#667781',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  badgeNonLus: {
    minWidth: '20px',
    height: '20px',
    boxSizing: 'border-box',
    padding: '0 6px',
    borderRadius: '999px',
    background: DEGRADE,
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  /* ---------- Chat ---------- */
  colChat: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#eef2f0',
    backgroundImage: 'radial-gradient(rgba(0,168,132,0.07) 1px, transparent 1px)',
    backgroundSize: '18px 18px',
  },
  chatEntete: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    flexShrink: 0,
    zIndex: 5,
  },
  boutonIcone: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#f0f2f5',
    color: '#54656f',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  chatTitre: { margin: 0, fontSize: '16px', fontWeight: 600 },
  chatSousTitre: {
    margin: '1px 0 0 0',
    fontSize: '12.5px',
    color: VERT,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  zoneMessages: {
    flex: 1,
    minHeight: 0, // indispensable pour que le scroll reste dans la zone
    overflowY: 'auto',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  separateurDate: { textAlign: 'center', margin: '10px 0 8px' },
  badgeDate: {
    backgroundColor: '#ffffff',
    color: '#54656f',
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '999px',
    fontWeight: 500,
    textTransform: 'capitalize',
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  },
  bulleWrapper: (admin) => ({
    alignSelf: admin ? 'flex-end' : 'flex-start',
    maxWidth: '80%',
  }),
  bulle: (admin) => ({
    backgroundColor: admin ? '#d9fdd3' : '#ffffff',
    color: '#111b21',
    padding: '7px 12px 5px',
    borderRadius: '16px',
    borderBottomRightRadius: admin ? '4px' : '16px',
    borderBottomLeftRadius: admin ? '16px' : '4px',
    boxShadow: '0 1px 1px rgba(0,0,0,0.10)',
    fontSize: '15px',
    lineHeight: '1.4',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  }),
  heure: {
    fontSize: '11px',
    color: '#667781',
    textAlign: 'right',
    marginTop: '2px',
    marginLeft: '12px',
  },
  zoneSaisie: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: '#f0f2f5',
    flexShrink: 0, // la saisie ne se fait jamais écraser
  },
  input: {
    flex: 1,
    minWidth: 0,
    boxSizing: 'border-box',
    padding: '12px 18px',
    borderRadius: '999px',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    color: '#111b21',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
  },
  boutonEnvoyer: (actif) => ({
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    border: 'none',
    background: DEGRADE,
    color: '#ffffff',
    cursor: actif ? 'pointer' : 'default',
    opacity: actif ? 1 : 0.55,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 2px 6px rgba(0,168,132,0.35)',
  }),
  placeholder: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8696a0',
    padding: '20px',
    textAlign: 'center',
  },

  /* ---------- Détails client ---------- */
  colInfos: (overlay) => ({
    width: overlay ? 'min(340px, 100%)' : '330px',
    flexShrink: 0,
    backgroundColor: '#ffffff',
    borderLeft: '1px solid #e3e8e5',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    ...(overlay
      ? {
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 20,
          boxShadow: '-6px 0 24px rgba(0,0,0,0.15)',
        }
      : {}),
  }),
  infosEntete: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: '1px solid #eef1ef',
    flexShrink: 0,
  },
  infosCorps: { flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px' },
  carteClient: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '16px',
    backgroundColor: '#f6f8f7',
    borderRadius: '14px',
    marginBottom: '18px',
    textAlign: 'center',
  },
  sousTitre: {
    margin: '0 0 10px 0',
    fontSize: '13px',
    fontWeight: 700,
    color: '#667781',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  carteCommande: {
    padding: '12px',
    border: '1px solid #e8ecea',
    borderRadius: '12px',
    fontSize: '13px',
    backgroundColor: '#ffffff',
  },
  adresse: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#54656f',
    backgroundColor: '#f0f2f5',
    padding: '6px 8px',
    borderRadius: '8px',
  },
};

function formatJour(dateStr) {
  const date = new Date(dateStr);
  const hier = new Date();
  hier.setDate(hier.getDate() - 1);
  if (date.toDateString() === new Date().toDateString()) return "Aujourd'hui";
  if (date.toDateString() === hier.toDateString()) return 'Hier';
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function formatHeure(dateStr) {
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function initiale(nom) {
  return (nom || 'Client').trim().charAt(0).toUpperCase();
}

function BadgeStatut({ statut }) {
  const s = STATUTS[statut] || { bg: '#eeeeee', color: '#333333' };
  return (
    <span
      style={{
        backgroundColor: s.bg,
        color: s.color,
        padding: '3px 8px',
        borderRadius: '999px',
        fontSize: '10.5px',
        fontWeight: 700,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {String(statut || '—').replace(/_/g, ' ')}
    </span>
  );
}

export default function AdminMessages() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [chargementMessages, setChargementMessages] = useState(false);
  const [clientInfos, setClientInfos] = useState(null);
  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState('tous');
  const [afficherInfos, setAfficherInfos] = useState(false);
  const [largeur, setLargeur] = useState(1280);

  const messagesEndRef = useRef(null);
  const convActiveId = useRef(null);

  const isMobile = largeur < 768;
  const isLarge = largeur >= 1100; // panneau client fixe à droite

  // Taille de l'écran
  useEffect(() => {
    const maj = () => setLargeur(window.innerWidth);
    maj();
    window.addEventListener('resize', maj);
    return () => window.removeEventListener('resize', maj);
  }, []);

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

  // silencieux = rafraîchissement automatique, sans message "Chargement..."
  const chargerMessages = async (convId, silencieux = false) => {
    if (!silencieux) setChargementMessages(true);
    try {
      const res = await fetch(`/api/admin/messages/${convId}`);
      const data = await res.json();
      // On ignore la réponse si l'admin a changé de conversation entre-temps
      if (data.messages && convActiveId.current === convId) {
        setMessages(data.messages);
        if (!silencieux) setTimeout(chargerConversations, 200);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (!silencieux) setChargementMessages(false);
    }
  };

  // Rafraîchit la conversation ouverte toutes les 5 s
  useEffect(() => {
    if (!activeConv) return;
    const id = activeConv.conversation_id;
    const interval = setInterval(() => chargerMessages(id, true), 5000);
    return () => clearInterval(interval);
  }, [activeConv]);

  // Descend en bas quand un message arrive ou qu'on change de conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeConv]);

  const handleClickConversation = async (conv) => {
    convActiveId.current = conv.conversation_id;
    setActiveConv(conv);
    setClientInfos(null);
    setAfficherInfos(false);
    setMessages([]);
    chargerMessages(conv.conversation_id);

    if (conv.user_id) {
      try {
        const res = await fetch(`/api/admin/users/${conv.user_id}`);
        const data = await res.json();
        if (data.user && convActiveId.current === conv.conversation_id) setClientInfos(data);
      } catch (error) {
        console.error('Erreur chargement client', error);
      }
    }
  };

  const retourListe = () => {
    convActiveId.current = null;
    setActiveConv(null);
    setAfficherInfos(false);
  };

  const envoyerMessage = async (e) => {
    e.preventDefault();
    if (!nouveauMessage.trim() || !activeConv) return;

    const contenu = nouveauMessage.trim();
    setNouveauMessage('');

    // Affichage immédiat
    setMessages((prev) => [
      ...prev,
      { id: `tmp-${Date.now()}`, expediteur: 'admin', contenu, created_at: new Date().toISOString() },
    ]);

    try {
      await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId: activeConv.conversation_id, contenu }),
      });
      chargerMessages(activeConv.conversation_id, true);
      chargerConversations();
    } catch (error) {
      console.error(error);
    }
  };

  const conversationsFiltrees = conversations.filter((conv) => {
    const q = recherche.toLowerCase();
    const matchTexte =
      (conv.prenom || '').toLowerCase().includes(q) ||
      (conv.dernier_message || '').toLowerCase().includes(q);
    const matchFiltre = filtre === 'tous' ? true : conv.non_lus > 0;
    return matchTexte && matchFiltre;
  });

  const totalNonLus = conversations.filter((c) => c.non_lus > 0).length;

  // Panneau "Détails du client"
  const panneauInfos = (overlay) => {
    if (!clientInfos?.user) return null;
    const commandes = clientInfos.commandes || [];
    return (
      <aside style={css.colInfos(overlay)}>
        <div style={css.infosEntete}>
          <h3 style={{ margin: 0, fontSize: '16px' }}>Détails du client</h3>
          {overlay && (
            <button
              type="button"
              style={css.boutonIcone}
              onClick={() => setAfficherInfos(false)}
              aria-label="Fermer"
            >
              ✕
            </button>
          )}
        </div>

        <div style={css.infosCorps}>
          <div style={css.carteClient}>
            <div style={css.avatar(56)}>{initiale(clientInfos.user.prenom)}</div>
            <strong style={{ fontSize: '16px', marginTop: '6px' }}>
              {clientInfos.user.prenom || 'Client'}
            </strong>
            <span style={{ fontSize: '13px', color: '#667781', wordBreak: 'break-all' }}>
              {clientInfos.user.email}
            </span>
          </div>

          <h4 style={css.sousTitre}>Commandes ({commandes.length})</h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {commandes.length === 0 ? (
              <p style={{ color: '#8696a0', fontSize: '13px', margin: 0 }}>Aucune commande.</p>
            ) : (
              commandes.map((cmd) => (
                <div key={cmd.id} style={css.carteCommande}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 700,
                    }}
                  >
                    <span>
                      {String(cmd.type || '').toUpperCase()} · {cmd.crypto}
                    </span>
                    <BadgeStatut statut={cmd.statut} />
                  </div>

                  <div style={{ marginTop: '6px', color: VERT, fontWeight: 700, fontSize: '15px' }}>
                    {cmd.montant_fcfa ? `${Number(cmd.montant_fcfa).toLocaleString('fr-FR')} FCFA` : '—'}
                  </div>

                  <div style={css.adresse}>
                    {cmd.type === 'achat' ? 'Reçoit : ' : 'Dépose : '}
                    <span style={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                      {(cmd.type === 'achat' ? cmd.adresse_reception : cmd.adresse_depot) || '—'}
                    </span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#8696a0', marginTop: '8px' }}>
                    Réf : {cmd.reference}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>
    );
  };

  let dernierJour = null;

  return (
    <div style={css.page}>
      {/* 1. LISTE DES DISCUSSIONS (masquée sur mobile quand une conversation est ouverte) */}
      {(!isMobile || !activeConv) && (
        <div style={css.colListe(isMobile)}>
          <div style={css.listeEntete}>
            <h2 style={css.listeTitre}>
              Discussions
              <span style={css.compteur}>{conversationsFiltrees.length}</span>
            </h2>

            <input
              type="text"
              placeholder="Rechercher un nom, un message..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              style={css.recherche}
            />

            <div style={css.filtres}>
              <button type="button" onClick={() => setFiltre('tous')} style={css.filtre(filtre === 'tous')}>
                Tous
              </button>
              <button type="button" onClick={() => setFiltre('non_lus')} style={css.filtre(filtre === 'non_lus')}>
                Non lus{totalNonLus > 0 ? ` (${totalNonLus})` : ''}
              </button>
            </div>
          </div>

          <div style={css.listeCorps}>
            {conversationsFiltrees.length === 0 ? (
              <p style={css.vide}>Aucune discussion.</p>
            ) : (
              conversationsFiltrees.map((conv) => (
                <div
                  key={conv.conversation_id}
                  onClick={() => handleClickConversation(conv)}
                  style={css.conv(activeConv?.conversation_id === conv.conversation_id)}
                >
                  <div style={css.avatar(44)}>{initiale(conv.prenom)}</div>

                  <div style={css.convCorps}>
                    <div style={css.convLigne}>
                      <span style={css.convNom}>{conv.prenom || 'Client'}</span>
                      {conv.non_lus > 0 && <span style={css.badgeNonLus}>{conv.non_lus}</span>}
                    </div>
                    <div style={css.convRef}>
                      {conv.reference ? `${conv.reference} · ${conv.crypto}` : 'Discussion générale'}
                    </div>
                    <div style={css.convExtrait}>{conv.dernier_message || 'Aucun message'}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 2. CHAT (masqué sur mobile tant qu'aucune conversation n'est ouverte) */}
      {(!isMobile || activeConv) && (
        <div style={css.colChat}>
          {activeConv ? (
            <>
              <div style={css.chatEntete}>
                {isMobile && (
                  <button type="button" onClick={retourListe} style={css.boutonIcone} aria-label="Retour">
                    ←
                  </button>
                )}

                <div style={css.avatar(40)}>{initiale(activeConv.prenom)}</div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={css.chatTitre}>{activeConv.prenom || 'Client'}</h3>
                  <p style={css.chatSousTitre}>
                    {activeConv.reference
                      ? `Commande ${activeConv.reference} (${activeConv.type})`
                      : 'Discussion générale'}
                  </p>
                </div>

                {!isLarge && clientInfos?.user && (
                  <button
                    type="button"
                    onClick={() => setAfficherInfos(true)}
                    style={css.boutonIcone}
                    aria-label="Voir les détails du client"
                  >
                    ⓘ
                  </button>
                )}
              </div>

              <div style={css.zoneMessages}>
                {chargementMessages ? (
                  <p style={{ textAlign: 'center', color: '#8696a0' }}>Chargement...</p>
                ) : messages.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#8696a0' }}>Aucun message.</p>
                ) : (
                  messages.map((msg) => {
                    const admin = msg.expediteur === 'admin';
                    const jour = new Date(msg.created_at).toDateString();
                    const afficherSeparateur = jour !== dernierJour;
                    dernierJour = jour;

                    return (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
                        {afficherSeparateur && (
                          <div style={css.separateurDate}>
                            <span style={css.badgeDate}>{formatJour(msg.created_at)}</span>
                          </div>
                        )}
                        <div style={css.bulleWrapper(admin)}>
                          <div style={css.bulle(admin)}>
                            {msg.contenu}
                            <div style={css.heure}>{formatHeure(msg.created_at)}</div>
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
                  placeholder="Écrire un message..."
                  style={css.input}
                />
                <button
                  type="submit"
                  disabled={!nouveauMessage.trim()}
                  style={css.boutonEnvoyer(!!nouveauMessage.trim())}
                  aria-label="Envoyer"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div style={css.placeholder}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#b5c4bc"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <p style={{ marginTop: '14px', fontSize: '17px', fontWeight: 500 }}>
                Sélectionnez une discussion
              </p>
            </div>
          )}
        </div>
      )}

      {/* 3. DÉTAILS CLIENT : colonne fixe sur grand écran, panneau qui glisse par-dessus sur petit écran */}
      {activeConv && isLarge && panneauInfos(false)}
      {activeConv && !isLarge && afficherInfos && panneauInfos(true)}
    </div>
  );
}
