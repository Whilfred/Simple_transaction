'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ecrire } from '@/lib/storage';

export default function Bienvenue() {
  const router = useRouter();
  const [prenom, setPrenom] = useState('');

  function continuer(e) {
    e.preventDefault();
    const propre = prenom.trim();
    if (!propre) return;
    ecrire('prenom', propre);
    router.replace('/accueil');
  }

  return (
    <section className="page etroite">
      <h1>Bienvenue</h1>
      <p className="intro">Comment doit-on vous appeler ?</p>
      <form onSubmit={continuer} className="formulaire">
        <div className="champ">
          <label htmlFor="prenom">Votre prénom</label>
          <input id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} autoFocus required />
        </div>
        <button className="bouton plein" type="submit">Continuer</button>
      </form>
    </section>
  );
}
