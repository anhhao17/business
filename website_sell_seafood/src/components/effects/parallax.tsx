"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Translates its children along the Y axis based on scroll position,
 * creating a parallax depth effect. Positive `speed` moves up as you
 * scroll down (slower than page); negative moves down (faster illusion).
 *
 * @param speed  pixel offset per 1000px scrolled (default 120)
 */
export function Parallax({
  children,
  speed = 120,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    let currentY = 0;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // How far the element center is from viewport center, normalized
      const center = rect.top + rect.height / 2;
      const offset = (center - viewportH / 2) / viewportH;
      currentY = -offset * speed;
      el.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0)`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  );
}
