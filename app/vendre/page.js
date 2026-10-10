'use client';

import { useState } from 'react';
import Link from 'next/link';
import ChoixCrypto from '@/components/ChoixCrypto';
import ChampTelephone from '@/components/ChampTelephone';
import { telVide, nomReseau } from '@/lib/config';
import { ajouterCommande, lire } from '@/lib/storage';

export default function Vendre() {
  const [choix, setChoix] = useState({
    crypto: 'USDT',
    reseau: 'TRC20',
  });
  const [depot, setDepot] = useState(telVide());
  const [commande, setCommande] = useState(null);
  const [copie, setCopie] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState('');

  async function valider(e) {
    e.preventDefault();
    setErreur('');

    const numero = (depot.numero || '').replace(/\s+/g, '');

    if (!numero) {
      setErreur('Veuillez saisir votre numéro de dépôt.');
      return;
    }

    if (!/^\d{6,15}$/.test(numero)) {
      setErreur(
        'Votre numéro semble invalide. Vérifiez les chiffres saisis.'
      );
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
        setErreur(
          data.erreur || 'Une erreur est survenue. Réessayez.'
        );
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
      setErreur(
        'Connexion impossible. Vérifiez votre internet et réessayez.'
      );
    } finally {
      setEnvoi(false);
    }
  }

  async function copier() {
    try {
      await navigator.clipboard.writeText(commande.adresseDepot);
      setCopie(true);
      setTimeout(() => setCopie(false), 1800);
    } catch {
      setErreur(
        'Impossible de copier automatiquement. Sélectionnez et copiez l’adresse.'
      );
    }
  }

  // Étape 2 : instructions de dépôt
  if (commande) {
    const reseau = nomReseau(commande.crypto, commande.reseau);

    return (
      <section className="page vente-page">
        <Link href="/accueil" className="vente-retour">
          <span aria-hidden="true">←</span> Accueil
        </Link>

        <header className="vente-entete">
          <div className="vente-surtitre">
            <span className="vente-point" />
            DÉPÔT DE CRYPTOMONNAIES
          </div>

          <h1>Envoyez vos {commande.crypto}</h1>

          <p>
            Votre demande est créée. Suivez les instructions ci-dessous
            pour effectuer votre dépôt.
          </p>
        </header>

        <div className="vente-confirmation">
          <div className="vente-confirmation-entete">
            <div className="vente-icone-confirmation">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </div>

            <div>
              <span className="vente-etiquette">ÉTAPE SUIVANTE</span>
              <h2>Adresse de dépôt</h2>
              <p>Réseau sélectionné : {reseau}</p>
            </div>
          </div>

          <div className="vente-avertissement">
            <span aria-hidden="true">!</span>
            <p>
              Envoyez uniquement des {commande.crypto} via le réseau{' '}
              <strong>{reseau}</strong>. Vérifiez le réseau et l'adresse
              dans votre portefeuille avant de confirmer le transfert.
            </p>
          </div>

          <div className="vente-adresse-zone">
            <label htmlFor="adresse-depot">Adresse de réception du dépôt</label>

            <div className="vente-adresse-boite">
              <code id="adresse-depot">{commande.adresseDepot}</code>

              <button
                type="button"
                className={`vente-copier ${copie ? 'copie' : ''}`}
                onClick={copier}
                aria-label="Copier l'adresse de dépôt"
              >
                {copie ? (
                  <>
                    <span aria-hidden="true">✓</span> Copié
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">▢</span> Copier
                  </>
                )}
              </button>
            </div>

            <p className="vente-aide-adresse">
              Utilisez le bouton Copier pour éviter les erreurs de saisie.
            </p>
          </div>

          <div className="vente-details">
            <div className="vente-detail-ligne">
              <span>Référence de l'opération</span>
              <strong>{commande.id}</strong>
            </div>

            <div className="vente-detail-ligne">
              <span>Cryptomonnaie</span>
              <strong>{commande.crypto}</strong>
            </div>

            <div className="vente-detail-ligne">
              <span>Réseau</span>
              <strong>{reseau}</strong>
            </div>

            <div className="vente-detail-ligne">
              <span>Recevoir les FCFA sur</span>
              <strong>{commande.operateurDepot}</strong>
            </div>

            <div className="vente-detail-ligne">
              <span>Numéro Mobile Money</span>
              <strong>{commande.numeroDepot}</strong>
            </div>
          </div>

          <div className="vente-info-paiement">
            <span aria-hidden="true">ⓘ</span>
            <p>
              Après votre transfert, le traitement dépend de la réception
              et de la vérification des fonds. Le versement en FCFA n'est
              pas confirmé par le simple affichage de cette adresse.
            </p>
          </div>

          <div className="vente-actions">
            <Link href="/dashboard" className="bouton plein">
              Suivre mon opération <span aria-hidden="true">→</span>
            </Link>

            <Link href="/accueil" className="bouton">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Étape 1 : création de la demande
  return (
    <section className="page vente-page">
      <Link href="/accueil" className="vente-retour">
        <span aria-hidden="true">←</span> Accueil
      </Link>

      <header className="vente-entete">
        <div className="vente-surtitre">
          <span className="vente-point" />
          VENTE DE CRYPTOMONNAIES
        </div>

        <h1>Convertissez vos cryptos en FCFA</h1>

        <p>
          Sélectionnez votre cryptomonnaie et indiquez où recevoir
          votre paiement Mobile Money.
        </p>

        <div className="vente-etapes">
          <div className="vente-etape active">
            <span>1</span>
            <strong>Configuration</strong>
          </div>

          <div className="vente-etape-ligne" />

          <div className="vente-etape">
            <span>2</span>
            <strong>Dépôt crypto</strong>
          </div>
        </div>
      </header>

      <form onSubmit={valider} className="formulaire vente-formulaire">
        <div className="vente-bloc">
          <div className="vente-bloc-titre">
            <span className="vente-numero">01</span>
            <div>
              <h2>Cryptomonnaie à vendre</h2>
              <p>Choisissez la monnaie et son réseau de transfert.</p>
            </div>
          </div>

          <ChoixCrypto valeur={choix} onChange={setChoix} />
        </div>

        <div className="vente-separateur" />

        <div className="vente-bloc">
          <div className="vente-bloc-titre">
            <span className="vente-numero">02</span>
            <div>
              <h2>Recevoir mes FCFA</h2>
              <p>
                Renseignez le numéro Mobile Money sur lequel vous souhaitez
                recevoir votre paiement.
              </p>
            </div>
          </div>

          <ChampTelephone
            label="Numéro de réception Mobile Money"
            aide="Vérifiez que le numéro est correct et accessible."
            valeur={depot}
            onChange={setDepot}
            avecOperateur
          />
        </div>

        {erreur && (
          <p role="alert" className="vente-erreur">
            <span aria-hidden="true">!</span>
            {erreur}
          </p>
        )}

        <div className="vente-pied-formulaire">
          <div className="vente-rappel">
            <span aria-hidden="true">↗</span>
            <p>
              L'adresse de dépôt vous sera communiquée après la création
              de votre demande.
            </p>
          </div>

          <button
            className="bouton plein vente-submit"
            type="submit"
            disabled={envoi}
          >
            {envoi ? (
              <>
                <span className="vente-spinner" />
                Préparation…
              </>
            ) : (
              <>
                Obtenir mon adresse de dépôt
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>

          <p className="vente-conditions">
            Vérifiez toujours le réseau avant d'envoyer vos cryptomonnaies.
          </p>
        </div>
      </form>
    </section>
  );
}
