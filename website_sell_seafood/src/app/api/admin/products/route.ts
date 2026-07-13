import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isSupabaseConfigured } from "@/lib/env";
import { slugify } from "@/lib/format";
import { demoProducts, demoCategories } from "@/lib/demo-data";
import type { Product } from "@/lib/types";

// In-memory store for demo mode writes (resets on restart).
let demoStore: Product[] = demoProducts.map((p) => ({ ...p }));
let demoStoreCategories = [...demoCategories];

function findInDemo(id: string) {
  return demoStore.find((p) => p.id === id);
}

function parseFormFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: parseFloat(String(formData.get("price") ?? "0")) || 0,
    unit: String(formData.get("unit") ?? "per lb").trim(),
    category_id: String(formData.get("category_id") ?? "") || null,
    origin: String(formData.get("origin") ?? "").trim() || null,
    is_fresh: formData.get("is_fresh") === "on",
    is_featured: formData.get("is_featured") === "on",
    in_stock: formData.get("in_stock") !== "off",
    rating: formData.get("rating")
      ? parseFloat(String(formData.get("rating")))
      : null,
    existing_image: String(formData.get("existing_image") ?? "") || null,
  };
}

async function handleImage(
  formData: FormData,
  existing: string | null,
  slug: string,
): Promise<{ url: string | null; error?: string }> {
  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { url: existing };

  // Validate
  const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return { url: null, error: "Image must be PNG, JPEG, WebP, or GIF." };
  }
  if (file.size > 6 * 1024 * 1024) {
    return { url: null, error: "Image must be under 6MB." };
  }

  if (!isSupabaseConfigured) {
    // Save to /public/uploads (local dev only).
    const { writeFile, mkdir } = await import("node:fs/promises");
    const path = await import("node:path");
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${slug}-${Date.now()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), buffer);
    return { url: `/uploads/${filename}` };
  }

  const supabase = createServiceClient();
  if (!supabase) return { url: null, error: "Storage not configured." };
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filepath = `${slug}-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("products")
    .upload(filepath, file, { contentType: file.type, upsert: true });
  if (upErr) return { url: null, error: upErr.message };
  const { data: pub } = supabase.storage.from("products").getPublicUrl(filepath);
  return { url: pub.publicUrl };
}

// CREATE
export async function POST(request: Request) {
  const formData = await request.formData();
  const f = parseFormFields(formData);
  if (!f.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const slug = slugify(f.name);
  const { url, error: imgError } = await handleImage(formData, f.existing_image, slug);
  if (imgError) return NextResponse.json({ error: imgError }, { status: 400 });

  if (!isSupabaseConfigured) {
    const product: Product = {
      id: `p-${Date.now()}`,
      slug: ensureUniqueSlugDemo(slug),
      name: f.name,
      description: f.description,
      price: f.price,
      unit: f.unit,
      category_id: f.category_id,
      image_url: url,
      gallery: null,
      origin: f.origin,
      is_fresh: f.is_fresh,
      is_featured: f.is_featured,
      in_stock: f.in_stock,
      rating: f.rating,
      created_at: new Date().toISOString(),
    };
    demoStore.unshift(product);
    revalidatePath("/products");
    revalidatePath("/");
    return NextResponse.json({ ok: true, id: product.id });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      slug,
      name: f.name,
      description: f.description,
      price: f.price,
      unit: f.unit,
      category_id: f.category_id,
      image_url: url,
      origin: f.origin,
      is_fresh: f.is_fresh,
      is_featured: f.is_featured,
      in_stock: f.in_stock,
      rating: f.rating,
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/products");
  revalidatePath("/");
  return NextResponse.json({ ok: true, id: data.id });
}

// UPDATE
export async function PUT(request: Request) {
  const formData = await request.formData();
  const id = String(formData.get("id") ?? "");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const f = parseFormFields(formData);
  if (!f.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const slug = slugify(f.name);
  const { url, error: imgError } = await handleImage(formData, f.existing_image, slug);
  if (imgError) return NextResponse.json({ error: imgError }, { status: 400 });

  if (!isSupabaseConfigured) {
    const existing = findInDemo(id);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    Object.assign(existing, {
      name: f.name,
      slug,
      description: f.description,
      price: f.price,
      unit: f.unit,
      category_id: f.category_id,
      image_url: url,
      origin: f.origin,
      is_fresh: f.is_fresh,
      is_featured: f.is_featured,
      in_stock: f.in_stock,
      rating: f.rating,
    });
    revalidatePath("/products");
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      slug,
      name: f.name,
      description: f.description,
      price: f.price,
      unit: f.unit,
      category_id: f.category_id,
      image_url: url,
      origin: f.origin,
      is_fresh: f.is_fresh,
      is_featured: f.is_featured,
      in_stock: f.in_stock,
      rating: f.rating,
    })
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/products");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

// DELETE
export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  if (!isSupabaseConfigured) {
    demoStore = demoStore.filter((p) => p.id !== id);
    revalidatePath("/products");
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/products");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}

// READ (admin list, includes unpublished / all)
export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ products: demoStore });
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

function ensureUniqueSlugDemo(slug: string): string {
  let candidate = slug;
  let n = 1;
  while (demoStore.some((p) => p.slug === candidate)) {
    candidate = `${slug}-${n++}`;
  }
  return candidate;
}

// demoStoreCategories kept for potential future use (not exported — route
// files may only export HTTP methods).
void demoStoreCategories;
