import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { Scissors, Ruler, ArrowUpRight } from "lucide-react";

export function Reveal({ children, className = "", delay = 0 }) {
  const reduced = useReducedMotion() || typeof window === "undefined";
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function Tilt({ children, className = "", strength = 6 }) {
  const reduced = useReducedMotion();
  const rx = useSpring(0, { stiffness: 140, damping: 25 });
  const ry = useSpring(0, { stiffness: 140, damping: 25 });
  const px = useSpring(50, { stiffness: 120, damping: 24 });
  const py = useSpring(50, { stiffness: 120, damping: 24 });
  const spotX = useTransform(px, (v) => `${v}%`);
  const spotY = useTransform(py, (v) => `${v}%`);
  function move(e) {
    if (
      reduced ||
      e.pointerType !== "mouse" ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    const y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
    rx.set((0.5 - y) * strength);
    ry.set((x - 0.5) * strength);
    px.set(x * 100);
    py.set(y * 100);
  }
  return (
    <motion.div
      className={"tilt " + className}
      style={{
        transformPerspective: 1000,
        rotateX: reduced ? 0 : rx,
        rotateY: reduced ? 0 : ry,
        "--spot-x": spotX,
        "--spot-y": spotY,
      }}
      onPointerMove={move}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        px.set(50);
        py.set(50);
      }}
    >
      {children}
    </motion.div>
  );
}
export function InteractiveTitle() {
  const reduced = useReducedMotion() || typeof window === "undefined";
  const x = useSpring(0, { stiffness: 110, damping: 24 });
  const y = useSpring(0, { stiffness: 110, damping: 24 });
  function move(e) {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    y.set(((e.clientY - r.top) / r.height - 0.5) * 6);
  }
  return (
    <motion.h1
      className="interactive-title"
      aria-label="Le web, avec du caractère."
      style={{ x: reduced ? 0 : x, y: reduced ? 0 : y }}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {["Le web,", "avec du", "caractère."].map((line, i) => {
        const letters = [...line].map((letter, j) => (
          <motion.span
            key={j}
            className="title-letter"
            whileHover={
              reduced
                ? undefined
                : { y: -7, rotate: j % 2 ? 4 : -4, color: "#ffb078" }
            }
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            {letter === " " ? "\u00a0" : letter}
          </motion.span>
        ));
        return (
          <motion.span
            key={line}
            aria-hidden="true"
            className="title-line"
            initial={
              reduced ? false : { opacity: 0, y: 24, filter: "blur(5px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.85,
              delay: 0.12 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {i === 2 ? <em>{letters}</em> : letters}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}
export function Asset({
  src,
  alt,
  className = "",
  fallback,
  eager = false,
  size,
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  return src && !failed ? (
    <img
      src={src}
      alt={alt}
      className={className}
      width={size}
      height={size}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  ) : (
    fallback
  );
}
// Rubans lumineux : canvas 2D, 3D visuelle sans moteur WebGL lourd.
export function LightRibbons() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = ref.current,
      ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0,
      height = 0,
      frame = 0,
      last = 0,
      phase = 0,
      targetX = 0,
      targetY = 0,
      x = 0,
      y = 0,
      scroll = window.scrollY;
    const mobile = matchMedia("(max-width: 700px)").matches;
    const count = mobile ? 16 : 28;
    function size() {
      // Sur mobile, la barre d'adresse change la hauteur au défilement :
      // on évite de réallouer le canvas pour ces petites variations.
      if (width === innerWidth && Math.abs(height - innerHeight) < 120) return;
      width = innerWidth;
      height = innerHeight;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (reduced) draw(0);
    }
    function pointer(e) {
      if (e.pointerType === "mouse") {
        targetX = e.clientX / width - 0.5;
        targetY = e.clientY / height - 0.5;
      }
    }
    function reset() {
      targetX = 0;
      targetY = 0;
    }
    function onScroll() {
      scroll = window.scrollY;
      if (reduced) draw(0);
    }
    function draw(now) {
      if (!reduced && now - last < 32) {
        frame = requestAnimationFrame(draw);
        return;
      }
      const delta = last ? Math.min(now - last, 64) : 32;
      last = now;
      if (!reduced) {
        phase += delta * 0.0001;
        x += (targetX - x) * 0.07;
        y += (targetY - y) * 0.07;
      }
      ctx.clearRect(0, 0, width, height);
      const shift = reduced ? 0 : Math.min(scroll / height, 6);
      const cx = width * (0.6 + x * 0.12) + Math.sin(phase) * width * 0.06;
      const cy = height * (0.48 + y * 0.12) - shift * height * 0.035;
      for (let i = 0; i < count; i++) {
        const f = i / (count - 1),
          spread = (f - 0.5) * height * 0.17;
        ctx.beginPath();
        ctx.moveTo(width * 1.15, -height * 0.22 + spread);
        ctx.bezierCurveTo(
          width * 0.94,
          cy - height * 0.18 + spread,
          cx - width * 0.26,
          cy + spread,
          cx,
          cy + height * 0.07 + spread,
        );
        ctx.bezierCurveTo(
          cx + width * 0.13,
          cy + height * 0.26 + spread,
          width * 1.05,
          height * 0.72 + spread,
          width * 1.12,
          height * 1.3 + spread,
        );
        const gradient = ctx.createLinearGradient(
          width * 0.3,
          0,
          width,
          height,
        );
        const orange = i % 5 === 0;
        gradient.addColorStop(
          0,
          orange ? "rgba(245,148,77,.02)" : "rgba(78,146,255,.02)",
        );
        gradient.addColorStop(
          0.45,
          orange ? "rgba(249,153,83,.32)" : "rgba(95,165,255,.28)",
        );
        gradient.addColorStop(
          0.8,
          orange ? "rgba(245,148,77,.05)" : "rgba(78,146,255,.04)",
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = i % 6 === 0 ? 1.6 : 0.65;
        ctx.shadowColor = orange ? "#e99255" : "#4999ff";
        ctx.shadowBlur = mobile ? 4 : 7;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      if (!reduced) frame = requestAnimationFrame(draw);
    }
    function visibility() {
      cancelAnimationFrame(frame);
      last = 0;
      if (!document.hidden && !reduced) frame = requestAnimationFrame(draw);
    }
    size();
    if (!reduced) frame = requestAnimationFrame(draw);
    window.addEventListener("resize", size);
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [reduced]);
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-blue" />
      <div className="ambient-orange" />
      <canvas ref={ref} />
      <div className="ambient-shade" />
    </div>
  );
}
export function ProjectArt({ id }) {
  if (id === "barber")
    return (
      <div className="art barber-art">
        <div className="art-nav">
          <b>
            ATELIER N°7<span> / BARBER</span>
          </b>
          <Scissors size={22} strokeWidth={1.5} />
        </div>
        <div className="barber-layout">
          <div>
            <small>COUPE · BARBE · PRÉCISION</small>
            <h3>
              Une coupe.
              <br />
              <em>Une signature.</em>
            </h3>
            <span className="art-mini-cta">
              Trouver son style <ArrowUpRight size={12} />
            </span>
          </div>
          <div className="barber-mirror" aria-hidden="true">
            <span className="mirror-mark">
              N°<b>7</b>
            </span>
            <div className="barber-pole" />
            <div className="mirror-shelf" />
          </div>
        </div>
        <div className="art-bottom">
          <span>LE GESTE JUSTE.</span>
          <span>EST. / CONCEPT RAOUL.CJ</span>
        </div>
      </div>
    );
  if (id === "artisan")
    return (
      <div className="art artisan-art">
        <div className="art-nav">
          <b>
            atelier
            <br />
            <span>noyer.</span>
          </b>
          <span>MATIÈRE / SAVOIR-FAIRE</span>
        </div>
        <div className="artisan-layout">
          <div>
            <small>MENUISERIE SUR MESURE</small>
            <h3>
              Habiter
              <br />
              <em>autrement.</em>
            </h3>
            <span className="art-mini-cta">
              Voir les réalisations <ArrowUpRight size={12} />
            </span>
          </div>
          <div className="wood-scene" aria-hidden="true">
            <div className="wood-panel" />
            <div className="wood-bench" />
            <span className="measure-line">SUR MESURE / 01</span>
            <Ruler size={22} strokeWidth={1.4} />
          </div>
        </div>
        <div className="art-bottom">
          <span>LE BOIS, DANS LE DÉTAIL.</span>
          <span>DESIGN & AGENCEMENT</span>
        </div>
      </div>
    );
  return id === "alba" ? (
    <div className="art alba">
      <div className="art-nav">
        <b>MAISON ALBA</b>
        <span>LE STUDIO / LES SOINS</span>
      </div>
      <div className="alba-layout">
        <div>
          <small>LE SOIN COMME UN RITUEL</small>
          <h3>
            Une pause.
            <br />
            <em>Pour vous.</em>
          </h3>
          <p>
            Des gestes doux.
            <br />
            Le temps de se retrouver.
          </p>
          <span className="art-link">Découvrir les rituels ↗</span>
        </div>
        <div className="still-life" aria-hidden="true">
          <div className="arch" />
          <div className="bottle">
            <i />
            <span>
              ALBA
              <br />
              ESSENTIEL
            </span>
          </div>
          <div className="pot" />
          <div className="leaf" />
        </div>
      </div>
      <div className="art-bottom">DOUCEUR / ÉQUILIBRE / ATTENTION</div>
    </div>
  ) : (
    <div className="art sola">
      <div className="art-nav">
        <b>
          sola<span>.</span>
        </b>
        <span>UNE TABLE. DES SAISONS.</span>
      </div>
      <small>CUISINE VIVANTE / PRODUITS DE SAISON</small>
      <h3>
        Le goût
        <br />
        des <em>bons moments.</em>
      </h3>
      <div className="table-scene" aria-hidden="true">
        <div className="linen" />
        <div className="plate">
          <div className="food">
            <i />
            <b />
            <em />
          </div>
        </div>
        <div className="side-plate" />
      </div>
      <div className="art-bottom">ENTRÉES · PLATS · DESSERTS</div>
    </div>
  );
}
