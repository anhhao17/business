import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getBlogPosts } from "@/lib/data";
import { Reveal } from "@/components/effects/scroll-reveal";
import { getT, getLang } from "@/lib/i18n";
import { formatDate } from "@/lib/format";

export const metadata = { title: "Recipes & Guides" };

export default async function BlogPage() {
  const { t } = await getT();
  const lang = await getLang();
  const posts = await getBlogPosts({ publishedOnly: true });
  const [featured, ...rest] = posts;

  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="aurora-bg pointer-events-none absolute inset-0 opacity-50" />
        <div className="container-page relative py-14 sm:py-20">
          <span className="section-eyebrow">
            <BookOpen className="h-3.5 w-3.5" /> {t("blog.eyebrow")}
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
            {t("blog.title")}
          </h1>
          <p className="mt-3 max-w-xl text-slate-300">{t("blog.body")}</p>
        </div>
      </section>

      {posts.length === 0 ? (
        <div className="container-page py-20 text-center text-slate-400">
          {t("blog.none")}
        </div>
      ) : (
        <div className="container-page py-12">
          {/* Featured post */}
          {featured && (
            <Reveal>
              <Link
                href={`/blog/${featured.slug}`}
                className="glass-card-hover group mb-10 grid overflow-hidden rounded-3xl md:grid-cols-2"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-deep-700 md:aspect-auto">
                  {featured.cover_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.cover_image}
                      alt={featured.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center p-8 sm:p-10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ocean-300">
                    {t("blog.featured")} · {formatDate(featured.published_at, lang)}
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-slate-300">{featured.excerpt}</p>
                  <span className="mt-5 flex items-center gap-1 text-sm font-medium text-ocean-300">
                    {t("common.readArticle")} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Rest */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
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
                      {formatDate(post.published_at, lang)}
                    </span>
                    <h3 className="mt-2 font-display text-lg font-semibold text-white">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                      {post.excerpt}
                    </p>
                    <span className="mt-4 text-sm font-medium text-ocean-300">
                      {t("common.view")}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
