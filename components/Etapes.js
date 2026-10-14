// Indicateur de progression : ✓ pour les étapes terminées, numéro pour les autres.
// etapes = ['Crypto', 'Montant', ...]  —  courante = index (0, 1, 2…) de l'étape en cours
export default function Etapes({ etapes, courante }) {
  return (
    <nav className="etp" aria-label="Progression de la demande">
      <ol className="etp-liste">
        {etapes.map((nom, i) => {
          const etat = i < courante ? 'fait' : i === courante ? 'active' : '';
          return (
            <li
              key={nom}
              className={`etp-item ${etat}`}
              aria-current={i === courante ? 'step' : undefined}
            >
              <span className="etp-pastille" aria-hidden="true">
                {i < courante ? '✓' : i + 1}
              </span>
              <span className="etp-nom">{nom}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
