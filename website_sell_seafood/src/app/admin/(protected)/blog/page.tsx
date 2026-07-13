import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { env } from "@/lib/env";
import { formatDate } from "@/lib/format";
import { getT } from "@/lib/i18n";
import { DeletePostButton } from "@/components/admin/delete-post-button";

export const metadata = { title: "Blog" };

type ApiPost = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  created_at: string;
  published_at: string | null;
};

export default async function AdminBlogPage() {
  const { t } = await getT();
  const res = await fetch(`${env.siteUrl}/api/admin/blog`, { cache: "no-store" });
  const data = await res.json();
  const posts: ApiPost[] = data.posts ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">{t("admin.blog.title")}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {posts.length} {posts.length === 1 ? t("common.item") : t("common.items")}
          </p>
        </div>
        <Link href="/admin/blog/new" className="btn-primary">
          <Plus className="h-4 w-4" /> {t("admin.blog.add")}
        </Link>
      </div>

      <div className="glass-card mt-6 overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-400">{t("admin.blog.none")}</p>
            <Link href="/admin/blog/new" className="btn-primary mt-4">
              {t("admin.blog.addFirst")}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">{t("admin.blog.titleField")}</th>
                  <th className="px-4 py-3">{t("admin.products.status")}</th>
                  <th className="px-4 py-3">{t("admin.blog.publishedAt")}</th>
                  <th className="px-4 py-3 text-right">{t("admin.products.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{p.title}</p>
                      <p className="text-xs text-slate-500">/{p.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      {p.published ? (
                        <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-300">
                          {t("admin.blog.published")}
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-400/15 px-2 py-0.5 text-xs text-slate-300">
                          {t("admin.blog.draft")}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {p.published_at ? formatDate(p.published_at) : formatDate(p.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/blog/${p.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
                          aria-label={t("admin.products.edit")}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <DeletePostButton id={p.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
