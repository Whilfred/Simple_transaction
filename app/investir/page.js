'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function InvestirDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        else router.replace('/investir/login');
      })
      .finally(() => setChargement(false));
  }, [router]);

  if (chargement) return <p style={{ padding: 20 }}>Chargement…</p>;
  if (!user) return null;

  return (
    <section className="page">
      <h1>Espace Investissement</h1>
      <p style={{ marginBottom: 24, color: '#666' }}>
        Bienvenue <strong>{user.prenom}</strong>, choisissez votre type d'investissement.
      </p>

      <div style={{ display: 'grid', gap: 16 }}>
        <div style={{ padding: 20, border: '1px solid #e5e7eb', borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>📈 Bourse</h2>
          <p style={{ color: '#666' }}>Investissez dans les actions des grandes entreprises cotées.</p>
          <button className="bouton" disabled>Bientôt disponible</button>
        </div>

        <div style={{ padding: 20, border: '1px solid #e5e7eb', borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>₿ Crypto-monnaies</h2>
          <p style={{ color: '#666' }}>Construisez un portefeuille crypto sur le long terme.</p>
          <button className="bouton" disabled>Bientôt disponible</button>
        </div>

        <div style={{ padding: 20, border: '1px solid #e5e7eb', borderRadius: 12 }}>
          <h2 style={{ marginTop: 0 }}>🏢 Entreprises Locales</h2>
          <p style={{ color: '#666' }}>Investissez dans les PME non-cotées du Burkina Faso.</p>
          <button className="bouton" disabled>Bientôt disponible</button>
        </div>
      </div>
    </section>
  );
}
