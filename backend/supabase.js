import { createClient } from '@supabase/supabase-js';

// Client SERVEUR uniquement (routes /api). La clé service_role ne doit jamais
// être exposée au navigateur : pas de préfixe NEXT_PUBLIC_.
let client;

export function supabase() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !cle) {
      throw new Error('SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local');
    }
    client = createClient(url, cle, { auth: { persistSession: false } });
  }
  return client;
}
