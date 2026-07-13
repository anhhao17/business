-- ===========================================================================
-- Ocean Catch — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- It creates tables, RLS policies, a storage bucket, and seeds demo data.
-- ===========================================================================

-- Extensions ----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- CATEGORIES ----------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  icon        text,
  created_at  timestamptz default now()
);

-- PRODUCTS ------------------------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text default '',
  price       numeric(10,2) not null default 0,
  unit        text default 'per lb',
  category_id uuid references public.categories(id) on delete set null,
  image_url   text,
  gallery     jsonb,
  origin      text,
  is_fresh    boolean default true,
  is_featured boolean default false,
  in_stock    boolean default true,
  rating      numeric(2,1),
  created_at  timestamptz default now()
);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_featured_idx on public.products(is_featured);
create index if not exists products_created_idx on public.products(created_at desc);

-- BLOG POSTS ----------------------------------------------------------------
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  excerpt       text default '',
  body          text default '',
  cover_image   text,
  author        text,
  published     boolean default true,
  published_at  timestamptz default now()
);

-- ORDERS --------------------------------------------------------------------
create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email         text not null,
  phone         text,
  address       text,
  items         jsonb not null default '[]',
  total         numeric(10,2) not null default 0,
  status        text not null default 'pending',
  note          text,
  created_at    timestamptz default now()
);
create index if not exists orders_created_idx on public.orders(created_at desc);

-- CONTACT MESSAGES ----------------------------------------------------------
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  handled    boolean default false,
  created_at timestamptz default now()
);

-- ADMINS (allowlist of emails that may access /admin) -----------------------
create table if not exists public.admins (
  id    uuid primary key default gen_random_uuid(),
  email text unique not null
);

-- ===========================================================================
-- ROW LEVEL SECURITY
-- Public can read published catalog content; only authed admins can write.
-- ===========================================================================
alter table public.categories        enable row level security;
alter table public.products          enable row level security;
alter table public.blog_posts        enable row level security;
alter table public.orders            enable row level security;
alter table public.contact_messages  enable row level security;
alter table public.admins            enable row level security;

-- Public reads
create policy "public read categories" on public.categories
  for select using (true);
create policy "public read products" on public.products
  for select using (true);
create policy "public read published posts" on public.blog_posts
  for select using (published = true);
create policy "public create orders" on public.orders
  for insert with check (true);
create policy "public create messages" on public.contact_messages
  for insert with check (true);

-- Admin writes (any authenticated user; gate actual admin access via the
-- admins table / ADMIN_EMAIL check in the app, or tighten these policies
-- to `email = (select auth.jwt() ->> 'email')` if you prefer DB-level gating).
create policy "admin manage categories" on public.categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin manage products" on public.products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin manage posts" on public.blog_posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "admin read orders" on public.orders
  for select using (auth.role() = 'authenticated');
create policy "admin read messages" on public.contact_messages
  for select using (auth.role() = 'authenticated');
create policy "admin read admins" on public.admins
  for select using (auth.role() = 'authenticated');

-- ===========================================================================
-- STORAGE BUCKET for product images
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "public read product images" on storage.objects
  for select using (bucket_id = 'products');
create policy "auth upload product images" on storage.objects
  for insert with check (bucket_id = 'products' and auth.role() = 'authenticated');
create policy "auth update product images" on storage.objects
  for update using (bucket_id = 'products' and auth.role() = 'authenticated');
create policy "auth delete product images" on storage.objects
  for delete using (bucket_id = 'products' and auth.role() = 'authenticated');

-- ===========================================================================
-- SEED DATA (categories + a few products + blog posts)
-- ===========================================================================
insert into public.categories (slug, name, description, icon) values
  ('fish',       'Fresh Fish',           'Wild-caught and day-boat fish, delivered ice-cold.', 'fish'),
  ('shrimp',     'Shrimp & Prawns',      'Sweet, snap-fresh shrimp and jumbo prawns.',          'shrimp'),
  ('crab',       'Crab & Lobster',       'Live and cooked crustaceans from cold waters.',       'crab'),
  ('shellfish',  'Shellfish',            'Oysters, mussels, clams — straight from the tide.',   'shell'),
  ('specialty',  'Specialty & Caviar',   'Smoked, cured, and premium roe selections.',          'star')
on conflict (slug) do nothing;

insert into public.products (slug, name, description, price, unit, category_id, image_url, origin, is_fresh, is_featured, in_stock, rating) values
  ('wild-alaskan-salmon', 'Wild Alaskan King Salmon', 'Rich, buttery king salmon caught off the coast of Alaska. Hand-cut center-cut fillets, skin-on.', 32.90, 'per lb',
    (select id from public.categories where slug='fish'),
    'https://images.unsplash.com/photo-1519708227418-c8fd9a5d9078?auto=format&fit=crop&w=1200&q=80', 'Alaska, USA', true, true, true, 4.9),
  ('atlantic-sea-scallops', 'Dry Atlantic Sea Scallops', 'U/10 dry-pack scallops — never soaked. Sear golden for a caramelized crust.', 28.50, 'per lb',
    (select id from public.categories where slug='shellfish'),
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80', 'New Bedford, USA', true, true, true, 4.8),
  ('gulf-tiger-shrimp', 'Jumbo Gulf Tiger Shrimp', '16/20 count tiger shrimp with a firm bite and clean, briny sweetness.', 19.90, 'per lb',
    (select id from public.categories where slug='shrimp'),
    'https://images.unsplash.com/photo-1565680018434-b513d5e6fd56?auto=format&fit=crop&w=1200&q=80', 'Gulf of Mexico', false, true, true, 4.7),
  ('maine-lobster', 'Live Maine Lobster', 'Hard-shell Maine lobsters, 1.5 lb each, shipped overnight in seaweed.', 26.50, 'per lb',
    (select id from public.categories where slug='crab'),
    'https://images.unsplash.com/photo-1559737558-2f5a35f40236?auto=format&fit=crop&w=1200&q=80', 'Maine, USA', true, true, true, 5.0),
  ('ahi-tuna-loin', 'Sushi-Grade Ahi Tuna Loin', 'Sashimi-grade yellowfin tuna loin, deep red and clean-flavored. Frozen at sea.', 30.00, 'per lb',
    (select id from public.categories where slug='fish'),
    'https://images.unsplash.com/photo-1615141987999-1c23b9bcbbab?auto=format&fit=crop&w=1200&q=80', 'Hawaii, USA', false, true, true, 4.8),
  ('ossetra-caviar', 'Farm-Raised Ossetra Caviar', 'Sustainable farm-raised Ossetra — nutty, golden-brown pearls. 30g tin.', 95.00, 'per 30g',
    (select id from public.categories where slug='specialty'),
    'https://images.unsplash.com/photo-1592480292195-43f5b0f3c97a?auto=format&fit=crop&w=1200&q=80', 'California, USA', false, true, true, 4.9)
on conflict (slug) do nothing;

insert into public.blog_posts (slug, title, excerpt, body, cover_image, author, published, published_at) values
  ('how-to-sear-the-perfect-scallop', 'How to Sear the Perfect Scallop',
    'A foolproof method for a golden crust and a translucent, sweet center — every time.',
    '# The Setup\n\nPat the scallops completely dry. Season generously with salt just before cooking. Use a heavy pan, smoking hot.\n\n## The Cook\n\nPlace flat-side down and do not touch for 90 seconds. Flip, add butter and garlic, baste for 45–60 seconds. Serve immediately.',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1600&q=80', 'Chef Marina Reyes', true, now())
on conflict (slug) do nothing;

-- Add yourself as an admin (replace with your email)
-- insert into public.admins (email) values ('you@example.com');
