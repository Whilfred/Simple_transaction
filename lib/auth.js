// lib/auth.js
import { createHmac } from 'crypto';

const SECRET = process.env.ADMIN_SECRET || 'secret-de-secours-a-changer';
export const USER_COOKIE = 'excrypt_user';

function signer(id) {
  return createHmac('sha256', SECRET).update(id).digest('hex');
}

export function creerSessionUser(userId) {
  const signature = signer(userId);
  return `${userId}.${signature}`;
}

export function lireSessionUser(cookieValeur) {
  if (!cookieValeur || typeof cookieValeur !== 'string') return null;
  const [userId, signature] = cookieValeur.split('.');
  if (!userId || !signature) return null;
  
  const attendu = signer(userId);
  if (attendu !== signature) return null;
  
  return userId;
}
