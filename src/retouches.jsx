import React, { useEffect, useRef, useState } from "react";
import { DistinctProjectVisual } from "./DesignEffects";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Check,
  Code2,
  LayoutGrid,
  Paintbrush,
  Download,
  Mail,
  Phone,
  X,
  MapPin,
  ShoppingBag,
  ArrowUp,
  BookOpen,
} from "lucide-react";

import { site, services, projects, products } from "./site";
import { profile } from "./profile";
import { contact, media, shop } from "./retouches-config";
import { sendContact } from "./send-contact";

const ease = [0.22, 1, 0.36, 1];

function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function Heading({ eyebrow, children, text }) {
  return (
    <Reveal className="section-title">
      <div className="eyebrow">
        <span className="eyebrow-dash" />
        {eyebrow}
      </div>

      <h2>{children}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  );
}

function Photo({ src, alt, className = "", fallback }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return src && !failed ? (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    fallback
  );
}

/* Outils : déplacement de droite à gauche lié au scroll. */

export function ToolsBar() {
  const section = useRef(null);
  const viewport = useRef(null);
  const track = useRef(null);

  const [distance, setDistance] = useState(0);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -distance]
  );

  useEffect(() => {
    function measure() {
      setDistance(
        Math.max(
          0,
          track.current.scrollWidth - viewport.current.clientWidth
        )
      );
    }

    const observer = new ResizeObserver(measure);

    observer.observe(viewport.current);
    observer.observe(track.current);
    measure();

    return () => observer.disconnect();
  }, []);

  const tools = [
    "React",
    "WordPress",
    "Laravel",
    "JavaScript",
    "Photoshop",
  ];

  return (
    <div className="stackbar tools-bar" ref={section}>
      <div className="shell tools-inner">
        <span className="stackbar-label">MA BOÎTE À OUTILS</span>

        <div
          ref={viewport}
          className={
            "tools-viewport " + (reduced ? "tools-static" : "")
          }
          tabIndex={reduced ? 0 : undefined}
          aria-label="React, WordPress, Laravel, JavaScript et Photoshop"
        >
          <motion.div
            ref={track}
            className="tools-track"
            style={{ x: reduced ? 0 : x }}
          >
            {tools.map((tool, index) => (
              <motion.span
                key={tool}
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                {tool}
                <span className="tool-dot" aria-hidden="true" />
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* Services : grille desktop, carrousel manuel mobile. */

export function ServiceCards() {
  const row = useRef(null);
  const reduced = useReducedMotion();

  const [edges, setEdges] = useState({
    start: true,
    end: false,
  });

  const iconMap = {
    grid: LayoutGrid,
    code: Code2,
    brush: Paintbrush,
  };

  useEffect(() => {
    const element = row.current;

    function update() {
      setEdges({
        start: element.scrollLeft < 2,
        end:
          element.scrollLeft + element.clientWidth >=
          element.scrollWidth - 2,
      });
    }

    const observer = new ResizeObserver(update);

    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      observer.disconnect();
      element.removeEventListener("scroll", update);
    };
  }, []);

  function slide(direction) {
    const element = row.current;

    const cardWidth =
      element.firstElementChild.getBoundingClientRect().width;

    element.scrollBy({
      left: direction * (cardWidth + 18),
      behavior: reduced ? "auto" : "smooth",
    });
  }

  return (
    <section id="services" className="section services-section">
      <div className="shell">
        <Heading
          eyebrow="01 / CE QUE JE PROPOSE"
          text="Du premier site à l’amélioration de l’existant : des prestations simples, utiles et adaptées à vos objectifs."
        >
          Des solutions <em>qui font avancer.</em>
        </Heading>

        <div className="service-controls">
          <span>Faites défiler pour découvrir les services</span>

          <button
            disabled={edges.start}
            onClick={() => slide(-1)}
            aria-label="Service précédent"
          >
            <ArrowLeft size={19} />
          </button>

          <button
            disabled={edges.end}
            onClick={() => slide(1)}
            aria-label="Service suivant"
          >
            <ArrowRight size={19} />
          </button>
        </div>

        <div
          ref={row}
          className="services-grid service-slider"
          tabIndex={0}
          aria-label="Services : défilement horizontal sur mobile"
        >
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Code2;

            return (
              <Reveal
                className="service-card enhanced-service"
                key={service.number}
                delay={index * 0.08}
              >
                <div className="service-card-head">
                  <div className={"service-icon " + service.accent}>
                    <Icon size={26} strokeWidth={1.6} />
                  </div>

                  <span className="service-num">
                    {service.number} / 03
                  </span>
                </div>

                <span className="card-eyebrow">
                  {service.category}
                </span>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <div className="service-features">
                  {service.points.map((point) => (
                    <div key={point}>
                      <Check size={16} />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>

                <div className="service-card-footer">
                  <div>
                    <small>{service.suffix}</small>
                    <strong>{service.price}</strong>
                  </div>

                  <a
                    href="#contact"
                    aria-label={"Demander un devis : " + service.title}
                  >
                    <ArrowUpRight size={22} />
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="services-disclaimer">
          Tarifs de départ, hors domaine, hébergement et
          fonctionnalités spécifiques. Devis selon votre besoin.
        </p>
      </div>
    </section>
  );
}

/* Aperçus des deux concepts. */

function ProjectVisual({ salon }) {
  return <DistinctProjectVisual salon={salon} />;
}

export function ProjectPortfolio({ gotoDemo }) {
  return (
    <section id="projets" className="section portfolio-section">
      <div className="shell">
        <Heading
          eyebrow="02 / PORTFOLIO"
          text="Deux créations conceptuelles pour découvrir mon approche du design et de l’expérience web."
        >
          Quelques idées, <em>en images.</em>
        </Heading>

        <div className="project-grid refined-projects">
          {projects.map((project, index) => (
            <Reveal
              className="project-card"
              key={project.id}
              delay={index * 0.1}
            >
              <button
                className="refined-preview"
                onClick={() => gotoDemo(project.id)}
                aria-label={
                  "Explorer la démonstration " + project.name
                }
              >
                <div className="concept-browser">
                  <span />
                  <span />
                  <span />
                  <small>{project.name} / aperçu</small>
                </div>

                <ProjectVisual salon={project.id === "salon"} />

                <span className="concept-open">
                  <ArrowUpRight size={21} />
                </span>
              </button>

              <div className="project-desc">
                <div>
                  <span className="card-eyebrow">
                    {project.category}
                  </span>

                  <h3>{project.name}</h3>
                  <p>{project.description}</p>

                  <div className="tech-tags">
                    {project.tech.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>

                <button
                  className="project-go"
                  onClick={() => gotoDemo(project.id)}
                  aria-label={"Voir " + project.name}
                >
                  <ArrowUpRight size={21} />
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="project-transparency">
          <Check size={16} />
          Concepts de démonstration : aucune mission client
          ni réservation réelle.
        </p>
      </div>
    </section>
  );
}

/* Rendus interactifs des concepts. */

export function ProjectDemo({ id, onExit }) {
  const salon = id === "salon";
  const [tab, setTab] = useState(0);
  const [notice, setNotice] = useState(false);

  const categories = salon
    ? ["Visage", "Corps", "Rituels"]
    : ["Entrées", "Plats", "Desserts"];

  const offers = salon
    ? [
        [
          ["Soin éclat", "Un rituel doux pour retrouver confort et luminosité."],
          ["Soin essentiel", "Une pause personnalisée et un nettoyage délicat."],
        ],
        [
          ["Massage détente", "Une parenthèse pour relâcher les tensions."],
          ["Rituel corps", "Un soin enveloppant, pensé pour ralentir."],
        ],
        [
          ["Rituel signature", "Un moment complet consacré au bien-être."],
          ["Rituel découverte", "Une première rencontre avec l’univers Alba."],
        ],
      ]
    : [
        [
          ["Légumes de saison", "Herbes fraîches, textures croquantes et vinaigrette légère."],
          ["Velouté du marché", "Une composition qui suit les produits du moment."],
        ],
        [
          ["Assiette du jardin", "Légumes rôtis et céréales, sauce maison."],
          ["Suggestion du chef", "Une recette imaginée autour de la sélection du jour."],
        ],
        [
          ["Fruit & crème", "Une fin de repas fraîche et légère."],
          ["Chocolat de la maison", "Une création douce et généreuse."],
        ],
      ];

  useEffect(() => {
    document.title =
      (salon ? "Maison Alba" : "Sola Restaurant") +
      " — Démonstration Junix";

    return () => {
      document.title = "Junix — Sites web & design";
    };
  }, [salon]);

  return (
    <main
      className={
        "interactive-demo " + (salon ? "alba-demo" : "sola-demo")
      }
    >
      <div className="concept-warning">
        <span>CONCEPT FICTIF · AUCUNE RÉSERVATION RÉELLE</span>

        <button onClick={onExit}>
          <ArrowLeft size={16} />
          Retour au portfolio
        </button>
      </div>

      <div className="shell">
        <header className="concept-demo-nav">
          <strong>{salon ? "MAISON ALBA" : "sola."}</strong>

          <a href="#concept-offers">
            {salon ? "Découvrir les soins" : "Découvrir la carte"}
            <ArrowUpRight size={16} />
          </a>
        </header>

        <Reveal className="concept-demo-hero">
          <div>
            <span className="eyebrow">
              {salon
                ? "LE BIEN-ÊTRE, EN TOUTE SIMPLICITÉ"
                : "UNE TABLE AU RYTHME DES SAISONS"}
            </span>

            <h1>
              {salon ? (
                <>
                  Le temps
                  <br />
                  <em>pour soi.</em>
                </>
              ) : (
                <>
                  Le goût
                  <br />
                  <em>du moment.</em>
                </>
              )}
            </h1>

            <p>
              {salon
                ? "Un studio imaginé comme une parenthèse. Des soins attentifs, une atmosphère apaisante et le plaisir de prendre du temps pour soi."
                : "Une cuisine imaginée autour des produits de saison. Le goût des choses simples et le plaisir de partager une belle table."}
            </p>

            <a className="concept-action" href="#concept-offers">
              {salon ? "Explorer les rituels" : "Explorer notre cuisine"}
              <ArrowRight size={18} />
            </a>
          </div>

          <ProjectVisual salon={salon} />
        </Reveal>

        <section id="concept-offers" className="concept-offers">
          <Heading eyebrow={salon ? "LES SOINS" : "LA CARTE"}>
            {salon ? (
              <>
                Votre pause, <em>à votre rythme.</em>
              </>
            ) : (
              <>
                Une cuisine, <em>trois envies.</em>
              </>
            )}
          </Heading>

          <div
            className="concept-tabs"
            aria-label={
              salon ? "Catégories de soins" : "Catégories de la carte"
            }
          >
            {categories.map((label, index) => (
              <button
                key={label}
                aria-pressed={tab === index}
                onClick={() => {
                  setTab(index);
                  setNotice(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="concept-offer-grid" key={tab}>
            {offers[tab].map(([name, text]) => (
              <Reveal className="concept-offer" key={name}>
                <span>
                  {salon
                    ? "MAISON ALBA / RITUEL"
                    : "SOLA / CUISINE DE SAISON"}
                </span>

                <h3>{name}</h3>
                <p>{text}</p>

                <button onClick={() => setNotice(true)}>
                  Découvrir
                  <ArrowUpRight size={17} />
                </button>
              </Reveal>
            ))}
          </div>

          {notice && (
            <p className="concept-notice" role="status">
              Vous explorez une démonstration interactive.
              Ces prestations ne sont pas proposées à la réservation.
            </p>
          )}
        </section>

        <footer className="concept-demo-footer">
          <span>
            {salon ? "Maison Alba" : "Sola Restaurant"} —
            Design conceptuel par Junix.
          </span>

          <button onClick={onExit}>
            Retour au portfolio
            <ArrowUpRight size={17} />
          </button>
        </footer>
      </div>
    </main>
  );
}

/* Ressources : couvertures et liens de boutique configurables. */

export function ResourceProducts() {
  const [notice, setNotice] = useState("");

  return (
    <section id="produits" className="section products-section">
      <div className="shell">
        <Heading
          eyebrow="03 / RESSOURCES NUMÉRIQUES"
          text="Des guides et outils pour créer, apprendre et avancer à son rythme."
        >
          Des ressources pour <em>aller plus loin.</em>
        </Heading>

        <div className="product-grid resource-grid">
          {products.map((product, index) => {
            const config = shop.items[index] || {};
            // N'accepte que des liens HTTPS (évite javascript: ou http: par erreur).
            const raw = config.url || shop.url;
            const url = /^https:\/\//i.test(raw || "") ? raw : "";

            return (
              <Reveal
                className={
                  "product-card resource-card " +
                  (config.featured ? "resource-featured" : "")
                }
                key={product.title}
                delay={index * 0.08}
              >
                {config.featured && (
                  <span className="resource-badge">
                    {config.label}
                  </span>
                )}

                <div className={"resource-art " + product.style}>
                  <Photo
                    src={config.cover}
                    alt={"Couverture — " + product.title}
                    className="resource-cover"
                    fallback={
                      <div className="book-placeholder">
                        <BookOpen size={25} />
                        <span>JUNIX / RESSOURCES</span>
                        <strong>{product.title}</strong>
                        <small>{product.type}</small>
                      </div>
                    }
                  />
                </div>

                <div className="product-content">
                  <div className="product-type">
                    <span>{product.type}</span>
                    <span className="soon">EN PRÉPARATION</span>
                  </div>

                  <h3>{product.title}</h3>
                  <p>{product.description}</p>

                  <div className="product-bottom">
                    <strong>{product.price}</strong>

                    {url ? (
                      <a className="resource-link" href={url}>
                        Voir en boutique
                        <ArrowUpRight size={18} />
                      </a>
                    ) : (
                      <button
                        className="resource-link"
                        onClick={() =>
                          setNotice(
                            "La boutique est en préparation. Le lien sera activé à son ouverture."
                          )
                        }
                      >
                        Bientôt en boutique
                        <ShoppingBag size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="product-note" role="status">
          {notice ||
            "Ressources en préparation. Aucun paiement n’est actuellement proposé sur ce site."}
        </p>
      </div>
    </section>
  );
}

/* Biographie, photo de profil et CV. */

function BiographyDialog({ onClose }) {
  const dialog = useRef(null);

  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;

    element.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      element.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className="profile-dialog"
      aria-labelledby="biography-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      <div className="profile-content">
        <button
          autoFocus
          className="dialog-close"
          onClick={onClose}
          aria-label="Fermer la présentation"
        >
          <X />
        </button>

        <div className="bio-heading">
          <Photo
            src={media.portrait}
            alt={profile.name}
            className="bio-avatar"
            fallback={
              <span className="bio-avatar avatar-fallback">R</span>
            }
          />

          <div>
            <span className="eyebrow">DERRIÈRE JUNIX</span>

            <h2 id="biography-title">
              {profile.name}<span>.</span>
            </h2>
          </div>
        </div>

        <p className="profile-role">{profile.role}</p>
        <p>{profile.bio}</p>

        <div className="profile-timeline">
          <h3>Mon parcours</h3>

          {profile.journey.map((item) => (
            <div key={item.title}>
              <span>{item.label}</span>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        <h3>Mes domaines</h3>

        <div className="tech-tags">
          {profile.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>

        {media.cv ? (
          <a
            className="btn btn-dark bio-download"
            href={media.cv}
            download
          >
            <Download size={18} />
            Télécharger mon CV
          </a>
        ) : (
          <button className="btn bio-download" disabled>
            <Download size={18} />
            CV bientôt disponible
          </button>
        )}
      </div>
    </dialog>
  );
}

export function Biography() {
  const [open, setOpen] = useState(false);

  const steps = [
    [
      "Comprendre avant de créer",
      "Définir votre besoin, votre public et les fonctionnalités utiles.",
    ],
    [
      "Créer avec soin",
      "Un design qui vous ressemble, pensé pour tous les écrans.",
    ],
    [
      "Évoluer sereinement",
      "Des solutions faciles à faire évoluer, sans complexité superflue.",
    ],
  ];

  return (
    <section id="apropos" className="section about-section">
      <div className="shell about-grid">
        <Reveal className="profile-card revised-biography">
          <div className="profile-card-top">
            <span>LE CRÉATEUR DE JUNIX</span>
            <Code2 size={25} />
          </div>

          <div className="bio-heading">
            <Photo
              src={media.portrait}
              alt={profile.name}
              className="bio-avatar"
              fallback={
                <span className="bio-avatar avatar-fallback">R</span>
              }
            />

            <div className="profile-monogram">
              {profile.name}<span>.</span>
            </div>
          </div>

          <p>{profile.role}</p>

          <div className="profile-detail">
            <MapPin size={19} />

            <span>
              Algérie · France
              <br />
              Développement web & mobile
            </span>
          </div>

          <div className="bio-actions">
            <button
              className="btn profile-button"
              onClick={() => setOpen(true)}
            >
              Mon parcours
              <ArrowUpRight size={18} />
            </button>

            {media.cv ? (
              <a
                className="bio-cv-icon"
                href={media.cv}
                download
                aria-label="Télécharger mon CV au format PDF"
              >
                <Download size={20} />
              </a>
            ) : (
              <button
                className="bio-cv-icon"
                disabled
                aria-label="CV bientôt disponible"
                title="Ajoutez votre PDF pour activer le téléchargement"
              >
                <Download size={20} />
              </button>
            )}
          </div>
        </Reveal>

        <Reveal className="about-copy">
          <Heading
            eyebrow="04 / À PROPOS"
            text="J’associe le développement web et le design pour construire des expériences numériques cohérentes, lisibles et performantes."
          >
            Une approche
            <br />
            <em>créative et technique.</em>
          </Heading>

          {steps.map(([title, text], index) => (
            <div className="about-feature" key={title}>
              <span>0{index + 1}</span>

              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      {open && (
        <BiographyDialog onClose={() => setOpen(false)} />
      )}
    </section>
  );
}

/* Contact par mail, téléphone ou SMS. */

export function ClientContact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    _gotcha: "",
  });

  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendingRef = useRef(false);

  function change(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFeedback("");
  }

  async function submit(event) {
    event.preventDefault();

    if (sendingRef.current) return;

    sendingRef.current = true;
    setSending(true);
    setSuccess(false);
    setFeedback("Envoi en cours…");

    try {
      await sendContact(contact.formEndpoint, {
        name: form.name,
        email: form.email,
        message: form.message,
        _gotcha: form._gotcha,
      });

      setSuccess(true);
      setFeedback(
        "Votre demande a été transmise. Merci ! Je reviendrai vers vous par e-mail."
      );

      setForm({
        name: "",
        email: "",
        message: "",
        _gotcha: "",
      });
    } catch (error) {
      setSuccess(false);
      setFeedback(
        error.message ||
        "L’envoi n’a pas pu être confirmé. Contactez-moi directement."
      );
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(
        `À : ${contact.email}\n` +
        `Nom : ${form.name}\n` +
        `E-mail : ${form.email}\n\n` +
        form.message
      );

      setSuccess(true);
      setFeedback(
        "Demande copiée. Vous pouvez la coller dans un e-mail à " +
        contact.email + "."
      );
    } catch {
      setSuccess(false);
      setFeedback(
        "La copie automatique n’est pas disponible. Écrivez directement à " +
        contact.email + "."
      );
    }
  }

  return (
    <section id="contact" className="contact-section">
      <div className="shell contact-grid">
        <Reveal className="contact-copy">
          <div className="eyebrow">
            <span className="eyebrow-dash" />
            06 / ON ÉCHANGE ?
          </div>

          <h2>
            Un projet
            <br />
            en tête <span>?</span>
          </h2>

          <p>
            Parlez-moi de votre idée. Je vous aiderai à identifier
            la solution la plus adaptée.
          </p>

          <a
            className="contact-side contact-direct"
            href={"mailto:" + contact.email}
          >
            <span className="contact-side-icon">
              <Mail size={23} />
            </span>

            <div>
              <small>E-MAIL</small>
              <strong>{contact.email}</strong>
            </div>
          </a>

          <a
            className="contact-side contact-direct"
            href={"tel:" + contact.phone}
          >
            <span className="contact-side-icon">
              <Phone size={23} />
            </span>

            <div>
              <small>CONSULTATION OU PRÉCISION</small>
              <strong>{contact.phoneLabel}</strong>
            </div>
          </a>

          <a
            className="contact-sms"
            href={"sms:" + contact.phone}
          >
            Envoyer un SMS
            <ArrowUpRight size={16} />
          </a>

          <p className="contact-availability">
            Pour une demande urgente, précisez votre délai
            dans votre message.
          </p>
        </Reveal>

        <Reveal>
          <form
            className="contact-form"
            onSubmit={submit}
            aria-busy={sending}
          >
            <div className="contact-trap" aria-hidden="true">
              <label>
                Ne pas remplir
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form._gotcha}
                  onChange={change}
                  disabled={sending}
                />
              </label>
            </div>

            <h3>
              Décrivez votre projet
              <ArrowUpRight size={19} />
            </h3>

            <div className="form-row">
              <label>
                Votre nom
                <input
                  required
                  name="name"
                  autoComplete="name"
                  maxLength={80}
                  value={form.name}
                  onChange={change}
                  disabled={sending}
                  placeholder="Votre prénom et nom"
                />
              </label>

              <label>
                Votre e-mail
                <input
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={140}
                  value={form.email}
                  onChange={change}
                  disabled={sending}
                  placeholder="vous@exemple.fr"
                />
              </label>
            </div>

            <label>
              Votre besoin
              <textarea
                required
                name="message"
                minLength={10}
                maxLength={2500}
                rows={5}
                value={form.message}
                onChange={change}
                disabled={sending}
                placeholder="Votre projet, vos objectifs et votre délai…"
              />
            </label>

            <button
              className="btn btn-dark btn-lg"
              type="submit"
              disabled={sending}
            >
              {sending ? "Envoi en cours…" : "Envoyer ma demande"}
              <ArrowUpRight size={18} />
            </button>

            <p className="form-hint">
              Votre nom, votre e-mail et votre message sont
              transmis via Formspree pour traiter votre demande.
              {" "}
              <a href="#confidentialite">
                Données personnelles
              </a>.
            </p>

            <button
              className="copy-request"
              type="button"
              onClick={copy}
              disabled={sending}
            >
              Copier ma demande pour l’envoyer autrement
            </button>

            {feedback && (
              <p
                className={
                  "form-feedback " +
                  (success ? "feedback-success" : "feedback-error")
                }
                role="status"
                aria-live="polite"
              >
                {feedback}
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell">
        <Reveal className="footer-lead">
          <span className="eyebrow">UNE IDÉE À CONCRÉTISER ?</span>

          <a href="#contact" className="footer-big-link">
            Faisons quelque chose
            <br />
            <em>qui vous ressemble.</em>
            <ArrowUpRight />
          </a>
        </Reveal>

        <div className="footer-columns">
          <div>
            <a href="#accueil" className="brand">
              <img
                src={site.logo}
                alt="Logo Junix"
                width={44}
                height={44}
              />

              <span>
                Junix<span className="brand-dot">.</span>
              </span>
            </a>

            <p>
              Développement web & design.
              <br />
              Des expériences pensées avec soin.
            </p>
          </div>

          <nav aria-label="Navigation du pied de page">
            <span>EXPLORER</span>
            <a href="#services">Services</a>
            <a href="#projets">Projets</a>
            <a href="#produits">Ressources</a>
            <a href="#apropos">Mon parcours</a>
          </nav>

          <div>
            <span>CONTACT</span>

            <a
              className="footer-email"
              href={"mailto:" + contact.email}
            >
              {contact.email}
              <ArrowUpRight size={17} />
            </a>

            <a
              className="footer-phone"
              href={"tel:" + contact.phone}
            >
              <Phone size={15} />
              {contact.phoneLabel}
            </a>

            <p>{site.location}</p>

            <a className="back-top" href="#accueil">
              Retour en haut
              <ArrowUp size={16} />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Junix. Tous droits réservés.
          </span>

          <span>Conception & développement par Junix.</span>
        </div>
      </div>
    </footer>
  );
}