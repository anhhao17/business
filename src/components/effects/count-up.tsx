"use client";

import { useEffect, useRef, useState } from "react";

/**
 * CountUp — animates a number from 0 to target when scrolled into view.
 *
 * Uses IntersectionObserver to trigger the animation, then eases
 * from 0 to the target value over the specified duration.
 *
 * Usage:
 *   <CountUp end={1200} suffix="+" />
 *   <CountUp end={48} suffix="h" label="cold chain" />
 */
export function CountUp({
  end,
  duration = 2000,
  suffix = "",
  prefix = "",
  className = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(Math.round(end * eased));
            if (t < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
