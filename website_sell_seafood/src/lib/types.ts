export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number; // USD
  unit: string; // e.g. "per lb", "per dozen"
  category_id: string | null;
  category_slug?: string | null;
  image_url: string | null;
  gallery: string[] | null;
  origin: string | null;
  is_fresh: boolean;
  is_featured: boolean;
  in_stock: boolean;
  rating: number | null;
  created_at: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // markdown-ish plain text
  cover_image: string | null;
  author: string | null;
  published: boolean;
  published_at: string;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
};

export type Order = {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  items: OrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  note: string | null;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  handled: boolean;
};

export type CartItem = {
  product: Pick<
    Product,
    "id" | "slug" | "name" | "price" | "image_url" | "unit"
  >;
  quantity: number;
};
