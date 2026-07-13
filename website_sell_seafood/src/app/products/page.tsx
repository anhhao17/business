import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getProducts, getCategories } from "@/lib/data";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/effects/scroll-reveal";
import { getT } from "@/lib/i18n";

type SearchParams = Promise<{ search?: string; category?: string }>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { t } = await getT();
  const sp = await searchParams;
  const search = sp.search?.trim() ?? "";
  const categorySlug = sp.category?.trim() ?? "";

  const [products, categories] = await Promise.all([
    getProducts({ search, categorySlug }),
    getCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="relative">
      {/* Page header */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="aurora-bg pointer-events-none absolute inset-0 opacity-50" />
        <div className="container-page relative py-14 sm:py-20">
          <span className="section-eyebrow">{t("products.market")}</span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
            {activeCategory ? activeCategory.name : t("products.all")}
          </h1>
          <p className="mt-3 max-w-xl text-slate-300">
            {activeCategory?.description ?? t("products.allDesc")}
          </p>

          {/* Search + filters */}
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form className="relative w-full max-w-md" action="/products" method="GET">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder={t("products.search")}
                className="input-field pl-11 pr-24"
              />
              {categorySlug && (
                <input type="hidden" name="category" value={categorySlug} />
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-gradient-to-r from-ocean-400 to-abyss-500 px-4 py-2 text-xs font-semibold text-white hover:brightness-110"
              >
                {t("products.searchBtn")}
              </button>
            </form>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <SlidersHorizontal className="h-4 w-4 flex-shrink-0 text-slate-400" />
              <CategoryPill href="/products" active={!categorySlug}>
                {t("products.all")}
              </CategoryPill>
              {categories.map((c) => (
                <CategoryPill
                  key={c.id}
                  href={`/products?category=${c.slug}`}
                  active={categorySlug === c.slug}
                >
                  {c.name}
                </CategoryPill>
              ))}
            </div>
          </div>

          {/* Active search indicator */}
          {(search || categorySlug) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <span>{t("common.showing")}</span>
              {search && (
                <span className="chip">
                  “{search}”
                  <Link href={`/products${categorySlug ? `?category=${categorySlug}` : ""}`}>
                    <X className="h-3 w-3" />
                  </Link>
                </span>
              )}
              {categorySlug && (
                <span className="chip">
                  {activeCategory?.name}
                  <Link href={`/products${search ? `?search=${encodeURIComponent(search)}` : ""}`}>
                    <X className="h-3 w-3" />
                  </Link>
                </span>
              )}
              <span>· {products.length} {products.length === 1 ? t("common.results") : t("common.resultsPlural")}</span>
            </div>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="container-page py-12">
        {products.length === 0 ? (
          <div className="glass-card mx-auto max-w-md p-10 text-center">
            <p className="font-display text-lg font-semibold text-white">
              {t("products.noResults")}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              {t("products.noResultsHint")}
            </p>
            <Link href="/products" className="btn-outline mt-6">
              {t("common.clearFilters")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CategoryPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`flex-shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "border-ocean-400/60 bg-ocean-400/15 text-white"
          : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-ocean-400/40 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
