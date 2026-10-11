// app/admin/commandes/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUTS = [
  { code: 'en_attente', label: 'En attente' },
  { code: 'paiement_recu', label: 'Paiement reçu' },
  { code: 'en_cours', label: 'En cours' },
  { code: 'termine', label: 'Terminé' },
  { code: 'annule', label: 'Annulé' },
];

function formatDate(iso) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminCommandes() {
  const router = useRouter();
  const [commandes, setCommandes] = useState([]);
  const [total, setTotal] = useState(0);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [statut, setStatut] = useState('tous');

  async function charger() {
    setChargement(true);
    setErreur('');
    try {
      const params = new URLSearchParams({ statut, type: 'tous', page: 1, pageSize: 50 });
      const r = await fetch(`/api/admin/commandes?${params}`);
      if (r.status === 401) {
        router.replace('/admin/login');
        return;
      }
      const data = await r.json();
      if (!r.ok) {
        setErreur(data.erreur || 'Erreur.');
        return;
      }
      setCommandes(data.commandes);
      setTotal(data.total);
    } catch {
      setErreur('Connexion impossible.');
    } finally {
      setChargement(false);
    }
  }

  useEffect(() => {
    charger();
  }, [statut]);

  async function changerStatut(id, nouveauStatut) {
    const r = await fetch('/api/admin/commandes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, statut: nouveauStatut }),
    });
    if (!r.ok) {
      alert('Erreur lors du changement de statut.');
      return;
    }
    charger();
  }

  async function deconnexion() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  return (
    <section className="page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Commandes</h1>
        <button className="bouton" onClick={deconnexion}>
          Déconnexion
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <select value={statut} onChange={(e) => setStatut(e.target.value)}>
          <option value="tous">Tous les statuts</option>
          {STATUTS.map((s) => (
            <option key={s.code} value={s.code}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {erreur && <p style={{ color: 'red' }}>{erreur}</p>}
      {chargement && <p>Chargement…</p>}

      {!chargement && commandes.length === 0 && <p>Aucune commande.</p>}

      {!chargement && commandes.length > 0 && (
        <>
          <p style={{ color: '#666', fontSize: 14 }}>{total} commande(s)</p>
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
                </tr>
              </thead>
              <tbody>
                {commandes.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 8, fontFamily: 'monospace' }}>{c.reference}</td>
                    <td style={{ padding: 8 }}>{c.type}</td>
                    <td style={{ padding: 8 }}>
                      {c.crypto} · {c.reseau}
                    </td>
                    <td style={{ padding: 8 }}>
                      {c.montant_fcfa
                        ? `${Number(c.montant_fcfa).toLocaleString('fr-FR')} F`
                        : '—'}
                    </td>
                    <td style={{ padding: 8 }}>
                      {c.prenom}
                      <br />
                      <small>
                        {c.indicatif} {c.numero}
                      </small>
                    </td>
                    <td style={{ padding: 8 }}>
                      <select
                        value={c.statut}
                        onChange={(e) => changerStatut(c.id, e.target.value)}
                        style={{ fontSize: 13 }}
                      >
                        {STATUTS.map((s) => (
                          <option key={s.code} value={s.code}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: 8, whiteSpace: 'nowrap' }}>
                      {formatDate(c.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
