import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const { contacts } = await request.json();
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return NextResponse.json({ error: "No contacts provided" }, { status: 400 });
  }

  const supabase = createAdminClient();
  let imported = 0;
  let errors = 0;

  const BATCH = 100;
  for (let i = 0; i < contacts.length; i += BATCH) {
    const batch = contacts.slice(i, i + BATCH).filter((c: Record<string, string>) => c.email);
    const { data, error } = await supabase
      .from("contacts")
      .upsert(batch.map((c: Record<string, string>) => ({ ...c, source: c.source || "import_excel" })), { onConflict: "email" })
      .select("id");
    if (error) errors += batch.length;
    else imported += (data?.length || 0);
  }

  return NextResponse.json({ imported, errors });
}
