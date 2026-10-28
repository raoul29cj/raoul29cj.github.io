import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { LightRibbons } from "./Effects";

// Fond 3D : un relief de particules en WebGL natif (aucune librairie, ~4 Ko).
// La souris incline la scène et soulève une onde sous le curseur.
// Sans WebGL, on revient aux rubans lumineux en canvas 2D.

const vertex = `
attribute vec2 aGrid;
uniform float uTime;
uniform float uAspect;
uniform float uScroll;
uniform float uPointScale;
uniform vec2 uTilt;
uniform vec2 uMouse;
uniform float uMouseForce;
uniform float uOffsetX;
varying float vGlow;
varying float vFade;

void main() {
  vec3 p = vec3(aGrid.x * 9.0, 0.0, aGrid.y * 6.0);
  float t = uTime;
  p.y = sin(p.x * 0.55 + t * 0.55) * 0.42
      + sin(p.z * 0.85 + t * 0.4) * 0.3
      + sin((p.x + p.z) * 0.35 - t * 0.3) * 0.38;

  // Onde sous le curseur : bosse douce et ondulation qui s'éloigne.
  float d = distance(p.xz, uMouse);
  float bump = exp(-d * d * 0.45) * uMouseForce;
  p.y += bump * 0.95 + sin(d * 3.2 - t * 3.5) * exp(-d * 0.7) * 0.1 * uMouseForce;

  // Caméra : inclinaison selon la souris, léger recul au défilement.
  float rx = 0.42 + uTilt.y * 0.12 + uScroll * 0.08;
  float ry = uTilt.x * 0.28;
  mat3 rotY = mat3(cos(ry), 0.0, -sin(ry), 0.0, 1.0, 0.0, sin(ry), 0.0, cos(ry));
  mat3 rotX = mat3(1.0, 0.0, 0.0, 0.0, cos(rx), sin(rx), 0.0, -sin(rx), cos(rx));
  vec3 v = rotX * (rotY * p);
  v += vec3(uOffsetX, -0.55 - uScroll * 0.6, -7.5);

  float f = 1.0 / tan(0.45);
  // Perspective sans test de profondeur (z = 0) : les points derrière la caméra sont écartés.
  gl_Position = vec4(v.x * f / uAspect, v.y * f, 0.0, -v.z);
  gl_PointSize = min(uPointScale / -v.z, uPointScale * 0.16);

  vGlow = clamp(bump * 1.15 + max(p.y, 0.0) * 0.35, 0.0, 1.0);
  // Fondu au loin, sur les bords et au premier plan (lisibilité du contenu).
  vFade = smoothstep(14.0, 6.0, -v.z) * smoothstep(1.0, 0.75, abs(aGrid.x))
        * smoothstep(3.0, 5.5, -v.z);
}
`;

const fragment = `
precision mediump float;
varying float vGlow;
varying float vFade;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  vec3 blue = vec3(0.29, 0.6, 1.0);
  vec3 orange = vec3(1.0, 0.62, 0.36);
  vec3 c = mix(blue, orange, vGlow);
  gl_FragColor = vec4(c, a * vFade * (0.6 + vGlow * 0.4));
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error("shader");
  return shader;
}

export default function Background3D() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    const gl =
      canvas &&
      canvas.getContext("webgl", { antialias: false, alpha: true, powerPreference: "low-power" });
    if (!gl) return setFallback(true);

    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("link");
    } catch {
      return setFallback(true);
    }
    gl.useProgram(program);

    const mobile = matchMedia("(max-width: 700px)").matches;
    const cols = mobile ? 70 : 130,
      rows = mobile ? 46 : 80;
    const grid = new Float32Array(cols * rows * 2);
    for (let j = 0, k = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        grid[k++] = (i / (cols - 1)) * 2 - 1;
        grid[k++] = (j / (rows - 1)) * 2 - 1;
      }
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, grid, gl.STATIC_DRAW);
    const aGrid = gl.getAttribLocation(program, "aGrid");
    gl.enableVertexAttribArray(aGrid);
    gl.vertexAttribPointer(aGrid, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const u = {};
    for (const name of ["uTime", "uAspect", "uScroll", "uPointScale", "uTilt", "uMouse", "uMouseForce", "uOffsetX"])
      u[name] = gl.getUniformLocation(program, name);

    const state = { tx: 0, ty: 0, x: 0, y: 0, mx: 0, mz: 0, force: 0, targetForce: 0, scroll: 0 };
    let width = 0,
      height = 0,
      frame = 0,
      start = performance.now();

    function size() {
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      width = innerWidth;
      height = innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(u.uAspect, width / height);
      // Sur écran étroit, le relief est recentré.
      gl.uniform1f(u.uOffsetX, width < 850 ? 0.3 : 1.6);
      gl.uniform1f(u.uPointScale, (mobile ? 22 : 30) * ratio);
      if (reduced) draw(0);
    }
    function pointer(e) {
      if (e.pointerType !== "mouse") return;
      state.tx = e.clientX / width - 0.5;
      state.ty = e.clientY / height - 0.5;
      state.targetForce = 1;
    }
    function leave() {
      state.targetForce = 0;
      state.tx = state.ty = 0;
    }
    function draw(now) {
      const t = reduced ? 8 : (now - start) / 1000;
      // Lissage : la scène suit la souris avec douceur.
      state.x += (state.tx - state.x) * 0.06;
      state.y += (state.ty - state.y) * 0.06;
      state.force += (state.targetForce - state.force) * 0.05;
      // Position approximative du curseur sur le relief.
      state.mx += ((state.tx + 0.18) * 13 - state.mx) * 0.08;
      state.mz += ((state.ty + 0.05) * 9 - state.mz) * 0.08;
      const s = Math.min(scrollY / height, 4);
      state.scroll += (s - state.scroll) * 0.08;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(u.uTime, t);
      gl.uniform1f(u.uScroll, reduced ? 0 : state.scroll);
      gl.uniform2f(u.uTilt, state.x, state.y);
      gl.uniform2f(u.uMouse, state.mx, state.mz);
      gl.uniform1f(u.uMouseForce, state.force);
      gl.drawArrays(gl.POINTS, 0, cols * rows);
      if (!reduced) frame = requestAnimationFrame(draw);
    }
    function visibility() {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduced) frame = requestAnimationFrame(draw);
    }
    function lost(e) {
      e.preventDefault();
      cancelAnimationFrame(frame);
      setFallback(true);
    }

    size();
    if (reduced) draw(0);
    else frame = requestAnimationFrame(draw);
    window.addEventListener("resize", size);
    window.addEventListener("pointermove", pointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    canvas.addEventListener("webglcontextlost", lost);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", pointer);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", lost);
    };
  }, [reduced]);

  if (fallback) return <LightRibbons />;
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient-blue" />
      <div className="ambient-orange" />
      <canvas ref={ref} className="ambient-3d" />
      <div className="ambient-shade" />
    </div>
  );
}
