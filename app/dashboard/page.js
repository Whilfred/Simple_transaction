'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lire } from '@/lib/storage';

export default function Dashboard() {
  const [commandes, setCommandes] = useState([]);
  useEffect(() => setCommandes(lire('commandes', [])), []);

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
              <span className="statut">{c.statut}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
