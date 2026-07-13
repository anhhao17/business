"use client";

import { useRef, type ReactNode } from "react";

/**
 * 3D Tilt Card — tilts toward the cursor with a light glare effect.
 *
 * The card rotates on the X and Y axes based on the mouse position,
 * creating a 3D perspective effect. A radial glare follows the
 * cursor for a premium glassy look.
 *
 * Usage:
 *   <TiltCard className="..." glareOpacity={0.15}>
 *     <content />
 *   </TiltCard>
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  glareOpacity = 0.12,
  scale = 1.02,
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -maxTilt;
    const rotateY = ((x - cx) / cx) * maxTilt;
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;

    if (glareRef.current) {
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,${glareOpacity}), transparent 60%)`;
      glareRef.current.style.opacity = "1";
    }
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`tilt-card ${className}`.trim()}
      style={{ transformStyle: "preserve-3d", transition: "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)" }}
    >
      {children}
      <div
        ref={glareRef}
        className="tilt-card-glare"
        style={{ opacity: 0, transition: "opacity 0.3s ease" }}
      />
    </div>
  );
}
