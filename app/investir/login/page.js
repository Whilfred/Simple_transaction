'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/* ============================ STYLES ============================ */
const CSS = `
.au-wrap{min-height:100vh;min-height:100dvh;display:grid;grid-template-columns:1.05fr 1fr;font-family:'Inter',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#0f172a}
.au-wrap *{box-sizing:border-box}
.au-side{position:relative;overflow:hidden;color:#fff;padding:56px 48px;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(145deg,#0f172a 0%,#1e3a8a 55%,#2563eb 100%)}
.au-side::before{content:'';position:absolute;top:-120px;right:-100px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.2),transparent 70%)}
.au-side::after{content:'';position:absolute;bottom:-140px;left:-100px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(16,185,129,.28),transparent 70%)}
.au-side>*{position:relative;z-index:1}
.au-logo{display:inline-flex;align-items:center;gap:10px;font-weight:800;font-size:1.05rem}
.au-logo span{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28)}
.au-side h2{margin:0 0 14px;font-size:clamp(1.8rem,3vw,2.4rem);font-weight:800;letter-spacing:-.02em;line-height:1.15}
.au-side p{margin:0;opacity:.85;line-height:1.6;max-width:420px}
.au-points{list-style:none;margin:32px 0 0;padding:0;display:grid;gap:14px}
.au-points li{display:flex;align-items:center;gap:12px;font-weight:600;font-size:.95rem}
.au-check{flex-shrink:0;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:.8rem;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3)}
.au-legal{font-size:.78rem;opacity:.65}
.au-main{display:flex;align-items:center;justify-content:center;padding:32px 20px;background:#f8fafc}
.au-card{width:100%;max-width:420px}
.au-card h1{margin:0 0 8px;font-size:1.8rem;font-weight:800;letter-spacing:-.02em}
.au-intro{margin:0 0 28px;color:#64748b;line-height:1.5}
.au-field{margin-bottom:18px}
.au-field label{display:block;margin-bottom:7px;font-size:.85rem;font-weight:700;color:#334155}
.au-control{position:relative}
.au-input{width:100%;padding:13px 14px;border:1.5px solid #cbd5e1;border-radius:12px;font-size:1rem;font-family:inherit;background:#fff;color:#0f172a;outline:0;transition:border-color .2s,box-shadow .2s}
.au-input:focus{border-color:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.15)}
.au-input.has-eye{padding-right:92px}
.au-eye{position:absolute;right:8px;top:50%;transform:translateY(-50%);border:0;background:transparent;cursor:pointer;color:#475569;font-size:.8rem;font-weight:700;padding:7px 10px;border-radius:8px;font-family:inherit}
.au-eye:hover{background:#f1f5f9}
.au-error{margin:0 0 16px;padding:12px 14px;border-radius:12px;background:#fee2e2;color:#991b1b;font-size:.9rem;font-weight:600}
.au-submit{width:100%;border:0;cursor:pointer;padding:14px;border-radius:12px;font-size:1rem;font-weight:700;font-family:inherit;color:#fff;background:linear-gradient(135deg,#1e3a8a,#2563eb);box-shadow:0 10px 22px -10px rgba(37,99,235,.7);transition:transform .15s,filter .2s,opacity .2s}
.au-submit:hover:not(:disabled){transform:translateY(-1px);filter:brightness(1.07)}
.au-submit:disabled{opacity:.6;cursor:not-allowed}
.au-foot{margin:22px 0 0;text-align:center;font-size:.92rem;color:#64748b}
.au-foot a{color:#2563eb;font-weight:700;text-decoration:none}
.au-foot a:hover{text-decoration:underline}
@media(max-width:860px){
  .au-wrap{grid-template-columns:1fr}
  .au-side{display:none}
}
@media(prefers-reduced-motion:reduce){.au-wrap *{transition:none!important}}
`;

/* ============================ PAGE ============================ */
export default function UserLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [voir, setVoir] = useState(false);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  async function valider(e) {
    e.preventDefault();
    setErreur('');
    setEnvoi(true);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErreur(data.erreur || 'Identifiants incorrects.');
        setEnvoi(false);
        return;
      }
      router.replace('/investir');
    } catch {
      setErreur('Connexion impossible. Vérifiez votre réseau et réessayez.');
      setEnvoi(false);
    }
  }

  return (
    <div className="au-wrap">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <aside className="au-side">
        <div className="au-logo">
          <span>📈</span> Espace Investisseur
        </div>

        <div>
          <h2>Investissez simplement, où que vous soyez.</h2>
          <p>Bourse, crypto-monnaies et PME africaines : tout votre patrimoine réuni dans un seul espace.</p>
          <ul className="au-points">
            <li><span className="au-check">✓</span> Actions des plus grandes entreprises mondiales</li>
            <li><span className="au-check">✓</span> Portefeuille crypto long terme</li>
            <li><span className="au-check">✓</span> Investissement dans les PME locales</li>
          </ul>
        </div>

        <div className="au-legal">Tout investissement comporte un risque de perte en capital.</div>
      </aside>

      <main className="au-main">
        <div className="au-card">
          <h1>Connexion</h1>
          <p className="au-intro">Accédez à votre espace d'investissement.</p>

          <form onSubmit={valider} noValidate={false}>
            <div className="au-field">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                id="email"
                className="au-input"
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="au-field">
              <label htmlFor="password">Mot de passe</label>
              <div className="au-control">
                <input
                  id="password"
                  className="au-input has-eye"
                  type={voir ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="au-eye"
                  onClick={() => setVoir((v) => !v)}
                  aria-pressed={voir}
                >
                  {voir ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            {erreur && <p className="au-error" role="alert">{erreur}</p>}

            <button className="au-submit" type="submit" disabled={envoi}>
              {envoi ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>

          <p className="au-foot">
            Pas encore de compte ? <Link href="/investir/register">Créer un compte</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
