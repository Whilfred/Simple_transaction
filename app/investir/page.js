'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ============================ STYLES ============================ */
const CSS = `
.inv-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 20px 56px;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: #0f172a;
}

/* En-tête */
.inv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
}
.inv-date {
  margin: 0 0 6px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
}
.inv-titre {
  margin: 0;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.inv-sous-titre {
  margin: 8px 0 0;
  font-size: 1.05rem;
  color: #64748b;
}
.inv-avatar {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #0f172a, #334155);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.25);
}

/* Bandeau de synthèse */
.inv-resume {
  display: flex;
  align-items: stretch;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px 22px;
  margin-bottom: 36px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}
.inv-resume-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.inv-resume-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}
.inv-resume-valeur {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}
.inv-resume-sep {
  width: 1px;
  background: #e2e8f0;
  margin: 0 22px;
}
.inv-point-vert {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.18);
}

/* Grille */
.inv-section-titre {
  margin: 0 0 16px;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.inv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Cartes */
.inv-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  min-height: 250px;
  padding: 24px;
  border-radius: 22px;
  color: #fff;
  text-decoration: none;
  overflow: hidden;
  isolation: isolate;
  box-shadow: 0 10px 30px -12px var(--ombre);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.inv-card::before {
  content: '';
  position: absolute;
  top: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.28), transparent 70%);
  z-index: -1;
  transition: transform 0.4s ease;
}
.inv-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px -14px var(--ombre);
}
.inv-card:hover::before { transform: scale(1.3); }
.inv-card:focus-visible { outline: 3px solid #0f172a; outline-offset: 3px; }

.inv-bleu  { background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%); --ombre: rgba(37, 99, 235, 0.6); }
.inv-ambre { background: linear-gradient(135deg, #b45309 0%, #d97706 55%, #f59e0b 100%); --ombre: rgba(217, 119, 6, 0.6); }
.inv-vert  { background: linear-gradient(135deg, #065f46 0%, #059669 55%, #10b981 100%); --ombre: rgba(5, 150, 105, 0.6); }

.inv-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.inv-icone {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.25);
}
.inv-badge {
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.28);
}
.inv-card-body { flex: 1; }
.inv-card-titre {
  margin: 0 0 8px;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.inv-card-desc {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.5;
  opacity: 0.9;
}
.inv-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.22);
}
.inv-horizon { font-size: 0.8rem; opacity: 0.85; }
.inv-fleche {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
}
.inv-fleche svg { transition: transform 0.25s ease; }
.inv-card:hover .inv-fleche svg { transform: translateX(5px); }

/* Avertissement */
.inv-avertissement {
  margin: 36px 0 0;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  font-size: 0.78rem;
  line-height: 1.6;
  color: #94a3b8;
}

/* Skeleton */
.inv-skeleton {
  border-radius: 14px;
  background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: inv-shimmer 1.4s infinite;
}
.inv-sk-titre { height: 34px; width: 55%; margin-bottom: 14px; }
.inv-sk-text  { height: 18px; width: 35%; margin-bottom: 36px; }
.inv-sk-card  { height: 250px; border-radius: 22px; }
@keyframes inv-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Responsive */
@media (max-width: 900px) {
  .inv-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .inv-page { padding: 24px 16px 40px; }
  .inv-grid { grid-template-columns: 1fr; }
  .inv-card { min-height: 220px; }
  .inv-resume { flex-direction: column; gap: 14px; }
  .inv-resume-sep { width: 100%; height: 1px; margin: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .inv-card, .inv-card::before, .inv-fleche svg, .inv-skeleton {
    transition: none;
    animation: none;
  }
}
`;

/* ============================ ICÔNES ============================ */
const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const IconBourse = () => (
  <svg {...svgProps} width="26" height="26" strokeWidth="1.8">
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M15 7h6v6" />
  </svg>
);

const IconCrypto = () => (
  <svg {...svgProps} width="26" height="26" strokeWidth="1.8">
    <path d="M9 5v14M13 5v14" />
    <path d="M7 7h6.5a2.5 2.5 0 010 5H7h7a2.5 2.5 0 010 5H7" />
  </svg>
);

const IconEntreprise = () => (
  <svg {...svgProps} width="26" height="26" strokeWidth="1.8">
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4v18" />
    <path d="M19 21V11l-7-3" />
    <path d="M9 9v.01M9 12v.01M9 15v.01M15 14v.01M15 17v.01" />
  </svg>
);

const IconArrow = () => (
  <svg {...svgProps} width="18" height="18" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

/* ============================ DONNÉES ============================ */
const OPTIONS = [
  {
    href: '/investir/bourse',
    titre: 'Bourse',
    description: "Accédez aux actions d'entreprises mondiales et construisez un portefeuille diversifié.",
    icone: <IconBourse />,
    theme: 'inv-bleu',
    risque: 'Risque modéré',
    horizon: 'Moyen / long terme',
  },
  {
    href: '/investir/crypto',
    titre: 'Crypto-monnaies',
    description: 'Constituez un portefeuille crypto pensé pour le long terme.',
    icone: <IconCrypto />,
    theme: 'inv-ambre',
    risque: 'Risque élevé',
    horizon: 'Long terme',
  },
  {
    href: '/investir/entreprises',
    titre: 'Entreprises locales',
    description: 'Investissez dans des PME africaines non cotées à fort potentiel.',
    icone: <IconEntreprise />,
    theme: 'inv-vert',
    risque: 'Risque variable',
    horizon: 'Long terme',
  },
];

function salutation() {
  const h = new Date().getHours();
  if (h < 5) return 'Bonsoir';
  if (h < 18) return 'Bonjour';
  return 'Bonsoir';
}

/* ============================ PAGE ============================ */
export default function InvestirDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else router.replace('/investir/login');
      })
      .catch(() => router.replace('/investir/login'))
      .finally(() => setChargement(false));
  }, [router]);

  if (chargement) {
    return (
      <section className="inv-page">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="inv-skeleton inv-sk-titre" />
        <div className="inv-skeleton inv-sk-text" />
        <div className="inv-grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className="inv-skeleton inv-sk-card" />
          ))}
        </div>
      </section>
    );
  }

  if (!user) return null;

  const initiale = (user.prenom || '?').charAt(0).toUpperCase();
  const dateJour = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <section className="inv-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* En-tête */}
      <header className="inv-header">
        <div>
          <p className="inv-date">{dateJour}</p>
          <h1 className="inv-titre">
            {salutation()}, {user.prenom} 👋
          </h1>
          <p className="inv-sous-titre">Où souhaitez-vous investir aujourd'hui ?</p>
        </div>
        <div className="inv-avatar" aria-hidden="true">{initiale}</div>
      </header>

      {/* Bandeau de synthèse */}
      <div className="inv-resume">
        <div className="inv-resume-item">
          <span className="inv-resume-label">Univers d'investissement</span>
          <span className="inv-resume-valeur">3 classes d'actifs</span>
        </div>
        <div className="inv-resume-sep" />
        <div className="inv-resume-item">
          <span className="inv-resume-label">Statut du compte</span>
          <span className="inv-resume-valeur">
            <span className="inv-point-vert" /> Actif
          </span>
        </div>
        <div className="inv-resume-sep" />
        <div className="inv-resume-item">
          <span className="inv-resume-label">Conseil</span>
          <span className="inv-resume-valeur">Diversifiez vos placements</span>
        </div>
      </div>

      {/* Cartes */}
      <h2 className="inv-section-titre">Marchés</h2>
      <div className="inv-grid">
        {OPTIONS.map((o) => (
          <Link key={o.href} href={o.href} className={`inv-card ${o.theme}`}>
            <div className="inv-card-top">
              <div className="inv-icone">{o.icone}</div>
              <span className="inv-badge">{o.risque}</span>
            </div>

            <div className="inv-card-body">
              <h3 className="inv-card-titre">{o.titre}</h3>
              <p className="inv-card-desc">{o.description}</p>
            </div>

            <div className="inv-card-footer">
              <span className="inv-horizon">{o.horizon}</span>
              <span className="inv-fleche">
                Explorer <IconArrow />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className="inv-avertissement">
        Tout investissement comporte des risques, dont la perte partielle ou totale du capital.
        Les performances passées ne préjugent pas des performances futures.
      </p>
    </section>
  );
}
