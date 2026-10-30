'use client';
import { useState } from 'react';
import Link from 'next/link';

const ACTIONS = [
  { code: 'AAPL', nom: 'Apple Inc.', prixUsd: 175 },
  { code: 'TSLA', nom: 'Tesla', prixUsd: 240 },
  { code: 'MSFT', nom: 'Microsoft', prixUsd: 330 },
  { code: 'AMZN', nom: 'Amazon', prixUsd: 180 },
];

export default function BoursePage() {
  const [montant, setMontant] = useState('');
  const [achatEnCours, setAchatEnCours] = useState(null);
  const [succes, setSucces] = useState('');
  const TAUX_USD_FCFA = 600;
  const montantNum = Number(montant) || 0;

  async function investir(action, quantite, prixFcfa) {
    setAchatEnCours(action.code);
    setSucces('');
    try {
      const r = await fetch('/api/investir/acheter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categorie: 'bourse', actif: action.code, quantite, prixUnitaireFcfa: prixFcfa }),
      });
      
      const data = await r.json();
      if (!r.ok) throw new Error(data.erreur || 'Erreur lors de l\'achat');
      
      setSucces(`Investissement réussi dans ${action.nom} !`);
      setMontant(''); 
      setTimeout(() => setSucces(''), 4000); 
    } catch (e) { 
      alert(e.message); 
    } finally { 
      setAchatEnCours(null); 
    }
  }

  return (
    <section className="page">
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/investir" style={{ color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>←</span> Retour
        </Link>
        <Link href="/investir/portefeuille" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
          Mon portefeuille →
        </Link>
      </div>
      
      <h1 style={{ marginBottom: 8 }}>Actions en Bourse</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>Investissez dans les plus grandes entreprises mondiales.</p>

      {succes && (
        <div style={{ padding: 16, background: '#d1fae5', color: '#065f46', borderRadius: 8, marginBottom: 24, fontWeight: 'bold' }}>
          ✅ {succes}
        </div>
      )}
      
      <div style={{ padding: 24, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 12, color: '#374151' }}>Montant à investir (FCFA)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="0" style={{ flex: 1, padding: 16, fontSize: 24, fontWeight: 'bold', borderRadius: 12, border: '1px solid #d1d5db', outline: 'none' }} />
          <span style={{ fontSize: 20, fontWeight: 'bold', color: '#9ca3af' }}>FCFA</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {ACTIONS.map((a) => {
          const prixFcfa = a.prixUsd * TAUX_USD_FCFA;
          const quantite = montantNum > 0 ? (montantNum / prixFcfa) : 0;
          return (
            <div key={a.code} style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e0e7ff', color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {a.code[0]}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{a.nom}</h3>
                  <span style={{ fontSize: 14, color: '#6b7280' }}>{a.code}</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Prix</div>
                <div style={{ fontWeight: 'bold' }}>{prixFcfa.toLocaleString('fr-FR')} FCFA</div>
              </div>

              <div style={{ textAlign: 'right', minWidth: 120 }}>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Vous obtenez</div>
                <div style={{ fontWeight: 'bold', color: '#1e3a8a' }}>{quantite > 0 ? `${quantite.toFixed(4)} actions` : '—'}</div>
              </div>

              <button 
                className="bouton plein" 
                disabled={quantite <= 0 || achatEnCours === a.code}
                onClick={() => investir(a, quantite, prixFcfa)}
                style={{ padding: '10px 24px', borderRadius: 8 }}
              >
                {achatEnCours === a.code ? '...' : 'Investir'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
