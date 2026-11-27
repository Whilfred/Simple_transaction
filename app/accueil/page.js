'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const css = {
  page: {
    '--ex-jaune': '#16cb62',
    '--ex-nuit': '#0c1220',
    '--ex-fond': '#f4f5f8',
    '--ex-texte': '#0f172a',
    
    // 🔥 MODIFICATIONS ICI POUR BLOQUER LE SCROLL
    height: '100%', 
    maxHeight: '100vh',
    overflow: 'hidden', 
    
    backgroundColor: 'var(--ex-fond)',
    color: 'var(--ex-texte)',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    WebkitFontSmoothing: 'antialiased',
  },
  conteneur: { 
    position: 'relative', 
    maxWidth: '520px', 
    height: '100%',
    overflow: 'hidden', // Bloque le scroll ici aussi
    margin: '0 auto', 
    backgroundColor: 'var(--ex-fond)',
    display: 'flex',
    flexDirection: 'column'
  },
  entete: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 20px 96px', backgroundColor: 'var(--ex-nuit)', borderRadius: '0 0 32px 32px', flexShrink: 0 },
  salut: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: { display: 'grid', placeItems: 'center', width: '46px', height: '46px', border: '2px solid var(--ex-jaune)', borderRadius: '50%', color: 'var(--ex-jaune)' },
  avatarSvg: { width: '22px', height: '22px' },
  bonjour: { display: 'block', color: 'var(--ex-jaune)', fontSize: '0.85rem', fontWeight: '600' },
  nom: { display: 'block', marginTop: '2px', color: '#ffffff', fontSize: '1.05rem', fontWeight: '600' },
  iconeBtn: { display: 'grid', placeItems: 'center', width: '42px', height: '42px', border: '0', borderRadius: '50%', backgroundColor: 'transparent', color: 'var(--ex-jaune)', cursor: 'pointer' },
  iconeBtnSvg: { width: '24px', height: '24px' },
  
  // On laisse le corps scroller si nécessaire, mais il ne dépassera pas l'écran
  corps: { position: 'relative', marginTop: '-72px', padding: '0 16px 40px', flex: 1, overflowY: 'auto' },
  
  hero: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', overflow: 'hidden', padding: '26px 22px', backgroundColor: 'var(--ex-jaune)', borderRadius: '24px', boxShadow: '0 14px 30px rgba(229, 159, 0, 0.28)' },
  heroTexte: { position: 'relative', zIndex: 1, maxWidth: '270px' },
  
  // 🔥 COULEUR DU TEXTE EN BLANC
  heroH1: { margin: '0 0 10px', color: '#ffffff', fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1.2' },
  heroP: { margin: '0 0 20px', color: '#ffffff', fontSize: '0.88rem', lineHeight: '1.5' },
  
  heroBtn: { display: 'inline-block', padding: '11px 26px', backgroundColor: 'var(--ex-nuit)', borderRadius: '999px', color: '#ffffff', fontSize: '0.9rem', fontWeight: '600', textDecoration: 'none' },
  heroDeco: { position: 'absolute', right: '-34px', bottom: '-40px', width: '190px', height: '190px' },
  heroCercle: { display: 'grid', placeItems: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(12, 18, 32, 0.1)', borderRadius: '50%', color: 'rgba(12, 18, 32, 0.28)', fontSize: '6.5rem', fontWeight: '800', boxShadow: 'inset 0 0 0 22px rgba(255, 255, 255, 0.12)' },
  grille: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '22px', padding: '18px 12px', backgroundColor: '#ffffff', borderRadius: '22px', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.05)' },
  tuile: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--ex-texte)', textDecoration: 'none' },
  tuileIcone: { display: 'grid', placeItems: 'center', width: '54px', height: '54px', borderRadius: '16px', color: '#ffffff' },
  tuileIconeSvg: { width: '24px', height: '24px' },
  tuileLabel: { fontSize: '0.74rem', fontWeight: '600', textAlign: 'center' },
  vert: { backgroundColor: '#22b573' },
  bleu: { backgroundColor: '#3b82f6' },
  orange: { backgroundColor: '#19b851' },
  violet: { backgroundColor: '#5cf066' },
  bandeau: { display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px', padding: '18px', backgroundColor: 'var(--ex-nuit)', borderRadius: '20px' },
  bandeauIcone: { display: 'grid', placeItems: 'center', flexShrink: 0, width: '46px', height: '46px', backgroundColor: 'var(--ex-jaune)', borderRadius: '12px', color: 'var(--ex-nuit)' },
  bandeauIconeSvg: { width: '24px', height: '24px' },
  bandeauTexteStrong: { display: 'block', color: '#ffffff', fontSize: '0.98rem', fontWeight: '700' },
  bandeauTexteSpan: { display: 'block', marginTop: '3px', color: 'var(--ex-jaune)', fontSize: '0.8rem', lineHeight: '1.45' },
};

export default function Accueil() {
  const router = useRouter();
  const [prenom, setPrenom] = useState(null);
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
        } else {
          setPrenom('');
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
    } catch (e) {}
  };

  if (verification || prenom === null) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f5f8' }}>
        <p style={{ color: '#0c1220', fontWeight: 'bold' }}>Chargement de votre espace...</p>
      </div>
    );
  }

  return (
    <main style={css.page}>
      <div style={css.conteneur}>
        <header style={css.entete}>
          <div style={css.salut}>
            <div style={css.avatar} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={css.avatarSvg}>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </div>
            <div>
              <span style={css.bonjour}>Bonjour</span>
              <strong style={css.nom}>{prenom || 'Bienvenue'}</strong>
            </div>
          </div>

          <button type="button" style={css.iconeBtn} onClick={partager} aria-label="Partager ExCrypt">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={css.iconeBtnSvg} aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
            </svg>
          </button>
        </header>

        <div style={css.corps}>
          <section style={css.hero}>
            <div style={css.heroTexte}>
              <h1 style={css.heroH1}>Bienvenue sur <br />ExCrypt !</h1>
              <p style={css.heroP}>Votre crypto, votre argent, votre liberté. Achetez et vendez vos cryptomonnaies simplement.</p>
              <Link href="/acheter" style={css.heroBtn}>Commencer</Link>
            </div>
            <div style={css.heroDeco} aria-hidden="true">
              <div style={css.heroCercle}>₮</div>
            </div>
          </section>

          <nav style={css.grille} aria-label="Opérations">
            <Link href="/acheter" style={css.tuile}>
              <span style={{ ...css.tuileIcone, ...css.vert }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={css.tuileIconeSvg} aria-hidden="true">
                  <path d="M12 19V5" />
                  <path d="m5 12 7-7 7 7" />
                </svg>
              </span>
              <span style={css.tuileLabel}>Acheter</span>
            </Link>

            <Link href="/vendre" style={css.tuile}>
              <span style={{ ...css.tuileIcone, ...css.bleu }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={css.tuileIconeSvg} aria-hidden="true">
                  <path d="M12 5v14" />
                  <path d="m19 12-7 7-7-7" />
                </svg>
              </span>
              <span style={css.tuileLabel}>Vendre</span>
            </Link>

            <Link href="/dashboard" style={css.tuile}>
              <span style={{ ...css.tuileIcone, ...css.orange }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={css.tuileIconeSvg} aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
              <span style={css.tuileLabel}>Historique</span>
            </Link>

            <Link href="/messages" style={css.tuile}>
              <span style={{ ...css.tuileIcone, ...css.violet }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={css.tuileIconeSvg} aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6" />
                  <path d="M12 17h.01" />
                </svg>
              </span>
              <span style={css.tuileLabel}>Support</span>
            </Link>
          </nav>

          <div style={css.bandeau}>
            <div style={css.bandeauIcone} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={css.bandeauIconeSvg}>
                <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <strong style={css.bandeauTexteStrong}>Un échange en toute simplicité</strong>
              <span style={css.bandeauTexteSpan}>Suivez les instructions et vérifiez les informations avant de confirmer.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
