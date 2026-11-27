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

  const partager = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'ExCrypt',
          text: 'Achetez et vendez vos cryptomonnaies simplement avec ExCrypt.',
          url: window.location.origin,
        });
      }
    } catch (e) {
      /* partage annulé */
    }
  };

  return (
    <>
      <style>{styles}</style>

      <main className="ex-page" aria-busy={verification}>
        <div className="ex-conteneur">
          {verification ? (
            <>
              <div className="ex-entete">
                <div className="ex-skeleton ex-sk-entete" />
              </div>
              <div className="ex-corps">
                <div className="ex-skeleton ex-sk-hero" />
                <div className="ex-grille">
                  <div className="ex-skeleton ex-sk-tuile" />
                  <div className="ex-skeleton ex-sk-tuile" />
                  <div className="ex-skeleton ex-sk-tuile" />
                  <div className="ex-skeleton ex-sk-tuile" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* En-tête sombre */}
              <header className="ex-entete">
                <div className="ex-salut">
                  <div className="ex-avatar" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="ex-bonjour">Bonjour</span>
                    <strong className="ex-nom">{prenom || 'Bienvenue'}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="ex-icone-btn"
                  onClick={partager}
                  aria-label="Partager ExCrypt"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
                  </svg>
                </button>
              </header>

              <div className="ex-corps">
                {/* Carte de bienvenue */}
                <section className="ex-hero">
                  <div className="ex-hero-texte">
                    <h1>
                      Bienvenue sur <br />
                      ExCrypt !
                    </h1>
                    <p>
                      Votre crypto, votre argent, votre liberté. Achetez et
                      vendez vos cryptomonnaies simplement.
                    </p>
                    <Link href="/acheter" className="ex-hero-btn">
                      Commencer
                    </Link>
                  </div>

                  <div className="ex-hero-deco" aria-hidden="true">
                    <div className="ex-hero-cercle">₮</div>
                  </div>
                </section>

                {/* Raccourcis */}
                <nav className="ex-grille" aria-label="Opérations">
                  <Link href="/acheter" className="ex-tuile">
                    <span className="ex-tuile-icone ex-vert">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 19V5" />
                        <path d="m5 12 7-7 7 7" />
                      </svg>
                    </span>
                    <span className="ex-tuile-label">Acheter</span>
                  </Link>

                  <Link href="/vendre" className="ex-tuile">
                    <span className="ex-tuile-icone ex-bleu">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 5v14" />
                        <path d="m19 12-7 7-7-7" />
                      </svg>
                    </span>
                    <span className="ex-tuile-label">Vendre</span>
                  </Link>

                  {/* 🔥 MODIFIÉ : Redirection vers /dashboard */}
                  <Link href="/dashboard" className="ex-tuile">
                    <span className="ex-tuile-icone ex-orange">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </span>
                    <span className="ex-tuile-label">Historique</span>
                  </Link>

                  {/* 🔥 MODIFIÉ : Redirection vers /messages */}
                  <Link href="/messages" className="ex-tuile">
                    <span className="ex-tuile-icone ex-violet">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6" />
                        <path d="M12 17h.01" />
                      </svg>
                    </span>
                    <span className="ex-tuile-label">Support</span>
                  </Link>
                </nav>

                {/* Bandeau sombre */}
                <div className="ex-bandeau">
                  <div className="ex-bandeau-icone" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <div className="ex-bandeau-texte">
                    <strong>Un échange en toute simplicité</strong>
                    <span>
                      Suivez les instructions et vérifiez les informations avant
                      de confirmer.
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

const styles = `
.ex-page {
  --ex-jaune: #16cb62;
  --ex-jaune-fonce: #16cb62;
  --ex-nuit: #0c1220;
  --ex-nuit-2: #18202f;
  --ex-fond: #f4f5f8;
  --ex-surface: #ffffff;
  --ex-texte: #0f172a;
  --ex-doux: #64748b;
  --ex-bordure: #e5e7ee;

  min-height: 100vh;
  background: var(--ex-fond);
  color: var(--ex-texte);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.ex-page *,
.ex-page *::before,
.ex-page *::after {
  box-sizing: border-box;
}

.ex-conteneur {
  position: relative;
  max-width: 520px;
  min-height: 100vh;
  margin: 0 auto;
  background: var(--ex-fond);
}

/* En-tête */
.ex-entete {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 20px 96px;
  background: var(--ex-nuit);
  border-radius: 0 0 32px 32px;
}

.ex-salut {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ex-avatar {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 2px solid var(--ex-jaune);
  border-radius: 50%;
  color: var(--ex-jaune);
}

.ex-avatar svg {
  width: 22px;
  height: 22px;
}

.ex-bonjour {
  display: block;
  color: var(--ex-jaune);
  font-size: 0.85rem;
  font-weight: 600;
}

.ex-nom {
  display: block;
  margin-top: 2px;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 600;
}

.ex-icone-btn {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--ex-jaune);
  cursor: pointer;
  transition: background 0.15s ease;
}

.ex-icone-btn:hover {
  background: rgba(255, 180, 0, 0.14);
}

.ex-icone-btn:focus-visible {
  outline: 2px solid var(--ex-jaune);
  outline-offset: 2px;
}

.ex-icone-btn svg {
  width: 24px;
  height: 24px;
}

/* Corps */
.ex-corps {
  position: relative;
  margin-top: -72px;
  padding: 0 16px 40px;
}

/* Carte de bienvenue */
.ex-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  overflow: hidden;
  padding: 26px 22px;
  background: var(--ex-jaune);
  border-radius: 24px;
  box-shadow: 0 14px 30px rgba(229, 159, 0, 0.28);
}

.ex-hero-texte {
  position: relative;
  z-index: 1;
  max-width: 270px;
}

.ex-hero h1 {
  margin: 0 0 10px;
  color: var(--ex-nuit);
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.ex-hero p {
  margin: 0 0 20px;
  color: rgba(12, 18, 32, 0.82);
  font-size: 0.88rem;
  line-height: 1.5;
}

.ex-hero-btn {
  display: inline-block;
  padding: 11px 26px;
  background: var(--ex-nuit);
  border-radius: 999px;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.15s ease, background 0.15s ease;
}

.ex-hero-btn:hover {
  background: var(--ex-nuit-2);
  transform: translateY(-1px);
}

.ex-hero-btn:focus-visible {
  outline: 3px solid var(--ex-nuit);
  outline-offset: 3px;
}

.ex-hero-deco {
  position: absolute;
  right: -34px;
  bottom: -40px;
  width: 190px;
  height: 190px;
}

.ex-hero-cercle {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: rgba(12, 18, 32, 0.1);
  border-radius: 50%;
  color: rgba(12, 18, 32, 0.28);
  font-size: 6.5rem;
  font-weight: 800;
  padding: 0 0 0 0;
  box-shadow: inset 0 0 0 22px rgba(255, 255, 255, 0.12);
}

/* Raccourcis */
.ex-grille {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 22px;
  padding: 18px 12px;
  background: var(--ex-surface);
  border-radius: 22px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
}

.ex-tuile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--ex-texte);
  text-decoration: none;
  transition: transform 0.15s ease;
}

.ex-tuile:hover {
  transform: translateY(-2px);
}

.ex-tuile:focus-visible {
  outline: 2px solid var(--ex-nuit);
  outline-offset: 4px;
  border-radius: 12px;
}

.ex-tuile-icone {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  border-radius: 16px;
  color: #ffffff;
}

.ex-tuile-icone svg {
  width: 24px;
  height: 24px;
}

.ex-vert { background: #22b573; }
.ex-bleu { background: #3b82f6; }
.ex-orange { background: #19b851; }
.ex-violet { background: #5cf066; }

.ex-tuile-label {
  font-size: 0.74rem;
  font-weight: 600;
  text-align: center;
}

/* Bandeau sombre */
.ex-bandeau {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 18px;
  padding: 18px;
  background: var(--ex-nuit);
  border-radius: 20px;
}

.ex-bandeau-icone {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  background: var(--ex-jaune);
  border-radius: 12px;
  color: var(--ex-nuit);
}

.ex-bandeau-icone svg {
  width: 24px;
  height: 24px;
}

.ex-bandeau-texte strong {
  display: block;
  color: #ffffff;
  font-size: 0.98rem;
  font-weight: 700;
}

.ex-bandeau-texte span {
  display: block;
  margin-top: 3px;
  color: var(--ex-jaune);
  font-size: 0.8rem;
  line-height: 1.45;
}

/* Chargement */
.ex-skeleton {
  background: linear-gradient(90deg, #e3e7ee 25%, #f1f3f8 50%, #e3e7ee 75%);
  background-size: 200% 100%;
  animation: ex-shimmer 1.4s infinite linear;
  border-radius: 20px;
}

.ex-sk-entete {
  width: 180px;
  height: 46px;
  background: rgba(255, 255, 255, 0.12);
  animation: none;
}

.ex-sk-hero {
  height: 200px;
}

.ex-sk-tuile {
  height: 80px;
}

.ex-page .ex-corps .ex-grille {
  background: transparent;
  box-shadow: none;
  padding: 0;
}

@keyframes ex-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .ex-tuile,
  .ex-hero-btn,
  .ex-icone-btn,
  .ex-skeleton {
    transition: none;
    animation: none;
  }
}
`;
