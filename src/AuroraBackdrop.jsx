import React, { useEffect, useRef } from "react";

import {
  motion,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
  useInView,
} from "motion/react";

export function AuroraBackdrop() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const visible = useInView(ref, {
    margin: "100px",
  });

  const pointerX = useSpring(0, {
    stiffness: 65,
    damping: 24,
  });

  const pointerY = useSpring(0, {
    stiffness: 65,
    damping: 24,
  });

  const active = useSpring(0, {
    stiffness: 65,
    damping: 24,
  });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scroll = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 26,
  });

  const azureX = useTransform(
    () =>
      pointerX.get() * -120 -
      active.get() * 35 +
      scroll.get() * 35
  );

  const azureY = useTransform(
    () =>
      pointerY.get() * -85 -
      scroll.get() * 100
  );

  const orangeX = useTransform(
    () =>
      pointerX.get() * 135 +
      active.get() * 30 -
      scroll.get() * 45
  );

  const orangeY = useTransform(
    () =>
      pointerY.get() * 95 +
      scroll.get() * 75
  );

  const iceX = useTransform(
    () =>
      pointerX.get() * -90 +
      active.get() * 35 +
      scroll.get() * 60
  );

  const iceY = useTransform(
    () =>
      pointerY.get() * 105 -
      scroll.get() * 65
  );

  useEffect(() => {
    const hero = ref.current?.closest(".hero");

    if (!hero) return;

    function move(event) {
      if (reduced || event.pointerType !== "mouse") return;

      const rect = hero.getBoundingClientRect();

      pointerX.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1
      );

      pointerY.set(
        ((event.clientY - rect.top) / rect.height) * 2 - 1
      );

      active.set(1);
    }

    function reset() {
      pointerX.set(0);
      pointerY.set(0);
      active.set(0);
    }

    reset();

    hero.addEventListener("pointermove", move);
    hero.addEventListener("pointerleave", reset);

    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
    };
  }, [reduced, pointerX, pointerY, active]);

  return (
    <div
      ref={ref}
      className={
        "aurora-backdrop " +
        (visible && !reduced ? "aurora-active" : "")
      }
      aria-hidden="true"
    >
      <div className="aurora-mesh" />

      <motion.div
        className="aurora-layer aurora-azure"
        style={{
          x: reduced ? 0 : azureX,
          y: reduced ? 0 : azureY,
        }}
      >
        <div className="aurora-color" />
      </motion.div>

      <motion.div
        className="aurora-layer aurora-orange"
        style={{
          x: reduced ? 0 : orangeX,
          y: reduced ? 0 : orangeY,
        }}
      >
        <div className="aurora-color" />
      </motion.div>

      <motion.div
        className="aurora-layer aurora-ice"
        style={{
          x: reduced ? 0 : iceX,
          y: reduced ? 0 : iceY,
        }}
      >
        <div className="aurora-color" />
      </motion.div>

      <div className="aurora-veil" />
    </div>
  );
}