import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroSection } from "@/components/home/hero-section";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/effects/scroll-reveal";
import { getFeaturedProducts, getCategories, getBlogPosts } from "@/lib/data";
import { getT } from "@/lib/i18n";
import { formatDate } from "@/lib/format";

export default async function HomePage() {
  const { t } = await getT();
  const [featured, categories, posts] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getBlogPosts({ publishedOnly: true }),
  ]);

  const topPosts = posts.slice(0, 3);

  return (
    <>
      <HeroSection />

      {/* Categories */}
      <section className="container-page py-16 sm:py-20">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="section-eyebrow">
                <Sparkles className="h-3.5 w-3.5" /> {t("home.categories.eyebrow")}
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
                {t("home.categories.title")}
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-medium text-ocean-300 hover:text-white sm:flex"
            >
              {t("common.viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat, i) => (
            <Reveal key={cat.id} delay={(i % 5) as 1 | 2 | 3 | 4 | 5}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="glass-card-hover group flex flex-col items-center gap-3 rounded-2xl p-5 text-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-ocean-400/20 to-abyss-500/20 text-ocean-200 transition group-hover:scale-110">
                  <CategoryIcon name={cat.icon} />
                </span>
                <span className="text-sm font-semibold text-white">{cat.name}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-page py-12 sm:py-16">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="section-eyebrow">{t("home.featured.eyebrow")}</span>
              <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
                {t("home.featured.title")}
              </h2>
              <p className="mt-2 max-w-lg text-slate-400">
                {t("home.featured.body")}
              </p>
            </div>
            <Link
              href="/products"
              className="hidden items-center gap-1 text-sm font-medium text-ocean-300 hover:text-white sm:flex"
            >
              {t("common.shopAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Value props banner */}
      <section className="container-page py-16">
        <Reveal>
          <div className="glass-card relative overflow-hidden rounded-3xl p-8 sm:p-12">
            <div className="aurora-bg pointer-events-none absolute inset-0 opacity-40" />
            <div className="relative grid gap-8 md:grid-cols-3">
              <ValueProp title={t("home.value.dock.title")} body={t("home.value.dock.body")} />
              <ValueProp title={t("home.value.cold.title")} body={t("home.value.cold.body")} />
              <ValueProp title={t("home.value.guarantee.title")} body={t("home.value.guarantee.body")} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Blog teaser */}
      {topPosts.length > 0 && (
        <section className="container-page py-12 sm:py-16">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="section-eyebrow">{t("home.blog.eyebrow")}</span>
                <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">
                  {t("home.blog.title")}
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden items-center gap-1 text-sm font-medium text-ocean-300 hover:text-white sm:flex"
              >
                {t("common.readMore")} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {topPosts.map((post, i) => (
              <Reveal key={post.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="glass-card-hover group flex flex-col overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-deep-700">
                    {post.cover_image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <span className="text-xs text-slate-400">
                      {formatDate(post.published_at)}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-semibold text-white">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 text-sm font-medium text-ocean-300">
                      {t("common.readArticle")} →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-page py-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-ocean-400/20 bg-gradient-to-br from-deep-700 to-deep-900 p-10 text-center sm:p-16">
            <div className="aurora-bg pointer-events-none absolute inset-0 opacity-50" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                {t("home.cta.title")}
              </h2>
              <p className="mt-4 text-slate-300">{t("home.cta.body")}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/products" className="btn-primary">
                  {t("home.cta.shop")} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className="btn-ghost">
                  {t("home.cta.talk")}
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function ValueProp({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{body}</p>
    </div>
  );
}

function CategoryIcon({ name }: { name: string | null }) {
  const icons: Record<string, React.ReactNode> = {
    fish: <FishIcon />,
    shrimp: <ShrimpIcon />,
    crab: <CrabIcon />,
    shell: <ShellIcon />,
    star: <StarIcon />,
  };
  return <>{icons[name ?? "fish"] ?? <FishIcon />}</>;
}

function FishIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 12c.94-3.13 4.05-5.5 7.5-5.5 4.14 0 7.5 2.69 7.5 6s-3.36 6-7.5 6c-3.45 0-6.56-2.37-7.5-5.5" />
      <path d="M18 12c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1" />
      <path d="M2 12s1.5-2 4.5-2 4.5 2 4.5 2-1.5 2-4.5 2S2 12 2 12" />
    </svg>
  );
}
function ShrimpIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 14c2-4 6-6 10-6 4 0 7 2 8 5" />
      <circle cx="18" cy="9" r="1.2" />
      <path d="M7 16c1 1 3 2 5 2 2 0 4-1 5-2" />
      <path d="M5 12c-1 0-2 1-2 2" />
    </svg>
  );
}
function CrabIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13" r="4" />
      <path d="M8 13H4M4 13l-1-2M4 13l-1 2" />
      <path d="M16 13h4M20 13l1-2M20 13l1 2" />
      <path d="M9 9L7 6M15 9l2-3" />
      <path d="M10 17l-1 3M14 17l1 3" />
    </svg>
  );
}
function ShellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 16H4L12 3z" />
      <path d="M12 3v16M9 7l-1 12M15 7l1 12" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9L12 3z" />
    </svg>
  );
}
