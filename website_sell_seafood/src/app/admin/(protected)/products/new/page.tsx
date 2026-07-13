import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCategories } from "@/lib/data";
import { getT } from "@/lib/i18n";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  const { t } = await getT();
  const categories = await getCategories();
  return (
    <div>
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/admin/products" className="hover:text-white">{t("admin.products.title")}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-300">{t("admin.products.new.title")}</span>
      </nav>
      <h1 className="mt-3 font-display text-2xl font-bold text-white">
        {t("admin.products.new")}
      </h1>
      <p className="mt-1 text-sm text-slate-400">{t("admin.products.newHint")}</p>
      <div className="mt-6">
        <ProductForm product={null} categories={categories} />
      </div>
    </div>
  );
}
