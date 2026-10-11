// app/admin/commandes/page.js
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const STATUTS = [
  { code: 'en_attente', label: 'En attente' },
  { code: 'paiement_recu', label: 'Paiement reçu' },
  { code: 'en_cours', label: 'En cours' },
  { code: 'termine', label: 'Terminé' },
  { code: 'annule', label: 'Annulé' },
];

function libelleStatut(code) {
  return STATUTS.find((s) => s.code === code)?.label || code;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatFcfa(n) {
  return n ? `${Number(n).toLocaleString('fr-FR')} F` : '—';
}

export default function AdminCommandes() {
  const router = useRouter();
  const [commandes, setCommandes] = useState([]);
  const [total, setTotal] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [statut, setStatut] = useState('tous');
  const [type, setType] = useState('tous');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [selection, setSelection] = useState(null);
  const [noteEnCours, setNoteEnCours] = useState('');
  const pageSize = 30;

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur('');
    try {
      const params = new URLSearchParams({ statut, type, q, page, pageSize });
      const r = await fetch(`/api/admin/commandes?${params}`);
      if (r.status === 401) { router.replace('/admin/login'); return; }
      const data = await r.json();
      if (!r.ok) { setErreur(data.erreur || 'Erreur.'); return; }
      setCommandes(data.commandes);
      setTotal(data.total);
    } catch {
      setErreur('Connexion impossible.');
    } finally {
      setChargement(false);
    }
  }, [statut, type, q, page, router]);

  useEffect(() => { charger(); }, [charger]);

  async function changerStatut(id, nouveauStatut) {
    const r = await fetch('/api/admin/commandes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, statut: nouveauStatut }),
    });
    if (!r.ok) { alert('Erreur lors du changement de statut.'); return; }
    charger();
    if (selection?.id === id) setSelection((s) => ({ ...s, statut: nouveauStatut }));
  }

  async function enregistrerNote() {
    if (!selection) return;
    const r = await fetch(`/api/admin/commandes/${selection.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note_admin: noteEnCours }),
    });
    if (!r.ok) { alert('Erreur.'); return; }
    setSelection((s) => ({ ...s, note_admin: noteEnCours }));
    alert('Note enregistrée.');
  }

  async function deconnexion() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <section className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Commandes</h1>
        <button className="bouton" onClick={deconnexion}>Déconnexion</button>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <select value={statut} onChange={(e) => { setStatut(e.target.value); setPage(1); }}>
          <option value="tous">Tous les statuts</option>
          {STATUTS.map((s) => <option key={s.code} value={s.code}>{s.label}</option>)}
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>
          <option value="tous">Tous les types</option>
          <option value="achat">Achats</option>
          <option value="vente">Ventes</option>
        </select>
        <input
          placeholder="Référence, prénom, numéro…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          style={{ flex: 1, minWidth: 200 }}
        />
      </div>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      {chargement && <p>Chargement…</p>}

      {!chargement && commandes.length === 0 && <p>Aucune commande.</p>}

      {!chargement && commandes.length > 0 && (
        <>
          <p style={{ color: '#666', fontSize: 14 }}>{total} commande(s) · page {page}/{totalPages}</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: 8 }}>Réf.</th>
                  <th style={{ padding: 8 }}>Type</th>
                  <th style={{ padding: 8 }}>Crypto</th>
                  <th style={{ padding: 8 }}>Montant</th>
                  <th style={{ padding: 8 }}>Client</th>
                  <th style={{ padding: 8 }}>Statut</th>
                  <th style={{ padding: 8 }}>Date</th>
                  <th style={{ padding: 8 }}></th>
                </tr>
              </thead>
              <tbody>
                {commandes.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 8, fontFamily: 'monospace' }}>{c.reference}</td>
                    <td style={{ padding: 8 }}>{c.type}</td>
                    <td style={{ padding: 8 }}>{c.crypto} · {c.reseau}</td>
                    <td style={{ padding: 8 }}>{formatFcfa(c.montant_fcfa)}</td>
                    <td style={{ padding: 8 }}>{c.prenom}<br /><small>{c.indicatif} {c.numero}</small></td>
                    <td style={{ padding: 8 }}>
                      <select
                        value={c.statut}
                        onChange={(e) => changerStatut(c.id, e.target.value)}
                        style={{ fontSize: 13 }}
                      >
                        {STATUTS.map((s) => <option key={s.code} value={s.code}>{s.label}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: 8, whiteSpace: 'nowrap' }}>{formatDate(c.created_at)}</td>
                    <td style={{ padding: 8 }}>
                      <button
                        className="bouton"
                        style={{ fontSize: 12, padding: '4px 8px' }}
                        onClick={() => { setSelection(c); setNoteEnCours(c.note_admin || ''); }}
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
              <button className="bouton" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Précédent</button>
              <span style={{ alignSelf: 'center' }}>Page {page} / {totalPages}</span>
              <button className="bouton" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Suivant →</button>
            </div>
          )}
        </>
      )}

      {/* Panneau détails */}
      {selection && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            padding: 20, zIndex: 1000,
          }}
          onClick={() => setSelection(null)}
        >
          <div
            style={{
              background: 'white', borderRadius: 12, padding: 24,
              maxWidth: 600, width: '100%', maxHeight: '90vh', overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>{selection.reference}</h2>
            <p><strong>Type :</strong> {selection.type}</p>
            <p><strong>Crypto :</strong> {selection.crypto} · {selection.reseau}</p>
            <p><strong>Montant :</strong> {formatFcfa(selection.montant_fcfa)}</p>
            <p><strong>Client :</strong> {selection.prenom} · {selection.indicatif} {selection.numero} · {selection.operateur}</p>
            {selection.adresse_reception && <p><strong>Adresse réception :</strong> <code>{selection.adresse_reception}</code></p>}
            {selection.adresse_depot && <p><strong>Adresse dépôt :</strong> <code>{selection.adresse_depot}</code></p>}
            <p><strong>Statut :</strong> {libelleStatut(selection.statut)}</p>
            <p><strong>Créée :</strong> {formatDate(selection.created_at)}</p>

            <hr style={{ margin: '16px 0' }} />

            <label style={{ display: 'block', marginBottom: 4 }}>
              <strong>Note admin</strong>
            </label>
            <textarea
              value={noteEnCours}
              onChange={(e) => setNoteEnCours(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: 8, fontFamily: 'inherit' }}
              placeholder="Note interne (non visible par le client)…"
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
              <button className="bouton" onClick={() => setSelection(null)}>Fermer</button>
              <button className="bouton plein" onClick={enregistrerNote}>Enregistrer la note</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
