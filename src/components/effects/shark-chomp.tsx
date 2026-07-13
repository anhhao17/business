"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Left-click shark chomp effect (Fizz ultimate inspired).
 *
 * On each left-click, a shark lunges up from below the click point,
 * chomps, and splashes back down. A splash burst + ripple accompany
 * the strike.
 *
 * Uses a single canvas overlay with requestAnimationFrame.
 * Hidden on touch devices.
 */
type Shark = {
  x: number;
  y: number;
  born: number;
  scale: number;
  angle: number;
};

type Splash = {
  x: number;
  y: number;
  born: number;
  particles: { x: number; y: number; vx: number; vy: number; size: number }[];
};

const SHARK_DURATION = 900; // ms — full chomp cycle
const SPLASH_DURATION = 700;

export function SharkChomp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sharksRef = useRef<Shark[]>([]);
  const splashesRef = useRef<Splash[]>([]);

  const onClick = useCallback((e: MouseEvent) => {
    // Only left click (button === 0); ignore clicks on links/buttons/inputs
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (
      target.closest("a, button, input, textarea, select, label, [role='button']")
    ) {
      return;
    }

    const scale = 0.8 + Math.random() * 0.5;
    // Shark lunges up from below at a slight random angle
    const angle = (-90 + (Math.random() * 30 - 15)) * (Math.PI / 180);

    sharksRef.current.push({
      x: e.clientX,
      y: e.clientY,
      born: performance.now(),
      scale,
      angle,
    });

    // Splash burst particles
    const particles = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 3 + Math.random() * 5;
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - 2,
        size: 2 + Math.random() * 4,
      });
    }
    splashesRef.current.push({
      x: e.clientX,
      y: e.clientY,
      born: performance.now(),
      particles,
    });

    // Cap concurrent sharks
    if (sharksRef.current.length > 5) sharksRef.current.shift();
    if (splashesRef.current.length > 5) splashesRef.current.shift();
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
     * Draw the shark body lunging up. The shark shape is drawn with
     * a path: pointed snout, dorsal fin, tail. We animate the vertical
     * offset so it emerges from below, chomps at the apex, then sinks.
     */
    function drawShark(shark: Shark, now: number) {
      const elapsed = now - shark.born;
      const t = elapsed / SHARK_DURATION; // 0 → 1
      if (t >= 1) return false;

      // Phase: 0→0.35 rise, 0.35→0.55 chomp hold, 0.55→1.0 sink
      let yOffset: number;
      let mouthOpen: number;
      if (t < 0.35) {
        const p = t / 0.35;
        yOffset = (1 - p) * 220; // rise from 220px below
        mouthOpen = 0;
      } else if (t < 0.55) {
        const p = (t - 0.35) / 0.2;
        yOffset = 0;
        mouthOpen = Math.sin(p * Math.PI); // open then close
      } else {
        const p = (t - 0.55) / 0.45;
        yOffset = p * 260; // sink back down
        mouthOpen = 0;
      }

      const opacity = t < 0.85 ? 1 : (1 - t) / 0.15;

      g.save();
      g.translate(shark.x, shark.y + yOffset);
      g.rotate(shark.angle);
      g.scale(shark.scale, shark.scale);
      g.globalAlpha = opacity;

      // Body gradient
      const bodyGrad = g.createLinearGradient(0, -30, 0, 30);
      bodyGrad.addColorStop(0, "#5a7a9a");
      bodyGrad.addColorStop(0.5, "#3a5a7a");
      bodyGrad.addColorStop(1, "#1a3a5a");

      // --- Shark body (pointing up) ---
      g.fillStyle = bodyGrad;
      g.beginPath();
      // Snout (top, pointed)
      g.moveTo(0, -90);
      // Right side of head
      g.quadraticCurveTo(30, -50, 35, -10);
      // Right body
      g.quadraticCurveTo(40, 20, 25, 40);
      // Tail (bottom)
      g.lineTo(15, 55);
      g.lineTo(-15, 55);
      // Left body
      g.quadraticCurveTo(-40, 20, -35, -10);
      // Left side of head
      g.quadraticCurveTo(-30, -50, 0, -90);
      g.closePath();
      g.fill();

      // Dorsal fin
      g.fillStyle = "#2a4a6a";
      g.beginPath();
      g.moveTo(-5, 5);
      g.lineTo(-25, -35);
      g.lineTo(5, 0);
      g.closePath();
      g.fill();

      // Pectoral fin
      g.beginPath();
      g.moveTo(20, 10);
      g.lineTo(45, 35);
      g.lineTo(15, 25);
      g.closePath();
      g.fill();

      // --- Mouth (opens during chomp phase) ---
      const mouthY = -75;
      const mouthH = 20 + mouthOpen * 35;
      const mouthW = 22;

      // Lower jaw (fixed)
      g.fillStyle = "#1a2a3a";
      g.beginPath();
      g.moveTo(-mouthW, mouthY);
      g.lineTo(mouthW, mouthY);
      g.lineTo(mouthW * 0.7, mouthY + mouthH);
      g.lineTo(-mouthW * 0.7, mouthY + mouthH);
      g.closePath();
      g.fill();

      // Teeth on lower jaw
      g.fillStyle = "#ffffff";
      for (let i = -2; i <= 2; i++) {
        const tx = (i * mouthW * 0.7) / 2.5;
        g.beginPath();
        g.moveTo(tx - 3, mouthY + 2);
        g.lineTo(tx, mouthY + 9);
        g.lineTo(tx + 3, mouthY + 2);
        g.closePath();
        g.fill();
      }

      // Upper jaw (part of head, with teeth pointing down)
      for (let i = -2; i <= 2; i++) {
        const tx = (i * mouthW * 0.7) / 2.5;
        g.beginPath();
        g.moveTo(tx - 3, mouthY - 1);
        g.lineTo(tx, mouthY - 8);
        g.lineTo(tx + 3, mouthY - 1);
        g.closePath();
        g.fill();
      }

      // Inside mouth (dark red when open)
      if (mouthOpen > 0.1) {
        g.fillStyle = `rgba(180, 30, 40, ${mouthOpen * 0.8})`;
        g.beginPath();
        g.moveTo(-mouthW * 0.7, mouthY);
        g.lineTo(mouthW * 0.7, mouthY);
        g.lineTo(mouthW * 0.5, mouthY + mouthH * 0.8);
        g.lineTo(-mouthW * 0.5, mouthY + mouthH * 0.8);
        g.closePath();
        g.fill();
      }

      // Eye
      g.fillStyle = "#000";
      g.beginPath();
      g.arc(-12, -45, 4, 0, Math.PI * 2);
      g.fill();
      // Eye glint
      g.fillStyle = "#fff";
      g.beginPath();
      g.arc(-13, -46, 1.5, 0, Math.PI * 2);
      g.fill();

      // Gills
      g.strokeStyle = "rgba(20, 40, 60, 0.6)";
      g.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        g.beginPath();
        g.moveTo(-20 - i * 8, -25);
        g.quadraticCurveTo(-25 - i * 8, -15, -20 - i * 8, -5);
        g.stroke();
      }

      g.restore();
      return true;
    }

    function drawSplash(splash: Splash, now: number) {
      const elapsed = now - splash.born;
      const t = elapsed / SPLASH_DURATION;
      if (t >= 1) return false;

      const opacity = 1 - t;

      // Expanding ring
      const ringRadius = t * 80;
      g.strokeStyle = `rgba(89, 192, 255, ${opacity * 0.6})`;
      g.lineWidth = 3 * (1 - t);
      g.beginPath();
      g.arc(splash.x, splash.y, ringRadius, 0, Math.PI * 2);
      g.stroke();

      // Particles
      g.fillStyle = `rgba(142, 216, 255, ${opacity})`;
      for (const p of splash.particles) {
        const px = p.x + p.vx * elapsed * 0.06;
        const py = p.y + p.vy * elapsed * 0.06 + 0.005 * elapsed * elapsed * 0.5;
        g.beginPath();
        g.arc(px, py, p.size * (1 - t * 0.5), 0, Math.PI * 2);
        g.fill();
      }

      return true;
    }

    function render() {
      g.clearRect(0, 0, width, height);
      const now = performance.now();

      // Draw splashes (behind sharks)
      splashesRef.current = splashesRef.current.filter((s) =>
        drawSplash(s, now),
      );

      // Draw sharks
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
