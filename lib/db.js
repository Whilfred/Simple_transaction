import { Pool } from 'pg';

let pool;

export function db() {
  if (!pool) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL manquant dans .env.local');
    console.log('🔌 Connexion Postgres →', url.replace(/:[^:@]+@/, ':***@'));
    pool = new Pool({
      connectionString: url,
      ssl: url.includes('neon.tech') ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function query(text, params) {
  const debut = Date.now();
  try {
    const res = await db().query(text, params);
    console.log(`🐘 SQL OK (${Date.now() - debut}ms) :`, text.slice(0, 80).replace(/\s+/g, ' '));
    return res;
  } catch (e) {
    console.error(`❌ SQL FAIL (${Date.now() - debut}ms) :`, text.slice(0, 80).replace(/\s+/g, ' '));
    console.error('   →', e.message);
    throw e;
  }
}
