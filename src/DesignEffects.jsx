import React from "react";

import {
  motion,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";

import {
  ArrowUpRight,
  ArrowRight,
  Monitor,
  CheckCircle2,
} from "lucide-react";

// Compatibilité avec un éventuel ancien import.
export {
  AuroraBackdrop as HeroBackdrop,
} from "./AuroraBackdrop";

export function StudioCard() {
  const reduced = useReducedMotion();

  const rx = useSpring(0, {
    stiffness: 130,
    damping: 24,
  });

  const ry = useSpring(0, {
    stiffness: 130,
    damping: 24,
  });

  const px = useSpring(240, {
    stiffness: 90,
    damping: 25,
  });

  const py = useSpring(180, {
    stiffness: 90,
    damping: 25,
  });

  const glowOpacity = useSpring(0, {
    stiffness: 90,
    damping: 25,
  });

  const background = useMotionTemplate`
    radial-gradient(
      320px circle at ${px}px ${py}px,
      rgba(147, 197, 253, 0.20),
      transparent 75%
    )
  `;

  function move(event) {
    if (reduced || event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ry.set((x / rect.width - 0.5) * 9);
    rx.set(-(y / rect.height - 0.5) * 7);

    px.set(x);
    py.set(y);
    glowOpacity.set(1);
  }

  function reset() {
    rx.set(0);
    ry.set(0);
    glowOpacity.set(0);
  }

  return (
    <motion.div
      className="studio-visual studio-v2"
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className="studio-window studio-panel"
        style={{
          rotateX: reduced ? 0 : rx,
          rotateY: reduced ? 0 : ry,
        }}
        onPointerMove={move}
        onPointerLeave={reset}
      >
        <div className="studio-toolbar">
          <span className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>

          <span>JUNIX / DESIGN & DÉVELOPPEMENT</span>
          <Monitor size={15} aria-hidden="true" />
        </div>

        <div className="studio-editorial">
          <div className="editorial-top">
            <span>junix.</span>

            <span>
              STUDIO INDÉPENDANT
              <ArrowUpRight size={14} aria-hidden="true" />
            </span>
          </div>

          <span className="editorial-label">
            UNE IDÉE. UNE IDENTITÉ.
          </span>

          <h2>
            <span>Du sens.</span>
            <span>Du style.</span>
            <em>De l’impact.</em>
          </h2>

          <div className="editorial-bottom">
            <p>
              Des expériences web
              <br />
              pensées dans les détails.
            </p>

            <a
              href="#projets"
              aria-label="Découvrir les projets"
            >
              <ArrowUpRight size={25} aria-hidden="true" />
            </a>
          </div>

          <div className="editorial-process">
            <span>01 / CONCEVOIR</span>
            <span>02 / CRÉER</span>
            <span>03 / DÉVELOPPER</span>
          </div>
        </div>

        <motion.div
          className="studio-light"
          aria-hidden="true"
          style={{
            background,
            opacity: reduced ? 0 : glowOpacity,
          }}
        />
      </motion.div>

      <div className="studio-caption">
        <span>
          <CheckCircle2 size={16} aria-hidden="true" />
          Pensé pour tous les écrans
        </span>

        <span>JUNIX / {new Date().getFullYear()}</span>
      </div>
    </motion.div>
  );
}

export function DistinctProjectVisual({ salon }) {
  if (salon) {
    return (
      <div className="concept-screen design-alba">
        <div className="alba-editorial-nav">
          <span>MAISON ALBA</span>
          <small>BEAUTÉ & BIEN-ÊTRE</small>
        </div>

        <div className="alba-editorial-layout">
          <div className="alba-editorial-copy">
            <span>LE SOIN COMME UN RITUEL</span>

            <strong>
              Une pause.
              <br />
              <em>Pour vous.</em>
            </strong>

            <p>
              Des gestes doux.
              <br />
              Le temps de se retrouver.
            </p>

            <span className="alba-editorial-cta">
              Découvrir les rituels
              <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </div>

          <div className="alba-still-life" aria-hidden="true">
            <div className="alba-still-arch" />
            <div className="alba-still-plinth" />

            <div className="alba-bottle">
              <i />
              <span>
                ALBA
                <br />
                ESSENTIEL
              </span>
            </div>

            <div className="alba-small-pot" />
            <div className="alba-still-leaf" />

            <span className="alba-art-caption">
              L’ART DE PRENDRE SOIN.
            </span>
          </div>
        </div>

        <div className="alba-editorial-footer">
          <span>DOUCEUR / ÉQUILIBRE / ATTENTION</span>
          <span>01 — LE STUDIO</span>
        </div>
      </div>
    );
  }

  return (
    <div className="concept-screen design-sola">
      <div className="sola-editorial-nav">
        <span>
          sola<span>.</span>
        </span>

        <small>UNE TABLE. DES SAISONS.</small>
      </div>

      <div className="sola-editorial-title">
        <span>CUISINE VIVANTE / PRODUITS DE SAISON</span>

        <strong>
          Le goût
          <br />
          des <em>bons moments.</em>
        </strong>
      </div>

      <div className="sola-table-scene" aria-hidden="true">
        <div className="sola-linen" />

        <div className="sola-main-dish">
          <div className="sola-food">
            <i />
            <b />
            <em />
          </div>
        </div>

        <div className="sola-side-dish">
          <i />
          <b />
          <em />
        </div>

        <div className="sola-table-line" />
      </div>

      <div className="sola-editorial-footer">
        <span>À DÉCOUVRIR / LA CARTE</span>

        <span>
          ENTRÉES · PLATS · DESSERTS
          <ArrowRight size={13} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}