'use client';

import { CRYPTOS } from '@/lib/config';

// Valeur = { crypto: 'USDT', reseau: 'TRC20' }
export default function ChoixCrypto({ valeur, onChange }) {
  const crypto = CRYPTOS.find((c) => c.code === valeur.crypto) || CRYPTOS[0];

  return (
    <>
      <div className="champ">
        <label htmlFor="crypto">Crypto</label>
        <select
          id="crypto"
          value={valeur.crypto}
          onChange={(e) => {
            const c = CRYPTOS.find((x) => x.code === e.target.value);
            onChange({ crypto: c.code, reseau: c.reseaux[0].code });
          }}
        >
          {CRYPTOS.map((c) => (
            <option key={c.code} value={c.code}>{c.nom}</option>
          ))}
        </select>
      </div>

      <div className="champ">
        <label>Réseau</label>
        <div className="pastilles" role="radiogroup" aria-label="Réseau">
          {crypto.reseaux.map((r) => (
            <button
              type="button"
              key={r.code}
              role="radio"
              aria-checked={valeur.reseau === r.code}
              className={'pastille' + (valeur.reseau === r.code ? ' choisie' : '')}
              onClick={() => onChange({ crypto: crypto.code, reseau: r.code })}
            >
              {r.nom}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
