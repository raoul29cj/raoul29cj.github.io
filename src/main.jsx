import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  Check,
  Code2,
  PanelsTopLeft,
  Paintbrush,
  Menu,
  X,
  Download,
  MapPin,
  Layers,
  ScanLine,
  BookOpen,
  Plus,
  Mail,
  Phone,
  Globe,
  Atom,
  Database,
  Image as ImageIcon,
} from "lucide-react";
import { config, services, products, journey, faq } from "./config";
import { projects } from "./projects";
import {
  Reveal,
  Tilt,
  Asset,
  ProjectArt,
  InteractiveTitle,
} from "./Effects";
import { LegalPage, ProjectPage, NotFound, ErrorBoundary } from "./Pages";
import Contact from "./Contact";
import Background3D from "./Background3D";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/space-grotesk/latin-700.css";
import "./styles.css";

const pad = (n) => String(n).padStart(2, "0");
function Brand() {
  return (
    <a className="brand" href="/#accueil" aria-label="Raoul.CJ, accueil">
      <Asset
        src={config.portrait}
        alt=""
        eager
        size={36}
        fallback={<span className="brand-fallback">R</span>}
      />
      <span>
        Raoul<span>.</span>CJ
      </span>
    </a>
  );
}
function Header() {
  const [open, setOpen] = useState(false),
    [compact, setCompact] = useState(
      typeof window !== "undefined" && window.scrollY > 100,
    );
  const [active, setActive] = useState("");
  const ref = useRef(null),
    button = useRef(null);
  const { scrollY, scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 100));
  // Menu actif : la section qui traverse le milieu de l'écran est mise en avant.
  useEffect(() => {
    const sections = document.querySelectorAll("main#content > section[id]");
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    function key(e) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        button.current?.focus();
      }
    }
    function outside(e) {
      if (open && !ref.current?.contains(e.target)) setOpen(false);
    }
    function hash() {
      setOpen(false);
    }
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    window.addEventListener("hashchange", hash);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("hashchange", hash);
    };
  }, [open]);
  return (
    <>
    {!reduced && (
      <motion.span
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
    )}
    <header
      ref={ref}
      className={
        "navigation " + (compact ? "compact " : "") + (open ? "open" : "")
      }
    >
      <div className="nav-inner">
        <Brand />
        <nav id="main-menu" aria-label="Navigation principale">
          {[
            ["Projets", "projets"],
            ["Services", "services"],
            ["À propos", "apropos"],
            ["Ressources", "ressources"],
          ].map(([label, id]) => (
            <a
              href={"/#" + id}
              key={id}
              className={active === id ? "active" : undefined}
              aria-current={active === id ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <a className="mobile-cta" href="/#contact">
            Parlons de votre projet
            <ArrowUpRight size={16} />
          </a>
        </nav>
        <a className="button primary nav-cta" href="/#contact">
          Parlons de votre projet
          <ArrowUpRight size={16} />
        </a>
        <button
          ref={button}
          className="burger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          aria-controls="main-menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
    </>
  );
}
function SectionTitle({ number, label, children, text }) {
  return (
    <Reveal className="section-heading">
      <span className="eyebrow">
        {number} / {label}
      </span>
      <h2>{children}</h2>
      {text && <p className="lead">{text}</p>}
    </Reveal>
  );
}
// Les 4 étapes de la méthode : partagées par le visuel interactif et les cartes.
const steps = [
  [
    "Votre idée",
    "Objectifs, public, contenu.",
    "Nous échangeons sur vos objectifs, votre public et vos priorités. Je vous envoie ensuite un devis clair.",
  ],
  [
    "Le design",
    "Une direction qui vous ressemble.",
    "Je crée une direction visuelle fidèle à votre identité, que vous validez avant toute ligne de code.",
  ],
  [
    "Le développement",
    "Une expérience fluide sur tous les écrans.",
    "Je développe un site rapide et soigné, pensé pour le mobile comme pour l’ordinateur.",
  ],
  [
    "La mise en ligne",
    "Vérifications et accompagnement.",
    "Je vérifie chaque détail, je publie le site et je vous montre comment le faire vivre.",
  ],
];
function FlowPreview() {
  const [step, setStep] = useState(0);
  return (
    <Tilt className="flow-preview panel" strength={15}>
      <div className="window-bar">
        <div className="dots">
          <i />
          <i />
          <i />
        </div>
        <span>RAOUL.CJ / VOTRE PROJET EN MOUVEMENT</span>
        <ScanLine size={15} />
      </div>
      <div className="flow-top">
        <span className="tiny-label">DE L’IDÉE À LA MISE EN LIGNE</span>
        <span className="flow-version">CONCEPTION WEB</span>
      </div>
      <div className="flow-map" aria-label="Étapes interactives du projet">
        {steps.map(([name], i) => (
          <React.Fragment key={name}>
            <button
              className={
                "flow-node node-" + i + (step === i ? " selected" : "")
              }
              onClick={() => setStep(i)}
              aria-pressed={step === i}
            >
              <span>0{i + 1}</span>
              {name}
              {i === step && <Check size={13} />}
            </button>
            {i < steps.length - 1 && (
              <span className={"flow-wire wire-" + i} aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flow-description" aria-live="polite">
        <span className="flow-icon">
          <Layers size={18} />
        </span>
        <div>
          <strong>{steps[step][0]}</strong>
          <p>{steps[step][1]}</p>
        </div>
        <span className="flow-counter">
          {pad(step + 1)}/{pad(steps.length)}
        </span>
      </div>
      <div className="flow-footer">
        <span>
          <i />
          Un interlocuteur, du début à la fin.
        </span>
        <ArrowUpRight size={16} />
      </div>
    </Tilt>
  );
}
// Vitrine de l'accueil : les projets défilent seuls, pause au survol ou au clavier.
function HeroShowcase() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0),
    [paused, setPaused] = useState(false);
  const go = (n) => setIndex((n + projects.length) % projects.length);
  const p = projects[index];
  return (
    <Tilt className="flow-preview panel hero-showcase" strength={10}>
      <div
        aria-roledescription="carrousel"
        aria-label="Projets à la une"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="window-bar">
          <div className="dots">
            <i />
            <i />
            <i />
          </div>
          <span>RAOUL.CJ / PROJETS À LA UNE</span>
          <ScanLine size={15} />
        </div>
        <a
          className="showcase-stage"
          href={"/projets/" + p.id + "/"}
          aria-label={"Explorer " + p.name}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={p.id}
              initial={reduced ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectArt id={p.id} />
            </motion.div>
          </AnimatePresence>
        </a>
        <div className="showcase-footer">
          <div className="showcase-caption" aria-live={paused ? "polite" : "off"}>
            <span className="tiny-label">{p.type}</span>
            <strong>{p.name}</strong>
          </div>
          <div className="showcase-controls">
            <button onClick={() => go(index - 1)} aria-label="Projet précédent">
              <ArrowLeft size={15} />
            </button>
            <span>
              {pad(index + 1)}/{pad(projects.length)}
            </span>
            <button onClick={() => go(index + 1)} aria-label="Projet suivant">
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
        {/* La fin de la barre de progression déclenche le projet suivant. */}
        {!reduced && (
          <span
            key={index}
            className={"showcase-progress" + (paused ? " paused" : "")}
            onAnimationEnd={() => go(index + 1)}
            aria-hidden="true"
          />
        )}
      </div>
    </Tilt>
  );
}
function Hero() {
  return (
    <section className="hero container" id="accueil">
      <div className="hero-copy">
        <Reveal>
          <div className="availability">
            <span />
            Ouvert aux nouveaux projets
          </div>
        </Reveal>
        <InteractiveTitle />
        <Reveal delay={0.25}>
          <p className="hero-description">
            Du design au développement, je transforme vos idées en expériences
            web claires, soignées et singulières.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="/#contact">
              Parlons de votre projet
              <ArrowUpRight size={18} />
            </a>
            <a className="button ghost" href="/#projets">
              Voir mes projets
              <ArrowRight size={17} />
            </a>
          </div>
          <div className="hero-signature">
            <span />
            DÉVELOPPEMENT WEB & DESIGN GRAPHIQUE
          </div>
        </Reveal>
      </div>
      <Reveal className="hero-preview" delay={0.2}>
        <HeroShowcase />
      </Reveal>
      <a className="scroll-indicator" href="/#projets">
        <span>DÉCOUVRIR MES PROJETS</span>
        <ArrowDown size={15} />
      </a>
    </section>
  );
}
function Tools() {
  const ref = useRef(null),
    viewport = useRef(null),
    group = useRef(null);
  const reduced = useReducedMotion();
  const [distance, setDistance] = useState(800);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 0.2, 1], [0, 0, -distance]);
  const x = useSpring(raw, { stiffness: 75, damping: 26, restDelta: 0.1 });
  useEffect(() => {
    const measure = () =>
      setDistance(group.current?.getBoundingClientRect().width || 800);
    const observer = new ResizeObserver(measure);
    if (group.current) observer.observe(group.current);
    if (viewport.current) observer.observe(viewport.current);
    measure();
    return () => observer.disconnect();
  }, []);
  const tools = [
    ["React", Atom],
    ["JavaScript", Code2],
    ["WordPress", Globe],
    ["Laravel", Database],
    ["Photoshop", ImageIcon],
  ];
  return (
    <section
      className="tools"
      ref={ref}
      aria-label="Mes outils de création et de développement"
    >
      <div className="container">
        <span className="tiny-label">
          UNE BOÎTE À OUTILS,
          <br />
          DES POSSIBILITÉS
        </span>
        <div
          className="tools-viewport"
          ref={viewport}
          tabIndex={reduced ? 0 : undefined}
        >
          <motion.div className="tools-track" style={{ x: reduced ? 0 : x }}>
            {[0, 1, 2].map((copy) => (
              <ul
                className={"tools-group" + (copy ? " tools-copy" : "")}
                ref={copy === 0 ? group : undefined}
                key={copy}
                aria-hidden={copy ? true : undefined}
              >
                {tools.map(([name, Icon], i) => (
                  <li key={name} className={"tool-item tool-" + i}>
                    <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
                    <span>{name}</span>
                    <i aria-hidden="true" />
                  </li>
                ))}
              </ul>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
function Services() {
  const icons = { web: PanelsTopLeft, code: Code2, design: Paintbrush };
  const row = useRef(null),
    reduced = useReducedMotion();
  function slide(n) {
    row.current.scrollBy({
      left:
        n * (row.current.firstElementChild.getBoundingClientRect().width + 18),
      behavior: reduced ? "auto" : "smooth",
    });
  }
  return (
    <section className="section" id="services">
      <div className="container">
        <SectionTitle
          number="02"
          label="CE QUE JE PROPOSE"
          text="Créer, corriger, donner une direction. Des prestations utiles, avec un périmètre clair."
        >
          Le fond compte.
          <br />
          <em>La forme aussi.</em>
        </SectionTitle>
        <div className="carousel-controls">
          <span>Découvrez les services</span>
          <button onClick={() => slide(-1)} aria-label="Services précédents">
            <ArrowLeft size={17} />
          </button>
          <button onClick={() => slide(1)} aria-label="Services suivants">
            <ArrowRight size={17} />
          </button>
        </div>
        <div
          className="services-grid"
          ref={row}
          tabIndex={0}
          aria-label="Services, défilement horizontal sur mobile"
        >
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Reveal className="service-wrap" key={s.title} delay={i * 0.06}>
                <Tilt className="panel service-card">
                  <div className="card-top">
                    <span className={"icon-box tone-" + i}>
                      <Icon size={23} />
                    </span>
                    <span className="index">0{i + 1}/03</span>
                  </div>
                  <span className="tiny-label">{s.category}</span>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <ul>
                    {s.points.map((point) => (
                      <li key={point}>
                        <Check size={14} />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="service-price">
                    <span>
                      <small>À PARTIR DE</small>
                      <strong>{s.price}</strong>
                    </span>
                    <a
                      href="/#contact"
                      className="round-link"
                      aria-label={"Demander un devis : " + s.title}
                    >
                      <ArrowUpRight size={20} />
                    </a>
                  </div>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
        <p className="fine-print">
          Prix de départ indicatifs. Domaine, hébergement et fonctionnalités
          spécifiques à préciser au devis.
        </p>
      </div>
    </section>
  );
}
function Work() {
  function card(p, i) {
    return (
      <Reveal key={p.id} delay={(i % 2) * 0.08}>
        <Tilt className="project-card">
          <a
            className="project-preview"
            href={"/projets/" + p.id + "/"}
            aria-label={"Explorer " + p.name}
          >
            <div className="preview-bar">
              <span>CONCEPT {pad(i + 1)}</span>
              <ArrowUpRight size={17} />
            </div>
            <ProjectArt id={p.id} />
          </a>
          <div className="project-meta">
            <span className="tiny-label">{p.type}</span>
            <a href={"/projets/" + p.id + "/"}>
              <h3>{p.name}</h3>
              <ArrowUpRight size={23} />
            </a>
            <p>{p.text}</p>
            <div className="tags">
              {p.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </Tilt>
      </Reveal>
    );
  }
  return (
    <section className="section work" id="projets">
      <div className="container">
        <SectionTitle
          number="01"
          label="PROJETS CONCEPTUELS"
          text={`${projects.length} concepts que j’ai imaginés et développés, chacun avec son univers. Explorez les démonstrations interactives.`}
        >
          Des idées.
          <br />
          <em>Des identités.</em>
        </SectionTitle>
        <div className="work-grid">{projects.map(card)}</div>
        <div className="work-footer">
          <span>{pad(projects.length)} CONCEPTS À EXPLORER</span>
          <a className="button ghost" href="/#contact">
            Un projet dans cet esprit ?
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
function Method() {
  return (
    <section className="section method">
      <div className="container">
        <div className="method-intro">
          <SectionTitle
            number="03"
            label="UNE MÉTHODE CLAIRE"
            text="De l’idée à la mise en ligne, chaque étape est partagée. Cliquez sur les étapes pour les découvrir."
          >
            Moins de flou.
            <br />
            <em>Plus de sens.</em>
          </SectionTitle>
          <Reveal className="method-preview">
            <FlowPreview />
          </Reveal>
        </div>
        <div className="method-grid">
          {steps.map(([title, , text], i) => (
            <Reveal className="method-card" key={title} delay={i * 0.07}>
              <span>{pad(i + 1)}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
        <div className="facts">
          {[
            ["03", "domaines de service"],
            [pad(projects.length), "concepts à explorer"],
            ["01", "interlocuteur"],
          ].map(([n, label]) => (
            <Reveal key={label}>
              <strong>
                {n}
                <span>.</span>
              </strong>
              <p>{label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
function Resources() {
  const [notice, setNotice] = useState("");
  return (
    <section className="section" id="ressources">
      <div className="container">
        <SectionTitle
          number="05"
          label="RESSOURCES NUMÉRIQUES"
          text="Des supports pour avancer par vous-même. La boutique est en préparation."
        >
          Un peu d’élan.
          <br />
          <em>À portée de main.</em>
        </SectionTitle>
        <div className="resource-grid">
          {products.map((p, i) => {
            // N'accepte que des liens HTTPS (évite javascript: ou http: par erreur).
            const raw = p.url || config.shopUrl;
            const url = /^https:\/\//i.test(raw || "") ? raw : "";
            return (
              <Reveal key={p.title} delay={i * 0.06}>
                <div
                  className={
                    "panel resource-card " + (p.featured ? "featured" : "")
                  }
                >
                  {p.featured && (
                    <span className="featured-badge">À LA UNE</span>
                  )}
                  <div className={"cover-stage stage-" + i}>
                    <Asset
                      src={p.image}
                      alt={"Couverture — " + p.title}
                      className="product-cover"
                      fallback={
                        <div className="book-cover">
                          <BookOpen size={23} />
                          <span>RAOUL.CJ / RESSOURCES</span>
                          <strong>{p.title}</strong>
                          <small>{p.type}</small>
                        </div>
                      }
                    />
                  </div>
                  <div className="resource-content">
                    <span className="tiny-label">{p.type}</span>
                    <h3>{p.title}</h3>
                    <p>{p.description}</p>
                    <div className="resource-bottom">
                      <strong>{p.price}</strong>
                      {url ? (
                        <a href={url}>
                          Voir en boutique
                          <ArrowUpRight size={16} />
                        </a>
                      ) : (
                        <button
                          onClick={() =>
                            setNotice(
                              "La boutique est en préparation. Aucun achat n’est encore proposé.",
                            )
                          }
                        >
                          Bientôt disponible
                          <ArrowUpRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="fine-print" role="status">
          {notice}
        </p>
      </div>
    </section>
  );
}
function About() {
  const [cvReady, setCvReady] = useState(false);
  useEffect(() => {
    if (!config.cv) return;
    const controller = new AbortController();
    fetch(config.cv, { method: "HEAD", signal: controller.signal })
      .then((r) =>
        setCvReady(
          r.ok && (r.headers.get("content-type") || "").includes("pdf"),
        ),
      )
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <section id="apropos" className="section">
      <div className="container about-grid">
        <Reveal>
          <div className="panel identity-card">
            <div className="identity-top">
              <span className="tiny-label">QUI SUIS-JE ?</span>
              <Code2 size={22} />
            </div>
            <div className="identity-person">
              <Asset
                src={config.portrait}
                alt={config.author}
                className="avatar"
                size={58}
                fallback={<span className="avatar initials">R</span>}
              />
              <h3>
                {config.author}
                <span>.</span>
              </h3>
            </div>
            <p>Développeur web & designer graphique freelance.</p>
            <div className="identity-location">
              <MapPin size={16} />
              Algérie · France / Travail à distance
            </div>
            <p className="identity-bio">
              J’associe la technique et le design pour créer des expériences
              numériques cohérentes, avec une attention particulière portée aux
              détails.
            </p>
            {cvReady ? (
              <a className="button ghost" href={config.cv} download>
                <Download size={17} />
                Télécharger mon CV
              </a>
            ) : (
              <span className="cv-pending">
                <Download size={16} />
                CV à ajouter
              </span>
            )}
          </div>
        </Reveal>
        <div>
          <SectionTitle number="04" label="À PROPOS">
            Créatif dans l’approche.
            <br />
            <em>Précis dans le détail.</em>
          </SectionTitle>
          <div className="timeline">
            {journey.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <span className="tiny-label">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
function FAQ() {
  return (
    <section className="section faq">
      <div className="container faq-grid">
        <SectionTitle number="06" label="QUESTIONS FRÉQUENTES">
          Quelques réponses,
          <br />
          <em>avant de se lancer.</em>
        </SectionTitle>
        <div>
          {faq.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <Plus size={18} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-call">
          <div className="footer-status">
            <span className="status-light" /> Disponible pour échanger{" "}
            <span>FRANCE · À DISTANCE</span>
          </div>
          <span className="eyebrow">UNE IDÉE À CONCRÉTISER ?</span>
          <a href="/#contact">
            Faisons quelque chose
            <br />
            <em>qui vous ressemble.</em>
            <ArrowUpRight />
          </a>
        </div>
        <div className="footer-grid">
          <div>
            <Brand />
            <p>
              Développement web & design.
              <br />
              De l’intention dans chaque détail.
            </p>
          </div>
          <nav aria-label="Navigation de pied de page">
            <span className="tiny-label">EXPLORER</span>
            <a href="/#projets">
              Projets <ArrowUpRight size={14} />
            </a>
            <a href="/#services">
              Services <ArrowUpRight size={14} />
            </a>
            <a href="/#apropos">À propos</a>
            <a href="/#ressources">Ressources</a>
          </nav>
          <div>
            <span className="tiny-label">CONTACT</span>
            <a href={"mailto:" + config.email}>
              <Mail size={16} />
              {config.email}
              <ArrowUpRight size={15} />
            </a>
            <a href={"tel:" + config.phone}>
              <Phone size={16} />
              {config.phoneLabel}
            </a>
            <a href="/#accueil" className="back-top">
              Retour en haut
              <ArrowUp size={15} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Raoul.CJ.{" "}
            <span className="footer-crafted">
              Pensé avec soin. Développé sur mesure.
            </span>
          </span>
          <nav aria-label="Informations légales">
            <a href="/mentions-legales/">Mentions légales</a>
            <a href="/confidentialite/">Données personnelles</a>
            <a href="/conditions/">Conditions d’utilisation</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
export function App({ initialPath = "/", initialHash = "" } = {}) {
  const path =
    typeof window === "undefined" ? initialPath : window.location.pathname;
  const [route, setRoute] = useState(
    typeof window === "undefined" ? initialHash : window.location.hash,
  );
  const heading = useRef(null);
  useEffect(() => {
    function update() {
      setRoute(window.location.hash);
    }
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const normalized =
    path === "/index.html" ? "/" : path.replace(/\/$/, "") || "/";
  const legacyProject = route.startsWith("#/projet/") ? route.slice(9) : null;
  const project = normalized.startsWith("/projets/")
    ? normalized.slice(9)
    : legacyProject;
  const legal =
    normalized !== "/"
      ? normalized.slice(1)
      : route.startsWith("#/")
        ? route.slice(2)
        : null;
  const legalKnown = [
    "mentions-legales",
    "confidentialite",
    "conditions",
  ].includes(legal);
  const projectKnown = projects.some((p) => p.id === project);
  const isHome = normalized === "/" && !route.startsWith("#/");
  const realUnknown = !isHome && !legalKnown && !projectKnown;
  useEffect(() => {
    const title =
      projects.find((p) => p.id === project)?.name ||
      {
        "mentions-legales": "Mentions légales",
        confidentialite: "Données personnelles",
        conditions: "Conditions d’utilisation",
      }[legal];
    document.title = realUnknown
      ? "Page introuvable — " + config.name
      : title
        ? title + " — " + config.name
        : config.name + " — Développeur web freelance & design graphique";
    // Préserve les anciennes adresses partagées tout en adoptant les URL de pages.
    if (normalized === "/" && route.startsWith("#/") && !realUnknown) {
      window.location.replace(
        projectKnown ? "/projets/" + project + "/" : "/" + legal + "/",
      );
      return;
    }
    if (realUnknown)
      document
        .querySelector('meta[name="robots"]')
        ?.setAttribute("content", "noindex,follow");
    requestAnimationFrame(() => {
      if (route && !route.startsWith("#/")) {
        let id = route.slice(1);
        try {
          id = decodeURIComponent(id);
        } catch {
          // Ancre mal encodée (ex. « /#% ») : on l'ignore au lieu de planter.
        }
        document.getElementById(id)?.scrollIntoView();
      } else if (!isHome) {
        window.scrollTo({ top: 0, behavior: "instant" });
        const el = document.querySelector("main h1");
        if (el) {
          el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        }
      }
    });
  }, [route, project, legal, isHome, realUnknown, normalized, projectKnown]);
  let content;
  if (realUnknown) content = <NotFound />;
  else if (project) content = <ProjectPage key={project} id={project} />;
  else if (
    ["mentions-legales", "confidentialite", "conditions"].includes(legal)
  )
    content = <LegalPage type={legal} />;
  else if (!isHome) content = <NotFound />;
  else
    content = (
      <main id="content" ref={heading}>
        <Hero />
        <Work />
        <Tools />
        <Services />
        <Method />
        <About />
        <Resources />
        <FAQ />
        <Contact />
      </main>
    );
  return (
    <>
      <Background3D />
      <a className="skip-link" href={isHome ? "#content" : "#page-content"}>
        Aller au contenu
      </a>
      <Header />
      <div className="site-content" id="page-content">
        {content}
      </div>
      <Footer />
    </>
  );
}
if (typeof document !== "undefined")
  createRoot(document.getElementById("root")).render(
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </MotionConfig>,
  );
