import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { QuickAddButton } from "@/components/cart/add-to-cart";
import { getT } from "@/lib/i18n";
import { getLang } from "@/lib/i18n";
import { TiltCard } from "@/components/effects/tilt-card";

export async function ProductCard({ product }: { product: Product }) {
  const { t } = await getT();
  const lang = await getLang();

  return (
    <TiltCard className="glass-card-hover group relative flex flex-col overflow-hidden rounded-2xl" maxTilt={8} glareOpacity={0.08}>
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-deep-700">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-600">
              {t("product.noImage")}
            </div>
          )}

          {/* Top badges */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {product.is_featured && (
              <span className="rounded-full bg-ocean-400/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                {t("common.featured")}
              </span>
            )}
            {product.is_fresh ? (
              <span className="freshness-badge freshness-badge-fresh">{t("common.fresh")}</span>
            ) : (
              <span className="rounded-full bg-sky-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                {t("common.frozen")}
              </span>
            )}
          </div>

          {/* Quick add */}
          <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <QuickAddButton product={product} />
          </div>

          {!product.in_stock && (
            <div className="absolute inset-0 flex items-center justify-center bg-deep-900/60">
              <span className="rounded-full bg-coral px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                {t("common.soldOut")}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-base font-semibold leading-snug text-white">
              {product.name}
            </h3>
            {product.rating != null && (
              <span className="flex flex-shrink-0 items-center gap-1 text-xs text-amber-300">
                <Star className="h-3.5 w-3.5 fill-amber-300" />
                {product.rating.toFixed(1)}
              </span>
            )}
          </div>

          {product.origin && (
            <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
              <MapPin className="h-3.5 w-3.5" /> {product.origin}
            </p>
          )}

          <p className="mt-2 line-clamp-2 text-sm text-slate-400">
            {product.description}
          </p>

          <div className="mt-auto flex items-end justify-between pt-4">
            <div>
              <span className="font-display text-lg font-bold text-white">
                {formatPrice(product.price, lang)}
              </span>
              <span className="ml-1 text-xs text-slate-400">{product.unit}</span>
            </div>
            <span className="text-xs font-medium text-ocean-300 opacity-0 transition-opacity group-hover:opacity-100">
              {t("common.view")}
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
