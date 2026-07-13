import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

const demoMessages: Array<Record<string, unknown>> = [];

export async function POST(request: Request) {
  let body: { name: string; email: string; subject: string; message: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  for (const key of ["name", "email", "subject", "message"]) {
    if (!(body as Record<string, unknown>)[key]) {
      return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 });
    }
  }

  const record = {
    id: crypto.randomUUID(),
    name: body.name,
    email: body.email,
    subject: body.subject,
    message: body.message,
    created_at: new Date().toISOString(),
    handled: false,
  };

  if (!isSupabaseConfigured) {
    demoMessages.unshift(record);
    return NextResponse.json({ ok: true, demo: true });
  }
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(record);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ messages: demoMessages });
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data });
}
