'use client';

import { PAYS, operateursDe } from '@/lib/config';
import Selecteur from '@/components/Selecteur';

const OPTIONS = PAYS.map((p) => ({
  value: p.indicatif,
  label: `${p.nom} (${p.indicatif})`,
  court: p.indicatif,
  flag: p.iso,
  groupe: p.region,
}));

// Valeur = { indicatif: '+226', numero: '70123456', operateur: 'Orange Money' }
// avecOperateur = affiche le choix MTN / Moov / Wave / Orange… du pays choisi
export default function ChampTelephone({ label, valeur, onChange, aide, avecOperateur = false }) {
  const slug = label.replace(/\W+/g, '-');
  const operateurs = operateursDe(valeur.indicatif);

  function changerPays(indicatif) {
    onChange({ ...valeur, indicatif, operateur: operateursDe(indicatif)[0] });
  }

  return (
    <div className="champ">
      <label htmlFor={`numero-${slug}`}>{label}</label>
      <div className="tel">
        <Selecteur
          id={`pays-${slug}`}
          label="Pays et indicatif"
          valeur={valeur.indicatif}
          options={OPTIONS}
          onChange={changerPays}
        />
        <input
          id={`numero-${slug}`}
          type="tel"
          inputMode="tel"
          placeholder="70 12 34 56"
          value={valeur.numero}
          onChange={(e) => onChange({ ...valeur, numero: e.target.value.replace(/[^\d\s]/g, '') })}
          required
        />
      </div>

      {avecOperateur && (
        <>
          <label style={{ marginTop: '0.6rem' }}>Opérateur mobile money</label>
          <div className="pastilles" role="radiogroup" aria-label="Opérateur mobile money">
            {operateurs.map((nom) => (
              <button
                type="button"
                key={nom}
                role="radio"
                aria-checked={valeur.operateur === nom}
                className={'pastille' + (valeur.operateur === nom ? ' choisie' : '')}
                onClick={() => onChange({ ...valeur, operateur: nom })}
              >
                {nom}
              </button>
            ))}
          </div>
        </>
      )}

      {aide && <small>{aide}</small>}
    </div>
  );
}
