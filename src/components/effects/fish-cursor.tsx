"use client";

import { useEffect, useRef } from "react";

/**
 * A little fish that swims around and chases the mouse cursor.
 *
 * - Smoothly lerps toward the cursor (swimming motion)
 * - Rotates to face the direction it's moving
   - Tail wags faster when swimming faster
 * - Wanders gently when the mouse is idle
 * - Stays near the edges of the viewport when the mouse leaves
 * - Hidden on touch devices
 */
export function FishCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = window.innerWidth * 0.8;
    let targetY = window.innerHeight * 0.3;
    let curX = targetX;
    let curY = targetY;
    let prevX = curX;
    let prevY = curY;
    let angle = 0;
    let speed = 0;
    let wagPhase = 0;
    let mouseActive = false;
    let lastMoveTime = 0;
    let rafId = 0;

    // Wander target for idle behavior
    let wanderX = targetX;
    let wanderY = targetY;
    let nextWander = 0;

    const onMove = (e: MouseEvent) => {
      // Fish chases slightly behind/offset from the cursor
      targetX = e.clientX;
      targetY = e.clientY;
      mouseActive = true;
      lastMoveTime = performance.now();
    };

    const onLeave = () => {
      mouseActive = false;
    };

    const animate = () => {
      const now = performance.now();

      // If mouse has been idle, wander gently
      if (now - lastMoveTime > 3000) {
        mouseActive = false;
        if (now > nextWander) {
          // Pick a new wander point
          const margin = 120;
          wanderX = margin + Math.random() * (window.innerWidth - margin * 2);
          wanderY = margin + Math.random() * (window.innerHeight - margin * 2);
          nextWander = now + 2000 + Math.random() * 3000;
        }
        // Slowly drift toward wander point
        targetX += (wanderX - targetX) * 0.005;
        targetY += (wanderY - targetY) * 0.005;
      }

      // Smooth swim toward target
      const lerp = mouseActive ? 0.045 : 0.02;
      prevX = curX;
      prevY = curY;
      curX += (targetX - curX) * lerp;
      curY += (targetY - curY) * lerp;

      // Calculate speed and direction
      const dx = curX - prevX;
      const dy = curY - prevY;
      speed = Math.sqrt(dx * dx + dy * dy);
      const targetAngle = Math.atan2(dy, dx);

      // Smoothly rotate toward movement direction
      let angleDiff = targetAngle - angle;
      // Normalize to [-PI, PI]
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      angle += angleDiff * 0.12;

      // Tail wag speed based on swimming speed
      wagPhase += 0.08 + Math.min(speed * 0.04, 0.25);
      const wag = Math.sin(wagPhase) * (8 + Math.min(speed * 0.8, 20));

      // Apply transform
      el.style.transform = `translate(${curX}px, ${curY}px) rotate(${angle}rad)`;

      // Update CSS variables for tail wag
      el.style.setProperty("--wag", `${wag}deg`);

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="fish-cursor" aria-hidden>
      <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
        {/* Tail */}
        <g
          className="fish-tail"
          style={{ transformOrigin: "8px 20px", transform: "rotate(var(--wag))" }}
        >
          <path
            d="M8 20 L0 8 Q4 20 0 32 Z"
            fill="rgba(89, 192, 255, 0.7)"
          />
        </g>
        {/* Body */}
        <ellipse cx="30" cy="20" rx="24" ry="12" fill="url(#fish-body)" />
        {/* Top fin */}
        <path
          d="M28 8 Q34 2 40 8 Z"
          fill="rgba(56, 170, 255, 0.6)"
        />
        {/* Bottom fin */}
        <path
          d="M28 32 Q34 38 40 32 Z"
          fill="rgba(56, 170, 255, 0.5)"
        />
        {/* Eye */}
        <circle cx="44" cy="17" r="2.5" fill="#04111f" />
        <circle cx="45" cy="16" r="1" fill="#fff" opacity="0.9" />
        {/* Shine on body */}
        <ellipse cx="26" cy="15" rx="14" ry="4" fill="rgba(255,255,255,0.15)" />
        <defs>
          <linearGradient id="fish-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#59c0ff" />
            <stop offset="50%" stopColor="#1c85f5" />
            <stop offset="100%" stopColor="#0f71e0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
