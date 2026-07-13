"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

/**
 * Magnetic Button — attracts toward the cursor when nearby.
 *
 * The element smoothly translates toward the mouse when the cursor
 * is within the magnetic radius, creating a "pull" effect. Returns
 * to center on mouse leave.
 *
 * Usage:
 *   <MagneticButton>
 *     <Link href="/products" className="btn-primary">Shop Now</Link>
 *   </MagneticButton>
 *
 * Or wrap any element:
 *   <MagneticButton strength={0.3} radius={80}>
 *     <button>Click me</button>
 *   </MagneticButton>
 */
export function MagneticButton({
  children,
  strength = 0.35,
  radius = 100,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < radius + rect.width / 2) {
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    }
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`magnetic-wrapper ${className}`.trim()}
      style={{
        display: "inline-block",
        transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
