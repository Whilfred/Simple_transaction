// Tout est sauvegardé dans le navigateur (localStorage) pour l'instant.
const CLES = {
  consentement: 'excrypt_consentement',
  prenom: 'excrypt_prenom',
  commandes: 'excrypt_commandes',
};

export function lire(cle, defaut = null) {
  try {
    const v = window.localStorage.getItem(CLES[cle]);
    return v === null ? defaut : JSON.parse(v);
  } catch {
    return defaut;
  }
}

export function ecrire(cle, valeur) {
  try {
    window.localStorage.setItem(CLES[cle], JSON.stringify(valeur));
  } catch {}
}

export function ajouterCommande(commande) {
  const liste = lire('commandes', []);
  ecrire('commandes', [commande, ...liste]);
}

export function nouvelId() {
  return 'EX-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}
