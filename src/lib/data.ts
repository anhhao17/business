import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import {
  demoCategories,
  demoProducts,
  demoBlogPosts,
} from "@/lib/demo-data";
import type { Category, Product, BlogPost } from "@/lib/types";

// ---------------------------------------------------------------------------
// READ LAYER
// Uses Supabase when configured; otherwise falls back to bundled demo data so
// the site runs immediately with `npm run dev` and zero external setup.
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return demoCategories;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) return demoCategories;
  return data as Category[];
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug) ?? null;
}

export type ProductFilter = {
  search?: string;
  categorySlug?: string;
  featuredOnly?: boolean;
  inStockOnly?: boolean;
  limit?: number;
};

export async function getProducts(
  filter: ProductFilter = {},
): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    let list = [...demoProducts];
    if (filter.featuredOnly) list = list.filter((p) => p.is_featured);
    if (filter.inStockOnly) list = list.filter((p) => p.in_stock);
    if (filter.categorySlug) {
      const cat = demoCategories.find((c) => c.slug === filter.categorySlug);
      if (cat) list = list.filter((p) => p.category_id === cat.id);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.origin ?? "").toLowerCase().includes(q),
      );
    }
    if (filter.limit) list = list.slice(0, filter.limit);
    return list.map(enrichWithCategorySlug(demoCategories));
  }

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, categories(slug, name)")
    .order("created_at", { ascending: false });

  if (filter.featuredOnly) query = query.eq("is_featured", true);
  if (filter.inStockOnly) query = query.eq("in_stock", true);
  if (filter.limit) query = query.limit(filter.limit);

  const { data, error } = await query;
  if (error || !data) return [];

  let list = data as (Product & { categories?: { slug: string } | null })[];
  if (filter.categorySlug) {
    list = list.filter((p) => p.categories?.slug === filter.categorySlug);
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.origin ?? "").toLowerCase().includes(q),
    );
  }
  return list.map((p) => ({
    ...p,
    category_slug: p.categories?.slug ?? null,
  }));
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | null> {
  if (!isSupabaseConfigured) {
    const p = demoProducts.find((p) => p.slug === slug);
    if (!p) return null;
    return enrichWithCategorySlug(demoCategories)(p);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(slug, name)")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  const p = data as Product & { categories?: { slug: string } | null };
  return { ...p, category_slug: p.categories?.slug ?? null };
}

export async function getFeaturedProducts(
  limit = 6,
): Promise<Product[]> {
  return getProducts({ featuredOnly: true, limit });
}

export async function getBlogPosts(
  opts: { publishedOnly?: boolean } = {},
): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) {
    let list = [...demoBlogPosts];
    if (opts.publishedOnly) list = list.filter((p) => p.published);
    return list.sort(
      (a, b) =>
        new Date(b.published_at).getTime() -
        new Date(a.published_at).getTime(),
    );
  }
  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (opts.publishedOnly) query = query.eq("published", true);
  const { data, error } = await query;
  if (error || !data) return [];
  return data as BlogPost[];
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) {
    return demoBlogPosts.find((p) => p.slug === slug) ?? null;
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return data as BlogPost;
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function enrichWithCategorySlug(cats: Category[]) {
  return (p: Product): Product => {
    const cat = cats.find((c) => c.id === p.category_id);
    return { ...p, category_slug: cat?.slug ?? null };
  };
}
