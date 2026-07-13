"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { useT } from "@/components/i18n/i18n-provider";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, setQty, remove, subtotal, count } = useCart();
  const { t } = useT();

  if (items.length === 0) {
    return (
      <div className="container-page py-24">
        <div className="glass-card mx-auto max-w-md p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ocean-400/10">
            <ShoppingBag className="h-7 w-7 text-ocean-300" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">
            {t("cart.empty")}
          </h1>
          <p className="mt-2 text-sm text-slate-400">{t("common.emptyHint")}</p>
          <Link href="/products" className="btn-primary mt-6">
            {t("common.shopSeafood")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
        {t("cart.title")}
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        {count} {count === 1 ? t("common.item") : t("common.items")}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {items.map((item) => (
            <div key={item.product.id} className="glass-card flex gap-4 p-4">
              <Link
                href={`/products/${item.product.slug}`}
                className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-deep-700"
              >
                {item.product.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-medium text-white hover:text-ocean-200"
                  >
                    {item.product.name}
                  </Link>
                  <button
                    onClick={() => remove(item.product.id)}
                    aria-label={t("common.remove")}
                    className="text-slate-500 hover:text-coral"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  {formatPrice(item.product.price)} · {item.product.unit}
                </p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center gap-1 rounded-lg border border-white/10 p-1">
                    <button
                      onClick={() => setQty(item.product.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-300 hover:bg-white/5"
                      aria-label={t("common.decrease")}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => setQty(item.product.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md text-slate-300 hover:bg-white/5"
                      aria-label={t("common.increase")}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <span className="font-semibold text-white">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-card sticky top-24 p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              {t("cart.orderSummary")}
            </h2>
            <div className="mt-4 space-y-2 text-sm">
              <Row label={t("common.subtotal")} value={formatPrice(subtotal)} />
              <Row label={t("common.shipping")} value={t("common.freeOver")} muted />
              <Row
                label={t("common.estimatedTotal")}
                value={formatPrice(subtotal + (subtotal >= 75 ? 0 : 12))}
                strong
              />
            </div>
            <Link href="/checkout" className="btn-primary mt-6 w-full">
              {t("common.checkout")}
            </Link>
            <Link
              href="/products"
              className="mt-3 block text-center text-xs text-slate-400 hover:text-white"
            >
              {t("common.continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-slate-400" : "text-slate-300"}>{label}</span>
      <span
        className={
          strong ? "font-display text-lg font-bold text-white" : "text-white"
        }
      >
        {value}
      </span>
    </div>
  );
}
