"use client";

import { useEffect, useRef } from "react";

/**
 * A soft radial glow that follows the cursor on desktop.
 * Hidden on touch devices via CSS (max-width: 768px).
 */
export function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let curX = targetX;
    let curY = targetY;
    let rafId = 0;
    let visible = false;

    const animate = () => {
      // Smooth lerp toward the target position
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
      el.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(animate);
    };

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        el.style.opacity = "1";
        visible = true;
      }
    };

    const onLeave = () => {
      el.style.opacity = "0";
      visible = false;
    };

    el.style.opacity = "0";
    rafId = requestAnimationFrame(animate);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} className="mouse-glow" aria-hidden />;
}
