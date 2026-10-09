'use client';

import { useState } from 'react';
import Link from 'next/link';
import ChoixCrypto from '@/components/ChoixCrypto';
import ChampTelephone from '@/components/ChampTelephone';
import { tauxPour, telVide, nomReseau } from '@/lib/config';
import { adresseValide, aideAdresse } from '@/lib/adresses';
import { ajouterCommande, lire } from '@/lib/storage';
import { erreurMontant, erreurAdresse, erreurTelephone, messageServeur } from '@/lib/erreurs';

export default function Acheter() {
  const [choix, setChoix] = useState({ crypto: 'USDT', reseau: 'TRC20' });
  const [montant, setMontant] = useState('');
  const [adresse, setAdresse] = useState('');
  const [tel, setTel] = useState(telVide());
  const [envoye, setEnvoye] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  // Erreurs par champ
  const [err, setErr] = useState({ montant: '', adresse: '', telephone: '', global: '' });

  const fcfa = Number(montant) || 0;
  const estimation = fcfa > 0 ? (fcfa / tauxPour(fcfa)).toFixed(2) : null;
  const reseauNom = nomReseau(choix.crypto, choix.reseau);

  function verifierChamp(champ) {
    let message = '';
    if (champ === 'montant') message = erreurMontant(montant);
    if (champ === 'adresse') message = erreurAdresse(choix.reseau, adresse, adresseValide, aideAdresse);
    if (champ === 'telephone') message = erreurTelephone(tel.numero);
    setErr((e) => ({ ...e, [champ]: message || '' }));
    return !message;
  }

  async function valider(e) {
    e.preventDefault();
    setErr({ montant: '', adresse: '', telephone: '', global: '' });

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
        setErr((x) => ({ ...x, global: messageServeur(data.erreur) }));
        return;
      }

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
      setErr((x) => ({ ...x, global: messageServeur(err.message) }));
    } finally {
      setEnvoi(false);
    }
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
      <form onSubmit={valider} className="formulaire" noValidate>
        <ChoixCrypto valeur={choix} onChange={setChoix} />

        <div className="champ">
          <label htmlFor="montant">Montant à payer (FCFA)</label>
          <input
            id="montant"
            type="number"
            inputMode="numeric"
            min="1000"
            max="1000000"
            placeholder="50000"
            value={montant}
            onChange={(e) => {
              setMontant(e.target.value);
              if (err.montant) setErr((x) => ({ ...x, montant: '' }));
            }}
            onBlur={() => montant && verifierChamp('montant')}
            aria-invalid={!!err.montant}
            style={err.montant ? { borderColor: '#b42318' } : undefined}
          />
          {err.montant ? (
            <small role="alert" style={{ color: '#b42318' }}>{err.montant}</small>
          ) : (
            estimation && <small>Environ {estimation} {choix.crypto} reçus.</small>
          )}
        </div>

        <div className="champ">
          <label htmlFor="adresse">Adresse de réception {choix.crypto} ({reseauNom})</label>
          <input
            id="adresse"
            value={adresse}
            onChange={(e) => {
              setAdresse(e.target.value);
              if (err.adresse) setErr((x) => ({ ...x, adresse: '' }));
            }}
            onBlur={() => adresse && verifierChamp('adresse')}
            autoComplete="off"
            spellCheck={false}
            aria-invalid={!!err.adresse}
            style={err.adresse ? { borderColor: '#b42318' } : undefined}
          />
          {err.adresse && <small role="alert" style={{ color: '#b42318' }}>{err.adresse}</small>}
        </div>

        <div>
          <ChampTelephone label="Votre numéro de téléphone" valeur={tel} onChange={(v) => {
            setTel(v);
            if (err.telephone) setErr((x) => ({ ...x, telephone: '' }));
          }} avecOperateur />
          {err.telephone && <small role="alert" style={{ color: '#b42318' }}>{err.telephone}</small>}
        </div>

        {err.global && (
          <p role="alert" style={{
            color: '#b42318',
            background: '#fee4e2',
            padding: '0.8rem 1rem',
            borderRadius: '8px',
            margin: 0,
            border: '1px solid #fda29b',
          }}>
            {err.global}
          </p>
        )}

        <button className="bouton plein" type="submit" disabled={envoi}>
          {envoi ? 'Envoi…' : 'Acheter'}
        </button>
      </form>
    </section>
  );
}
