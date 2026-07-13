import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { OrderItem } from "@/lib/types";

// In-memory store for demo mode (no Supabase). Cleared on server restart.
const demoOrders: Array<{
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  items: OrderItem[];
  total: number;
  status: string;
  note: string | null;
  created_at: string;
}> = [];

export async function POST(request: Request) {
  let body: {
    customer_name: string;
    email: string;
    phone?: string;
    address?: string;
    note?: string;
    items: OrderItem[];
    total: number;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const required = ["customer_name", "email", "items", "total"];
  for (const key of required) {
    if (!(body as Record<string, unknown>)[key]) {
      return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
    }
  }

  const id = crypto.randomUUID();
  const record = {
    id,
    customer_name: body.customer_name,
    email: body.email,
    phone: body.phone ?? null,
    address: body.address ?? null,
    items: body.items,
    total: body.total,
    status: "pending" as const,
    note: body.note ?? null,
    created_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured) {
    demoOrders.unshift(record);
    return NextResponse.json({ ok: true, id, demo: true });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("orders").insert({
    id: record.id,
    customer_name: record.customer_name,
    email: record.email,
    phone: record.phone,
    address: record.address,
    items: record.items,
    total: record.total,
    status: record.status,
    note: record.note,
    created_at: record.created_at,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, id });
}

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ orders: demoOrders });
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}
