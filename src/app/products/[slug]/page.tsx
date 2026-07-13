import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Star, Truck, ShieldCheck, Snowflake } from "lucide-react";
import { getProductBySlug, getProducts } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { getT, getLang } from "@/lib/i18n";
import { ProductPurchaseBox } from "@/components/product/product-purchase-box";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/effects/scroll-reveal";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { t } = await getT();
  const lang = await getLang();
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getProducts({ categorySlug: product.category_slug ?? undefined });
  const related = all.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="relative">
      {/* Breadcrumb */}
      <div className="container-page pt-8">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/" className="hover:text-white">{t("nav.home")}</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-white">{t("nav.shop")}</Link>
          {product.category_slug && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={`/products?category=${product.category_slug}`}
                className="hover:text-white capitalize"
              >
                {product.category_slug}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-300">{product.name}</span>
        </nav>
      </div>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="relative">
          <div className="glass-card relative aspect-square overflow-hidden rounded-3xl">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-600">
                {t("product.noImage")}
              </div>
            )}
          </div>
          {/* badges */}
          <div className="mt-4 flex flex-wrap gap-2">
            {product.is_fresh ? (
              <span className="chip border-emerald-400/30 text-emerald-300">{t("common.fresh")}</span>
            ) : (
              <span className="chip border-sky-400/30 text-sky-300">{t("common.frozenAtSea")}</span>
            )}
            {product.is_featured && (
              <span className="chip border-ocean-400/30 text-ocean-200">{t("common.featured")}</span>
            )}
            {product.in_stock ? (
              <span className="chip border-emerald-400/30 text-emerald-300">{t("common.inStock")}</span>
            ) : (
              <span className="chip border-coral/30 text-coral">{t("common.soldOut")}</span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.category_slug && (
            <Link
              href={`/products?category=${product.category_slug}`}
              className="text-xs font-semibold uppercase tracking-wider text-ocean-300 hover:text-white"
            >
              {product.category_slug}
            </Link>
          )}
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-300">
            {product.rating != null && (
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
                <span className="font-semibold text-white">{product.rating.toFixed(1)}</span>
                <span className="text-slate-500">{t("common.rating")}</span>
              </span>
            )}
            {product.origin && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-ocean-300" /> {product.origin}
              </span>
            )}
          </div>

          <p className="mt-5 text-base leading-relaxed text-slate-300">
            {product.description}
          </p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-display text-4xl font-bold text-white">
              {formatPrice(product.price, lang)}
            </span>
            <span className="text-sm text-slate-400">{product.unit}</span>
          </div>

          <div className="mt-6">
            <ProductPurchaseBox product={product} />
          </div>

          {/* Perks */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Perk icon={<Truck className="h-5 w-5" />} title={t("product.perks.overnight")} body={t("product.perks.overnightBody")} />
            <Perk icon={<Snowflake className="h-5 w-5" />} title={t("product.perks.cold")} body={t("product.perks.coldBody")} />
            <Perk icon={<ShieldCheck className="h-5 w-5" />} title={t("product.perks.guarantee")} body={t("product.perks.guaranteeBody")} />
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="container-page py-16">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {t("product.youMightLike")}
            </h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Perk({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="glass-card flex items-start gap-3 p-4">
      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-ocean-400/10 text-ocean-200">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-slate-400">{body}</p>
      </div>
    </div>
  );
}
