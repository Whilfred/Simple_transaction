'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  async function valider(e) {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (!r.ok) {
      setErreur(data.erreur);
      setEnvoi(false);
      return;
    }
    router.replace('/investir');
  }

  return (
    <section className="page etroite">
      <h1>Connexion Investisseur</h1>
      <p className="intro">Accédez à votre espace d'investissement.</p>
      
      <form onSubmit={valider} className="formulaire">
        <div className="champ">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="champ">
          <label>Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        {erreur && <p style={{ color: 'red', marginTop: 8 }}>{erreur}</p>}
        
        <button className="bouton plein" type="submit" disabled={envoi}>
          {envoi ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
      
      <p style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>
        Pas encore de compte ? <Link href="/investir/register" style={{ color: 'var(--accent)' }}>Créer un compte</Link>
      </p>
    </section>
  );
}
