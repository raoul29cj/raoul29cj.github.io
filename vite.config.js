import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      // La librairie d'animation contient des directives "use client" sans effet ici.
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
    },
  },
});
