'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { lire, ecrire } from '@/lib/storage';
import { SITE } from '@/lib/config';

export default function Shell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pret, setPret] = useState(false);
  const [consentement, setConsentement] = useState(false);
  const [prenom, setPrenom] = useState('');

  // Relit le navigateur à chaque changement de page
  useEffect(() => {
    setConsentement(lire('consentement', false) === true);
    setPrenom(lire('prenom', '') || '');
    setPret(true);
  }, [pathname]);

  // Garde-fous : pas de prénom → /bienvenue ; prénom déjà saisi → on quitte /bienvenue
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

  return (
    <>
      <header className="entete">
        <div className="conteneur entete-ligne">
          <Link href="/accueil" className="logo">{SITE.nom}</Link>
          {prenom && (
            <nav className="nav">
              <Link href="/accueil" className={pathname === '/accueil' ? 'actif' : ''}>Accueil</Link>
              <Link href="/dashboard" className={pathname === '/dashboard' ? 'actif' : ''}>Mes opérations</Link>
              <span className="salut">{prenom}</span>
            </nav>
          )}
        </div>
      </header>

      <main className="conteneur">{consentement || pathname === '/confidentialite' ? children : null}</main>

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
            <button className="bouton plein" onClick={accepter}>J'accepte la politique de confidentialité</button>
          </div>
        </div>
      )}
    </>
  );
}
