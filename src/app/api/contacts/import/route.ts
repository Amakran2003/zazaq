import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_FIELDS = ["email", "first_name", "last_name", "company", "phone", "status", "source", "notes"];

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
    const batch = contacts.slice(i, i + BATCH)
      .filter((c: Record<string, string>) => c.email)
      .map((c: Record<string, string>) => {
        const clean: Record<string, string> = {};
        for (const key of VALID_FIELDS) {
          if (c[key]) clean[key] = c[key];
        }
        if (!clean.source) clean.source = "import_excel";
        return clean;
      });

    if (batch.length === 0) continue;

    const { data, error } = await supabase
      .from("contacts")
      .upsert(batch, { onConflict: "email" })
      .select("id");

    if (error) {
      console.error("Import batch error:", error.message);
      errors += batch.length;
    } else {
      imported += (data?.length || 0);
    }
  }

  return NextResponse.json({ imported, errors });
}
