// ─── Tout ce qui se change souvent est ici ───

export const SITE = { nom: 'ExCrypt' };

// Réseaux compatibles Ethereum : une seule et même adresse de dépôt (Binance).
const EVM_ADRESSE = '0x207fce40e34b2f0576d9043a9dc160e0451bc938';

// Cryptos et réseaux proposés (achat ET vente).
// Pour ajouter un réseau : ajoutez une ligne dans "reseaux" ET son adresse dans ADRESSES_DEPOT.
export const CRYPTOS = [
  {
    code: 'USDT',
    nom: 'Tether (USDT)',
    logo: '/crypto/usdt.svg',
    estimable: true, // valeur ≈ 1 $ : l'estimation en FCFA (TAUX_ACHAT) est fiable
    reseaux: [
      { code: 'TRC20', nom: 'TRON (TRC20)' },
      { code: 'BEP20', nom: 'BNB Chain (BEP20)' },
      { code: 'ERC20', nom: 'Ethereum (ERC20)' },
      { code: 'SOL', nom: 'Solana' },
      { code: 'POLYGON', nom: 'Polygon' },
    ],
  },
  {
    code: 'BTC',
    nom: 'Bitcoin (BTC)',
    logo: '/crypto/btc.svg',
    reseaux: [
      { code: 'BTC', nom: 'Bitcoin (adresses 1... / 3...)' },
      { code: 'SEGWIT', nom: 'Bitcoin SegWit (bc1...)' },
    ],
  },
  {
    code: 'USDC',
    nom: 'USD Coin (USDC)',
    logo: '/crypto/usdc.svg',
    estimable: true, // valeur ≈ 1 $ : l'estimation en FCFA (TAUX_ACHAT) est fiable
    reseaux: [
      { code: 'ERC20', nom: 'Ethereum (ERC20)' },
      { code: 'SOL', nom: 'Solana' },
      { code: 'POLYGON', nom: 'Polygon' },
      { code: 'ARBITRUM', nom: 'Arbitrum One' },
      { code: 'OPTIMISM', nom: 'Optimism' },
      { code: 'BASE', nom: 'Base' },
    ],
  },
  {
    code: 'ETH',
    nom: 'Ethereum (ETH)',
    logo: '/crypto/eth.svg',
    reseaux: [
      { code: 'ERC20', nom: 'Ethereum (ERC20)' },
      { code: 'ARBITRUM', nom: 'Arbitrum One' },
      { code: 'OPTIMISM', nom: 'Optimism' },
      { code: 'BASE', nom: 'Base' },
    ],
  },
  {
    code: 'SOL',
    nom: 'Solana (SOL)',
    logo: '/crypto/sol.svg',
    reseaux: [{ code: 'SOL', nom: 'Solana' }],
  },
  {
    code: 'BNB',
    nom: 'BNB',
    logo: '/crypto/bnb.svg',
    reseaux: [{ code: 'BEP20', nom: 'BNB Smart Chain (BEP20)' }],
  },
  {
    code: 'XRP',
    nom: 'XRP',
    logo: '/crypto/xrp.svg',
    reseaux: [{ code: 'XRPL', nom: 'XRP Ledger' }],
  },
  {
    code: 'LTC',
    nom: 'Litecoin (LTC)',
    logo: '/crypto/ltc.svg',
    reseaux: [{ code: 'LTC', nom: 'Litecoin' }],
  },
  {
    code: 'DOGE',
    nom: 'Dogecoin (DOGE)',
    logo: '/crypto/doge.svg',
    reseaux: [{ code: 'DOGE', nom: 'Dogecoin' }],
  },
];

// Adresses de dépôt affichées au client qui VEND.
// Les adresses sont sensibles à la casse : toujours les copier-coller, ne jamais les retaper.
// Clé = `${crypto}:${reseau}`
export const ADRESSES_DEPOT = {
  // USDT
  'USDT:TRC20': 'TQDtHHpgBNmCoC9MMpPWHhLpVHytCa1SfR',
  'USDT:BEP20': EVM_ADRESSE,
  'USDT:ERC20': EVM_ADRESSE,
  'USDT:SOL': '7KQaAmCNZN3L84Ld1qaAvomZH6VbV1yPNzso1k4NPsL5',
  'USDT:POLYGON': EVM_ADRESSE,

  // Bitcoin
  'BTC:BTC': '1GQE63kDnea6t2E9NUjFHFRrtKxzwA2ca7',
  'BTC:SEGWIT': 'bc1q0wd6n7hmtwnvdzmsp5jn6ssk586c0ts94hkg30',

  // USDC
  'USDC:ERC20': EVM_ADRESSE,
  'USDC:SOL': '7KQaAmCNZN3L84Ld1qaAvomZH6VbV1yPNzso1k4NPsL5',
  'USDC:POLYGON': EVM_ADRESSE,
  'USDC:ARBITRUM': EVM_ADRESSE,
  'USDC:OPTIMISM': EVM_ADRESSE,
  'USDC:BASE': EVM_ADRESSE,

  // Ethereum
  'ETH:ERC20': EVM_ADRESSE,
  'ETH:ARBITRUM': EVM_ADRESSE,
  'ETH:OPTIMISM': EVM_ADRESSE,
  'ETH:BASE': EVM_ADRESSE,

  // Autres
  'SOL:SOL': '7KQaAmCNZN3L84Ld1qaAvomZH6VbV1yPNzso1k4NPsL5',
  'BNB:BEP20': EVM_ADRESSE,
  'XRP:XRPL': 'rNxp4h8apvRis6mJf9Sh8C6iRxfrDWN7AV',
  'LTC:LTC': 'Law3V8wgQ6Vhtx7b9YnXjqbUZfcvfNZVks',
  'DOGE:DOGE': 'DTziExg6i37n92Bo76G1JVqd5mDxiaaeAn',
};

// MEMO / tag obligatoire pour certains réseaux (sans lui, les fonds sont perdus).
// Clé = `${crypto}:${reseau}`
export const MEMOS_DEPOT = {
  'XRP:XRPL': '499528707',
};

// Dépôt minimum accepté par Binance (dans l'unité de la crypto), quand il est connu.
export const DEPOT_MINIMUM = {
  'BTC:BTC': 0.000005,
  'BTC:SEGWIT': 0.000006,
  'USDC:ERC20': 0.001,
  'USDC:POLYGON': 0.001,
  'USDC:ARBITRUM': 0.001,
  'USDC:OPTIMISM': 0.001,
  'USDC:BASE': 0.001,
  'ETH:ERC20': 0.0000003,
  'ETH:ARBITRUM': 0.0000003,
  'ETH:OPTIMISM': 0.0000003,
  'ETH:BASE': 0.0000003,
  'DOGE:DOGE': 0.05,
};

// Taux d'achat indicatifs (FCFA pour 1 USDT) — estimation affichée au client.
// ⚠ Valable pour l'USDT (et USDC, à peu près 1 $). Les autres cryptos varient : prix à récupérer en direct.
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

// Mémo à afficher au client pour un dépôt (ou null s'il n'y en a pas)
export function memoPour(codeCrypto, codeReseau) {
  return MEMOS_DEPOT[`${codeCrypto}:${codeReseau}`] || null;
}
