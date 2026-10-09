// Vérifie qu'une adresse correspond bien au réseau choisi
// (évite d'envoyer des fonds sur le mauvais réseau).
const BASE58 = '[1-9A-HJ-NP-Za-km-z]';
const EVM = { regex: /^0x[0-9a-fA-F]{40}$/, aide: 'elle commence par 0x et contient 42 caractères' };

const FORMATS = {
  TRC20: { regex: new RegExp(`^T${BASE58}{33}$`), aide: 'elle commence par T et contient 34 caractères' },
  BEP20: EVM,
  ERC20: EVM,
  POLYGON: EVM,
  SOL: { regex: new RegExp(`^${BASE58}{32,44}$`), aide: 'elle contient entre 32 et 44 caractères' },
};

export function adresseValide(reseau, adresse) {
  const f = FORMATS[reseau];
  return f ? f.regex.test(adresse) : adresse.length >= 20;
}

export function aideAdresse(reseau) {
  return FORMATS[reseau]?.aide || '';
}
