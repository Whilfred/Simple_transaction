'use client';

import { useState } from 'react';
import Link from 'next/link';
import ChoixCrypto from '@/components/ChoixCrypto';
import ChampTelephone from '@/components/ChampTelephone';
import { telVide, nomReseau } from '@/lib/config';
import { ajouterCommande, lire } from '@/lib/storage';

export default function Vendre() {
  const [choix, setChoix] = useState({ crypto: 'USDT', reseau: 'TRC20' });
  const [depot, setDepot] = useState(telVide());
  const [commande, setCommande] = useState(null);
  const [copie, setCopie] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState('');

  async function valider(e) {
    e.preventDefault();
    setErreur('');

    // Validation rapide du numéro
    const numero = (depot.numero || '').replace(/\s+/g, '');
    if (!numero) {
      setErreur('Veuillez saisir votre numéro de dépôt.');
      return;
    }
    if (!/^\d{6,15}$/.test(numero)) {
      setErreur('Votre numéro semble invalide. Vérifiez les chiffres saisis.');
      return;
    }

    setEnvoi(true);
    try {
      const reponse = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'vente',
          ...choix,
          indicatif: depot.indicatif,
          numero,
          operateur: depot.operateur,
          prenom: lire('prenom', '') || 'Client',
        }),
      });

      const data = await reponse.json().catch(() => ({}));

      if (!reponse.ok) {
        setErreur(data.erreur || 'Une erreur est survenue. Réessayez.');
        return;
      }

      ajouterCommande({
        id: data.reference,
        type: 'vente',
        date: new Date().toISOString(),
        statut: data.statut,
        ...choix,
      });

      setCommande({
        id: data.reference,
        ...choix,
        adresseDepot: data.adresseDepot,
        numeroDepot: `${depot.indicatif} ${numero}`,
        operateurDepot: depot.operateur,
      });
    } catch {
      setErreur('Connexion impossible. Vérifiez votre internet et réessayez.');
    } finally {
      setEnvoi(false);
    }
  }

  async function copier() {
    try {
      await navigator.clipboard.writeText(commande.adresseDepot);
      setCopie(true);
      setTimeout(() => setCopie(false), 1800);
    } catch {}
  }

  if (commande) {
    return (
      <section className="page etroite">
        <h1>Envoyez vos {commande.crypto}</h1>
        <p className="intro">
          Envoyez uniquement des {commande.crypto} sur le réseau{' '}
          <strong>{nomReseau(commande.crypto, commande.reseau)}</strong> à cette adresse.
        </p>

        <div className="adresse-depot">
          <code>{commande.adresseDepot}</code>
          <button type="button" className="bouton" onClick={copier}>
            {copie ? 'Copié' : 'Copier'}
          </button>
        </div>

        <p className="note">
          Vos FCFA seront envoyés au {commande.numeroDepot} ({commande.operateurDepot}).
          Référence <strong>{commande.id}</strong>.
        </p>

        <div className="actions">
          <Link href="/dashboard" className="bouton plein">Voir mes opérations</Link>
          <Link href="/accueil" className="bouton">Retour à l'accueil</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page etroite">
      <h1>Vendre</h1>
      <form onSubmit={valider} className="formulaire">
        <ChoixCrypto valeur={choix} onChange={setChoix} />

        <ChampTelephone
          label="Numéro de dépôt (mobile money)"
          aide="C'est ici que vous recevez vos FCFA."
          valeur={depot}
          onChange={setDepot}
          avecOperateur
        />

        {erreur && (
          <p role="alert" style={{ color: '#b42318', margin: 0 }}>
            {erreur}
          </p>
        )}

        <button className="bouton plein" type="submit" disabled={envoi}>
          {envoi ? 'Envoi…' : "Obtenir l'adresse de dépôt"}
        </button>
      </form>
    </section>
  );
}
