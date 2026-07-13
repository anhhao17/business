"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps children and fades/slides them in when they enter the viewport.
 *
 * Usage:
 *   <Reveal>...</Reveal>
 *   <Reveal delay={2}>...</Reveal>   // delay = 1–5 (maps to reveal-delay-N)
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  threshold = 0.15,
}: {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion: show immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("reveal-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const delayClass = delay > 0 ? ` reveal-delay-${delay}` : "";

  return (
    <div ref={ref} className={`reveal${delayClass} ${className}`.trim()}>
      {children}
    </div>
  );
}
