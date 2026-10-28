import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { LightRibbons } from "./Effects";

const vertex = `
attribute vec2 aGrid;
uniform float uTime;
uniform float uAspect;
uniform float uPointScale;
uniform vec2 uCam;
uniform vec3 uOffset;
uniform vec2 uMouse;
uniform float uMouseForce;
uniform vec3 uPulse;
uniform float uEnergy;
varying float vGlow;
varying float vFade;

void main() {
  vec3 p = vec3(aGrid.x * 9.0, 0.0, aGrid.y * 6.0);
  float t = uTime;
  float amp = 1.0 + uEnergy * 0.8;
  p.y = (sin(p.x * 0.55 + t * 0.55) * 0.42
       + sin(p.z * 0.85 + t * 0.4) * 0.3
       + sin((p.x + p.z) * 0.35 - t * 0.3) * 0.38) * amp;

  float d = distance(p.xz, uMouse);
  float bump = exp(-d * d * 0.28) * uMouseForce;
  p.y += bump * 1.35 + sin(d * 3.0 - t * 4.0) * exp(-d * 0.55) * 0.16 * uMouseForce;

  float pd = distance(p.xz, uPulse.xy);
  float ring = exp(-pow(pd - uPulse.z * 5.0, 2.0) * 1.6) * exp(-uPulse.z * 1.4);
  p.y += ring * 0.9;

  float rx = uCam.x, ry = uCam.y;
  mat3 rotY = mat3(cos(ry), 0.0, -sin(ry), 0.0, 1.0, 0.0, sin(ry), 0.0, cos(ry));
  mat3 rotX = mat3(1.0, 0.0, 0.0, 0.0, cos(rx), sin(rx), 0.0, -sin(rx), cos(rx));
  vec3 v = rotX * (rotY * p) + uOffset;

  float f = 1.0 / tan(0.45);

  gl_Position = vec4(v.x * f / uAspect, v.y * f, 0.0, -v.z);
  gl_PointSize = min(uPointScale / -v.z, uPointScale * 0.16) * (1.0 + bump * 0.6 + ring);

  vGlow = clamp(bump * 1.2 + ring * 1.5 + max(p.y, 0.0) * 0.3, 0.0, 1.0);

  vFade = smoothstep(14.0, 6.0, -v.z) * smoothstep(1.0, 0.75, abs(aGrid.x))
        * smoothstep(2.5, 5.0, -v.z);
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
  gl_FragColor = vec4(c, a * vFade * (0.55 + vGlow * 0.45));
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error("shader");
  return shader;
}

const FOCAL = 1 / Math.tan(0.45);
const ease = (current, target, k) => current + (target - current) * k;

export default function Background3D() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    let cleanup = () => {},
      cancelled = false;
    const begin = () => {
      if (!cancelled) cleanup = init() || cleanup;
    };
    const idle = (cb) =>
      window.requestIdleCallback
        ? requestIdleCallback(cb, { timeout: 1500 })
        : setTimeout(cb, 300);
    const kick = () => idle(begin);
    if (document.readyState === "complete") kick();
    else window.addEventListener("load", kick, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", kick);
      cleanup();
    };

    function init() {
      const canvas = ref.current;
      const gl =
        canvas &&
        canvas.getContext("webgl", {
          antialias: false,
          alpha: true,
          powerPreference: "low-power",
        });
      if (!gl) return setFallback(true);

      let program;
      try {
        program = gl.createProgram();
        gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertex));
        gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragment));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS))
          throw new Error("link");
      } catch {
        return setFallback(true);
      }
      gl.useProgram(program);

      const mobile = matchMedia("(max-width: 700px)").matches;
      const cols = mobile ? 72 : 130,
        rows = mobile ? 48 : 80;
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
      for (const name of [
        "uTime",
        "uAspect",
        "uPointScale",
        "uCam",
        "uOffset",
        "uMouse",
        "uMouseForce",
        "uPulse",
        "uEnergy",
      ])
        u[name] = gl.getUniformLocation(program, name);

      const s = {
        px: -1,
        py: -1,
        tilt: 0,
        tiltY: 0,
        rx: 0.42,
        ry: 0,
        lift: -0.55,
        mx: 0,
        mz: 0,
        force: 0,
        forceTarget: 0,
        pulseX: 0,
        pulseZ: 0,
        pulseAge: 99,
        energy: 0,
        lastScroll: scrollY,
        time: 0,
        last: 0,
      };
      let width = 0,
        height = 0,
        offsetX = 1.6,
        frame = 0;

      function project(clientX, clientY) {
        const x = (clientX / width) * 2 - 1,
          y = 1 - (clientY / height) * 2;
        const cx = Math.cos(s.rx),
          sx = Math.sin(s.rx),
          cy = Math.cos(s.ry),
          sy = Math.sin(s.ry);
        const inv = ([a, b, c]) => {
          const qy = cx * b + sx * c,
            qz = -sx * b + cx * c;
          return [cy * a - sy * qz, qy, sy * a + cy * qz];
        };
        const o = inv([-offsetX, -s.lift, 7.5]);
        const d = inv([(x * width) / height / FOCAL, y / FOCAL, -1]);
        if (d[1] >= -0.01) return null;
        const t = -o[1] / d[1];
        return [o[0] + d[0] * t, o[2] + d[2] * t];
      }

      function size() {
        const ratio = Math.min(devicePixelRatio || 1, 1.5);
        width = innerWidth;
        height = innerHeight;
        offsetX = width < 850 ? 0.3 : 1.6;
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(u.uAspect, width / height);
        gl.uniform1f(u.uPointScale, (mobile ? 22 : 30) * ratio);
        if (reduced) draw(0);
      }
      function pointer(e) {
        s.px = e.clientX;
        s.py = e.clientY;
        s.forceTarget = e.pointerType === "mouse" ? 1 : 0.8;
      }
      function release(e) {
        if (e.pointerType !== "mouse") s.forceTarget = 0;
      }
      function leave() {
        s.forceTarget = 0;
      }
      function pulse(e) {
        const hit = project(e.clientX, e.clientY);
        if (!hit) return;
        [s.pulseX, s.pulseZ] = hit;
        s.pulseAge = 0;
      }

      function draw(now) {
        const dt = s.last ? Math.min((now - s.last) / 1000, 0.05) : 0.016;
        s.last = now;
        const doc = Math.max(document.documentElement.scrollHeight - height, 1);
        const progress = Math.min(scrollY / doc, 1);

        const speed = Math.abs(scrollY - s.lastScroll) / height;
        s.lastScroll = scrollY;
        s.energy = Math.max(ease(s.energy, 0, 0.04), Math.min(speed * 12, 1));
        s.time += reduced ? 0 : dt * (1 + s.energy * 1.5);

        const tx = s.px < 0 ? 0 : s.px / width - 0.5;
        const ty = s.py < 0 ? 0 : s.py / height - 0.5;
        s.tilt = ease(s.tilt, tx, 0.06);
        s.tiltY = ease(s.tiltY, ty, 0.06);

        s.rx = ease(s.rx, 0.42 + s.tiltY * 0.14 + progress * 0.38, 0.08);
        s.ry = ease(s.ry, s.tilt * 0.3 + progress * 0.9, 0.08);
        s.lift = ease(
          s.lift,
          -0.55 - Math.min(scrollY / height, 1) * 0.35,
          0.08,
        );
        s.force = ease(s.force, s.forceTarget, 0.06);
        if (s.px >= 0) {
          const hit = project(s.px, s.py);
          if (hit) {
            s.mx = ease(s.mx, hit[0], 0.18);
            s.mz = ease(s.mz, hit[1], 0.18);
          }
        }
        s.pulseAge += dt;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(u.uTime, reduced ? 8 : s.time + 8);
        gl.uniform2f(u.uCam, reduced ? 0.42 : s.rx, reduced ? 0 : s.ry);
        gl.uniform3f(u.uOffset, offsetX, reduced ? -0.55 : s.lift, -7.5);
        gl.uniform2f(u.uMouse, s.mx, s.mz);
        gl.uniform1f(u.uMouseForce, s.force);
        gl.uniform3f(u.uPulse, s.pulseX, s.pulseZ, s.pulseAge);
        gl.uniform1f(u.uEnergy, s.energy);
        gl.drawArrays(gl.POINTS, 0, cols * rows);
        if (!reduced) frame = requestAnimationFrame(draw);
      }
      function visibility() {
        cancelAnimationFrame(frame);
        s.last = 0;
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
      const passive = { passive: true };
      window.addEventListener("resize", size);
      if (!reduced) {
        window.addEventListener("pointermove", pointer, passive);
        window.addEventListener("pointerdown", pulse, passive);
        window.addEventListener("pointerup", release, passive);
        window.addEventListener("pointercancel", release, passive);
        document.documentElement.addEventListener("pointerleave", leave);
      }
      document.addEventListener("visibilitychange", visibility);
      canvas.addEventListener("webglcontextlost", lost);
      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", size);
        window.removeEventListener("pointermove", pointer);
        window.removeEventListener("pointerdown", pulse);
        window.removeEventListener("pointerup", release);
        window.removeEventListener("pointercancel", release);
        document.documentElement.removeEventListener("pointerleave", leave);
        document.removeEventListener("visibilitychange", visibility);
        canvas.removeEventListener("webglcontextlost", lost);
      };
    }
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
