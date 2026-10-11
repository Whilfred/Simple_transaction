'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { lire } from '@/lib/storage';

export default function Accueil() {
  const [prenom, setPrenom] = useState('');

  useEffect(() => {
    setPrenom(lire('prenom', '') || '');
  }, []);

  return (
    <section className="page accueil">
      {/* Bienvenue */}
      <div className="accueil-hero">
        <div className="hero-contenu">
          <h1>
            {prenom ? `Bonjour ${prenom} 👋` : 'Bienvenue sur ExCrypt'}
          </h1>

          <p className="intro">
            Votre crypto, votre argent, votre liberté.
            Achetez et vendez vos cryptomonnaies simplement.
          </p>
        </div>

        <div className="hero-decoration" aria-hidden="true">
          <div className="hero-cercle hero-cercle-1" />
          <div className="hero-cercle hero-cercle-2" />
          <div className="hero-crypto">₮</div>
        </div>
      </div>

      {/* Actions principales */}
      <div className="accueil-section-titre">
        <div>
          <h2>Que souhaitez-vous faire ?</h2>
          <p>Choisissez votre opération</p>
        </div>
        <span className="securite-badge">Échange simple</span>
      </div>

      <div className="choix">
        <Link href="/acheter" className="carte-choix acheter">
          <div className="carte-haut">
            <div className="icone-operation icone-acheter">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            </div>
            <span className="fleche-operation">↗</span>
          </div>

          <div className="carte-bas">
            <strong>Acheter des cryptomonnaies</strong>
            <span>
              Payez en FCFA et recevez vos cryptomonnaies dans votre portefeuille.
            </span>
            <div className="carte-action">
              Commencer l’achat <span>→</span>
            </div>
          </div>
        </Link>

        <Link href="/vendre" className="carte-choix vendre">
          <div className="carte-haut">
            <div className="icone-operation icone-vendre">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </div>
            <span className="fleche-operation">↗</span>
          </div>

          <div className="carte-bas">
            <strong>Vendre des cryptomonnaies</strong>
            <span>
              Envoyez vos cryptomonnaies et recevez votre paiement en FCFA.
            </span>
            <div className="carte-action">
              Commencer la vente <span>→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Réassurance */}
      <div className="accueil-reassurance">
        <div className="reassurance-icone">↔</div>
        <div>
          <strong>Un échange en toute simplicité</strong>
          <p>
            Suivez les instructions de chaque opération et vérifiez
            les informations avant de confirmer.
          </p>
        </div>
      </div>
    </section>
  );
}
