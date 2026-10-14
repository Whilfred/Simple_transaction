'use client';

import { useEffect, useRef, useState } from 'react';

// Menu déroulant avec images (drapeaux ou logos).
// options = [{ value, label, court?, flag?, logo?, groupe? }]
export default function Selecteur({ id, label, valeur, options, onChange, large = false }) {
  const [ouvert, setOuvert] = useState(false);
  const [actif, setActif] = useState(0);
  const racine = useRef(null);
  const bouton = useRef(null);
  const courant = options.find((o) => o.value === valeur) || options[0];

  useEffect(() => {
    function dehors(e) {
      if (racine.current && !racine.current.contains(e.target)) setOuvert(false);
    }
    document.addEventListener('mousedown', dehors);
    return () => document.removeEventListener('mousedown', dehors);
  }, []);

  useEffect(() => {
    if (ouvert) document.getElementById(`${id}-opt-${actif}`)?.scrollIntoView({ block: 'nearest' });
  }, [ouvert, actif, id]);

  function ouvrir() {
    setActif(Math.max(0, options.findIndex((o) => o.value === courant.value)));
    setOuvert(true);
  }

  function choisir(o) {
    onChange(o.value);
    setOuvert(false);
    bouton.current?.focus();
  }

  function touche(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!ouvert) return ouvrir();
      const pas = e.key === 'ArrowDown' ? 1 : -1;
      setActif((i) => Math.min(options.length - 1, Math.max(0, i + pas)));
    } else if ((e.key === 'Enter' || e.key === ' ') && ouvert) {
      e.preventDefault();
      choisir(options[actif]);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setOuvert(false);
    }
  }

  const Image = ({ o }) =>
    o.flag ? (
      <span className={`fi fi-${o.flag} drapeau`} aria-hidden="true" />
    ) : o.logo ? (
      <img src={o.logo} alt="" width="24" height="24" className="logo-crypto" />
    ) : null;

  return (
    <div className={'selecteur' + (large ? ' large' : '')} ref={racine}>
      <button
        type="button"
        id={id}
        ref={bouton}
        className="selecteur-bouton"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={ouvert}
        onClick={() => (ouvert ? setOuvert(false) : ouvrir())}
        onKeyDown={touche}
      >
        <Image o={courant} />
        <span className="selecteur-texte">{courant.court ?? courant.label}</span>
        <span className="chevron" aria-hidden="true">▾</span>
      </button>

      {ouvert && (
        <ul className="selecteur-liste" role="listbox" aria-label={label} aria-activedescendant={`${id}-opt-${actif}`}>
          {options.map((o, i) => (
            <li key={o.value} role="presentation">
              {o.groupe && o.groupe !== options[i - 1]?.groupe && <div className="selecteur-groupe">{o.groupe}</div>}
              <div
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={o.value === courant.value}
                className={'selecteur-option' + (i === actif ? ' actif' : '') + (o.value === courant.value ? ' choisi' : '')}
                onMouseEnter={() => setActif(i)}
                onClick={() => choisir(o)}
              >
                <Image o={o} />
                <span>{o.label}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
