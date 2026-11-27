'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Accueil() {
  const router = useRouter();
  const [prenom, setPrenom] = useState('');
  const [verification, setVerification] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) {
          router.replace('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          setPrenom(data.user.prenom);
        }
        setVerification(false);
      })
      .catch(() => {
        router.replace('/login');
      });
  }, [router]);

  return (
    <>
      <style>{styles}</style>

      <section className="ex-accueil" aria-busy={verification}>
        {verification ? (
          <>
            <div className="ex-skeleton ex-skeleton-hero" />
            <div className="ex-choix">
              <div className="ex-skeleton ex-skeleton-carte" />
              <div className="ex-skeleton ex-skeleton-carte" />
            </div>
          </>
        ) : (
          <>
            {/* Bienvenue */}
            <header className="ex-hero">
              <span className="ex-badge">
                <span className="ex-badge-point" />
                Plateforme sécurisée
              </span>

              <h1>{prenom ? `Bonjour ${prenom}` : 'Bienvenue sur ExCrypt'}</h1>

              <p className="ex-intro">
                Votre crypto, votre argent, votre liberté. Achetez et vendez
                vos cryptomonnaies simplement.
              </p>
            </header>

            {/* Actions principales */}
            <div className="ex-titre-section">
              <div>
                <h2>Que souhaitez-vous faire ?</h2>
                <p>Choisissez votre opération</p>
              </div>
              <span className="ex-tag">Échange simple</span>
            </div>

            <div className="ex-choix">
              <Link href="/acheter" className="ex-carte ex-acheter">
                <div className="ex-carte-haut">
                  <div className="ex-icone">
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
                  <span className="ex-fleche" aria-hidden="true">↗</span>
                </div>

                <div className="ex-carte-bas">
                  <strong>Acheter des cryptomonnaies</strong>
                  <span>
                    Payez en FCFA et recevez vos cryptomonnaies dans votre
                    portefeuille.
                  </span>
                  <div className="ex-action">
                    Commencer l’achat <span aria-hidden="true">→</span>
                  </div>
                </div>
              </Link>

              <Link href="/vendre" className="ex-carte ex-vendre">
                <div className="ex-carte-haut">
                  <div className="ex-icone">
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
                  <span className="ex-fleche" aria-hidden="true">↗</span>
                </div>

                <div className="ex-carte-bas">
                  <strong>Vendre des cryptomonnaies</strong>
                  <span>
                    Envoyez vos cryptomonnaies et recevez votre paiement en
                    FCFA.
                  </span>
                  <div className="ex-action">
                    Commencer la vente <span aria-hidden="true">→</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Réassurance */}
            <div className="ex-reassurance">
              <div className="ex-reassurance-icone" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <strong>Un échange en toute simplicité</strong>
                <p>
                  Suivez les instructions de chaque opération et vérifiez les
                  informations avant de confirmer.
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

const styles = `
.ex-accueil {
  --ex-bg: #f6f8fb;
  --ex-surface: #ffffff;
  --ex-texte: #0f172a;
  --ex-texte-doux: #64748b;
  --ex-bordure: #e2e8f0;
  --ex-primaire: #0f766e;
  --ex-primaire-clair: #ccfbf1;
  --ex-secondaire: #1d4ed8;
  --ex-secondaire-clair: #dbeafe;
  --ex-rayon: 16px;

  max-width: 880px;
  margin: 0 auto;
  padding: 32px 20px 48px;
  color: var(--ex-texte);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.ex-accueil *,
.ex-accueil *::before,
.ex-accueil *::after {
  box-sizing: border-box;
}

/* Hero */
.ex-hero {
  background: var(--ex-surface);
  border: 1px solid var(--ex-bordure);
  border-radius: var(--ex-rayon);
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.ex-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--ex-primaire-clair);
  color: var(--ex-primaire);
  font-size: 0.8rem;
  font-weight: 600;
}

.ex-badge-point {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ex-primaire);
}

.ex-hero h1 {
  margin: 16px 0 8px;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.ex-intro {
  margin: 0;
  max-width: 520px;
  color: var(--ex-texte-doux);
  font-size: 1rem;
  line-height: 1.6;
}

/* Titre de section */
.ex-titre-section {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.ex-titre-section h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.ex-titre-section p {
  margin: 4px 0 0;
  color: var(--ex-texte-doux);
  font-size: 0.9rem;
}

.ex-tag {
  padding: 5px 12px;
  border: 1px solid var(--ex-bordure);
  border-radius: 999px;
  background: var(--ex-surface);
  color: var(--ex-texte-doux);
  font-size: 0.78rem;
  font-weight: 500;
  white-space: nowrap;
}

/* Cartes */
.ex-choix {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.ex-carte {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  min-height: 220px;
  padding: 24px;
  background: var(--ex-surface);
  border: 1px solid var(--ex-bordure);
  border-radius: var(--ex-rayon);
  color: inherit;
  text-decoration: none;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: transform 0.18s ease, box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.ex-carte:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
}

.ex-carte:focus-visible {
  outline: 3px solid var(--ex-couleur);
  outline-offset: 3px;
}

.ex-acheter {
  --ex-couleur: var(--ex-primaire);
  --ex-couleur-clair: var(--ex-primaire-clair);
}

.ex-vendre {
  --ex-couleur: var(--ex-secondaire);
  --ex-couleur-clair: var(--ex-secondaire-clair);
}

.ex-carte:hover {
  border-color: var(--ex-couleur);
}

.ex-carte-haut {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ex-icone {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: var(--ex-couleur-clair);
  color: var(--ex-couleur);
}

.ex-icone svg {
  width: 22px;
  height: 22px;
}

.ex-fleche {
  color: var(--ex-texte-doux);
  font-size: 1.2rem;
  transition: transform 0.18s ease, color 0.18s ease;
}

.ex-carte:hover .ex-fleche {
  color: var(--ex-couleur);
  transform: translate(2px, -2px);
}

.ex-carte-bas {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ex-carte-bas strong {
  font-size: 1.1rem;
  font-weight: 700;
}

.ex-carte-bas > span {
  color: var(--ex-texte-doux);
  font-size: 0.92rem;
  line-height: 1.55;
}

.ex-action {
  margin-top: 8px;
  color: var(--ex-couleur);
  font-size: 0.92rem;
  font-weight: 600;
}

.ex-action span {
  display: inline-block;
  transition: transform 0.18s ease;
}

.ex-carte:hover .ex-action span {
  transform: translateX(4px);
}

/* Réassurance */
.ex-reassurance {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-top: 24px;
  padding: 18px 20px;
  background: var(--ex-surface);
  border: 1px solid var(--ex-bordure);
  border-radius: var(--ex-rayon);
}

.ex-reassurance-icone {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--ex-primaire-clair);
  color: var(--ex-primaire);
}

.ex-reassurance-icone svg {
  width: 20px;
  height: 20px;
}

.ex-reassurance strong {
  font-size: 0.95rem;
}

.ex-reassurance p {
  margin: 4px 0 0;
  color: var(--ex-texte-doux);
  font-size: 0.88rem;
  line-height: 1.5;
}

/* Chargement */
.ex-skeleton {
  border-radius: var(--ex-rayon);
  background: linear-gradient(
    90deg,
    #e8edf3 25%,
    #f3f6fa 50%,
    #e8edf3 75%
  );
  background-size: 200% 100%;
  animation: ex-shimmer 1.4s infinite linear;
}

.ex-skeleton-hero {
  height: 170px;
  margin-bottom: 32px;
}

.ex-skeleton-carte {
  height: 220px;
}

@keyframes ex-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

/* Mobile */
@media (max-width: 640px) {
  .ex-accueil {
    padding: 20px 16px 40px;
  }

  .ex-hero {
    padding: 24px 20px;
  }

  .ex-choix {
    grid-template-columns: 1fr;
  }

  .ex-carte {
    min-height: 190px;
  }

  .ex-titre-section {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ex-carte,
  .ex-fleche,
  .ex-action span,
  .ex-skeleton {
    transition: none;
    animation: none;
  }
}
`;
