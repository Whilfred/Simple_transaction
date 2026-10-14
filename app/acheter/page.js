'use client';

import { useState } from 'react';
import Link from 'next/link';
import ChoixCrypto from '@/components/ChoixCrypto';
import ChampTelephone from '@/components/ChampTelephone';
import { CRYPTOS, tauxPour, telVide, nomReseau } from '@/lib/config';
import { adresseValide, aideAdresse } from '@/lib/adresses';
import { ajouterCommande, lire } from '@/lib/storage';
import { redirigerVersWhatsApp } from '@/lib/whatsapp';

import {
  erreurMontant,
  erreurAdresse,
  erreurTelephone,
  messageServeur,
} from '@/lib/erreurs';

export default function Acheter() {
  const [choix, setChoix] = useState({
    crypto: 'USDT',
    reseau: 'TRC20',
  });
  const [montant, setMontant] = useState('');
  const [adresse, setAdresse] = useState('');
  const [tel, setTel] = useState(telVide());
  const [envoye, setEnvoye] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  const [err, setErr] = useState({
    montant: '',
    adresse: '',
    telephone: '',
    global: '',
  });

  const fcfa = Number(montant) || 0;

  // L'estimation n'est fiable que pour les cryptos à ~1 $ (USDT, USDC).
  // Pour les autres (BTC, ETH, SOL…), le prix varie : il est confirmé par l'équipe.
  const cryptoChoisie = CRYPTOS.find((c) => c.code === choix.crypto);
  const estimable = !!cryptoChoisie?.estimable;
  const estimation =
    estimable && fcfa > 0 ? (fcfa / tauxPour(fcfa)).toFixed(2) : null;
  const reseauNom = nomReseau(choix.crypto, choix.reseau);

  function verifierChamp(champ) {
    let message = '';

    if (champ === 'montant') message = erreurMontant(montant);
    if (champ === 'adresse') {
      message = erreurAdresse(
        choix.reseau,
        adresse,
        adresseValide,
        aideAdresse
      );
    }
    if (champ === 'telephone') {
      message = erreurTelephone(tel.numero);
    }

    setErr((e) => ({ ...e, [champ]: message || '' }));
    return !message;
  }

  async function valider(e) {
    e.preventDefault();
    setErr({
      montant: '',
      adresse: '',
      telephone: '',
      global: '',
    });

    const okMontant = verifierChamp('montant');
    const okAdresse = verifierChamp('adresse');
    const okTel = verifierChamp('telephone');

    if (!okMontant || !okAdresse || !okTel) return;

    setEnvoi(true);

    try {
      const reponse = await fetch('/api/commandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'achat',
          ...choix,
          montantFcfa: fcfa,
          adresse: adresse.trim(),
          indicatif: tel.indicatif,
          numero: tel.numero,
          operateur: tel.operateur,
          prenom: lire('prenom', '') || 'Client',
        }),
      });

      const data = await reponse.json().catch(() => ({}));

      if (!reponse.ok) {
        setErr((x) => ({
          ...x,
          global: messageServeur(data.erreur),
        }));
        return;
      }

      const messageWhatsApp = [
        'Bonjour ExCrypt ! Je viens de créer une demande d’achat.',
        '',
        `Référence : ${data.reference}`,
        `Cryptomonnaie : ${choix.crypto}`,
        `Réseau : ${reseauNom}`,
        `Montant à payer : ${fcfa.toLocaleString('fr-FR')} FCFA`,
        `Montant estimé à recevoir : ${
          estimation ? `${estimation} ${choix.crypto}` : 'À confirmer'
        }`,
        `Adresse de réception : ${adresse.trim()}`,
        `Opérateur Mobile Money : ${tel.operateur}`,
        `Mon numéro : ${tel.indicatif} ${tel.numero.trim()}`,
        '',
        'Merci de me guider pour la suite de mon achat.',
      ].join('\n');

      redirigerVersWhatsApp(messageWhatsApp);

      ajouterCommande({
        id: data.reference,
        type: 'achat',
        date: new Date().toISOString(),
        statut: data.statut,
        ...choix,
        montantFcfa: fcfa,
      });

      setEnvoye({
        id: data.reference,
        telephone: `${tel.indicatif} ${tel.numero.trim()}`,
        operateur: tel.operateur,
      });
    } catch (err) {
      setErr((x) => ({
        ...x,
        global: messageServeur(err.message),
      }));
    } finally {
      setEnvoi(false);
    }
  }

  // Confirmation
  if (envoye) {
    return (
      <section className="page achat-page">
        <div className="confirmation-achat">
          <div className="confirmation-icone">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m5 12 4 4L19 6" />
            </svg>
          </div>

          <span className="achat-surtitre">EXCRYPT · ACHAT</span>
          <h1>Demande envoyée !</h1>

          <p className="confirmation-description">
            Votre demande a bien été transmise. Notre équipe vous
            contactera pour la suite du paiement.
          </p>

          <div className="reference-achat">
            <span>Référence de votre opération</span>
            <strong>{envoye.id}</strong>
          </div>

          <div className="confirmation-detail">
            <span>Numéro de contact</span>
            <strong>{envoye.telephone}</strong>
          </div>

          <div className="confirmation-detail">
            <span>Opérateur Mobile Money</span>
            <strong>{envoye.operateur}</strong>
          </div>

          <div className="confirmation-note">
            <span aria-hidden="true">ⓘ</span>
            <p>
              Attendez les instructions de paiement et vérifiez toujours
              les informations avant d'envoyer de l'argent.
            </p>
          </div>

          <div className="confirmation-actions">
            <Link href="/dashboard" className="bouton plein">
              Voir mes opérations
            </Link>
            <Link href="/accueil" className="bouton">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page achat-page">
      {/* En-tête */}
      <header className="achat-entete">
        <Link href="/accueil" className="achat-retour">
          <span aria-hidden="true">←</span> Accueil
        </Link>

        <div className="achat-surtitre">
          <span className="achat-point" />
          ACHAT DE CRYPTOMONNAIES
        </div>

        <h1>Acheter des cryptomonnaies</h1>

        <p className="achat-description">
          Payez en FCFA avec votre opérateur Mobile Money et recevez
          vos cryptomonnaies à l'adresse indiquée.
        </p>

        <div className="achat-etapes">
          <div className="achat-etape active">
            <span>1</span>
            <strong>Configuration</strong>
          </div>
          <div className="achat-etape-ligne" />
          <div className="achat-etape">
            <span>2</span>
            <strong>Confirmation</strong>
          </div>
        </div>
      </header>

      <form onSubmit={valider} className="formulaire achat-formulaire" noValidate>
        {/* Crypto et réseau */}
        <div className="achat-bloc">
          <div className="achat-bloc-titre">
            <span className="achat-numero">01</span>
            <div>
              <h2>Votre cryptomonnaie</h2>
              <p>Choisissez la monnaie et le réseau de réception.</p>
            </div>
          </div>

          <ChoixCrypto valeur={choix} onChange={setChoix} />
        </div>

        <div className="achat-separateur" />

        {/* Montant */}
        <div className="achat-bloc">
          <div className="achat-bloc-titre">
            <span className="achat-numero">02</span>
            <div>
              <h2>Montant de l'achat</h2>
              <p>Indiquez combien vous souhaitez payer en FCFA.</p>
            </div>
          </div>

          <div className="champ achat-champ">
            <label htmlFor="montant">Montant à payer</label>

            <div className={`achat-montant-input ${err.montant ? 'invalide' : ''}`}>
              <input
                id="montant"
                type="number"
                inputMode="numeric"
                min="1000"
                max="1000000"
                placeholder="50 000"
                value={montant}
                onChange={(e) => {
                  setMontant(e.target.value);
                  if (err.montant) {
                    setErr((x) => ({ ...x, montant: '' }));
                  }
                }}
                onBlur={() => montant && verifierChamp('montant')}
                aria-invalid={!!err.montant}
              />
              <span className="achat-devise">FCFA</span>
            </div>

            {err.montant ? (
              <small role="alert" className="achat-erreur">
                {err.montant}
              </small>
            ) : (
              <small className="achat-aide">
                Montant autorisé selon les limites de la plateforme.
              </small>
            )}
          </div>

          <div className="achat-estimation">
            <div>
              <span className="estimation-label">Vous recevrez environ</span>
              <div className="estimation-valeur">
                {estimable ? (
                  <>
                    {estimation || '0.00'}
                    <span>{choix.crypto}</span>
                  </>
                ) : (
                  <>
                    À confirmer
                    <span>{choix.crypto}</span>
                  </>
                )}
              </div>
            </div>

            <div className="estimation-icone" aria-hidden="true">
              ↗
            </div>
          </div>

          <p className="achat-note-taux">
            {estimable
              ? 'Estimation indicative selon le taux applicable à votre montant.'
              : `Le prix du ${choix.crypto} varie en permanence : le montant exact vous sera confirmé par notre équipe avant le paiement.`}
          </p>
        </div>

        <div className="achat-separateur" />

        {/* Adresse */}
        <div className="achat-bloc">
          <div className="achat-bloc-titre">
            <span className="achat-numero">03</span>
            <div>
              <h2>Adresse de réception</h2>
              <p>Indiquez l'adresse du portefeuille qui recevra vos fonds.</p>
            </div>
          </div>

          <div className="champ achat-champ">
            <label htmlFor="adresse">
              Adresse {choix.crypto} ({reseauNom})
            </label>

            <input
              id="adresse"
              value={adresse}
              onChange={(e) => {
                setAdresse(e.target.value);
                if (err.adresse) {
                  setErr((x) => ({ ...x, adresse: '' }));
                }
              }}
              onBlur={() => adresse && verifierChamp('adresse')}
              autoComplete="off"
              spellCheck={false}
              placeholder="Collez votre adresse de portefeuille"
              aria-invalid={!!err.adresse}
            />

            {err.adresse ? (
              <small role="alert" className="achat-erreur">
                {err.adresse}
              </small>
            ) : (
              <small className="achat-aide">
                Vérifiez que l'adresse correspond au réseau sélectionné.
              </small>
            )}
          </div>

          <div className="achat-avertissement">
            <span aria-hidden="true">!</span>
            <p>
              Une adresse ou un réseau incorrect peut entraîner la perte
              définitive des fonds. Vérifiez attentivement avant de continuer.
            </p>
          </div>
        </div>

        <div className="achat-separateur" />

        {/* Téléphone */}
        <div className="achat-bloc">
          <div className="achat-bloc-titre">
            <span className="achat-numero">04</span>
          </div>

          <div className="achat-telephone">
            <ChampTelephone
              label="Votre numéro de téléphone"
              valeur={tel}
              onChange={(v) => {
                setTel(v);
                if (err.telephone) {
                  setErr((x) => ({ ...x, telephone: '' }));
                }
              }}
              avecOperateur
            />

            {err.telephone && (
              <small role="alert" className="achat-erreur">
                {err.telephone}
              </small>
            )}
          </div>
        </div>

        {/* Erreur générale */}
        {err.global && (
          <p role="alert" className="achat-erreur-global">
            <span aria-hidden="true">!</span>
            {err.global}
          </p>
        )}

        {/* Bouton */}
        <div className="achat-pied-formulaire">
          <div className="achat-securite">
            <span aria-hidden="true">♧</span>
            <span>Vérifiez les informations avant de confirmer.</span>
          </div>

          <button
            className="bouton plein achat-submit"
            type="submit"
            disabled={envoi}
          >
            {envoi ? (
              <>
                <span className="achat-spinner" />
                Envoi en cours…
              </>
            ) : (
              <>
                Continuer ma demande
                <span aria-hidden="true">→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
