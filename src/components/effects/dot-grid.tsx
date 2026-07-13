"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive dot-grid canvas inspired by devin.ai/cli.
 *
 * Renders a full-screen grid of small dots on a canvas. Dots near the
 * cursor brighten with an ocean-blue glow, and the brightness decays
 * over time — creating a smooth "trail" that follows mouse movement.
 * Clicking emits a ripple pulse that outwardly expands.
 *
 * Performance: uses a single canvas + requestAnimationFrame loop with
 * spatial grid culling. Hidden on touch devices.
 */
export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const cv = canvas; // non-null after guard
    const g = ctx; // non-null after guard

    // ---- Config ----
    const SPACING = 28; // px between dots
    const DOT_RADIUS = 1.1; // base dot radius
    const INFLUENCE_RADIUS = 180; // how far the mouse glow reaches
    const TRAIL_RADIUS = 120; // how far the trail brightens
    const DECAY = 0.92; // brightness decay per frame
    const RIPPLE_SPEED = 4.5; // px per frame
    const RIPPLE_WIDTH = 60; // ring thickness
    const RIPPLE_MAX = 600; // max ripple radius

    // ---- State ----
    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // mouse position (smoothed)
    let mouseX = -9999;
    let mouseY = -9999;
    let smoothX = -9999;
    let smoothY = -9999;
    let prevX = -9999;
    let prevY = -9999;

    // per-dot brightness buffer
    let brightness: Float32Array = new Float32Array(0);

    // ripples from clicks
    type Ripple = { x: number; y: number; radius: number };
    const ripples: Ripple[] = [];

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

      cols = Math.ceil(width / SPACING) + 1;
      rows = Math.ceil(height / SPACING) + 1;
      brightness = new Float32Array(cols * rows);
    }

    function onMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    function onClick(e: MouseEvent) {
      ripples.push({ x: e.clientX, y: e.clientY, radius: 0 });
      // cap concurrent ripples
      if (ripples.length > 8) ripples.shift();
    }

    function onLeave() {
      mouseX = -9999;
      mouseY = -9999;
    }

    function render() {
      g.clearRect(0, 0, width, height);

      // Smooth mouse position
      if (smoothX === -9999) {
        smoothX = mouseX;
        smoothY = mouseY;
      } else {
        smoothX += (mouseX - smoothX) * 0.18;
        smoothY += (mouseY - smoothY) * 0.18;
      }

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += RIPPLE_SPEED;
        if (ripples[i].radius > RIPPLE_MAX) ripples.splice(i, 1);
      }

      // Decay all brightness
      for (let i = 0; i < brightness.length; i++) {
        brightness[i] *= DECAY;
      }

      // Add brightness along the mouse trail segment
      if (mouseX > -9000) {
        if (prevX > -9000) {
          paintTrail(prevX, prevY, smoothX, smoothY);
        } else {
          paintTrail(smoothX, smoothY, smoothX, smoothY);
        }
        prevX = smoothX;
        prevY = smoothY;
      } else {
        prevX = -9999;
        prevY = -9999;
      }

      // Draw dots
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          const x = col * SPACING;
          const y = row * SPACING;

          let b = brightness[idx];

          // Add proximity glow from current mouse position
          if (mouseX > -9000) {
            const dx = x - smoothX;
            const dy = y - smoothY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < INFLUENCE_RADIUS) {
              const prox = 1 - dist / INFLUENCE_RADIUS;
              b = Math.max(b, prox * 0.5);
            }
          }

          // Add ripple brightness
          for (const r of ripples) {
            const dx = x - r.x;
            const dy = y - r.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const delta = Math.abs(dist - r.radius);
            if (delta < RIPPLE_WIDTH) {
              const fade = 1 - r.radius / RIPPLE_MAX;
              const ring = (1 - delta / RIPPLE_WIDTH) * fade;
              b = Math.max(b, ring * 0.8);
            }
          }

          if (b < 0.01) {
            // Base dim dot
            g.fillStyle = "rgba(56, 170, 255, 0.06)";
            g.beginPath();
            g.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
            g.fill();
          } else {
            // Bright dot with glow
            const radius = DOT_RADIUS + b * 2.5;
            const alpha = Math.min(b, 1);
            // Glow halo
            g.fillStyle = `rgba(89, 192, 255, ${alpha * 0.15})`;
            g.beginPath();
            g.arc(x, y, radius * 3, 0, Math.PI * 2);
            g.fill();
            // Core
            g.fillStyle = `rgba(142, 216, 255, ${alpha * 0.9})`;
            g.beginPath();
            g.arc(x, y, radius, 0, Math.PI * 2);
            g.fill();
          }
        }
      }

      rafId = requestAnimationFrame(render);
    }

    /**
     * Paint brightness onto dots along a line segment from (x1,y1) to (x2,y2).
     * This creates the "trail" effect as the mouse moves.
     */
    function paintTrail(x1: number, y1: number, x2: number, y2: number) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.ceil(len / (SPACING * 0.4)));

      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const px = x1 + dx * t;
        const py = y1 + dy * t;

        // Find nearby grid dots and brighten them
        const colStart = Math.max(0, Math.floor((px - TRAIL_RADIUS) / SPACING));
        const colEnd = Math.min(cols - 1, Math.ceil((px + TRAIL_RADIUS) / SPACING));
        const rowStart = Math.max(0, Math.floor((py - TRAIL_RADIUS) / SPACING));
        const rowEnd = Math.min(rows - 1, Math.ceil((py + TRAIL_RADIUS) / SPACING));

        for (let row = rowStart; row <= rowEnd; row++) {
          for (let col = colStart; col <= colEnd; col++) {
            const x = col * SPACING;
            const y = row * SPACING;
            const ddx = x - px;
            const ddy = y - py;
            const dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < TRAIL_RADIUS) {
              const intensity = (1 - dist / TRAIL_RADIUS) * 0.85;
              const idx = row * cols + col;
              if (intensity > brightness[idx]) {
                brightness[idx] = intensity;
              }
            }
          }
        }
      }
    }

    resize();
    rafId = requestAnimationFrame(render);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="dot-grid-canvas"
      aria-hidden
    />
  );
}
