-- db/schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS commandes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('achat', 'vente')),
  statut text NOT NULL DEFAULT 'en_attente'
    CHECK (statut IN ('en_attente', 'paiement_recu', 'en_cours', 'termine', 'annule')),

  crypto text NOT NULL,
  reseau text NOT NULL,
  montant_fcfa bigint,
  adresse_reception text,
  adresse_depot text,

  prenom text NOT NULL,
  indicatif text NOT NULL,
  numero text NOT NULL,
  operateur text NOT NULL,

  note_admin text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS commandes_created_idx ON commandes (created_at DESC);
CREATE INDEX IF NOT EXISTS commandes_statut_idx ON commandes (statut);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION maj_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS commandes_maj ON commandes;
CREATE TRIGGER commandes_maj BEFORE UPDATE ON commandes
  FOR EACH ROW EXECUTE FUNCTION maj_updated_at();

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  prenom text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE investissements_user DROP CONSTRAINT IF EXISTS investissements_user_user_id_categorie_actif_key;
ALTER TABLE investissements_user ADD CONSTRAINT investissements_user_user_id_categorie_actif_key UNIQUE (user_id, categorie, actif);

CREATE TABLE IF NOT EXISTS investissements_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  categorie text NOT NULL,
  actif text NOT NULL,
  quantite numeric NOT NULL DEFAULT 0,
  prix_achat_moyen numeric NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, categorie, actif)
);
