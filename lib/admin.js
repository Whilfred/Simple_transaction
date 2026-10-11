// lib/admin.js
// Session admin : cookie HttpOnly signé avec HMAC.
// Un seul admin (toi), mot de passe dans ADMIN_PASSWORD.

import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'excrypt_admin';
const DUREE_MAX = 60 * 60 * 24 * 7; // 7 jours

function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error('ADMIN_SECRET manquant dans .env.local');
  return s;
}

function signer(valeur) {
  return createHmac('sha256', secret()).update(valeur).digest('hex');
}

export function verifierMotDePasse(motDePasse) {
  const attendu = process.env.ADMIN_PASSWORD;
  if (!attendu) throw new Error('ADMIN_PASSWORD manquant dans .env.local');
  if (typeof motDePasse !== 'string' || motDePasse.length !== attendu.length) {
    // Comparaison à temps constant même si les longueurs diffèrent
    timingSafeEqual(Buffer.from(attendu), Buffer.from(attendu));
    return false;
  }
  return timingSafeEqual(Buffer.from(motDePasse), Buffer.from(attendu));
}

export function creerSession() {
  const expires = Date.now() + DUREE_MAX * 1000;
  const valeur = String(expires);
  const signature = signer(valeur);
  return `${valeur}.${signature}`;
}

export function sessionValide(cookieValeur) {
  if (!cookieValeur || typeof cookieValeur !== 'string') return false;
  const [valeur, signature] = cookieValeur.split('.');
  if (!valeur || !signature) return false;
  const attendu = signer(valeur);
  if (attendu.length !== signature.length) return false;
  if (!timingSafeEqual(Buffer.from(attendu), Buffer.from(signature))) return false;
  const expires = Number(valeur);
  return Number.isFinite(expires) && Date.now() < expires;
}

export function estAdmin() {
  const c = cookies().get(COOKIE_NAME);
  return sessionValide(c?.value);
}

export const ADMIN_COOKIE = COOKIE_NAME;
export const ADMIN_DUREE_MAX = DUREE_MAX;
