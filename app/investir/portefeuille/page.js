'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ============================ STYLES ============================ */
const CSS = `
.pf-page{max-width:900px;margin:0 auto;padding:28px 20px 64px;font-family:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0f172a}
.pf-page *{box-sizing:border-box}
.pf-back{display:inline-flex;align-items:center;gap:8px;color:#475569;text-decoration:none;font-weight:600;font-size:.95rem;margin-bottom:18px}
.pf-back:hover{color:#0f172a}
.pf-titre{margin:0 0 20px;font-size:clamp(1.6rem,4vw,2.1rem);font-weight:800;letter-spacing:-.02em}
.pf-hero{position:relative;overflow:hidden;border-radius:24px;padding:28px;color:#fff;background:linear-gradient(135deg,#0f172a 0%,#065f46 60%,#10b981 100%);margin-bottom:20px;box-shadow:0 14px 34px -16px rgba(5,150,105,.7)}
.pf-hero::after{content:'';position:absolute;top:-80px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.22),transparent 70%);pointer-events:none}
.pf-hero>*{position:relative;z-index:1}
.pf-hero-label{margin:0;font-size:.78rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.85}
.pf-hero-val{margin:8px 0 12px;font-size:clamp(1.9rem,6vw,2.7rem);font-weight:800;letter-spacing:-.02em}
.pf-gain{display:inline-block;padding:5px 12px;border-radius:999px;font-size:.85rem;font-weight:700;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.3)}
.pf-stats{display:flex;gap:28px;flex-wrap:wrap;margin-top:22px;padding-top:18px;border-top:1px solid rgba(255,255,255,.22)}
.pf-stat-l{font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;opacity:.8;margin-bottom:3px}
.pf-stat-v{font-weight:700;font-size:1.05rem}
.pf-box{background:#fff;border:1px solid #e2e8f0;border-radius:20px;padding:22px;margin-bottom:24px;box-shadow:0 1px 2px rgba(15,23,42,.04)}
.pf-box h2{margin:0 0 14px;font-size:1rem;font-weight:700}
.pf-bar{display:flex;height:12px;border-radius:999px;overflow:hidden;background:#e2e8f0}
.pf-bar>span{display:block;height:100%;transition:width .4s ease}
.pf-legend{display:flex;flex-wrap:wrap;gap:8px 20px;margin-top:14px;font-size:.85rem;color:#475569}
.pf-legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:7px}
.pf-legend b{color:#0f172a}
.pf-liste-titre{margin:0 0 12px;font-size:1rem;font-weight:700}
.pf-list{display:grid;gap:12px}
.pf-row{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr) minmax(0,1.2fr);align-items:center;gap:16px;background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:16px 18px;transition:box-shadow .2s,transform .2s}
.pf-row:hover{box-shadow:0 10px 24px -14px rgba(15,23,42,.25);transform:translateY(-2px)}
.pf-id{display:flex;align-items:center;gap:14px;min-width:0}
.pf-avatar{flex-shrink:0;width:46px;height:46px;border-radius:14px;display:grid;place-items:center;font-size:1.2rem;background:color-mix(in srgb,var(--c) 14%,#fff);color:var(--c)}
.pf-badge{display:inline-block;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--c)}
.pf-nom{margin:2px 0 0;font-size:1.05rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pf-l{font-size:.72rem;font-weight:600;text-transform:uppercase;letter-spacing:.04em;color:#94a3b8;margin-bottom:3px}
.pf-v{font-weight:700;font-size:.98rem;overflow-wrap:anywhere}
.pf-up{color:#059669}
.pf-down{color:#dc2626}
.pf-pnl{font-size:.8rem;font-weight:600;margin-top:2px}
.pf-empty{padding:44px 24px;text-align:center;background:#f8fafc;border-radius:20px;border:1px dashed #cbd5e1}
.pf-empty p{margin:0 0 18px;color:#64748b}
.pf-cta{display:inline-block;padding:12px 24px;border-radius:12px;background:#0f172a;color:#fff;text-decoration:none;font-weight:700}
.pf-error{padding:14px 16px;border-radius:12px;background:#fee2e2;color:#991b1b;font-weight:600;margin-bottom:20px}
.pf-sk{border-radius:16px;background:linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);background-size:200% 100%;animation:pf-sh 1.4s infinite}
@keyframes pf-sh{0%{background-position:200% 0}100%{background-position:-200% 0}}
.pf-note{margin-top:28px;padding-top:18px;border-top:1px solid #e2e8f0;font-size:.78rem;line-height:1.6;color:#94a3b8}
@media(max-width:640px){
  .pf-row{grid-template-columns:1fr 1fr;gap:14px}
  .pf-id{grid-column:1/-1}
  .pf-hero{padding:22px}
}
@media(prefers-reduced-motion:reduce){.pf-page *{transition:none!important;animation:none!important}}
`;

/* ============================ DONNÉES ============================ */
const TAUX_USD_FCFA = 600;

// Prix simulés (USD) pour la bourse et la crypto
const PRIX_USD = {
  USDT: 1, BTC: 65000, ETH: 3500, SOL: 150, BNB: 600, XRP: 0.5, LTC: 80, DOGE: 0.15,
  AAPL: 175, TSLA: 240, MSFT: 330, AMZN: 180,
};

// Prix des parts (FCFA) pour les entreprises locales
const PRIX_PARTS_FCFA = {
  'AgroTech Bobo': 5000,
  SolarSahel: 10000,
  OuagaTrans: 25000,
};

const CATEGORIES = {
  bourse: { label: 'Bourse', couleur: '#2563eb', icone: '📈', unite: 'action(s)' },
  crypto: { label: 'Crypto', couleur: '#d97706', icone: '₿', unite: '' },
  entreprise: { label: 'Entreprise', couleur: '#059669', icone: '🏢', unite: 'part(s)' },
};
const catDe = (k) => CATEGORIES[k] || { label: k, couleur: '#64748b', icone: '💼', unite: '' };

const fcfa = (n) => `${Math.round(n).toLocaleString('fr-FR')} FCFA`;
const fmtQte = (q) =>
  Number.isInteger(q) ? q.toLocaleString('fr-FR') : q >= 1 ? q.toFixed(4) : q.toFixed(8);

function prixActuelFcfa(categorie, actif) {
  if (categorie === 'entreprise') return PRIX_PARTS_FCFA[actif] ?? 0;
  return (PRIX_USD[actif] ?? 0) * TAUX_USD_FCFA;
}

/* ============================ PAGE ============================ */
export default function PortefeuillePage() {
  const router = useRouter();
  const [investissements, setInvestissements] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    fetch('/api/investir/portefeuille')
      .then(async (r) => {
        if (r.status === 401) {
          router.replace('/investir/login');
          return null;
        }
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.erreur || 'Impossible de charger le portefeuille.');
        return data;
      })
      .then((data) => {
        if (data?.investissements) setInvestissements(data.investissements);
      })
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false));
  }, [router]);

  // Regroupe les achats d'un même actif en une seule position
  const positions = useMemo(() => {
    const map = new Map();
    for (const inv of investissements) {
      const cle = `${inv.categorie}:${inv.actif}`;
      const qte = Number(inv.quantite) || 0;
      const pa = Number(inv.prixUnitaireFcfa ?? inv.prix_unitaire_fcfa);
      const p = map.get(cle) || {
        categorie: inv.categorie,
        actif: inv.actif,
        quantite: 0,
        investi: 0,
        investiConnu: true,
      };
      p.quantite += qte;
      if (Number.isFinite(pa)) p.investi += qte * pa;
      else p.investiConnu = false;
      map.set(cle, p);
    }
    return [...map.values()]
      .map((p) => {
        const prix = prixActuelFcfa(p.categorie, p.actif);
        const valeur = prix > 0 ? p.quantite * prix : p.investiConnu ? p.investi : 0;
        return { ...p, valeur };
      })
      .sort((a, b) => b.valeur - a.valeur);
  }, [investissements]);

  const valeurTotale = positions.reduce((s, p) => s + p.valeur, 0);
  const tousConnus = positions.length > 0 && positions.every((p) => p.investiConnu);
  const investiTotal = tousConnus ? positions.reduce((s, p) => s + p.investi, 0) : 0;
  const gain = tousConnus && investiTotal > 0 ? valeurTotale - investiTotal : null;
  const gainPct = gain !== null ? (gain / investiTotal) * 100 : null;

  const repartition = Object.keys(CATEGORIES)
    .map((k) => ({
      cle: k,
      ...catDe(k),
      valeur: positions.filter((p) => p.categorie === k).reduce((s, p) => s + p.valeur, 0),
    }))
    .filter((c) => c.valeur > 0);

  if (chargement) {
    return (
      <section className="pf-page">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="pf-sk" style={{ height: 34, width: '45%', marginBottom: 20 }} />
        <div className="pf-sk" style={{ height: 190, borderRadius: 24, marginBottom: 20 }} />
        <div className="pf-sk" style={{ height: 80, marginBottom: 12 }} />
        <div className="pf-sk" style={{ height: 80 }} />
      </section>
    );
  }

  return (
    <section className="pf-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <Link href="/investir" className="pf-back">← Retour à l'espace</Link>
      <h1 className="pf-titre">Mon portefeuille</h1>

      {erreur && <div className="pf-error" role="alert">{erreur}</div>}

      {positions.length === 0 && !erreur ? (
        <div className="pf-empty">
          <p>Vous n'avez pas encore d'investissements.</p>
          <Link href="/investir" className="pf-cta">Découvrir les opportunités</Link>
        </div>
      ) : (
        positions.length > 0 && (
          <>
            <div className="pf-hero">
              <p className="pf-hero-label">Valeur totale estimée</p>
              <p className="pf-hero-val">{fcfa(valeurTotale)}</p>

              {gain !== null && (
                <span className="pf-gain">
                  {gain >= 0 ? '▲' : '▼'} {fcfa(Math.abs(gain))} (
                  {gainPct.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %)
                </span>
              )}

              <div className="pf-stats">
                {tousConnus && (
                  <div>
                    <div className="pf-stat-l">Capital investi</div>
                    <div className="pf-stat-v">{fcfa(investiTotal)}</div>
                  </div>
                )}
                <div>
                  <div className="pf-stat-l">Nombre d'actifs</div>
                  <div className="pf-stat-v">{positions.length}</div>
                </div>
              </div>
            </div>

            <div className="pf-box">
              <h2>Répartition</h2>
              <div className="pf-bar" role="img" aria-label="Répartition du portefeuille par catégorie">
                {repartition.map((c) => (
                  <span
                    key={c.cle}
                    style={{ width: `${(c.valeur / valeurTotale) * 100}%`, background: c.couleur }}
                  />
                ))}
              </div>
              <div className="pf-legend">
                {repartition.map((c) => (
                  <span key={c.cle}>
                    <i style={{ background: c.couleur }} />
                    {c.label} <b>{Math.round((c.valeur / valeurTotale) * 100)} %</b>
                  </span>
                ))}
              </div>
            </div>

            <h2 className="pf-liste-titre">Détail de vos actifs</h2>
            <div className="pf-list">
              {positions.map((p) => {
                const cat = catDe(p.categorie);
                const pnl = p.investiConnu && p.investi > 0 ? p.valeur - p.investi : null;
                const unite = p.categorie === 'crypto' ? p.actif : cat.unite;
                return (
                  <div key={`${p.categorie}:${p.actif}`} className="pf-row" style={{ '--c': cat.couleur }}>
                    <div className="pf-id">
                      <div className="pf-avatar">{cat.icone}</div>
                      <div style={{ minWidth: 0 }}>
                        <span className="pf-badge">{cat.label}</span>
                        <h3 className="pf-nom">{p.actif}</h3>
                      </div>
                    </div>

                    <div>
                      <div className="pf-l">Quantité</div>
                      <div className="pf-v">{fmtQte(p.quantite)} {unite}</div>
                    </div>

                    <div>
                      <div className="pf-l">Valeur actuelle</div>
                      <div className="pf-v">{fcfa(p.valeur)}</div>
                      {pnl !== null && (
                        <div className={`pf-pnl ${pnl >= 0 ? 'pf-up' : 'pf-down'}`}>
                          {pnl >= 0 ? '+' : '−'}{fcfa(Math.abs(pnl))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="pf-note">
              Valorisation estimée sur la base de prix indicatifs. Elle ne constitue pas une valeur de revente garantie.
            </p>
          </>
        )
      )}
    </section>
  );
}
