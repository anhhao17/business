import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import { getT, getLang } from "@/lib/i18n";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Article not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { t } = await getT();
  const lang = await getLang();
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const all = await getBlogPosts({ publishedOnly: true });
  const more = all.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article className="relative">
      <div className="container-page pt-8">
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/" className="hover:text-white">{t("nav.home")}</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/blog" className="hover:text-white">{t("nav.blog")}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-300">{post.title}</span>
        </nav>
      </div>

      {/* Hero */}
      <header className="container-page py-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-ocean-300">
            {formatDate(post.published_at, lang)}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-slate-300">{post.excerpt}</p>
          {post.author && (
            <p className="mt-4 text-sm text-slate-400">By {post.author}</p>
          )}
        </div>
      </header>

      {post.cover_image && (
        <div className="container-page">
          <div className="glass-card relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="container-page py-12">
        <div
          className="prose-invert mx-auto max-w-2xl text-base"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
        />
      </div>

      {/* More */}
      {more.length > 0 && (
        <section className="container-page pb-16">
          <h2 className="font-display text-2xl font-bold text-white">{t("common.keepReading")}</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {more.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="glass-card-hover group flex flex-col overflow-hidden rounded-2xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-deep-700">
                  {p.cover_image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.cover_image}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold text-white">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                    {p.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/blog"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-ocean-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> {t("common.allArticles")}
          </Link>
        </section>
      )}
    </article>
  );
}
