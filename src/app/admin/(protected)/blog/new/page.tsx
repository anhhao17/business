import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getT } from "@/lib/i18n";
import { BlogForm } from "@/components/admin/blog-form";

export const metadata = { title: "New article" };

export default async function NewBlogPage() {
  const { t } = await getT();
  return (
    <div>
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Link href="/admin/blog" className="hover:text-white">{t("admin.blog.title")}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-300">{t("admin.blog.new.title")}</span>
      </nav>
      <h1 className="mt-3 font-display text-2xl font-bold text-white">
        {t("admin.blog.new")}
      </h1>
      <p className="mt-1 text-sm text-slate-400">{t("admin.blog.newHint")}</p>
      <div className="mt-6">
        <BlogForm post={null} />
      </div>
    </div>
  );
}
