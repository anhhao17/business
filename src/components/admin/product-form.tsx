"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ImagePlus, Loader2, Save } from "lucide-react";
import { useT } from "@/components/i18n/i18n-provider";
import type { Category, Product } from "@/lib/types";

export function ProductForm({
  product,
  categories,
}: {
  product: Product | null;
  categories: Category[];
}) {
  const router = useRouter();
  const { t } = useT();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image_url ?? null,
  );

  const isEdit = Boolean(product);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (isEdit && product) formData.append("id", product.id);
    if (product?.image_url) formData.append("existing_image", product.image_url);
    try {
      const res = await fetch("/api/admin/products", {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="font-display text-lg font-semibold text-white">
          {isEdit ? t("admin.products.edit") : t("admin.products.new")}
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label-field">{t("admin.products.name")} <span className="text-coral">*</span></label>
            <input
              name="name"
              required
              defaultValue={product?.name}
              className="input-field"
              placeholder="Wild Alaskan King Salmon"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label-field">{t("admin.products.description")}</label>
            <textarea
              name="description"
              rows={4}
              defaultValue={product?.description}
              className="input-field"
              placeholder="Rich, buttery king salmon caught off the coast of Alaska…"
            />
          </div>

          <div>
            <label className="label-field">{t("admin.products.priceUsd")} <span className="text-coral">*</span></label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={product?.price ?? ""}
              className="input-field"
              placeholder="32.90"
            />
          </div>

          <div>
            <label className="label-field">{t("admin.products.unit")}</label>
            <input
              name="unit"
              defaultValue={product?.unit ?? "per lb"}
              className="input-field"
              placeholder="per lb / per dozen / per 8oz pack"
            />
          </div>

          <div>
            <label className="label-field">{t("admin.products.category")}</label>
            <select
              name="category_id"
              defaultValue={product?.category_id ?? ""}
              className="input-field"
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-field">{t("admin.products.origin")}</label>
            <input
              name="origin"
              defaultValue={product?.origin ?? ""}
              className="input-field"
              placeholder="Alaska, USA"
            />
          </div>

          <div>
            <label className="label-field">{t("admin.products.ratingOpt")}</label>
            <input
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              defaultValue={product?.rating ?? ""}
              className="input-field"
              placeholder="4.8"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="label-field">{t("admin.products.image")}</label>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <label className="group relative flex h-32 w-32 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/15 bg-deep-800/60 text-slate-400 hover:border-ocean-400/50">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-1 text-xs">
                    <ImagePlus className="h-6 w-6" /> {t("admin.products.upload")}
                  </span>
                )}
                <input
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={onImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-400 sm:pt-1">
                {t("admin.products.imageHint")}
              </p>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="mt-6 flex flex-wrap gap-6">
          <Toggle
            name="is_fresh"
            label={t("admin.products.toggleFresh")}
            defaultChecked={product?.is_fresh ?? false}
          />
          <Toggle
            name="is_featured"
            label={t("admin.products.toggleFeatured")}
            defaultChecked={product?.is_featured ?? false}
          />
          <Toggle
            name="in_stock"
            label={t("admin.products.toggleStock")}
            defaultChecked={product?.in_stock ?? true}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {t("common.saving")}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> {isEdit ? t("admin.products.save") : t("admin.products.create")}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="btn-ghost"
        >
          {t("common.cancel")}
        </button>
      </div>
    </form>
  );
}

function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
      <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-deep-700 transition has-[:checked]:bg-ocean-500">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          value="on"
          className="peer sr-only"
        />
        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
      </span>
      {label}
    </label>
  );
}
