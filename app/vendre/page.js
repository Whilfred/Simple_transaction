'use client';

import { useState } from 'react';
import Link from 'next/link';
import ChoixCrypto from '@/components/ChoixCrypto';
import ChampTelephone from '@/components/ChampTelephone';
import { ADRESSES_DEPOT, telVide, nomReseau } from '@/lib/config';
import { ajouterCommande, nouvelId, lire } from '@/lib/storage';

export default function Vendre() {
  const [choix, setChoix] = useState({ crypto: 'USDT', reseau: 'TRC20' });
  const [depot, setDepot] = useState(telVide());
  const [tel, setTel] = useState(telVide());
  const [commande, setCommande] = useState(null);
  const [copie, setCopie] = useState(false);

  function valider(e) {
    e.preventDefault();
    const c = {
      id: nouvelId(),
      type: 'vente',
      date: new Date().toISOString(),
      statut: 'En attente de dépôt',
      ...choix,
      numeroDepot: `${depot.indicatif} ${depot.numero.trim()}`,
      operateurDepot: depot.operateur,
      telephone: `${tel.indicatif} ${tel.numero.trim()}`,
      adresseDepot: ADRESSES_DEPOT[`${choix.crypto}:${choix.reseau}`] || '',
      prenom: lire('prenom', ''),
    };
    ajouterCommande(c);
    setCommande(c);
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
          Envoyez uniquement des {commande.crypto} sur le réseau <strong>{nomReseau(commande.crypto, commande.reseau)}</strong> à cette adresse.
        </p>

        <div className="adresse-depot">
          <code>{commande.adresseDepot}</code>
          <button type="button" className="bouton" onClick={copier}>{copie ? 'Copié' : 'Copier'}</button>
        </div>

        <p className="note">
          Vos FCFA seront envoyés au {commande.numeroDepot} ({commande.operateurDepot}). Référence <strong>{commande.id}</strong>.
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

        <ChampTelephone label="Votre numéro de téléphone" valeur={tel} onChange={setTel} />

        <button className="bouton plein" type="submit">Obtenir l'adresse de dépôt</button>
      </form>
    </section>
  );
}
