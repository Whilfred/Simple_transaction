import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { query } from '@/lib/db';
import { CRYPTOS, ADRESSES_DEPOT, PAYS, operateursDe } from '@/lib/config';
import { adresseValide } from '@/lib/adresses';

export const dynamic = 'force-dynamic';

const MONTANT_MIN = 1000;
const MONTANT_MAX = 1000000;

const essais = new Map();
function tropDeDemandes(ip) {
  const maintenant = Date.now();
  const liste = (essais.get(ip) || []).filter((t) => maintenant - t < 10 * 60 * 1000);
  liste.push(maintenant);
  essais.set(ip, liste);
  return liste.length > 10;
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function nouvelleReference() {
  let r = '';
  for (const octet of randomBytes(8)) r += ALPHABET[octet % ALPHABET.length];
  return 'EX-' + r;
}

function valider(b) {
  if (!b || typeof b !== 'object') return { erreur: 'Requête invalide.' };

  const type = b.type;
  if (type !== 'achat' && type !== 'vente') return { erreur: "Type d'opération invalide." };

  const crypto = CRYPTOS.find((c) => c.code === b.crypto);
  const reseau = crypto && crypto.reseaux.find((r) => r.code === b.reseau);
  if (!reseau) return { erreur: 'Crypto ou réseau invalide.' };

  const prenom = String(b.prenom || '').trim().slice(0, 50);
  if (!prenom) return { erreur: 'Prénom manquant.' };

  const pays = PAYS.find((p) => p.indicatif === b.indicatif);
  if (!pays) return { erreur: 'Pays invalide.' };

  const numero = String(b.numero || '').replace(/\s+/g, '');
  if (!/^\d{6,15}$/.test(numero)) return { erreur: 'Numéro de téléphone invalide.' };

  if (!operateursDe(pays.indicatif).includes(b.operateur)) {
    return { erreur: 'Opérateur invalide pour ce pays.' };
  }

  let montant = null;
  let adresseReception = null;
  let adresseDepot = null;

  if (type === 'achat') {
    montant = Number(b.montantFcfa);
    if (!Number.isInteger(montant) || montant < MONTANT_MIN || montant > MONTANT_MAX) {
      return {
        erreur: `Le montant doit être entre ${MONTANT_MIN.toLocaleString('fr-FR')} et ${MONTANT_MAX.toLocaleString('fr-FR')} FCFA.`,
      };
    }
    adresseReception = String(b.adresse || '').trim();
    if (!adresseValide(reseau.code, adresseReception)) {
      return { erreur: `Adresse invalide pour le réseau ${reseau.nom}.` };
    }
  } else {
    adresseDepot = ADRESSES_DEPOT[`${crypto.code}:${reseau.code}`];
    if (!adresseDepot) return { erreur: 'Ce réseau est momentanément indisponible.' };
  }

  return {
    ligne: {
      type,
      crypto: crypto.code,
      reseau: reseau.code,
      montant_fcfa: montant,
      adresse_reception: adresseReception,
      adresse_depot: adresseDepot,
      prenom,
      indicatif: pays.indicatif,
      numero,
      operateur: b.operateur,
    },
    adresseDepot,
  };
}

export async function POST(request) {
  const ip = (request.headers.get('x-forwarded-for') || 'local').split(',')[0].trim();
  if (tropDeDemandes(ip)) {
    return NextResponse.json(
      { erreur: 'Trop de demandes. Réessayez dans quelques minutes.' },
      { status: 429 }
    );
  }

  let corps;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête invalide.' }, { status: 400 });
  }

  const { ligne, adresseDepot, erreur } = valider(corps);
  if (erreur) return NextResponse.json({ erreur }, { status: 400 });

  try {
    for (let i = 0; i < 3; i++) {
      const reference = nouvelleReference();
      try {
        await query(
          `INSERT INTO commandes
             (reference, type, crypto, reseau, montant_fcfa, adresse_reception, adresse_depot,
              prenom, indicatif, numero, operateur)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
          [
            reference,
            ligne.type,
            ligne.crypto,
            ligne.reseau,
            ligne.montant_fcfa,
            ligne.adresse_reception,
            ligne.adresse_depot,
            ligne.prenom,
            ligne.indicatif,
            ligne.numero,
            ligne.operateur,
          ]
        );
        return NextResponse.json(
          { reference, statut: 'en_attente', adresseDepot },
          { status: 201 }
        );
      } catch (e) {
        if (e.code !== '23505') throw e; // 23505 = référence déjà prise → on réessaie
      }
    }
    throw new Error('Impossible de générer une référence unique');
  } catch (e) {
    console.error('Erreur création commande :', e);
    return NextResponse.json(
      { erreur: 'Erreur du serveur. Réessayez dans un instant.' },
      { status: 500 }
    );
  }
}
