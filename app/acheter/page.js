'use client';

import { useState } from 'react';
import Link from 'next/link';
import ChoixCrypto from '@/components/ChoixCrypto';
import ChampTelephone from '@/components/ChampTelephone';
import { tauxPour, telVide, nomReseau } from '@/lib/config';
import { ajouterCommande, nouvelId, lire } from '@/lib/storage';

export default function Acheter() {
  const [choix, setChoix] = useState({ crypto: 'USDT', reseau: 'TRC20' });
  const [montant, setMontant] = useState('');
  const [adresse, setAdresse] = useState('');
  const [tel, setTel] = useState(telVide());
  const [envoye, setEnvoye] = useState(null);

  const fcfa = Number(montant) || 0;
  const estimation = fcfa > 0 ? (fcfa / tauxPour(fcfa)).toFixed(2) : null;

  function valider(e) {
    e.preventDefault();
    const commande = {
      id: nouvelId(),
      type: 'achat',
      date: new Date().toISOString(),
      statut: 'En attente',
      ...choix,
      montantFcfa: fcfa,
      adresse: adresse.trim(),
      telephone: `${tel.indicatif} ${tel.numero.trim()}`,
      operateur: tel.operateur,
      prenom: lire('prenom', ''),
    };
    ajouterCommande(commande);
    setEnvoye(commande);
  }

  if (envoye) {
    return (
      <section className="page etroite">
        <h1>Demande envoyée</h1>
        <p className="intro">
          Référence <strong>{envoye.id}</strong>. Nous vous contactons au {envoye.telephone} pour le paiement par {envoye.operateur}.
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
      <h1>Acheter</h1>
      <form onSubmit={valider} className="formulaire">
        <ChoixCrypto valeur={choix} onChange={setChoix} />

        <div className="champ">
          <label htmlFor="montant">Montant à payer (FCFA)</label>
          <input
            id="montant"
            type="number"
            inputMode="numeric"
            min="1000"
            placeholder="50000"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
          />
          {estimation && <small>Environ {estimation} {choix.crypto} reçus. Le montant final est confirmé avec les frais avant paiement.</small>}
        </div>

        <div className="champ">
          <label htmlFor="adresse">Adresse de réception {choix.crypto} ({nomReseau(choix.crypto, choix.reseau)})</label>
          <input
            id="adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            required
          />
        </div>

        <ChampTelephone label="Votre numéro de téléphone" valeur={tel} onChange={setTel} avecOperateur />

        <button className="bouton plein" type="submit">Acheter</button>
      </form>
    </section>
  );
}
