import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCategories } from "@/lib/data";
import { env } from "@/lib/env";
import { getT } from "@/lib/i18n";
import { ProductForm } from "@/components/admin/product-form";
import type { Product } from "@/lib/types";

type Params = Promise<{ id: string }>;

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: { params: Params }) {
  const { t } = await getT();
  const { id } = await params;
  const [categories, productsRes] = await Promise.all([
    getCategories(),
    fetch(`${env.siteUrl}/api/admin/products`, { cache: "no-store" }).then((r) =>
      r.json(),
    ),
  ]);
  const products: Product[] = productsRes.products ?? [];
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/admin/products" className="hover:text-white">{t("admin.products.title")}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-slate-300">{product.name}</span>
      </nav>
      <h1 className="mt-3 font-display text-2xl font-bold text-white">
        {t("admin.products.edit")}
      </h1>
      <p className="mt-1 text-sm text-slate-400">{t("admin.products.editHint")}</p>
      <div className="mt-6">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}
