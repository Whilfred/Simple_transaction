'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// On reprend les prix simulés pour calculer la valeur du portefeuille
const PRIX_SIMULES = {
  USDT: 1, BTC: 65000, ETH: 3500, SOL: 150, BNB: 600, XRP: 0.5, LTC: 80, DOGE: 0.15,
  AAPL: 175, TSLA: 240, MSFT: 330, AMZN: 180
};
const TAUX_USD_FCFA = 600;

export default function PortefeuillePage() {
  const [investissements, setInvestissements] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch('/api/investir/portefeuille')
      .then((r) => r.json())
      .then((data) => {
        if (data.investissements) setInvestissements(data.investissements);
      })
      .finally(() => setChargement(false));
  }, []);

  if (chargement) return <p style={{ padding: 20 }}>Chargement…</p>;

  // Calcul de la valeur totale du portefeuille en FCFA
  const valeurTotale = investissements.reduce((total, inv) => {
    const prixUsd = PRIX_SIMULES[inv.actif] || 0;
    const valeurActuelle = Number(inv.quantite) * prixUsd * TAUX_USD_FCFA;
    return total + valeurActuelle;
  }, 0);

  return (
    <section className="page">
      <div style={{ marginBottom: 24 }}>
        <Link href="/investir" style={{ color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>←</span> Retour à l'espace
        </Link>
      </div>
      
      <h1 style={{ marginBottom: 8 }}>Mon Portefeuille</h1>
      
      {/* Affichage de la valeur totale */}
      {investissements.length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #065f46, #10b981)', padding: 24, borderRadius: 16, color: 'white', marginBottom: 32, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
          <p style={{ margin: 0, opacity: 0.9, fontSize: 14, textTransform: 'uppercase', fontWeight: 'bold' }}>Valeur totale estimée</p>
          <h2 style={{ margin: '8px 0 0 0', fontSize: '2.5rem' }}>
            {valeurTotale.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
          </h2>
        </div>
      )}
      
      {investissements.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', background: '#f9fafb', borderRadius: 16 }}>
          <p style={{ color: '#6b7280', marginBottom: 16 }}>Vous n'avez pas encore d'investissements.</p>
          <Link href="/investir" className="bouton plein" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Découvrir les opportunités
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>Détail de vos actifs</h3>
          
          {investissements.map((inv, index) => {
            const prixActuelUsd = PRIX_SIMULES[inv.actif] || 0;
            const valeurActuelleFcfa = Number(inv.quantite) * prixActuelUsd * TAUX_USD_FCFA;

            return (
              <div key={index} style={{ background: '#fff', padding: 20, borderRadius: 16, border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    {inv.categorie === 'bourse' ? '📈' : inv.categorie === 'crypto' ? '₿' : '🏢'}
                  </div>
                  <div>
                    <span style={{ fontSize: 12, textTransform: 'uppercase', color: '#6b7280', fontWeight: 'bold' }}>{inv.categorie}</span>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem' }}>{inv.actif}</h3>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>Quantité</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {Number(inv.quantite).toFixed(6)}
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: 120 }}>
                  <div style={{ fontSize: 13, color: '#6b7280' }}>Valeur actuelle</div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--accent)' }}>
                    {valeurActuelleFcfa.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
