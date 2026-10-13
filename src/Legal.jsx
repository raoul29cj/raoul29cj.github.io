import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { legal } from "./legal-config";

const labels = {
  "#mentions-legales": "Mentions légales",
  "#confidentialite": "Données personnelles",
};

const requiredFields = [
  "editorName",
  "status",
  "address",
  "registration",
  "vat",
  "publicationDirector",
  "hostName",
  "hostAddress",
  "hostPhone",
  "retention",
  "providersAndTransfers",
  "hostingLogs",
];

function value(text) {
  return text || "À compléter avant publication";
}

function LegalDialog({ kind, onClose }) {
  const dialog = useRef(null);

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    element.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  const draft = requiredFields.some((field) => !legal[field]);

  return (
    <dialog
      ref={dialog}
      className="legal-dialog"
      aria-labelledby="legal-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) {
          onClose();
        }
      }}
    >
      <div className="legal-content">
        <button
          autoFocus
          type="button"
          className="legal-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          <X size={20} />
        </button>

        <span className="eyebrow">JUNIX / INFORMATIONS</span>

        <h2 id="legal-title">{labels[kind]}</h2>

        {draft && (
          <p className="legal-draft">
            Brouillon : des informations doivent encore être
            complétées avant publication.
          </p>
        )}

        {kind === "#mentions-legales" ? (
          <>
            <h3>Éditeur du site</h3>

            <dl>
              <dt>Nom ou dénomination</dt>
              <dd>{value(legal.editorName)}</dd>

              <dt>Statut</dt>
              <dd>{value(legal.status)}</dd>

              <dt>Adresse professionnelle</dt>
              <dd>{value(legal.address)}</dd>

              <dt>Immatriculation</dt>
              <dd>{value(legal.registration)}</dd>

              <dt>TVA</dt>
              <dd>{value(legal.vat)}</dd>

              <dt>Responsable de publication</dt>
              <dd>{value(legal.publicationDirector)}</dd>

              <dt>E-mail</dt>
              <dd>
                <a href={"mailto:" + legal.email}>
                  {legal.email}
                </a>
              </dd>

              <dt>Téléphone</dt>
              <dd>{legal.phone}</dd>
            </dl>

            <h3>Hébergement</h3>

            <dl>
              <dt>Hébergeur</dt>
              <dd>{value(legal.hostName)}</dd>

              <dt>Adresse</dt>
              <dd>{value(legal.hostAddress)}</dd>

              <dt>Téléphone</dt>
              <dd>{value(legal.hostPhone)}</dd>
            </dl>

            <h3>Présentation du portfolio</h3>

            <p>
              Junix présente des services de développement web et
              de design graphique. Maison Alba et Sola Restaurant
              sont des projets conceptuels fictifs. Les ressources
              numériques sont en préparation ; aucun paiement
              n’est proposé sur ce portfolio.
            </p>

            <h3>Contenus et droits</h3>

            <p>
              Les textes, créations et visuels sont protégés lorsque
              les conditions légales de protection sont réunies.
              Les marques et ressources tierces restent soumises
              aux droits et licences de leurs titulaires.
              Pour une demande de réutilisation, contactez l’éditeur.
            </p>
          </>
        ) : (
          <>
            <h3>Responsable du traitement</h3>

            <p>
              {value(legal.editorName)} — {value(legal.address)}.
              Pour toute question relative à vos données :{" "}
              <a href={"mailto:" + legal.email}>
                {legal.email}
              </a>.
            </p>

            <h3>Demandes de contact</h3>

            <p>
              Le formulaire utilise votre nom, votre adresse e-mail
              et le contenu de votre demande pour préparer un
              message dans votre application e-mail. Vous devez
              envoyer ce message depuis cette application.
              Le formulaire n’enregistre pas votre demande dans
              une base de données du portfolio.
            </p>

            <p>
              Les champs sont requis pour préparer une demande
              complète. Vous pouvez également contacter Junix
              directement par e-mail, téléphone ou SMS.
              Le bouton de copie place votre demande dans le
              presse-papiers de votre appareil lorsque vous l’utilisez.
            </p>

            <h3>Finalités et bases légales</h3>

            <p>
              Les demandes de devis sont traitées pour prendre
              des mesures précontractuelles à votre demande.
              Les autres questions sont traitées sur la base
              de l’intérêt légitime de l’éditeur à répondre aux
              personnes qui le contactent. Toute utilisation
              ultérieure pour une autre finalité doit faire
              l’objet d’une information appropriée.
            </p>

            <h3>Destinataires et prestataires</h3>

            <p>
              Les messages envoyés sont reçus par l’éditeur.
              Les prestataires de messagerie et d’hébergement
              peuvent traiter des données nécessaires à leurs services.
            </p>

            <p>{value(legal.providersAndTransfers)}</p>

            <h3>Conservation</h3>

            <p>{value(legal.retention)}</p>

            <p>
              Les données nécessaires à une relation contractuelle,
              à une obligation légale ou à la défense d’un droit
              peuvent relever de durées distinctes, à préciser
              selon la situation.
            </p>

            <h3>Données techniques d’hébergement</h3>

            <p>{value(legal.hostingLogs)}</p>

            <h3>Cookies et services externes</h3>

            <p>
              Le code de cette version du portfolio n’ajoute pas
              de cookies publicitaires ou de mesure d’audience.
              Les polices sont servies avec les fichiers du site.
              Les éventuels traceurs ajoutés par l’hébergement
              ou par de futurs services devront être vérifiés
              avant leur activation.
            </p>

            <p>
              Les liens e-mail, téléphone et SMS ouvrent une
              application de votre appareil. Les liens vers
              une boutique externe, lorsqu’ils seront activés,
              vous conduiront vers un service disposant de ses
              propres informations de confidentialité.
            </p>

            <h3>Vos droits</h3>

            <p>
              Selon les conditions applicables au traitement,
              vous pouvez exercer vos droits d’accès, de
              rectification, d’effacement, de limitation,
              d’opposition et, lorsque les conditions sont réunies,
              de portabilité, en écrivant à{" "}
              <a href={"mailto:" + legal.email}>
                {legal.email}
              </a>.
            </p>

            <p>
              Vous pouvez également adresser une réclamation à la{" "}
              <a href="https://www.cnil.fr/fr/plaintes">
                CNIL
              </a>.
            </p>
          </>
        )}
      </div>
    </dialog>
  );
}

export function LegalLinks() {
  const [kind, setKind] = useState(() =>
    labels[window.location.hash] ? window.location.hash : null
  );

  const previousHash = useRef("#accueil");

  useEffect(() => {
    let lastHash = labels[window.location.hash]
      ? "#accueil"
      : window.location.hash;

    function handleHashChange() {
      const hash = window.location.hash;

      if (labels[hash]) {
        previousHash.current = lastHash;
        setKind(hash);
      } else {
        lastHash = hash;
        setKind(null);
      }
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  function close() {
    window.history.replaceState(
      null,
      "",
      window.location.pathname +
        window.location.search +
        (previousHash.current || "#accueil")
    );

    setKind(null);
  }

  return (
    <>
      <div className="legal-bar">
        <div className="shell">
          <nav aria-label="Informations légales">
            <a href="#mentions-legales">Mentions légales</a>
            <a href="#confidentialite">Données personnelles</a>
          </nav>
        </div>
      </div>

      {kind && (
        <LegalDialog key={kind} kind={kind} onClose={close} />
      )}
    </>
  );
}