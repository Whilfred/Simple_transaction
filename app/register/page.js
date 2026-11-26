// app/register/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push('/login');
      } else {
        setErreur(data.erreur || 'Erreur lors de l\'inscription.');
      }
    } catch (err) {
      setErreur('Erreur de connexion au serveur.');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Créer un compte</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Prénom</label>
          <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        <div>
          <label>Mot de passe (8 caractères min.)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        {erreur && <p style={{ color: 'red', fontSize: '0.9em' }}>{erreur}</p>}
        <button type="submit" disabled={chargement} style={{ padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {chargement ? 'Inscription...' : 'S\'inscrire'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Déjà un compte ? <Link href="/login" style={{ color: '#007bff' }}>Se connecter</Link>
      </p>
    </div>
  );
}
