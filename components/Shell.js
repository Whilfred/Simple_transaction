'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { lire, ecrire } from '@/lib/storage';
import { SITE } from '@/lib/config';

// --- Icônes SVG (trait fin, héritent de la couleur) ---
function IconeAccueil({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

function IconeOperations({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M8 10h8M8 14h5" />
    </svg>
  );
}

export default function Shell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pret, setPret] = useState(false);
  const [consentement, setConsentement] = useState(false);
  const [prenom, setPrenom] = useState('');

  useEffect(() => {
    setConsentement(lire('consentement', false) === true);
    setPrenom(lire('prenom', '') || '');
    setPret(true);
  }, [pathname]);

  useEffect(() => {
    if (!pret || !consentement) return;
    const libre = pathname === '/bienvenue' || pathname === '/confidentialite';
    if (!prenom && !libre) router.replace('/bienvenue');
    if (prenom && pathname === '/bienvenue') router.replace('/accueil');
  }, [pret, consentement, prenom, pathname, router]);

  function accepter() {
    ecrire('consentement', true);
    setConsentement(true);
  }

  if (!pret) return null;

  const afficherPopup = !consentement && pathname !== '/confidentialite';

  const pagesAvecNav = ['/accueil', '/dashboard', '/acheter', '/vendre'];
  const afficherNav = prenom && pagesAvecNav.includes(pathname);

  const estAccueil = pathname === '/accueil';
  const estDashboard = pathname === '/dashboard';

  return (
    <>
      <header className="entete">
        <div className="conteneur entete-ligne">
          <Link href="/accueil" className="logo">{SITE.nom}</Link>
            {prenom && <span className="salut">{prenom}</span>}
          {prenom && <span className="salut salut-mobile">{prenom}</span>}
        </div>
      </header>

      <main className={`conteneur ${afficherNav ? 'avec-nav-bas' : ''}`}>
        {consentement || pathname === '/confidentialite' ? children : null}
      </main>

      {afficherNav && (
        <nav className="nav-bas" aria-label="Navigation principale">
          <Link href="/accueil" className={`nav-bas-item ${estAccueil ? 'actif' : ''}`} aria-current={estAccueil ? 'page' : undefined}>
            <IconeAccueil active={estAccueil} />
            <span className="nav-bas-texte">Accueil</span>
          </Link>
          <Link href="/dashboard" className={`nav-bas-item ${estDashboard ? 'actif' : ''}`} aria-current={estDashboard ? 'page' : undefined}>
            <IconeOperations active={estDashboard} />
            <span className="nav-bas-texte">Mes opérations</span>
          </Link>
        </nav>
      )}

      {afficherPopup && (
        <div className="voile" role="dialog" aria-modal="true" aria-labelledby="titre-popup">
          <div className="popup">
            <h2 id="titre-popup">Confidentialité</h2>
            <p>
              Nous gardons uniquement les informations nécessaires pour traiter vos opérations : prénom,
              numéro de téléphone, adresse de réception. Elles ne sont jamais revendues.
            </p>
            <p>
              <Link href="/confidentialite">Lire la politique complète</Link>
            </p>
            <button className="bouton plein" onClick={accepter}>
              J'accepte la politique de confidentialité
            </button>
          </div>
        </div>
      )}
    </>
  );
}
