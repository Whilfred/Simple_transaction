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








