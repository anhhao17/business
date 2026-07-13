import Link from "next/link";
import { Pencil, Plus, Search } from "lucide-react";
import { getCategories } from "@/lib/data";
import { env } from "@/lib/env";
import { formatPrice, formatDate } from "@/lib/format";
import { getT } from "@/lib/i18n";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const metadata = { title: "Products" };

type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  unit: string;
  in_stock: boolean;
  is_featured: boolean;
  image_url: string | null;
  created_at: string;
  categories?: { name: string } | null;
};

export default async function AdminProductsPage() {
  const { t } = await getT();
  const [categories, productsRes] = await Promise.all([
    getCategories(),
    fetch(`${env.siteUrl}/api/admin/products`, { cache: "no-store" }).then((r) =>
      r.json(),
    ),
  ]);
  const products: ApiProduct[] = productsRes.products ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{t("admin.products.title")}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {products.length} {products.length === 1 ? t("common.item") : t("common.items")}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="h-4 w-4" /> {t("admin.products.add")}
        </Link>
      </div>

      <div className="glass-card mt-6 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-400">{t("admin.products.none")}</p>
            <Link href="/admin/products/new" className="btn-primary mt-4">
              {t("admin.products.addFirst")}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">{t("admin.products.title")}</th>
                  <th className="px-4 py-3">{t("admin.products.category")}</th>
                  <th className="px-4 py-3">{t("admin.products.price")}</th>
                  <th className="px-4 py-3">{t("admin.products.status")}</th>
                  <th className="px-4 py-3">{t("admin.products.added")}</th>
                  <th className="px-4 py-3 text-right">{t("admin.products.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-deep-700">
                          {p.image_url && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image_url} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{p.name}</p>
                          <p className="text-xs text-slate-500">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {p.categories?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {formatPrice(p.price)}
                      <span className="ml-1 text-xs text-slate-500">{p.unit}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.in_stock ? (
                          <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-300">
                            {t("common.inStock")}
                          </span>
                        ) : (
                          <span className="rounded-full bg-coral/15 px-2 py-0.5 text-xs text-coral">
                            {t("common.soldOut")}
                          </span>
                        )}
                        {p.is_featured && (
                          <span className="rounded-full bg-ocean-400/15 px-2 py-0.5 text-xs text-ocean-200">
                            {t("common.featured")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                          aria-label={t("admin.products.edit")}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeleteProductButton id={p.id} name={p.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
        <Search className="h-3.5 w-3.5" />
        {t("admin.tip")}{" "}
        <Link href="/products" className="text-ocean-300 hover:text-white">
          {t("nav.shop")}
        </Link>
        .
      </p>
    </div>
  );
}
