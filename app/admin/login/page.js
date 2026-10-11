// app/admin/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  async function valider(e) {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motDePasse }),
      });
      const data = await r.json();
      if (!r.ok) {
        setErreur(data.erreur || 'Erreur de connexion.');
        setEnvoi(false);
        return;
      }
      router.replace('/admin/commandes');
    } catch {
      setErreur('Connexion impossible. Vérifiez votre connexion internet.');
      setEnvoi(false);
    }
  }

  return (
    <section className="page etroite">
      <h1>Administration</h1>
      <p className="intro">Accès réservé.</p>
      <form onSubmit={valider} className="formulaire">
        <div className="champ">
          <label htmlFor="mdp">Mot de passe</label>
          <input
            id="mdp"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            autoFocus
            required
            autoComplete="current-password"
          />
        </div>
        {erreur && <p style={{ color: '#e0334f', marginTop: 8 }}>{erreur}</p>}
        <button className="bouton plein" type="submit" disabled={envoi}>
          {envoi ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </section>
  );
}
