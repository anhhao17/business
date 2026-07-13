"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Cartoon shark that swims in and chomps on click.
 *
 * On left-click, a shark swims in from the nearest screen edge,
 * undulating its body and wagging its tail. It swims toward the
 * click point, chomps (mouth opens wide with teeth), then continues
 * swimming off the opposite side. A splash burst accompanies the chomp.
 *
 * Inspired by cartoon shark animations.
 * Hidden on touch devices.
 */
type Shark = {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  exitX: number;
  exitY: number;
  born: number;
  duration: number;
  scale: number;
  direction: number; // 1 = right, -1 = left
  chompAt: number; // 0-1 fraction of duration when chomp happens
};

type Splash = {
  x: number;
  y: number;
  born: number;
  particles: { x: number; y: number; vx: number; vy: number; size: number }[];
};

const SWIM_DURATION = 1400; // ms total swim cycle
const SPLASH_DURATION = 800;

export function SharkChomp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sharksRef = useRef<Shark[]>([]);
  const splashesRef = useRef<Splash[]>([]);

  const onClick = useCallback((e: MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (
      target.closest("a, button, input, textarea, select, label, [role='button']")
    ) {
      return;
    }

    const cx = e.clientX;
    const cy = e.clientY;
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Decide which side to enter from — nearest horizontal edge
    const fromLeft = cx < w / 2;
    const direction = fromLeft ? 1 : -1; // swim direction
    const startX = fromLeft ? -150 : w + 150;
    const startY = cy + (Math.random() * 120 - 60);
    const exitX = fromLeft ? w + 150 : -150;
    const exitY = cy + (Math.random() * 120 - 60);

    const scale = 0.7 + Math.random() * 0.4;

    sharksRef.current.push({
      startX,
      startY,
      targetX: cx,
      targetY: cy,
      exitX,
      exitY,
      born: performance.now(),
      duration: SWIM_DURATION,
      scale,
      direction,
      chompAt: 0.45,
    });

    // Splash at chomp point
    const particles = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 4 + Math.random() * 7;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - 3,
        size: 2 + Math.random() * 5,
      });
    }
    splashesRef.current.push({
      x: cx,
      y: cy,
      born: performance.now() + SWIM_DURATION * 0.45,
      particles,
    });

    if (sharksRef.current.length > 4) sharksRef.current.shift();
    if (splashesRef.current.length > 4) splashesRef.current.shift();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const g = ctx;
    const cv = canvas;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let rafId = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = width * dpr;
      cv.height = height * dpr;
      cv.style.width = `${width}px`;
      cv.style.height = `${height}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /**
     * Quadratic bezier interpolation between two points with a control point.
     */
    function bezierPoint(
      t: number,
      p0: number,
      p1: number,
      p2: number,
    ): number {
      const u = 1 - t;
      return u * u * p0 + 2 * u * t * p1 + t * t * p2;
    }

    /**
     * Draw a cartoon shark with body undulation and tail wag.
     * The shark swims in the direction of `direction` (1=right, -1=left).
     */
    function drawShark(shark: Shark, now: number): boolean {
      const elapsed = now - shark.born;
      const t = elapsed / shark.duration;
      if (t >= 1) return false;

      // Three-phase path: start → target (chomp) → exit
      let x: number, y: number;
      let phase: "swim_in" | "chomp" | "swim_out";

      if (t < shark.chompAt) {
        // Swim in: bezier from start to target
        const pt = t / shark.chompAt;
        const ctrlX = (shark.startX + shark.targetX) / 2;
        const ctrlY = (shark.startY + shark.targetY) / 2 - 40;
        x = bezierPoint(pt, shark.startX, ctrlX, shark.targetX);
        y = bezierPoint(pt, shark.startY, ctrlY, shark.targetY);
        phase = "swim_in";
      } else if (t < shark.chompAt + 0.12) {
        // Chomp hold at target
        x = shark.targetX;
        y = shark.targetY;
        phase = "chomp";
      } else {
        // Swim out: bezier from target to exit
        const pt = (t - shark.chompAt - 0.12) / (1 - shark.chompAt - 0.12);
        const ctrlX = (shark.targetX + shark.exitX) / 2;
        const ctrlY = (shark.targetY + shark.exitY) / 2 - 40;
        x = bezierPoint(pt, shark.targetX, ctrlX, shark.exitX);
        y = bezierPoint(pt, shark.targetY, ctrlY, shark.exitY);
        phase = "swim_out";
      }

      // Mouth open amount during chomp
      let mouthOpen = 0;
      if (phase === "chomp") {
        const ct = (t - shark.chompAt) / 0.12;
        mouthOpen = Math.sin(ct * Math.PI) * 1.2; // open then close
      } else if (phase === "swim_in" && t > shark.chompAt - 0.05) {
        // Start opening just before chomp
        mouthOpen = ((t - (shark.chompAt - 0.05)) / 0.05) * 0.5;
      }

      // Body undulation (sine wave along body)
      const undulation = Math.sin(elapsed * 0.012) * 0.08;

      // Fade in/out at edges
      let opacity = 1;
      if (t < 0.05) opacity = t / 0.05;
      if (t > 0.92) opacity = (1 - t) / 0.08;

      g.save();
      g.translate(x, y);
      g.scale(shark.direction * shark.scale, shark.scale);
      g.globalAlpha = Math.max(0, opacity);

      // Body gradient
      const bodyGrad = g.createLinearGradient(0, -35, 0, 35);
      bodyGrad.addColorStop(0, "#6b8eab");
      bodyGrad.addColorStop(0.4, "#4a7090");
      bodyGrad.addColorStop(0.7, "#2d5273");
      bodyGrad.addColorStop(1, "#1a3a55");

      // --- Tail (wagging) ---
      const tailWag = Math.sin(elapsed * 0.015) * 0.3;
      g.save();
      g.translate(-55, 0);
      g.rotate(tailWag);

      // Tail upper lobe
      g.fillStyle = "#3a6080";
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(-35, -30);
      g.lineTo(-25, 0);
      g.closePath();
      g.fill();

      // Tail lower lobe
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(-35, 30);
      g.lineTo(-25, 0);
      g.closePath();
      g.fill();
      g.restore();

      // --- Body (with undulation) ---
      g.fillStyle = bodyGrad;
      g.beginPath();
      // Start at tail base (left)
      g.moveTo(-50, 0);
      // Top of body — undulating curve toward head
      g.quadraticCurveTo(-30, -35 + undulation * 20, 0, -38);
      g.quadraticCurveTo(25, -40, 50, -30);
      // Head/snout (right side, pointed)
      g.quadraticCurveTo(70, -22, 85, -8);
      g.quadraticCurveTo(95, 0, 85, 8);
      // Bottom of body — undulating curve back to tail
      g.quadraticCurveTo(70, 22, 50, 30);
      g.quadraticCurveTo(25, 40, 0, 38);
      g.quadraticCurveTo(-30, 35 - undulation * 20, -50, 0);
      g.closePath();
      g.fill();

      // Belly highlight (lighter underside)
      g.fillStyle = "rgba(200, 220, 235, 0.25)";
      g.beginPath();
      g.moveTo(-40, 8);
      g.quadraticCurveTo(0, 38, 50, 25);
      g.quadraticCurveTo(70, 18, 75, 8);
      g.quadraticCurveTo(40, 30, 0, 32);
      g.quadraticCurveTo(-25, 28, -40, 8);
      g.closePath();
      g.fill();

      // --- Dorsal fin ---
      g.fillStyle = "#2d5273";
      g.beginPath();
      g.moveTo(-5, -35);
      g.lineTo(5, -60);
      g.lineTo(20, -33);
      g.closePath();
      g.fill();

      // Dorsal fin shadow
      g.fillStyle = "rgba(20, 40, 60, 0.3)";
      g.beginPath();
      g.moveTo(5, -55);
      g.lineTo(10, -38);
      g.lineTo(20, -33);
      g.closePath();
      g.fill();

      // --- Pectoral fin ---
      g.fillStyle = "#2d5273";
      g.save();
      g.translate(15, 20);
      g.rotate(0.3 + undulation * 0.5);
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(-20, 25);
      g.lineTo(5, 15);
      g.closePath();
      g.fill();
      g.restore();

      // --- Mouth ---
      const mouthX = 78;
      const mouthY = 2;
      const mouthW = 18;
      const mouthH = 8 + mouthOpen * 30;

      // Mouth interior (dark red)
      if (mouthOpen > 0.05) {
        g.fillStyle = `rgba(170, 25, 35, ${Math.min(mouthOpen, 1) * 0.9})`;
        g.beginPath();
        g.ellipse(mouthX, mouthY + mouthH * 0.3, mouthW * 0.7, mouthH * 0.5, 0, 0, Math.PI * 2);
        g.fill();
      }

      // Lower jaw
      g.fillStyle = "#1a3a55";
      g.beginPath();
      g.moveTo(mouthX - mouthW, mouthY);
      g.quadraticCurveTo(mouthX, mouthY + mouthH * 0.8, mouthX + mouthW, mouthY);
      g.lineTo(mouthX + mouthW, mouthY + 4);
      g.quadraticCurveTo(mouthX, mouthY + mouthH + 4, mouthX - mouthW, mouthY + 4);
      g.closePath();
      g.fill();

      // Teeth — lower jaw (pointing up)
      g.fillStyle = "#ffffff";
      const numTeeth = 5;
      for (let i = 0; i < numTeeth; i++) {
        const frac = i / (numTeeth - 1);
        const tx = mouthX - mouthW + frac * mouthW * 2;
        const ty = mouthY + 1;
        g.beginPath();
        g.moveTo(tx - 3, ty);
        g.lineTo(tx, ty + 7 + mouthOpen * 5);
        g.lineTo(tx + 3, ty);
        g.closePath();
        g.fill();
      }

      // Teeth — upper jaw (pointing down)
      for (let i = 0; i < numTeeth; i++) {
        const frac = i / (numTeeth - 1);
        const tx = mouthX - mouthW + frac * mouthW * 2;
        const ty = mouthY - 1 - mouthOpen * 10;
        g.beginPath();
        g.moveTo(tx - 3, ty);
        g.lineTo(tx, ty - 7 - mouthOpen * 5);
        g.lineTo(tx + 3, ty);
        g.closePath();
        g.fill();
      }

      // --- Eye ---
      g.fillStyle = "#0a0a0a";
      g.beginPath();
      g.arc(55, -18, 5, 0, Math.PI * 2);
      g.fill();
      // Eye glint
      g.fillStyle = "#ffffff";
      g.beginPath();
      g.arc(53, -20, 2, 0, Math.PI * 2);
      g.fill();

      // --- Gills ---
      g.strokeStyle = "rgba(15, 35, 55, 0.5)";
      g.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const gx = 25 + i * 10;
        g.beginPath();
        g.moveTo(gx, -20);
        g.quadraticCurveTo(gx - 5, -8, gx, 5);
        g.stroke();
      }

      g.restore();
      return true;
    }

    function drawSplash(splash: Splash, now: number): boolean {
      if (now < splash.born) return true; // not yet
      const elapsed = now - splash.born;
      if (elapsed < 0) return true;
      const t = elapsed / SPLASH_DURATION;
      if (t >= 1) return false;

      const opacity = 1 - t;

      // Expanding ripple rings (two)
      for (let r = 0; r < 2; r++) {
        const ringRadius = (t + r * 0.15) * 90;
        g.strokeStyle = `rgba(89, 192, 255, ${opacity * (0.6 - r * 0.2)})`;
        g.lineWidth = (3 - r) * (1 - t * 0.5);
        g.beginPath();
        g.arc(splash.x, splash.y, ringRadius, 0, Math.PI * 2);
        g.stroke();
      }

      // Water droplet particles
      g.fillStyle = `rgba(142, 216, 255, ${opacity})`;
      for (const p of splash.particles) {
        const dt = elapsed * 0.06;
        const px = p.x + p.vx * dt;
        const py = p.y + p.vy * dt + 0.004 * elapsed * elapsed * 0.5;
        g.beginPath();
        g.arc(px, py, p.size * (1 - t * 0.4), 0, Math.PI * 2);
        g.fill();
      }

      return true;
    }

    function render() {
      g.clearRect(0, 0, width, height);
      const now = performance.now();

      splashesRef.current = splashesRef.current.filter((s) =>
        drawSplash(s, now),
      );
      sharksRef.current = sharksRef.current.filter((s) =>
        drawShark(s, now),
      );

      rafId = requestAnimationFrame(render);
    }

    resize();
    rafId = requestAnimationFrame(render);

    window.addEventListener("resize", resize);
    window.addEventListener("mousedown", onClick, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousedown", onClick);
    };
  }, [onClick]);

  return <canvas ref={canvasRef} className="shark-canvas" aria-hidden />;
}
