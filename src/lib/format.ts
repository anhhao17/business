import type { Lang } from "@/lib/i18n/dictionaries";

// Exchange rate: 1 USD = 25,400 VND (approximate, fixed for display)
const USD_TO_VND = 25400;

export function formatPrice(value: number, lang: Lang = "vi"): string {
  if (lang === "vi") {
    const vnd = Math.round(value * USD_TO_VND);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(vnd);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function formatDate(value: string | Date, lang: Lang = "vi"): string {
  const d = typeof value === "string" ? new Date(value) : value;
  const locale = lang === "vi" ? "vi-VN" : "en-US";
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
