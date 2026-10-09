// ─── Tout ce qui se change souvent est ici ───

export const SITE = { nom: 'ExCrypt' };

// Cryptos et réseaux proposés (achat ET vente).
// Pour ajouter un réseau : ajoutez une ligne dans "reseaux" ET son adresse dans ADRESSES_DEPOT.
export const CRYPTOS = [
  {
    code: 'USDT',
    nom: 'Tether (USDT)',
    logo: '/crypto/usdt.svg',
    reseaux: [
      { code: 'TRC20', nom: 'TRON (TRC20)' },
      { code: 'BEP20', nom: 'BNB Chain (BEP20)' },
      { code: 'ERC20', nom: 'Ethereum (ERC20)' },
      { code: 'SOL', nom: 'Solana' },
      { code: 'POLYGON', nom: 'Polygon' },
    ],
  },
];

// Adresses de dépôt affichées au client qui VEND (à remplacer par les vôtres).
// Clé = `${crypto}:${reseau}`
export const ADRESSES_DEPOT = {
  'USDT:TRC20': 'REMPLACER_PAR_VOTRE_ADRESSE_TRC20',
  'USDT:BEP20': 'REMPLACER_PAR_VOTRE_ADRESSE_BEP20',
  'USDT:ERC20': 'REMPLACER_PAR_VOTRE_ADRESSE_ERC20',
  'USDT:SOL': 'REMPLACER_PAR_VOTRE_ADRESSE_SOLANA',
  'USDT:POLYGON': 'REMPLACER_PAR_VOTRE_ADRESSE_POLYGON',
};

// Taux d'achat indicatifs (FCFA pour 1 USDT) — estimation affichée au client.
export const TAUX_ACHAT = [
  { jusqua: 200000, taux: 602 },
  { jusqua: 1000000, taux: 640 },
];

// Pays + opérateurs mobile money proposés dans chaque pays.
// "Autre" est ajouté automatiquement à la fin de chaque liste.
// À vérifier / ajuster selon les opérateurs que vous acceptez vraiment.
const OUEST = "Afrique de l'Ouest";
const CENTRE = 'Afrique centrale';

export const PAYS = [
  // Afrique de l'Ouest
  { nom: 'Bénin', indicatif: '+229', iso: 'bj', region: OUEST, operateurs: ['MTN MoMo', 'Moov Money', 'Celtiis Cash'] },
  { nom: 'Burkina Faso', indicatif: '+226', iso: 'bf', region: OUEST, operateurs: ['Orange Money', 'Moov Money', 'Wave', 'Coris Money'] },
  { nom: 'Cap-Vert', indicatif: '+238', iso: 'cv', region: OUEST, operateurs: [] },
  { nom: "Côte d'Ivoire", indicatif: '+225', iso: 'ci', region: OUEST, operateurs: ['Orange Money', 'MTN MoMo', 'Moov Money', 'Wave'] },
  { nom: 'Gambie', indicatif: '+220', iso: 'gm', region: OUEST, operateurs: ['Wave', 'Afrimoney'] },
  { nom: 'Ghana', indicatif: '+233', iso: 'gh', region: OUEST, operateurs: ['MTN MoMo', 'Telecel Cash', 'AT Money'] },
  { nom: 'Guinée', indicatif: '+224', iso: 'gn', region: OUEST, operateurs: ['Orange Money', 'MTN MoMo'] },
  { nom: 'Guinée-Bissau', indicatif: '+245', iso: 'gw', region: OUEST, operateurs: ['Orange Money', 'MTN MoMo'] },
  { nom: 'Liberia', indicatif: '+231', iso: 'lr', region: OUEST, operateurs: ['Orange Money', 'MTN MoMo'] },
  { nom: 'Mali', indicatif: '+223', iso: 'ml', region: OUEST, operateurs: ['Orange Money', 'Moov Money', 'Wave'] },
  { nom: 'Mauritanie', indicatif: '+222', iso: 'mr', region: OUEST, operateurs: ['Bankily', 'Masrvi'] },
  { nom: 'Niger', indicatif: '+227', iso: 'ne', region: OUEST, operateurs: ['Orange Money', 'Moov Money', 'Airtel Money'] },
  { nom: 'Nigeria', indicatif: '+234', iso: 'ng', region: OUEST, operateurs: ['OPay', 'PalmPay', 'Moniepoint'] },
  { nom: 'Sénégal', indicatif: '+221', iso: 'sn', region: OUEST, operateurs: ['Orange Money', 'Wave', 'Free Money'] },
  { nom: 'Sierra Leone', indicatif: '+232', iso: 'sl', region: OUEST, operateurs: ['Orange Money', 'Afrimoney'] },
  { nom: 'Togo', indicatif: '+228', iso: 'tg', region: OUEST, operateurs: ['Moov Money', 'T-Money'] },
  // Afrique centrale
  { nom: 'Angola', indicatif: '+244', iso: 'ao', region: CENTRE, operateurs: ['Unitel Money'] },
  { nom: 'Burundi', indicatif: '+257', iso: 'bi', region: CENTRE, operateurs: ['Lumicash', 'EcoCash'] },
  { nom: 'Cameroun', indicatif: '+237', iso: 'cm', region: CENTRE, operateurs: ['MTN MoMo', 'Orange Money'] },
  { nom: 'Centrafrique', indicatif: '+236', iso: 'cf', region: CENTRE, operateurs: ['Orange Money', 'Moov Money'] },
  { nom: 'Congo', indicatif: '+242', iso: 'cg', region: CENTRE, operateurs: ['MTN MoMo', 'Airtel Money'] },
  { nom: 'RD Congo', indicatif: '+243', iso: 'cd', region: CENTRE, operateurs: ['M-Pesa', 'Orange Money', 'Airtel Money'] },
  { nom: 'Gabon', indicatif: '+241', iso: 'ga', region: CENTRE, operateurs: ['Airtel Money', 'Moov Money'] },
  { nom: 'Guinée équatoriale', indicatif: '+240', iso: 'gq', region: CENTRE, operateurs: [] },
  { nom: 'São Tomé-et-Príncipe', indicatif: '+239', iso: 'st', region: CENTRE, operateurs: [] },
  { nom: 'Tchad', indicatif: '+235', iso: 'td', region: CENTRE, operateurs: ['Airtel Money', 'Moov Money'] },
];

// Liste des opérateurs d'un pays (toujours terminée par "Autre")
export function operateursDe(indicatif) {
  const pays = PAYS.find((p) => p.indicatif === indicatif);
  return [...(pays ? pays.operateurs : []), 'Autre'];
}

// Valeur de départ d'un champ téléphone
export function telVide(indicatif = '+226') {
  return { indicatif, numero: '', operateur: operateursDe(indicatif)[0] };
}

export function nomReseau(codeCrypto, codeReseau) {
  const crypto = CRYPTOS.find((c) => c.code === codeCrypto);
  const reseau = crypto && crypto.reseaux.find((r) => r.code === codeReseau);
  return reseau ? reseau.nom : codeReseau;
}

export function tauxPour(montantFcfa) {
  const palier = TAUX_ACHAT.find((p) => montantFcfa <= p.jusqua);
  return (palier || TAUX_ACHAT[TAUX_ACHAT.length - 1]).taux;
}
