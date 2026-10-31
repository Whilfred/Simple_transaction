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
.au-input.bad{border-color:#ef4444}
.au-eye{position:absolute;right:8px;top:50%;transform:translateY(-50%);border:0;background:transparent;cursor:pointer;color:#475569;font-size:.8rem;font-weight:700;padding:7px 10px;border-radius:8px;font-family:inherit}
.au-eye:hover{background:#f1f5f9}
.au-meter{display:flex;gap:6px;margin-top:10px}
.au-meter span{flex:1;height:5px;border-radius:999px;background:#e2e8f0;transition:background .25s}
.au-meter-l{margin:6px 0 0;font-size:.78rem;font-weight:600;color:#64748b}
.au-helper{margin:6px 0 0;font-size:.8rem;color:#dc2626;font-weight:600}
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

/* ============================ UTILITAIRES ============================ */
const COULEURS_FORCE = ['#e2e8f0', '#ef4444', '#f59e0b', '#22c55e', '#16a34a'];
const LIBELLES_FORCE = ['', 'Trop faible', 'Moyen', 'Bon', 'Excellent'];

function forceMotDePasse(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.max(s, 1);
}

/* ============================ PAGE ============================ */
export default function UserRegister() {
  const router = useRouter();
  const [form, setForm] = useState({ prenom: '', email: '', password: '' });
  const [confirmation, setConfirmation] = useState('');
  const [voir, setVoir] = useState(false);
  const [erreur, setErreur] = useState('');
  const [envoi, setEnvoi] = useState(false);

  const force = forceMotDePasse(form.password);
  const nonConcordants = confirmation.length > 0 && confirmation !== form.password;

  const maj = (champ) => (e) => setForm({ ...form, [champ]: e.target.value });

  async function valider(e) {
    e.preventDefault();
    setErreur('');

    if (form.password !== confirmation) {
      setErreur('Les mots de passe ne correspondent pas.');
      return;
    }

    setEnvoi(true);
    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: form.prenom.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setErreur(data.erreur || 'Impossible de créer le compte.');
        setEnvoi(false);
        return;
      }
      router.replace('/investir/login');
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
          <h2>Faites travailler votre argent.</h2>
          <p>Créez votre compte en moins d'une minute et commencez à investir à votre rythme.</p>
          <ul className="au-points">
            <li><span className="au-check">✓</span> Inscription gratuite et sécurisée</li>
            <li><span className="au-check">✓</span> Investissez dès quelques milliers de FCFA</li>
            <li><span className="au-check">✓</span> Suivez votre portefeuille en temps réel</li>
          </ul>
        </div>

        <div className="au-legal">Tout investissement comporte un risque de perte en capital.</div>
      </aside>

      <main className="au-main">
        <div className="au-card">
          <h1>Devenir investisseur</h1>
          <p className="au-intro">Créez votre compte sécurisé pour commencer.</p>

          <form onSubmit={valider}>
            <div className="au-field">
              <label htmlFor="prenom">Prénom</label>
              <input
                id="prenom"
                className="au-input"
                autoComplete="given-name"
                placeholder="Votre prénom"
                value={form.prenom}
                onChange={maj('prenom')}
                required
              />
            </div>

            <div className="au-field">
              <label htmlFor="email">Adresse e-mail</label>
              <input
                id="email"
                className="au-input"
                type="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                value={form.email}
                onChange={maj('email')}
                required
              />
            </div>

            <div className="au-field">
              <label htmlFor="password">Mot de passe (8 caractères min.)</label>
              <div className="au-control">
                <input
                  id="password"
                  className="au-input has-eye"
                  type={voir ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={maj('password')}
                  required
                  minLength={8}
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

              <div className="au-meter" aria-hidden="true">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} style={{ background: i <= force ? COULEURS_FORCE[force] : undefined }} />
                ))}
              </div>
              {form.password && <p className="au-meter-l">Sécurité : {LIBELLES_FORCE[force]}</p>}
            </div>

            <div className="au-field">
              <label htmlFor="confirmation">Confirmer le mot de passe</label>
              <input
                id="confirmation"
                className={`au-input${nonConcordants ? ' bad' : ''}`}
                type={voir ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                required
              />
              {nonConcordants && <p className="au-helper">Les mots de passe ne correspondent pas.</p>}
            </div>

            {erreur && <p className="au-error" role="alert">{erreur}</p>}

            <button className="au-submit" type="submit" disabled={envoi}>
              {envoi ? 'Création…' : 'Créer mon compte'}
            </button>
          </form>

          <p className="au-foot">
            Déjà membre ? <Link href="/investir/login">Se connecter</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
