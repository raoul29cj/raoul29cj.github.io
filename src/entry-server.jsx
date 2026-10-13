import React from "react";
import { renderToString } from "react-dom/server";
import { MotionConfig } from "motion/react";
import { App } from "./main";

// Génère les mêmes composants pour les visiteurs et les robots, sans serveur Node en production.
export function render(path = "/") {
  return renderToString(
    <MotionConfig reducedMotion="always">
      <App initialPath={path} />
    </MotionConfig>,
  );
}
