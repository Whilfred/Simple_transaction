// app/register/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Styles en objet pour éviter les bugs d'hydratation
const css = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f4f5f8',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  carte: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  },
  titre: {
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '24px',
    fontWeight: '800',
    color: '#0c1220',
  },
  groupeChamp: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a',
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #e5e7ee',
    backgroundColor: '#f9fafb',
    fontSize: '15px',
    color: '#0f172a',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputFocus: {
    borderColor: '#16cb62',
  },
  erreur: {
    color: '#d9534f',
    fontSize: '13px',
    marginTop: '-10px',
    marginBottom: '15px',
    textAlign: 'center',
  },
  bouton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#16cb62', // Le vert d'ExCrypt
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '15px',
    transition: 'background-color 0.2s',
    marginTop: '10px',
  },
  lienBas: {
    marginTop: '25px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748b',
  },
  lien: {
    color: '#16cb62',
    fontWeight: '700',
    textDecoration: 'none',
    marginLeft: '5px',
  },
};

export default function Register() {
  const router = useRouter();
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);
  const [focusChamp, setFocusChamp] = useState(null);

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
    <div style={css.page}>
      <div style={css.carte}>
        <h1 style={css.titre}>Créer un compte</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={css.groupeChamp}>
            <label style={css.label}>Prénom</label>
            <input 
              type="text" 
              value={prenom} 
              onChange={(e) => setPrenom(e.target.value)} 
              required 
              placeholder="Votre prénom"
              style={{...css.input, ...(focusChamp === 'prenom' ? css.inputFocus : {})}} 
              onFocus={() => setFocusChamp('prenom')}
              onBlur={() => setFocusChamp(null)}
            />
          </div>

          <div style={css.groupeChamp}>
            <label style={css.label}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="votre@email.com"
              style={{...css.input, ...(focusChamp === 'email' ? css.inputFocus : {})}} 
              onFocus={() => setFocusChamp('email')}
              onBlur={() => setFocusChamp(null)}
            />
          </div>
          
          <div style={css.groupeChamp}>
            <label style={css.label}>Mot de passe (8 caractères min.)</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              style={{...css.input, ...(focusChamp === 'password' ? css.inputFocus : {})}} 
              onFocus={() => setFocusChamp('password')}
              onBlur={() => setFocusChamp(null)}
            />
          </div>

          {erreur && <p style={css.erreur}>{erreur}</p>}

          <button 
            type="submit" 
            disabled={chargement} 
            style={{
              ...css.bouton, 
              opacity: chargement ? 0.7 : 1,
              backgroundColor: chargement ? '#0ea34d' : '#16cb62'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#14b858'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16cb62'}
          >
            {chargement ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <p style={css.lienBas}>
          Déjà un compte ? 
          <Link href="/login" style={css.lien}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
