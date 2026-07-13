"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Fish } from "lucide-react";
import { useT } from "@/components/i18n/i18n-provider";
import { formatPrice } from "@/lib/format";

/**
 * Catch of the Day — featured product banner with a live countdown timer.
 *
 * Shows a "Catch of the Day" banner with a countdown timer that resets
 * every 24 hours. Creates urgency and highlights a featured product.
 *
 * Since this is a client component, it receives product data as props.
 */
export function CatchOfTheDay({
  name,
  price,
  unit,
  image_url,
  slug,
  origin,
}: {
  name: string;
  price: number;
  unit: string;
  image_url?: string | null;
  slug: string;
  origin?: string | null;
}) {
  const { t, lang } = useT();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="catch-banner group">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        {/* Image */}
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-deep-700 sm:h-40 sm:w-40">
          {image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image_url} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-ocean-400">
              <Fish className="h-12 w-12" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="freshness-badge freshness-badge-fresh">{t("catch.title")}</span>
          </div>
          <h3 className="font-display text-xl font-bold text-white sm:text-2xl">{name}</h3>
          {origin && (
            <p className="text-sm text-slate-400">{origin}</p>
          )}
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold text-ocean-300">
              {formatPrice(price, lang)}
            </span>
            <span className="text-sm text-slate-400">{unit}</span>
          </div>
        </div>

        {/* Timer + CTA */}
        <div className="flex flex-col items-center gap-3 sm:items-end">
          <div className="text-center sm:text-right">
            <p className="text-xs uppercase tracking-wider text-slate-400">{t("catch.endsIn")}</p>
            <p className="catch-banner-timer">{timeLeft}</p>
          </div>
          <Link
            href={`/products/${slug}`}
            className="btn-primary inline-flex items-center gap-2 text-sm"
          >
            {t("catch.grab")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
