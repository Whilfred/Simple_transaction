'use client';

import { CRYPTOS } from '@/lib/config';
import Selecteur from '@/components/Selecteur';

// Valeur = { crypto: 'USDT', reseau: 'TRC20' }
const OPTIONS = CRYPTOS.map((c) => ({
  value: c.code,
  label: c.nom,
  logo: c.logo, // ex. '/crypto/usdt.svg' (dossier public/crypto)
}));

export default function ChoixCrypto({ valeur, onChange }) {
  const crypto = CRYPTOS.find((c) => c.code === valeur.crypto) || CRYPTOS[0];

  function changerCrypto(code) {
    const c = CRYPTOS.find((x) => x.code === code);
    onChange({ crypto: c.code, reseau: c.reseaux[0].code });
  }

  return (
    <>
      <div className="champ">
        <label htmlFor="crypto">Crypto</label>
        <Selecteur
          id="crypto"
          label="Crypto"
          valeur={crypto.code}
          options={OPTIONS}
          onChange={changerCrypto}
          large
        />
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
