'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { lire } from '@/lib/storage';

export default function Accueil() {
  const [prenom, setPrenom] = useState('');
  useEffect(() => setPrenom(lire('prenom', '') || ''), []);

  return (
    <section className="page">
      <h1>Bonjour {prenom}</h1>
      <p className="intro">Que voulez-vous faire ?</p>

      <div className="choix">
        <Link href="/acheter" className="carte-choix acheter">
          <strong>Acheter</strong>
          <span>Payez en FCFA, recevez vos USDT.</span>
        </Link>
        <Link href="/vendre" className="carte-choix vendre">
          <strong>Vendre</strong>
          <span>Envoyez vos USDT, recevez des FCFA.</span>
        </Link>
      </div>
    </section>
  );
}
