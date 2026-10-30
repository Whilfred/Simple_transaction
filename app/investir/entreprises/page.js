'use client';
import { useState } from 'react';
import Link from 'next/link';

const ENTREPRISES = [
  { code: 'E1', nom: 'AgroTech Bobo', secteur: 'Agriculture', prixPart: 5000, rendement: '12% / an' },
  { code: 'E2', nom: 'SolarSahel', secteur: 'Énergie', prixPart: 10000, rendement: '15% / an' },
  { code: 'E3', nom: 'OuagaTrans', secteur: 'Logistique', prixPart: 25000, rendement: '10% / an' },
];

export default function EntreprisesPage() {
  const [montant, setMontant] = useState('');
  const [achatEnCours, setAchatEnCours] = useState(null);
  const montantNum = Number(montant) || 0;

  async function investir(entreprise, quantite, prixFcfa) {
    setAchatEnCours(entreprise.code);
    try {
      const r = await fetch('/api/investir/acheter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categorie: 'entreprise', actif: entreprise.nom, quantite, prixUnitaireFcfa: prixFcfa }),
      });
      if (!r.ok) throw new Error('Erreur lors de l\'achat');
      alert(`Succès ! Vous avez investi dans ${entreprise.nom}.`);
      setMontant('');
    } catch (e) { alert(e.message); } 
    finally { setAchatEnCours(null); }
  }

  return (
    <section className="page">
      <div style={{ marginBottom: 24 }}>
        <Link href="/investir" style={{ color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>←</span> Retour
        </Link>
      </div>
      
      <h1 style={{ marginBottom: 8 }}>Entreprises Locales</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>Investissez dans les PME africaines non-cotées.</p>
      
      <div style={{ padding: 24, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: 12, color: '#374151' }}>Montant à investir (FCFA)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="0" style={{ flex: 1, padding: 16, fontSize: 24, fontWeight: 'bold', borderRadius: 12, border: '1px solid #d1d5db', outline: 'none' }} />
          <span style={{ fontSize: 20, fontWeight: 'bold', color: '#9ca3af' }}>FCFA</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {ENTREPRISES.map((e) => {
          const quantite = montantNum > 0 ? Math.floor(montantNum / e.prixPart) : 0;
          return (
            <div key={e.code} style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#d1fae5', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  🏢
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{e.nom}</h3>
                  <span style={{ fontSize: 14, color: '#6b7280' }}>{e.secteur} · {e.rendement}</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Prix / part</div>
                <div style={{ fontWeight: 'bold' }}>{e.prixPart.toLocaleString('fr-FR')} FCFA</div>
              </div>

              <div style={{ textAlign: 'right', minWidth: 120 }}>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Vous obtenez</div>
                <div style={{ fontWeight: 'bold', color: '#065f46' }}>{quantite > 0 ? `${quantite} part(s)` : '—'}</div>
              </div>

              <button 
                className="bouton plein" 
                disabled={quantite <= 0 || achatEnCours === e.code}
                onClick={() => investir(e, quantite, e.prixPart)}
                style={{ padding: '10px 24px', borderRadius: 8 }}
              >
                {achatEnCours === e.code ? '...' : 'Investir'}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
