"use client";

import { type ReactNode } from "react";

/**
 * Devin.ai-style hover text effect.
 *
 * Splits text into individual characters. On hover, each character
 * slides up simultaneously, revealing a duplicate copy underneath.
 * The transition is staggered by 25ms per character for a wave effect.
 *
 * Usage:
 *   <HoverText>Product</HoverText>
 *   <HoverText className="text-ocean-300">Shop</HoverText>
 */
export function HoverText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const text = children;
  const chars = Array.from(text);

  return (
    <span className={`hover-effect ${className}`.trim()} aria-label={text}>
      {chars.map((char, i) => (
        <span
          key={i}
          className="hover-char"
          style={{ ["--i" as string]: i }}
          aria-hidden
        >
          {/* Original character (slides up on hover) */}
          <span>{char === " " ? "\u00A0" : char}</span>
          {/* Duplicate character (revealed from below) */}
          <span>{char === " " ? "\u00A0" : char}</span>
        </span>
      ))}
    </span>
  );
}

/**
 * Wrapper that applies the hover-effect to a Link or any element.
 * The HoverText inside will animate on hover of the parent.
 */
export function HoverLink({
  children,
  className = "",
  textClassName = "",
}: {
  children: ReactNode;
  className?: string;
  textClassName?: string;
}) {
  return (
    <span className={`hover-effect ${className}`.trim()}>
      <span className={textClassName}>{children}</span>
    </span>
  );
}
