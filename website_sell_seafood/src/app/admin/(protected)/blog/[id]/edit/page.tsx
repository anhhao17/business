import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { env } from "@/lib/env";
import { getT } from "@/lib/i18n";
import { BlogForm } from "@/components/admin/blog-form";
import type { BlogPost } from "@/lib/types";

type Params = Promise<{ id: string }>;

export const metadata = { title: "Edit article" };

export default async function EditBlogPage({ params }: { params: Params }) {
  const { t } = await getT();
  const { id } = await params;
  const res = await fetch(`${env.siteUrl}/api/admin/blog`, { cache: "no-store" });
  const data = await res.json();
  const posts: BlogPost[] = data.posts ?? [];
  const post = posts.find((p) => p.id === id);
  if (!post) notFound();

  return (
    <div>
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/admin/blog" className="hover:text-white">{t("admin.blog.title")}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-slate-300">{post.title}</span>
      </nav>
      <h1 className="mt-3 font-display text-2xl font-bold text-white">
        {t("admin.blog.edit")}
      </h1>
      <p className="mt-1 text-sm text-slate-400">{t("admin.blog.editHint")}</p>
      <div className="mt-6">
        <BlogForm post={post} />
      </div>
    </div>
  );
}
