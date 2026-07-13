"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useT } from "@/components/i18n/i18n-provider";
import type { BlogPost } from "@/lib/types";

export function BlogForm({ post }: { post: BlogPost | null }) {
  const router = useRouter();
  const { t } = useT();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEdit = Boolean(post);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (isEdit && post) formData.append("id", post.id);
    try {
      const res = await fetch("/api/admin/blog", {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="glass-card p-6">
        <h2 className="font-display text-lg font-semibold text-white">
          {isEdit ? t("admin.blog.edit") : t("admin.blog.new")}
        </h2>
        <div className="mt-5 space-y-4">
          <div>
            <label className="label-field">{t("admin.blog.titleField")} <span className="text-coral">*</span></label>
            <input
              name="title"
              required
              defaultValue={post?.title}
              className="input-field"
              placeholder="How to Sear the Perfect Scallop"
            />
          </div>
          <div>
            <label className="label-field">{t("admin.blog.excerpt")}</label>
            <input
              name="excerpt"
              defaultValue={post?.excerpt}
              className="input-field"
              placeholder={t("admin.blog.excerptPlaceholder")}
            />
          </div>
          <div>
            <label className="label-field">{t("admin.blog.coverUrl")}</label>
            <input
              name="cover_image"
              defaultValue={post?.cover_image ?? ""}
              className="input-field"
              placeholder="https://images.unsplash.com/…"
            />
          </div>
          <div>
            <label className="label-field">{t("admin.blog.author")}</label>
            <input
              name="author"
              defaultValue={post?.author ?? ""}
              className="input-field"
              placeholder="Chef Marina Reyes"
            />
          </div>
          <div>
            <label className="label-field">{t("admin.blog.body")} <span className="text-coral">*</span></label>
            <textarea
              name="body"
              required
              rows={14}
              defaultValue={post?.body}
              className="input-field font-mono text-sm leading-relaxed"
              placeholder={"# Heading\n\nWrite your article in markdown…\n\n- bullet\n- bullet"}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              {t("admin.blog.bodyHint")}
            </p>
          </div>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-300">
            <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-deep-700 has-[:checked]:bg-ocean-500">
              <input type="checkbox" name="published" defaultChecked={post?.published ?? true} value="on" className="peer sr-only" />
              <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
            </span>
            {t("admin.blog.published")}
          </label>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> {t("common.saving")}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> {isEdit ? t("admin.products.save") : t("admin.blog.publish")}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="btn-ghost"
        >
          {t("common.cancel")}
        </button>
      </div>
    </form>
  );
}
