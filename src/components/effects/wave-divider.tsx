"use client";

/**
 * WaveDivider — animated SVG wave between sections.
 *
 * Renders a full-width SVG wave at the bottom of a section.
 * The wave gently animates horizontally for a living ocean feel.
 *
 * Usage:
 *   <WaveDivider color="rgba(10,26,48,0.6)" flip={false} />
 */
export function WaveDivider({
  color = "rgba(10, 26, 48, 0.6)",
  flip = false,
  className = "",
}: {
  color?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`wave-divider ${className}`.trim()}
      style={{
        transform: flip ? "rotate(180deg)" : undefined,
        lineHeight: 0,
      }}
      aria-hidden
    >
      <svg
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "60px", display: "block" }}
      >
        <path
          d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,80 L0,80 Z"
          fill={color}
          className="wave-divider-path"
        >
          <animate
            attributeName="d"
            dur="8s"
            repeatCount="indefinite"
            values="
              M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,80 L0,80 Z;
              M0,40 C150,0 350,80 600,40 C850,0 1050,80 1200,40 L1200,80 L0,80 Z;
              M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,80 L0,80 Z
            "
          />
        </path>
      </svg>
    </div>
  );
}
