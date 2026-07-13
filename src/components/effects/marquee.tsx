"use client";

/**
 * Marquee — infinite scrolling ticker.
 *
 * Renders a horizontally scrolling strip of items that loops
 * seamlessly. Used for seafood facts, promotions, or announcements.
 *
 * Usage:
 *   <Marquee items={["Fresh daily", "Dock to door", "Sustainable"]} />
 */
export function Marquee({
  items,
  speed = 30,
  className = "",
}: {
  items: string[];
  speed?: number;
  className?: string;
}) {
  // Duplicate items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className={`marquee-container ${className}`.trim()} aria-hidden>
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="marquee-dot" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
