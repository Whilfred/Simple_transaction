'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

  const cardStyle = {
    padding: 24,
    borderRadius: 20,
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: 160,
    textDecoration: 'none',
    transition: 'transform 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  };

  return (
    <section className="page">
      <h1>Espace Investissement</h1>
      <p style={{ marginBottom: 32, color: '#666', fontSize: '1.1rem' }}>
        Bienvenue <strong>{user.prenom}</strong>, où souhaitez-vous investir aujourd'hui ?
      </p>

      <div style={{ display: 'grid', gap: 20 }}>
        <Link href="/investir/bourse" style={{ ...cardStyle, background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)' }}>
          <span style={{ fontSize: 32 }}>📈</span>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem' }}>Bourse</h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>Actions d'entreprises mondiales</p>
          </div>
        </Link>

        <Link href="/investir/crypto" style={{ ...cardStyle, background: 'linear-gradient(135deg, #b45309, #f59e0b)' }}>
          <span style={{ fontSize: 32 }}>₿</span>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem' }}>Crypto-monnaies</h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>Portefeuille crypto long terme</p>
          </div>
        </Link>

        <Link href="/investir/entreprises" style={{ ...cardStyle, background: 'linear-gradient(135deg, #065f46, #10b981)' }}>
          <span style={{ fontSize: 32 }}>🏢</span>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '1.4rem' }}>Entreprises Locales</h2>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>PME africaines non-cotées</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
