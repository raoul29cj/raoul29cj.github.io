import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  Check,
  RefreshCw,
  Scissors,
  Ruler,
  Clock3,
  Layers,
} from "lucide-react";
import { config } from "./config";
import { projects, demoContent } from "./projects";
import { ProjectArt, Reveal, Tilt } from "./Effects";

export function NotFound() {
  return (
    <main className="container error-page">
      <span className="eyebrow">UNE PETITE SORTIE DE ROUTE</span>
      <div className="error-code" aria-hidden="true">
        404<span>.</span>
      </div>
      <h1>
        Cette page a pris
        <br />
        <em>un autre chemin.</em>
      </h1>
      <p>Le lien est peut-être incomplet ou la page n’existe plus.</p>
      <a className="button primary" href="/">
        <ArrowLeft size={17} />
        Revenir à l’accueil
      </a>
      <nav className="error-shortcuts" aria-label="Autres destinations">
        <a href="/#services">
          Les services <ArrowRight size={15} />
        </a>
        <a href="/#projets">
          Les projets <ArrowRight size={15} />
        </a>
      </nav>
    </main>
  );
}
export class ErrorBoundary extends React.Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="container error-page">
        <span className="eyebrow">UNE INTERRUPTION IMPRÉVUE</span>
        <h1>
          Reprenons
          <br />
          <em>depuis le début.</em>
        </h1>
        <p>
          Une erreur empêche l’affichage de cette partie du site. Vos messages
          déjà envoyés ne sont pas renvoyés automatiquement.
        </p>
        <button
          className="button primary"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={16} />
          Recharger la page
        </button>
        <a className="subtle-link" href={"mailto:" + config.email}>
          Contacter Junix
        </a>
      </main>
    ) : (
      this.props.children
    );
  }
}
const legalTitles = {
  "mentions-legales": "Mentions légales",
  confidentialite: "Données personnelles",
  conditions: "Conditions d’utilisation",
};
export function LegalPage({ type }) {
  const l = config.legal;
  const pending = Object.values(l).some((v) => !v);
  const text = (v) => v || "À compléter avant publication";
  return (
    <main className="container document-page">
      <a className="subtle-link" href="/#accueil">
        <ArrowLeft size={16} />
        Retour à Junix
      </a>
      <span className="eyebrow">JUNIX / INFORMATIONS</span>
      <h1>{legalTitles[type]}</h1>
      <nav className="document-shortcuts" aria-label="Documents du site">
        {Object.entries(legalTitles).map(([id, title]) => (
          <a
            key={id}
            href={"/" + id + "/"}
            aria-current={id === type ? "page" : undefined}
          >
            {title}
            <ArrowUpRight size={14} />
          </a>
        ))}
      </nav>
      {pending && (
        <p className="draft-note">
          Document en préparation. L’identité légale, l’hébergement et certaines
          modalités de traitement doivent être complétés avant publication.
        </p>
      )}
      {type === "mentions-legales" ? (
        <>
          <h2>Éditeur et publication</h2>
          <dl>
            {[
              ["Identité", l.identity],
              ["Statut", l.status],
              ["Adresse professionnelle", l.address],
              ["Immatriculation", l.registration],
              ["TVA", l.vat],
              ["Responsable de publication", l.director],
              ["E-mail", config.email],
              ["Téléphone", config.phoneLabel],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{text(value)}</dd>
              </div>
            ))}
          </dl>
          <h2>Hébergement</h2>
          <p>
            {text(l.host)}
            <br />
            {text(l.hostAddress)}
            <br />
            {text(l.hostPhone)}
          </p>
          <h2>Contenus</h2>
          <p>
            Junix présente des services web et graphiques ainsi que des projets
            conceptuels. Les marques et ressources tierces restent soumises aux
            droits et licences de leurs titulaires. Contactez l’éditeur pour une
            demande de réutilisation.
          </p>
        </>
      ) : type === "confidentialite" ? (
        <>
          <h2>Qui traite vos données ?</h2>
          <p>
            {text(l.identity)} — {text(l.address)}. Contact :{" "}
            <a href={"mailto:" + config.email}>{config.email}</a>.
          </p>
          <h2>Formulaire et finalités</h2>
          <p>
            Votre nom, votre e-mail et votre message sont transmis à Formspree
            pour recevoir votre demande et notifier Junix par e-mail. Ces champs
            sont nécessaires à une demande complète. Vous pouvez aussi nous
            joindre directement par e-mail, téléphone ou SMS. La copie de votre
            demande utilise le presse-papiers de votre appareil uniquement à
            votre initiative.
          </p>
          <p>
            Les demandes de devis relèvent des mesures précontractuelles prises
            à votre demande. Les autres échanges reposent sur l’intérêt légitime
            à répondre aux personnes qui contactent Junix.
          </p>
          <h2>Destinataires et transferts</h2>
          <p>
            L’éditeur, Formspree et les prestataires de messagerie traitent les
            informations nécessaires à leurs services. Formspree peut conserver
            les soumissions dans son espace de gestion et indique traiter des
            données notamment aux États-Unis.{" "}
            <a href="https://formspree.io/legal/privacy-policy/">
              Politique de Formspree
            </a>
            .
          </p>
          <p>{text(l.transfers)}</p>
          <h2>Durées de conservation</h2>
          <p>{text(l.retention)}</p>
          <p>
            Les informations nécessaires à un contrat ou à une obligation légale
            peuvent relever de durées distinctes, à préciser selon la situation.
          </p>
          <h2>Hébergement et journaux techniques</h2>
          <p>{text(l.logs)}</p>
          <h2>Cookies et liens externes</h2>
          <p>
            Cette version n’intègre pas d’outil de suivi publicitaire ou de
            mesure d’audience. Les polices sont servies avec le site. Les
            traitements techniques et éventuels traceurs de l’hébergeur doivent
            être vérifiés avant publication. Les services externes accessibles
            par un lien disposent de leurs propres règles de confidentialité.
          </p>
          <h2>Vos droits</h2>
          <p>
            Selon les conditions applicables, vous disposez de droits d’accès,
            de rectification, d’effacement, de limitation, d’opposition et de
            portabilité. Contactez{" "}
            <a href={"mailto:" + config.email}>{config.email}</a>. Vous pouvez
            aussi adresser une réclamation à la{" "}
            <a href="https://www.cnil.fr/fr/plaintes">CNIL</a>.
          </p>
        </>
      ) : (
        <>
          <h2>Objet du site</h2>
          <p>
            Junix présente le travail de son créateur et permet de prendre
            contact. Aucun compte utilisateur ni paiement n’est proposé sur
            cette version.
          </p>
          <h2>Démonstrations et tarifs</h2>
          <p>
            Maison Alba et Sola Restaurant sont des créations fictives. Les
            interactions illustrent une expérience web ; elles ne permettent pas
            de réserver de prestations réelles. Les tarifs affichés sont des
            prix de départ indicatifs : le périmètre et les conditions d’une
            prestation sont précisés dans un devis et les documents contractuels
            applicables.
          </p>
          <h2>Ressources et liens</h2>
          <p>
            Les produits numériques sont en préparation. Les liens de boutique
            ne seront activés qu’à leur ouverture. Les conditions du vendeur et
            du prestataire de paiement devront alors être présentées séparément.
          </p>
          <h2>Utilisation et contact</h2>
          <p>
            N’utilisez pas le formulaire pour du spam, des contenus illicites ou
            des données sensibles. Pour signaler un problème, contactez{" "}
            <a href={"mailto:" + config.email}>{config.email}</a>.
          </p>
          <h2>Propriété intellectuelle</h2>
          <p>
            La réutilisation des contenus dépend des droits et licences
            associés. La consultation du site ne transfère pas ces droits.
          </p>
        </>
      )}
    </main>
  );
}
export function ProjectPage({ id }) {
  const p = projects.find((p) => p.id === id),
    d = demoContent[id];
  const [tab, setTab] = useState(0),
    [selected, setSelected] = useState("");
  const [choice, setChoice] = useState(""),
    [confirmed, setConfirmed] = useState(false);
  const selectionRef = React.useRef(null);
  useEffect(() => {
    setTab(0);
    setSelected("");
    setChoice("");
    setConfirmed(false);
  }, [id]);
  useEffect(() => {
    if (selected) selectionRef.current?.focus({ preventScroll: true });
  }, [selected]);
  if (!p || !d) return <NotFound />;
  const next =
    projects[
      (projects.findIndex((item) => item.id === id) + 1) % projects.length
    ];
  const Icon = id === "barber" ? Scissors : id === "artisan" ? Ruler : Layers;
  const options =
    id === "barber"
      ? ["10 h", "14 h", "17 h"]
      : id === "artisan"
        ? ["Chêne clair", "Noyer naturel", "À définir"]
        : [];
  return (
    <main className={"project-page " + d.theme}>
      <div className="demo-notice">
        <span>CONCEPT FICTIF / AUCUNE RÉSERVATION NI COMMANDE RÉELLE</span>
        <a href="/#projets">
          <ArrowLeft size={14} />
          Retour au portfolio
        </a>
      </div>
      <div className="container">
        <header className="demo-nav">
          <strong>
            <Icon size={22} strokeWidth={1.5} />
            {p.name}
          </strong>
          <a href="#demo-offers">
            {d.link}
            <ArrowUpRight size={15} />
          </a>
        </header>
        <div className="demo-hero">
          <Reveal>
            <span className="eyebrow">{p.type}</span>
            <h1>
              {d.title[0]}
              <br />
              <em>{d.title[1]}</em>
            </h1>
            <p>{d.intro}</p>
            <a className="demo-button" href="#demo-offers">
              Explorer le concept
              <ArrowUpRight size={17} />
            </a>
          </Reveal>
          <Reveal>
            <Tilt strength={9}>
              <ProjectArt id={id} />
            </Tilt>
          </Reveal>
        </div>
        <section id="demo-offers" className="demo-offers">
          <span className="eyebrow">{d.eyebrow}</span>
          <h2>{d.heading}</h2>
          <div className="tabs" aria-label="Catégories de la démonstration">
            {d.categories.map((name, i) => (
              <button
                key={name}
                aria-pressed={tab === i}
                onClick={() => {
                  setTab(i);
                  setSelected("");
                  setChoice("");
                  setConfirmed(false);
                }}
              >
                {name}
              </button>
            ))}
          </div>
          <div className="demo-offer-grid" key={tab}>
            {d.offers[tab].map(([name, text]) => (
              <Reveal
                className={
                  "demo-offer" + (selected === name ? " is-selected" : "")
                }
                key={name}
              >
                <span className="eyebrow">{d.itemLabel}</span>
                <h3>{name}</h3>
                <p>{text}</p>
                <button
                  aria-pressed={selected === name}
                  onClick={() => {
                    setSelected(name);
                    setChoice("");
                    setConfirmed(false);
                  }}
                >
                  {" "}
                  {selected === name ? "Sélectionné" : "Découvrir"}
                  {selected === name ? (
                    <Check size={16} />
                  ) : (
                    <ArrowUpRight size={16} />
                  )}
                </button>
              </Reveal>
            ))}
          </div>
          {selected && (
            <div
              className="demo-selection"
              ref={selectionRef}
              tabIndex={-1}
              aria-label={"Détails : " + selected}
            >
              <div className="selection-heading">
                <span className="demo-selection-icon">
                  <Icon size={22} />
                </span>
                <div>
                  <span className="tiny-label">VOTRE EXPLORATION</span>
                  <h3>{selected}</h3>
                </div>
                <button
                  className="selection-close"
                  onClick={() => {
                    setSelected("");
                    setChoice("");
                    document
                      .querySelector('.demo-offer button[aria-pressed="true"]')
                      ?.focus();
                  }}
                >
                  Fermer
                </button>
              </div>
              {options.length > 0 && (
                <>
                  <p>
                    {id === "barber"
                      ? "Choisissez un créneau fictif pour essayer le parcours :"
                      : "Explorez une finition pour ce projet fictif :"}
                  </p>
                  <div
                    className="demo-choices"
                    aria-label={
                      id === "barber"
                        ? "Exemples de créneaux"
                        : "Exemples de finitions"
                    }
                  >
                    {options.map((option) => (
                      <button
                        key={option}
                        aria-pressed={choice === option}
                        onClick={() => {
                          setChoice(option);
                          setConfirmed(false);
                        }}
                      >
                        {id === "barber" && <Clock3 size={15} />}
                        {option}
                        {choice === option && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                  <button
                    className="demo-button demo-summary"
                    disabled={!choice}
                    onClick={() => setConfirmed(true)}
                  >
                    Voir le récapitulatif
                    <ArrowRight size={16} />
                  </button>
                </>
              )}
              <p className="demo-feedback" role="status">
                <Check size={17} />
                {confirmed
                  ? selected +
                    " · " +
                    choice +
                    " : exemple de parcours terminé. Aucune demande n’a été envoyée."
                  : "Vous explorez une démonstration de design. Aucune réservation, commande ou demande réelle n’est effectuée."}
              </p>
            </div>
          )}
        </section>
        <div className="demo-next">
          <span className="tiny-label">UN AUTRE UNIVERS À EXPLORER</span>
          <a href={"/projets/" + next.id + "/"}>
            {next.name}
            <ArrowUpRight size={26} />
          </a>
        </div>
        <footer className="demo-footer">
          <span>{p.name} — Concept par Junix.</span>
          <a href="/#projets">
            Retour au portfolio
            <ArrowUpRight size={16} />
          </a>
        </footer>
      </div>
    </main>
  );
}
