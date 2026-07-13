import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { slugify } from "@/lib/format";
import { demoBlogPosts } from "@/lib/demo-data";
import type { BlogPost } from "@/lib/types";

let demoStore: BlogPost[] = demoBlogPosts.map((p) => ({ ...p }));

function fields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    body: String(formData.get("body") ?? "").trim(),
    cover_image: String(formData.get("cover_image") ?? "").trim() || null,
    author: String(formData.get("author") ?? "").trim() || null,
    published: formData.get("published") === "on",
  };
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const f = fields(formData);
  if (!f.title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  const slug = slugify(f.title);

  if (!isSupabaseConfigured) {
    const post: BlogPost = {
      id: `b-${Date.now()}`,
      slug: ensureUniqueSlug(slug),
      title: f.title,
      excerpt: f.excerpt,
      body: f.body,
      cover_image: f.cover_image,
      author: f.author,
      published: f.published,
      published_at: new Date().toISOString(),
    };
    demoStore.unshift(post);
    revalidatePath("/blog");
    return NextResponse.json({ ok: true, id: post.id });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug,
      title: f.title,
      excerpt: f.excerpt,
      body: f.body,
      cover_image: f.cover_image,
      author: f.author,
      published: f.published,
      published_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/blog");
  return NextResponse.json({ ok: true, id: data.id });
}

export async function PUT(request: Request) {
  const formData = await request.formData();
  const id = String(formData.get("id") ?? "");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const f = fields(formData);
  if (!f.title) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  const slug = slugify(f.title);

  if (!isSupabaseConfigured) {
    const existing = demoStore.find((p) => p.id === id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    Object.assign(existing, {
      title: f.title,
      slug,
      excerpt: f.excerpt,
      body: f.body,
      cover_image: f.cover_image,
      author: f.author,
      published: f.published,
    });
    revalidatePath("/blog");
    return NextResponse.json({ ok: true });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({
      slug,
      title: f.title,
      excerpt: f.excerpt,
      body: f.body,
      cover_image: f.cover_image,
      author: f.author,
      published: f.published,
    })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/blog");
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (!isSupabaseConfigured) {
    demoStore = demoStore.filter((p) => p.id !== id);
    revalidatePath("/blog");
    return NextResponse.json({ ok: true });
  }
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/blog");
  return NextResponse.json({ ok: true });
}

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ posts: demoStore });
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data });
}

function ensureUniqueSlug(slug: string): string {
  let candidate = slug;
  let n = 1;
  while (demoStore.some((p) => p.slug === candidate)) {
    candidate = `${slug}-${n++}`;
  }
  return candidate;
}
