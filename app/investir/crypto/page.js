'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { CRYPTOS } from '@/lib/config';

/* ============================ STYLES ============================ */
const CSS = `
.iv-page{max-width:960px;margin:0 auto;padding:28px 20px 64px;font-family:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0f172a}
.iv-page *{box-sizing:border-box}
.iv-topbar{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:22px}
.iv-back{display:inline-flex;align-items:center;gap:8px;color:#475569;text-decoration:none;font-weight:600;font-size:.95rem;background:none;border:0;padding:0;cursor:pointer;font-family:inherit}
.iv-back:hover{color:#0f172a}
.iv-pill{display:inline-flex;align-items:center;padding:9px 16px;border-radius:999px;background:#0f172a;color:#fff;text-decoration:none;font-weight:600;font-size:.88rem}
.iv-hero{position:relative;overflow:hidden;border-radius:24px;padding:28px;color:#fff;background:var(--grad);margin-bottom:24px;box-shadow:0 14px 34px -16px var(--accent)}
.iv-hero::after{content:'';position:absolute;top:-70px;right:-50px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.28),transparent 70%);pointer-events:none}
.iv-hero>*{position:relative;z-index:1}
.iv-hero h1{margin:0 0 6px;font-size:clamp(1.5rem,4vw,2rem);font-weight:800;letter-spacing:-.02em}
.iv-hero p{margin:0;opacity:.92;max-width:520px;line-height:1.5}
.iv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px}
.iv-card{display:flex;flex-direction:column;gap:14px;text-align:left;font-family:inherit;color:inherit;background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:20px;cursor:pointer;transition:transform .25s,box-shadow .25s,border-color .25s}
.iv-card:hover{transform:translateY(-5px);border-color:#cbd5e1;box-shadow:0 18px 34px -20px rgba(15,23,42,.35)}
.iv-card:focus-visible{outline:3px solid #0f172a;outline-offset:3px}
.iv-card-top{display:flex;justify-content:space-between;align-items:center}
.iv-avatar{flex-shrink:0;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;font-weight:800;background:color-mix(in srgb,var(--accent) 12%,#fff);color:var(--accent);overflow:hidden}
.iv-avatar img{width:30px;height:30px;object-fit:contain}
.iv-nom{margin:0;font-size:1.1rem;font-weight:800}
.iv-sub{font-size:.84rem;color:#64748b}
.iv-var{display:inline-block;padding:4px 10px;border-radius:999px;font-size:.78rem;font-weight:800}
.iv-var.up{background:#dcfce7;color:#166534}
.iv-var.down{background:#fee2e2;color:#991b1b}
.iv-risque{display:inline-block;padding:4px 10px;border-radius:999px;font-size:.74rem;font-weight:700}
.iv-risque.stable{background:#dcfce7;color:#166534}
.iv-risque.eleve{background:#fef3c7;color:#92400e}
.iv-risque.tres{background:#fee2e2;color:#991b1b}
.iv-prix{font-size:1.3rem;font-weight:800;letter-spacing:-.01em}
.iv-spark{width:100%;height:46px;display:block}
.iv-l{font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#94a3b8;margin-bottom:3px}
.iv-v{font-weight:700;font-size:.98rem}
.iv-search{width:100%;margin-bottom:20px;padding:13px 16px;border:1.5px solid #e2e8f0;border-radius:14px;font-size:1rem;font-family:inherit;outline:0;background:#fff}
.iv-search:focus{border-color:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 18%,transparent)}
.iv-vide{padding:32px;text-align:center;color:#94a3b8;background:#f8fafc;border-radius:16px}
.iv-dhead{display:flex;align-items:center;gap:14px;margin-bottom:4px}
.iv-dhead h1{margin:0;font-size:1.5rem;font-weight:800}
.iv-big{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin:12px 0 18px}
.iv-big b{font-size:clamp(2rem,6vw,2.8rem);font-weight:800;letter-spacing:-.02em}
.iv-box{background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:22px;margin-bottom:20px}
.iv-box h2{margin:0 0 10px;font-size:1.05rem;font-weight:800}
.iv-box p{margin:0;color:#475569;line-height:1.65}
.iv-chart-top{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap}
.iv-tabs{display:flex;gap:6px}
.iv-tab{border:0;background:#f1f5f9;color:#475569;font-weight:700;font-size:.82rem;padding:7px 14px;border-radius:999px;cursor:pointer;font-family:inherit}
.iv-tab.on{background:var(--accent);color:#fff}
.iv-hover{font-size:.88rem;color:#64748b}
.iv-hover b{color:#0f172a}
.iv-chart{width:100%;height:auto;display:block;touch-action:pan-y;cursor:crosshair}
.iv-mini{margin:8px 0 0;font-size:.74rem;color:#94a3b8}
.iv-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}
.iv-stat{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:16px}
.iv-alerte{display:flex;gap:12px;align-items:flex-start;padding:16px 18px;border-radius:16px;background:#fffbeb;border:1px solid #fde68a;color:#92400e;font-size:.9rem;line-height:1.55;margin-bottom:20px}
.iv-btn{width:100%;border:0;cursor:pointer;font-family:inherit;font-weight:800;font-size:1rem;color:#fff;background:var(--accent);padding:15px;border-radius:14px;transition:filter .2s,transform .15s,opacity .2s}
.iv-btn:hover:not(:disabled){filter:brightness(1.08);transform:translateY(-1px)}
.iv-btn:disabled{opacity:.45;cursor:not-allowed}
.iv-btn.sec{width:auto;background:#fff;color:#334155;border:1.5px solid #cbd5e1;padding:14px 20px;font-weight:700}
.iv-input-wrap{display:flex;align-items:center;gap:10px;border:1.5px solid #cbd5e1;border-radius:14px;padding:0 16px;background:#f8fafc;margin:14px 0 12px}
.iv-input-wrap:focus-within{border-color:var(--accent);box-shadow:0 0 0 4px color-mix(in srgb,var(--accent) 18%,transparent);background:#fff}
.iv-input{flex:1;min-width:0;border:0;outline:0;background:transparent;font-size:1.6rem;font-weight:800;padding:13px 0;font-family:inherit;-moz-appearance:textfield}
.iv-input::-webkit-outer-spin-button,.iv-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
.iv-input::placeholder{color:#cbd5e1}
.iv-suffix{font-weight:700;color:#94a3b8}
.iv-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.iv-chip{border:1px solid #e2e8f0;background:#fff;border-radius:999px;padding:7px 14px;font-size:.84rem;font-weight:600;color:#334155;cursor:pointer;font-family:inherit}
.iv-chip:hover{border-color:var(--accent);color:var(--accent)}
.iv-total{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:16px;border-radius:16px;background:color-mix(in srgb,var(--accent) 10%,#fff);margin-bottom:16px;font-weight:600;color:#0f172a}
.iv-total b{font-size:1.2rem;font-weight:800;color:var(--accent);text-align:right;overflow-wrap:anywhere}
.iv-actions{display:flex;gap:10px}
.iv-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:50;max-width:calc(100% - 32px);padding:13px 20px;border-radius:14px;font-weight:600;font-size:.92rem;color:#fff;box-shadow:0 14px 30px -10px rgba(15,23,42,.35);animation:iv-up .25s ease}
.iv-toast.ok{background:#065f46}
.iv-toast.err{background:#991b1b}
@keyframes iv-up{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
.iv-note{margin-top:28px;padding-top:18px;border-top:1px solid #e2e8f0;font-size:.78rem;line-height:1.6;color:#94a3b8}
@media(max-width:640px){.iv-stats{grid-template-columns:1fr}.iv-hero{padding:22px}.iv-input{font-size:1.4rem}}
@media(prefers-reduced-motion:reduce){.iv-page *{transition:none!important;animation:none!important}}
`;

/* ============================ DONNÉES ============================ */
const TAUX_USD_FCFA = 600;
const MONTANTS_RAPIDES = [10000, 50000, 100000, 500000];

// Prix simulés (USD)
const PRIX_SIMULES = { USDT: 1, BTC: 65000, ETH: 3500, SOL: 150, BNB: 600, XRP: 0.5, LTC: 80, DOGE: 0.15 };

// Volatilité simulée par crypto (sert uniquement à dessiner la courbe)
const VOLAT = { USDT: 0.0006, BTC: 0.02, ETH: 0.025, SOL: 0.035, BNB: 0.022, XRP: 0.03, LTC: 0.028, DOGE: 0.04 };

const RISQUES = {
  USDT: { label: 'Stable', classe: 'stable' },
  BTC: { label: 'Risque élevé', classe: 'eleve' },
  ETH: { label: 'Risque élevé', classe: 'eleve' },
  BNB: { label: 'Risque élevé', classe: 'eleve' },
};
const risqueDe = (code) => RISQUES[code] || { label: 'Très volatile', classe: 'tres' };

const DESCRIPTIONS = {
  USDT: "Le Tether (USDT) est un « stablecoin » : sa valeur est conçue pour rester proche de 1 dollar. Il sert de monnaie refuge et de moyen d'échange entre cryptos.",
  BTC: "Le Bitcoin est la première et la plus connue des crypto-monnaies. Son nombre d'unités est limité à 21 millions, ce qui le fait souvent comparer à de l'« or numérique ».",
  ETH: "Ethereum est une plateforme sur laquelle fonctionnent des milliers d'applications et de contrats automatiques. Sa monnaie, l'ether (ETH), sert à payer leur fonctionnement.",
  SOL: "Solana est un réseau conçu pour traiter un très grand nombre de transactions rapidement et à faible coût. Sa monnaie s'appelle SOL.",
  BNB: "BNB est la monnaie de l'écosystème Binance et de la BNB Chain. Elle sert notamment à payer des frais de transaction.",
  XRP: "XRP est la monnaie du réseau XRP Ledger, pensé pour accélérer les paiements et les transferts d'argent internationaux.",
  LTC: "Le Litecoin est une crypto-monnaie créée en 2011 pour effectuer des paiements plus rapides et moins coûteux que le Bitcoin.",
  DOGE: "Le Dogecoin est né comme une blague en 2013 avant de devenir très populaire. Son prix réagit fortement aux modes et aux réseaux sociaux.",
};

const PERIODES = {
  '1J': { pts: 24, f: 0.3 },
  '1S': { pts: 28, f: 0.7 },
  '1M': { pts: 45, f: 1 },
  '1A': { pts: 90, f: 3 },
};

const fcfa = (n) => `${Math.round(n).toLocaleString('fr-FR')} FCFA`;
const fmtVar = (v) => `${v >= 0 ? '+' : '−'}${Math.abs(v).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} %`;
const fmtQte = (q) => (q >= 1 ? q.toFixed(4) : q.toFixed(8));

// Courbe simulée, toujours identique pour une même crypto et une même période
function donnees(code, periode, prixFcfa, volat) {
  const { pts, f } = PERIODES[periode];
  let seed = 11;
  for (const c of code + periode) seed = (Math.imul(seed, 31) + c.charCodeAt(0)) >>> 0;
  const rnd = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const brut = [1];
  for (let i = 1; i < pts; i++) brut.push(brut[i - 1] * (1 + (rnd() - 0.5) * volat * f));
  const dernier = brut[pts - 1];
  const valeurs = brut.map((v) => (v / dernier) * prixFcfa);
  return { valeurs, variation: (valeurs[pts - 1] / valeurs[0] - 1) * 100 };
}

/* ============================ COMPOSANTS ============================ */
function Logo({ c }) {
  const [erreur, setErreur] = useState(false);
  if (!c.logo || erreur) return <>{String(c.code).slice(0, 1)}</>;
  return <img src={c.logo} alt="" onError={() => setErreur(true)} />;
}

function Spark({ valeurs, up }) {
  const min = Math.min(...valeurs);
  const max = Math.max(...valeurs);
  const pts = valeurs
    .map((v, i) => `${(i / (valeurs.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 26}`)
    .join(' ');
  return (
    <svg className="iv-spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={up ? '#16a34a' : '#dc2626'} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Chart({ valeurs, up }) {
  const [survol, setSurvol] = useState(null);
  const W = 600, H = 220, P = 10;
  const min = Math.min(...valeurs);
  const max = Math.max(...valeurs);
  const x = (i) => P + (i / (valeurs.length - 1)) * (W - 2 * P);
  const y = (v) => P + (1 - (v - min) / (max - min || 1)) * (H - 2 * P);
  const ligne = valeurs.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const aire = `${ligne} L${x(valeurs.length - 1)},${H} L${x(0)},${H} Z`;
  const couleur = up ? '#16a34a' : '#dc2626';
  const i = survol ?? valeurs.length - 1;

  function bouger(e) {
    const r = e.currentTarget.getBoundingClientRect();
    const rel = (e.clientX - r.left) / r.width;
    setSurvol(Math.max(0, Math.min(valeurs.length - 1, Math.round(rel * (valeurs.length - 1)))));
  }

  return (
    <>
      <div className="iv-hover">Prix : <b>{fcfa(valeurs[i])}</b></div>
      <svg className="iv-chart" viewBox={`0 0 ${W} ${H}`} onPointerMove={bouger} onPointerLeave={() => setSurvol(null)} role="img" aria-label="Évolution du prix">
        <defs>
          <linearGradient id="iv-aire" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={couleur} stopOpacity=".25" />
            <stop offset="100%" stopColor={couleur} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={aire} fill="url(#iv-aire)" />
        <path d={ligne} fill="none" stroke={couleur} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {survol !== null && <line x1={x(i)} x2={x(i)} y1="0" y2={H} stroke="#94a3b8" strokeDasharray="4 4" />}
        <circle cx={x(i)} cy={y(valeurs[i])} r="5" fill="#fff" stroke={couleur} strokeWidth="3" />
      </svg>
    </>
  );
}

/* ============================ PAGE ============================ */
export default function CryptoPage() {
  const [choix, setChoix] = useState(null);
  const [periode, setPeriode] = useState('1S');
  const [recherche, setRecherche] = useState('');
  const [ouvert, setOuvert] = useState(false);
  const [montant, setMontant] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  const prixDe = (c) => (PRIX_SIMULES[c.code] || 1) * TAUX_USD_FCFA;
  const volatDe = (c) => VOLAT[c.code] || 0.03;

  // Variation sur 1 semaine pour chaque carte
  const resumes = useMemo(
    () => Object.fromEntries(CRYPTOS.map((c) => [c.code, donnees(c.code, '1S', prixDe(c), volatDe(c))])),
    []
  );

  const detail = useMemo(
    () => (choix ? donnees(choix.code, periode, prixDe(choix), volatDe(choix)) : null),
    [choix, periode]
  );

  function selectionner(c) {
    setChoix(c);
    setPeriode('1S');
    setOuvert(false);
    setMontant('');
    window.scrollTo({ top: 0 });
  }

  const prixFcfa = choix ? prixDe(choix) : 0;
  const montantNum = Number(montant) || 0;
  const quantite = prixFcfa > 0 ? montantNum / prixFcfa : 0;

  async function confirmer() {
    setEnvoi(true);
    try {
      const r = await fetch('/api/investir/acheter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categorie: 'crypto', actif: choix.code, quantite, prixUnitaireFcfa: prixFcfa }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.erreur || "Erreur lors de l'achat");
      setToast({ type: 'ok', texte: `Investissement réussi : ${fmtQte(quantite)} ${choix.code}.` });
      setOuvert(false);
      setMontant('');
    } catch (e) {
      setToast({ type: 'err', texte: e.message || 'Erreur réseau, réessayez.' });
    } finally {
      setEnvoi(false);
    }
  }

  const q = recherche.trim().toLowerCase();
  const liste = CRYPTOS.filter((c) => !q || c.nom.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));

  return (
    <section
      className="iv-page"
      style={{ '--accent': '#d97706', '--grad': 'linear-gradient(135deg,#b45309 0%,#d97706 55%,#f59e0b 100%)' }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* ============ LISTE ============ */}
      {!choix && (
        <>
          <div className="iv-topbar">
            <Link href="/investir" className="iv-back">← Retour</Link>
            <Link href="/investir/portefeuille" className="iv-pill">Mon portefeuille →</Link>
          </div>

          <header className="iv-hero">
            <h1>Crypto-monnaies</h1>
            <p>Explorez les actifs numériques, comprenez ce qu'ils sont, puis investissez à votre rythme.</p>
          </header>

          <input
            className="iv-search"
            type="search"
            placeholder="Rechercher une crypto (Bitcoin, ETH…)"
            aria-label="Rechercher une crypto"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />

          <div className="iv-grid">
            {liste.length === 0 && <div className="iv-vide" style={{ gridColumn: '1/-1' }}>Aucune crypto ne correspond à votre recherche.</div>}

            {liste.map((c) => {
              const { valeurs, variation } = resumes[c.code];
              const up = variation >= 0;
              const risque = risqueDe(c.code);
              return (
                <button key={c.code} type="button" className="iv-card" onClick={() => selectionner(c)}>
                  <div className="iv-card-top">
                    <div className="iv-avatar"><Logo c={c} /></div>
                    <span className={`iv-var ${up ? 'up' : 'down'}`}>{up ? '▲' : '▼'} {fmtVar(variation)}</span>
                  </div>
                  <div>
                    <h2 className="iv-nom">{c.nom}</h2>
                    <span className="iv-sub">{c.code}</span>
                  </div>
                  <Spark valeurs={valeurs} up={up} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8 }}>
                    <div>
                      <div className="iv-l">Prix</div>
                      <div className="iv-prix">{fcfa(prixDe(c))}</div>
                    </div>
                    <span className={`iv-risque ${risque.classe}`}>{risque.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="iv-note">
            Variations sur 7 jours, à titre indicatif. Les crypto-monnaies sont des actifs à très forte volatilité :
            vous pouvez perdre tout ou partie du capital investi.
          </p>
        </>
      )}

      {/* ============ DÉTAIL ============ */}
      {choix && detail && (
        <>
          <div className="iv-topbar">
            <button type="button" className="iv-back" onClick={() => setChoix(null)}>← Toutes les cryptos</button>
            <Link href="/investir/portefeuille" className="iv-pill">Mon portefeuille →</Link>
          </div>

          <div className="iv-dhead">
            <div className="iv-avatar"><Logo c={choix} /></div>
            <div>
              <h1>{choix.nom}</h1>
              <span className="iv-sub">{choix.code}</span>
            </div>
          </div>

          <div className="iv-big">
            <b>{fcfa(prixFcfa)}</b>
            <span className={`iv-var ${detail.variation >= 0 ? 'up' : 'down'}`}>
              {detail.variation >= 0 ? '▲' : '▼'} {fmtVar(detail.variation)} sur {periode}
            </span>
          </div>

          <div className="iv-box">
            <div className="iv-chart-top">
              <h2 style={{ margin: 0 }}>Évolution du prix</h2>
              <div className="iv-tabs" role="tablist">
                {Object.keys(PERIODES).map((p) => (
                  <button key={p} role="tab" aria-selected={periode === p} className={`iv-tab${periode === p ? ' on' : ''}`} onClick={() => setPeriode(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <Chart valeurs={detail.valeurs} up={detail.variation >= 0} />
            <p className="iv-mini">Courbe indicative (simulée). Survolez le graphique pour voir le prix à chaque instant.</p>
          </div>

          <div className="iv-stats">
            <div className="iv-stat"><div className="iv-l">Prix en dollars</div><div className="iv-v">{(PRIX_SIMULES[choix.code] || 1).toLocaleString('fr-FR')} USD</div></div>
            <div className="iv-stat"><div className="iv-l">Variation ({periode})</div><div className="iv-v">{fmtVar(detail.variation)}</div></div>
            <div className="iv-stat"><div className="iv-l">Niveau de risque</div><div className="iv-v">{risqueDe(choix.code).label}</div></div>
          </div>

          <div className="iv-box">
            <h2>Qu'est-ce que {choix.nom} ?</h2>
            <p>{DESCRIPTIONS[choix.code] || `${choix.nom} (${choix.code}) est une crypto-monnaie échangeable sur les plateformes d'actifs numériques.`}</p>
          </div>

          {choix.code !== 'USDT' && (
            <div className="iv-alerte">
              <span aria-hidden="true">⚠️</span>
              <span>Le prix de cette crypto peut varier très fortement en peu de temps. N'investissez que ce que vous pouvez vous permettre de perdre.</span>
            </div>
          )}

          {!ouvert ? (
            <button className="iv-btn" onClick={() => setOuvert(true)}>Investir dans {choix.nom}</button>
          ) : (
            <div className="iv-box">
              <h2>Quel montant souhaitez-vous investir ?</h2>
              <div className="iv-input-wrap">
                <input
                  className="iv-input"
                  type="number"
                  inputMode="numeric"
                  min="0"
                  placeholder="0"
                  value={montant}
                  disabled={envoi}
                  onChange={(e) => setMontant(e.target.value)}
                  aria-label="Montant à investir en FCFA"
                />
                <span className="iv-suffix">FCFA</span>
              </div>
              <div className="iv-chips">
                {MONTANTS_RAPIDES.map((m) => (
                  <button key={m} type="button" className="iv-chip" onClick={() => setMontant(String(m))}>
                    {m.toLocaleString('fr-FR')}
                  </button>
                ))}
              </div>

              <div className="iv-total">
                <span>Vous obtenez</span>
                <b>{quantite > 0 ? `${fmtQte(quantite)} ${choix.code}` : '—'}</b>
              </div>

              <div className="iv-actions">
                <button className="iv-btn sec" onClick={() => setOuvert(false)} disabled={envoi}>Annuler</button>
                <button className="iv-btn" onClick={confirmer} disabled={quantite <= 0 || envoi}>
                  {envoi ? 'Traitement…' : 'Confirmer'}
                </button>
              </div>
            </div>
          )}

          <p className="iv-note">
            1 USD = {TAUX_USD_FCFA} FCFA · Prix indicatifs. Les crypto-monnaies comportent un risque élevé de perte en capital.
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
