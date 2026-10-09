// lib/erreurs.js
// Messages d'erreur "utilisateur" — en français clair, sans jargon technique.

export function erreurMontant(montant) {
  const n = Number(montant);
  if (!montant || isNaN(n)) return 'Veuillez saisir un montant.';
  if (n < 1000) return 'Le montant minimum est de 1 000 FCFA.';
  if (n > 1_000_000) return 'Le montant maximum est de 1 000 000 FCFA.';
  if (!Number.isInteger(n)) return 'Le montant doit être un nombre entier de FCFA.';
  return null;
}

export function erreurAdresse(reseau, adresse, adresseValide, aideAdresse) {
  const a = (adresse || '').trim();
  if (!a) return 'Veuillez saisir une adresse de réception.';
  if (!adresseValide(reseau, a)) {
    const aide = aideAdresse(reseau);
    return `Cette adresse ne semble pas valide pour ce réseau${aide ? ` — ${aide}` : ''}.`;
  }
  return null;
}

export function erreurTelephone(numero) {
  const n = (numero || '').replace(/\s+/g, '');
  if (!n) return 'Veuillez saisir votre numéro de téléphone.';
  if (!/^\d+$/.test(n)) return 'Le numéro ne doit contenir que des chiffres.';
  if (n.length < 6) return 'Votre numéro semble trop court.';
  if (n.length > 15) return 'Votre numéro semble trop long.';
  return null;
}

export function erreurPrenom(prenom) {
  const p = (prenom || '').trim();
  if (!p) return 'Veuillez saisir votre prénom.';
  if (p.length < 2) return 'Votre prénom est trop court.';
  return null;
}

// Transforme une erreur serveur/technique en message utilisateur
export function messageServeur(erreur) {
  if (!erreur) return 'Une erreur est survenue. Réessayez dans un instant.';

  // Erreurs réseau
  if (typeof erreur === 'string' && (
    erreur.includes('Failed to fetch') ||
    erreur.includes('NetworkError') ||
    erreur.includes('Network request failed')
  )) {
    return 'Connexion impossible. Vérifiez votre connexion internet et réessayez.';
  }

  // Si c'est déjà un message "propre" du serveur (commençant par une majuscule, pas d'anglais)
  if (typeof erreur === 'string' && /^[A-ZÀ-Ý]/.test(erreur) && !/error|exception|undefined/i.test(erreur)) {
    return erreur;
  }

  return 'Une erreur est survenue. Réessayez dans un instant.';
}
