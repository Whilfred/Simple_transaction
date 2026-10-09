// Statuts d'une opération (code enregistré en base → texte affiché au client)
export const STATUTS = {
  en_attente: 'En attente',
  paiement_recu: 'Paiement reçu',
  en_cours: 'En cours',
  termine: 'Terminé',
  annule: 'Annulé',
};

export const libelleStatut = (code) => STATUTS[code] || code;
