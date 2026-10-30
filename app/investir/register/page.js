'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserRegister() {
  const router = useRouter();
  const [form, setForm] = useState({ prenom: '', email: '', password: '' });
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  async function valider(e) {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    const r = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await r.json();
    if (!r.ok) {
      setErreur(data.erreur);
      setEnvoi(false);
      return;
    }
    router.replace('/investir/login');
  }

  return (
    <section className="page etroite">
      <h1>Devenir Investisseur</h1>
      <p className="intro">Créez votre compte sécurisé pour commencer.</p>
      
      <form onSubmit={valider} className="formulaire">
        <div className="champ">
          <label>Prénom</label>
          <input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
        </div>
        <div className="champ">
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="champ">
          <label>Mot de passe (8 caractères min.)</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
        </div>
        
        {erreur && <p style={{ color: 'red', marginTop: 8 }}>{erreur}</p>}
        
        <button className="bouton plein" type="submit" disabled={envoi}>
          {envoi ? 'Création…' : 'Créer mon compte'}
        </button>
      </form>
      
      <p style={{ marginTop: 16, textAlign: 'center', fontSize: 14 }}>
        Déjà membre ? <Link href="/investir/login" style={{ color: 'var(--accent)' }}>Se connecter</Link>
      </p>
    </section>
  );
}
