'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lire, ecrire } from '@/lib/storage';
import { libelleStatut } from '@/lib/statuts';

export default function Dashboard() {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const locales = lire('commandes', []);
    setCommandes(locales);
    if (locales.length === 0) return;

    // On demande au serveur le statut à jour de chaque opération
    fetch('/api/commandes/statuts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ references: locales.map((c) => c.id) }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data || !data.commandes) return;
        const parRef = new Map(data.commandes.map((c) => [c.reference, c.statut]));
        const maj = locales.map((c) => (parRef.has(c.id) ? { ...c, statut: parRef.get(c.id) } : c));
        setCommandes(maj);
        ecrire('commandes', maj);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="page">
      <h1>Mes opérations</h1>

      {commandes.length === 0 ? (
        <div className="vide">
          <p>Vous n'avez encore fait aucune opération.</p>
          <Link href="/accueil" className="bouton plein">Acheter ou vendre</Link>
        </div>
      ) : (
        <ul className="liste">
          {commandes.map((c) => (
            <li key={c.id} className="ligne">
              <div>
                <strong>{c.type === 'achat' ? 'Achat' : 'Vente'} {c.crypto} · {c.reseau}</strong>
                <small>
                  {c.id} · {new Date(c.date).toLocaleDateString('fr-FR')}
                  {c.montantFcfa ? ` · ${c.montantFcfa.toLocaleString('fr-FR')} FCFA` : ''}
                </small>
              </div>
              <span className="statut">{libelleStatut(c.statut)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
