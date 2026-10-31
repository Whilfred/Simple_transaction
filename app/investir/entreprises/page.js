'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

/* ============================ STYLES ============================ */
const CSS = `
.iv-page{max-width:900px;margin:0 auto;padding:28px 20px 64px;font-family:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0f172a;--accent:#059669}
.iv-page *{box-sizing:border-box}
.iv-topbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:22px}
.iv-back{display:inline-flex;align-items:center;gap:8px;color:#475569;text-decoration:none;font-weight:600;font-size:.95rem;background:none;border:0;padding:0;cursor:pointer;font-family:inherit}
.iv-back:hover{color:#0f172a}
.iv-pill{display:inline-flex;align-items:center;padding:9px 16px;border-radius:999px;background:#0f172a;color:#fff;text-decoration:none;font-weight:600;font-size:.88rem}
.iv-hero{position:relative;overflow:hidden;border-radius:24px;padding:28px;color:#fff;background:linear-gradient(135deg,#065f46 0%,#059669 55%,#10b981 100%);margin-bottom:24px;box-shadow:0 14px 34px -16px #059669}
.iv-hero::after{content:'';position:absolute;top:-70px;right:-50px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.28),transparent 70%);pointer-events:none}
.iv-hero>*{position:relative;z-index:1}
.iv-hero h1{margin:0 0 6px;font-size:clamp(1.5rem,4vw,2rem);font-weight:800;letter-spacing:-.02em}
.iv-hero p{margin:0;opacity:.92;max-width:520px;line-height:1.5}
.iv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px}
.iv-card{display:flex;flex-direction:column;gap:14px;text-align:left;font-family:inherit;color:inherit;background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:20px;cursor:pointer;transition:transform .25s,box-shadow .25s,border-color .25s}
.iv-card:hover{transform:translateY(-5px);border-color:#cbd5e1;box-shadow:0 18px 34px -20px rgba(15,23,42,.35)}
.iv-card:focus-visible{outline:3px solid #0f172a;outline-offset:3px}
.iv-avatar{width:48px;height:48px;border-radius:14px;display:grid;place-items:center;font-size:1.4rem;background:#d1fae5}
.iv-nom{margin:0;font-size:1.15rem;font-weight:800}
.iv-sub{font-size:.85rem;color:#64748b}
.iv-rend{display:inline-block;padding:3px 10px;border-radius:999px;font-size:.78rem;font-weight:700;background:#d1fae5;color:#065f46}
.iv-card-foot{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:14px;border-top:1px solid #f1f5f9}
.iv-l{font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#94a3b8;margin-bottom:3px}
.iv-v{font-weight:700;font-size:.95rem}
.iv-voir{font-weight:700;font-size:.88rem;color:#059669}
.iv-box{background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:22px;margin-bottom:20px}
.iv-box h2{margin:0 0 10px;font-size:1.05rem;font-weight:800}
.iv-box p{margin:0;color:#475569;line-height:1.65}
.iv-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}
.iv-stat{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:16px}
.iv-stat .iv-v{font-size:1.1rem}
.iv-vert{color:#059669}
.iv-btn{width:100%;border:0;cursor:pointer;font-family:inherit;font-weight:800;font-size:1rem;color:#fff;background:linear-gradient(135deg,#065f46,#059669);padding:15px;border-radius:14px;transition:filter .2s,transform .15s,opacity .2s}
.iv-btn:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px)}
.iv-btn:disabled{opacity:.45;cursor:not-allowed}
.iv-btn.sec{width:auto;background:#fff;color:#334155;border:1.5px solid #cbd5e1;padding:14px 20px;font-weight:700}
.iv-stepper{display:flex;align-items:center;gap:10px;margin:14px 0}
.iv-sbtn{width:50px;height:50px;border:1.5px solid #cbd5e1;border-radius:14px;background:#fff;font-size:1.5rem;font-weight:700;cursor:pointer;font-family:inherit}
.iv-sbtn:hover:not(:disabled){border-color:#059669;color:#059669}
.iv-sbtn:disabled{opacity:.35;cursor:not-allowed}
.iv-sinput{flex:1;min-width:0;height:50px;text-align:center;border:1.5px solid #cbd5e1;border-radius:14px;font-size:1.5rem;font-weight:800;font-family:inherit;outline:0;-moz-appearance:textfield}
.iv-sinput::-webkit-outer-spin-button,.iv-sinput::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.iv-sinput:focus{border-color:#059669;box-shadow:0 0 0 4px rgba(5,150,105,.15)}
.iv-total{display:flex;justify-content:space-between;align-items:center;padding:16px;border-radius:16px;background:#ecfdf5;margin-bottom:16px;color:#065f46;font-weight:600}
.iv-total b{font-size:1.35rem;font-weight:800}
.iv-actions{display:flex;gap:10px}
.iv-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:50;max-width:calc(100% - 32px);padding:13px 20px;border-radius:14px;font-weight:600;font-size:.92rem;color:#fff;box-shadow:0 14px 30px -10px rgba(15,23,42,.35);animation:iv-up .25s ease}
.iv-toast.ok{background:#065f46}
.iv-toast.err{background:#991b1b}
@keyframes iv-up{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
.iv-note{margin-top:28px;padding-top:18px;border-top:1px solid #e2e8f0;font-size:.78rem;line-height:1.6;color:#94a3b8}
@media(max-width:640px){.iv-stats{grid-template-columns:1fr}.iv-hero{padding:22px}}
@media(prefers-reduced-motion:reduce){.iv-page *{transition:none!important;animation:none!important}}
`;

/* ============================ DONNÉES ============================ */
const ENTREPRISES = [
  {
    code: 'E1',
    nom: 'AgroTech Bobo',
    secteur: 'Agriculture',
    emoji: '🌾',
    prixPart: 5000,
    rendement: '12% / an',
    description:
      "AgroTech Bobo produit et transforme des céréales et des produits maraîchers pour les marchés locaux. Les fonds servent à moderniser les équipements et à financer la prochaine campagne.",
  },
  {
    code: 'E2',
    nom: 'SolarSahel',
    secteur: 'Énergie',
    emoji: '☀️',
    prixPart: 10000,
    rendement: '15% / an',
    description:
      "SolarSahel installe des kits solaires pour les foyers, commerces et centres de santé situés hors du réseau électrique. Les fonds servent à acheter des équipements et à déployer de nouvelles installations.",
  },
  {
    code: 'E3',
    nom: 'OuagaTrans',
    secteur: 'Logistique',
    emoji: '🚚',
    prixPart: 25000,
    rendement: '10% / an',
    description:
      "OuagaTrans transporte des marchandises pour des entreprises à Ouagadougou et dans la sous-région. Les fonds servent à acheter de nouveaux camions et à renouveler la flotte.",
  },
];

const fcfa = (n) => `${Math.round(n).toLocaleString('fr-FR')} FCFA`;

/* ============================ PAGE ============================ */
export default function EntreprisesPage() {
  const [choix, setChoix] = useState(null); // entreprise sélectionnée
  const [ouvert, setOuvert] = useState(false); // panneau "investir" ouvert
  const [parts, setParts] = useState(1);
  const [envoi, setEnvoi] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  function selectionner(e) {
    setChoix(e);
    setParts(1);
    setOuvert(false);
    window.scrollTo({ top: 0 });
  }

  function retour() {
    setChoix(null);
    setOuvert(false);
  }

  async function confirmer() {
    setEnvoi(true);
    try {
      const r = await fetch('/api/investir/acheter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categorie: 'entreprise',
          actif: choix.nom,
          quantite: parts,
          prixUnitaireFcfa: choix.prixPart,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.erreur || "Erreur lors de l'achat");
      setToast({ type: 'ok', texte: `Vous avez investi ${fcfa(parts * choix.prixPart)} dans ${choix.nom}.` });
      setOuvert(false);
      setParts(1);
    } catch (err) {
      setToast({ type: 'err', texte: err.message || 'Erreur réseau, réessayez.' });
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <section className="iv-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ============ LISTE ============ */}
      {!choix && (
        <>
          <div className="iv-topbar">
            <Link href="/investir" className="iv-back">← Retour</Link>
            <Link href="/investir/portefeuille" className="iv-pill">Mon portefeuille →</Link>
          </div>

          <header className="iv-hero">
            <h1>Entreprises locales</h1>
            <p>Choisissez une PME africaine pour découvrir son projet, puis décidez d'investir.</p>
          </header>

          <div className="iv-grid">
            {ENTREPRISES.map((e) => (
              <button key={e.code} type="button" className="iv-card" onClick={() => selectionner(e)}>
                <div className="iv-avatar">{e.emoji}</div>
                <div>
                  <h2 className="iv-nom">{e.nom}</h2>
                  <span className="iv-sub">{e.secteur}</span>
                </div>
                <div><span className="iv-rend">{e.rendement}</span></div>
                <div className="iv-card-foot">
                  <div>
                    <div className="iv-l">Prix / part</div>
                    <div className="iv-v">{fcfa(e.prixPart)}</div>
                  </div>
                  <span className="iv-voir">Voir le détail →</span>
                </div>
              </button>
            ))}
          </div>

          <p className="iv-note">
            L'investissement dans des entreprises non cotées comporte un risque de perte partielle ou totale
            du capital. Les rendements indiqués sont des objectifs et ne sont pas garantis.
          </p>
        </>
      )}

      {/* ============ DÉTAIL ============ */}
      {choix && (
        <>
          <div className="iv-topbar">
            <button type="button" className="iv-back" onClick={retour}>← Toutes les entreprises</button>
            <Link href="/investir/portefeuille" className="iv-pill">Mon portefeuille →</Link>
          </div>

          <header className="iv-hero">
            <h1>{choix.emoji} {choix.nom}</h1>
            <p>{choix.secteur}</p>
          </header>

          <div className="iv-stats">
            <div className="iv-stat">
              <div className="iv-l">Rendement visé</div>
              <div className="iv-v iv-vert">{choix.rendement}</div>
            </div>
            <div className="iv-stat">
              <div className="iv-l">Prix d'une part</div>
              <div className="iv-v">{fcfa(choix.prixPart)}</div>
            </div>
            <div className="iv-stat">
              <div className="iv-l">Secteur</div>
              <div className="iv-v">{choix.secteur}</div>
            </div>
          </div>

          <div className="iv-box">
            <h2>À propos</h2>
            <p>{choix.description}</p>
          </div>

          {!ouvert ? (
            <button className="iv-btn" onClick={() => setOuvert(true)}>
              Investir dans {choix.nom}
            </button>
          ) : (
            <div className="iv-box">
              <h2>Combien de parts souhaitez-vous ?</h2>
              <p>{fcfa(choix.prixPart)} par part. Les parts sont indivisibles.</p>

              <div className="iv-stepper">
                <button className="iv-sbtn" onClick={() => setParts((p) => Math.max(1, p - 1))} disabled={parts <= 1 || envoi} aria-label="Retirer une part">−</button>
                <input
                  className="iv-sinput"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  value={parts}
                  disabled={envoi}
                  onChange={(ev) => {
                    const n = parseInt(ev.target.value, 10);
                    setParts(Number.isNaN(n) ? 1 : Math.max(1, n));
                  }}
                  aria-label="Nombre de parts"
                />
                <button className="iv-sbtn" onClick={() => setParts((p) => p + 1)} disabled={envoi} aria-label="Ajouter une part">+</button>
              </div>

              <div className="iv-total">
                <span>Total à investir</span>
                <b>{fcfa(parts * choix.prixPart)}</b>
              </div>

              <div className="iv-actions">
                <button className="iv-btn sec" onClick={() => setOuvert(false)} disabled={envoi}>Annuler</button>
                <button className="iv-btn" onClick={confirmer} disabled={envoi}>
                  {envoi ? 'Traitement…' : 'Confirmer'}
                </button>
              </div>
            </div>
          )}

          <p className="iv-note">
            Investir comporte un risque de perte partielle ou totale du capital. Le rendement n'est pas garanti
            et la revente des parts peut être difficile avant l'échéance.
          </p>
        </>
      )}

      {toast && (
        <div className={`iv-toast ${toast.type}`} role="status">
          {toast.type === 'ok' ? '✓ ' : '⚠ '}{toast.texte}
        </div>
      )}
    </section>
  );
}
