"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Lock, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { useT } from "@/components/i18n/i18n-provider";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { t } = useT();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      customer_name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      address: form.get("address"),
      note: form.get("note"),
      items: items.map((i) => ({
        product_id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        image_url: i.product.image_url,
      })),
      total,
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to place order");
      setDone(data.id);
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="container-page py-24">
        <div className="glass-card mx-auto max-w-lg p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
            <Check className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-white">
            {t("checkout.placed")}
          </h1>
          <p className="mt-2 text-sm text-slate-400">{t("checkout.placedBody")}</p>
          <p className="mt-4 text-xs text-slate-500">
            {t("checkout.orderRef")}: {done.slice(0, 8).toUpperCase()}
          </p>
          <Link href="/products" className="btn-primary mt-6">
            {t("checkout.keepShopping")}
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-24">
        <div className="glass-card mx-auto max-w-md p-10 text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-ocean-300" />
          <h1 className="mt-4 font-display text-xl font-bold text-white">
            {t("checkout.empty")}
          </h1>
          <Link href="/products" className="btn-primary mt-5">
            {t("common.shopSeafood")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
        {t("checkout.title")}
      </h1>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-400">
        <Lock className="h-3.5 w-3.5" /> {t("checkout.demoNote")}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              {t("checkout.contactShipping")}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label={t("checkout.fullName")} name="name" required placeholder="Jane Fisher" />
              <Field label={t("checkout.email")} name="email" type="email" required placeholder="jane@example.com" />
              <Field label={t("checkout.phone")} name="phone" placeholder="(555) 123-4567" />
              <Field label={t("checkout.address")} name="address" required placeholder="123 Harbor St, City, ST 00000" />
              <div className="sm:col-span-2">
                <label className="label-field">{t("checkout.orderNote")}</label>
                <textarea
                  name="note"
                  rows={3}
                  placeholder={t("checkout.orderNotePlaceholder")}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              {t("checkout.payment")}
            </h2>
            <p className="mt-2 text-sm text-slate-400">{t("checkout.paymentNote")}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-field">{t("checkout.cardNumber")}</label>
                <input className="input-field" placeholder="4242 4242 4242 4242" inputMode="numeric" />
              </div>
              <Field label={t("checkout.expiry")} name="exp" placeholder="MM / YY" />
              <Field label={t("checkout.cvc")} name="cvc" placeholder="123" />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card sticky top-24 p-6">
            <h2 className="font-display text-lg font-semibold text-white">
              {t("cart.orderSummary")}
            </h2>
            <div className="mt-4 space-y-3">
              {items.map((i) => (
                <div key={i.product.id} className="flex items-center gap-3">
                  <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-deep-700">
                    {i.product.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={i.product.image_url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="text-white">{i.product.name}</p>
                    <p className="text-xs text-slate-400">{t("common.qty")} {i.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {formatPrice(i.product.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">{t("common.subtotal")}</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t("common.shipping")}</span>
                <span className="text-white">
                  {shipping === 0 ? t("common.free") : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-3">
                <span className="font-semibold text-white">{t("common.total")}</span>
                <span className="font-display text-xl font-bold text-white">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-xs text-coral">
                {error}
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
              {submitting
                ? t("checkout.placing")
                : `${t("checkout.placeOrder")} · ${formatPrice(total)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label-field">
        {label} {required && <span className="text-coral">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}
