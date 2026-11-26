'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/config';

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

function IconeMessages({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function Shell({ children }) {
  const pathname = usePathname();
  
  // 🔥 On affiche la barre sur TOUTES les pages SAUF sur les pages de login/register
  const masquerNav = pathname === '/login' || pathname === '/register';
  const afficherNav = !masquerNav;

  const estAccueil = pathname === '/accueil';
  const estDashboard = pathname === '/dashboard';
  const estMessages = pathname === '/messages';

  return (
    <>
      <header className="entete">
        <div className="conteneur entete-ligne" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/accueil" className="logo">{SITE.nom}</Link>
          
          {/* Bouton déconnexion (uniquement si on est connecté et pas sur login) */}
          {!masquerNav && (
            <button 
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
              style={{ background: 'none', border: 'none', color: '#d9534f', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
            >
              Déconnexion
            </button>
          )}
        </div>
      </header>

      <main className={`conteneur ${afficherNav ? 'avec-nav-bas' : ''}`}>
        {children}
      </main>

      {afficherNav && (
        <nav className="nav-bas" aria-label="Navigation principale">
          <Link href="/accueil" className={`nav-bas-item ${estAccueil ? 'actif' : ''}`}>
            <IconeAccueil active={estAccueil} />
            <span className="nav-bas-texte">Accueil</span>
          </Link>
          
          <Link href="/dashboard" className={`nav-bas-item ${estDashboard ? 'actif' : ''}`}>
            <IconeOperations active={estDashboard} />
            <span className="nav-bas-texte">Opérations</span>
          </Link>

          <Link href="/messages" className={`nav-bas-item ${estMessages ? 'actif' : ''}`}>
            <IconeMessages active={estMessages} />
            <span className="nav-bas-texte">Messages</span>
          </Link>
        </nav>
      )}
    </>
  );
}
