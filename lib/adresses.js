// Vérifie qu'une adresse correspond bien au réseau choisi
// (évite d'envoyer des fonds sur le mauvais réseau).
const BASE58 = '[1-9A-HJ-NP-Za-km-z]';
const EVM = { regex: /^0x[0-9a-fA-F]{40}$/, aide: 'elle commence par 0x et contient 42 caractères' };

const FORMATS = {
  // USDT / USDC / ETH / BNB sur réseaux compatibles Ethereum
  TRC20: { regex: new RegExp(`^T${BASE58}{33}$`), aide: 'elle commence par T et contient 34 caractères' },
  BEP20: EVM,
  ERC20: EVM,
  POLYGON: EVM,
  ARBITRUM: EVM,
  OPTIMISM: EVM,
  BASE: EVM,
  SOL: { regex: new RegExp(`^${BASE58}{32,44}$`), aide: 'elle contient entre 32 et 44 caractères' },

  // Bitcoin : legacy (1...) ou P2SH (3...)
  BTC: {
    regex: new RegExp(`^[13]${BASE58}{25,34}$`),
    aide: 'elle commence par 1 ou 3 et contient 26 à 35 caractères',
  },
  // Bitcoin SegWit : bech32 (bc1q... / bc1p...)
  SEGWIT: {
    regex: /^bc1[02-9ac-hj-np-z]{25,87}$/,
    aide: 'elle commence par bc1 (en minuscules)',
  },
  XRPL: { regex: new RegExp(`^r${BASE58}{24,34}$`), aide: 'elle commence par r et contient 25 à 35 caractères' },
  LTC: {
    regex: new RegExp(`^([LM]${BASE58}{26,33}|ltc1[02-9ac-hj-np-z]{25,87})$`),
    aide: 'elle commence par L, M ou ltc1',
  },
  DOGE: { regex: new RegExp(`^[DA9]${BASE58}{33}$`), aide: 'elle commence par D (ou A, 9) et contient 34 caractères' },
};

export function adresseValide(reseau, adresse) {
  const f = FORMATS[reseau];
  return f ? f.regex.test(adresse) : adresse.length >= 20;
}

export function aideAdresse(reseau) {
  return FORMATS[reseau]?.aide || '';
}
