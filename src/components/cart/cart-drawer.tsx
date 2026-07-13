"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { useT } from "@/components/i18n/i18n-provider";
import { formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotal, count } = useCart();
  const { t, lang } = useT();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-deep-900/70 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-deep-800 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label={t("common.openCart")}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-ocean-300" />
            <h2 className="font-display text-base font-semibold text-white">
              {t("common.yourCatch")} ({count})
            </h2>
          </div>
          <button
            onClick={close}
            aria-label={t("common.closeCart")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ocean-400/10">
              <ShoppingBag className="h-7 w-7 text-ocean-300" />
            </div>
            <div>
              <p className="font-medium text-white">{t("common.empty")}</p>
              <p className="mt-1 text-sm text-slate-400">{t("common.emptyHint")}</p>
            </div>
            <Link href="/products" onClick={close} className="btn-primary">
              {t("common.shopSeafood")}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="glass-card flex gap-3 p-3"
                >
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-deep-700">
                    {item.product.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={close}
                        className="text-sm font-medium text-white hover:text-ocean-200"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => remove(item.product.id)}
                        aria-label={t("common.removeitem")}
                        className="text-slate-500 hover:text-coral"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">
                      {formatPrice(item.product.price, lang)} · {item.product.unit}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setQty(item.product.id, item.quantity - 1)
                          }
                          aria-label={t("common.decrease")}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-slate-300 hover:bg-white/5"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQty(item.product.id, item.quantity + 1)
                          }
                          aria-label={t("common.increase")}
                          className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-slate-300 hover:bg-white/5"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {formatPrice(item.product.price * item.quantity, lang)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{t("common.subtotal")}</span>
                <span className="font-semibold text-white">
                  {formatPrice(subtotal, lang)}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {t("common.shippingHint")}
              </p>
              <Link
                href="/checkout"
                onClick={close}
                className="btn-primary mt-4 w-full"
              >
                {t("common.checkout")}
              </Link>
              <Link
                href="/products"
                onClick={close}
                className="mt-2 block text-center text-xs text-slate-400 hover:text-white"
              >
                {t("common.continueShopping")}
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
