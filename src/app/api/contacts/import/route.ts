import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_FIELDS = ["email", "first_name", "last_name", "company", "phone", "status", "source", "notes"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contacts, list_id, new_list_name } = body;
    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json({ error: "No contacts provided" }, { status: 400 });
    }

    console.log("[import] Received", contacts.length, "contacts, list_id:", list_id, "new_list_name:", new_list_name);

    const supabase = createAdminClient();
    let imported = 0;
    let errors = 0;
    const allIds: string[] = [];

  // Deduplicate by email (keep last occurrence)
  const deduped = new Map<string, Record<string, string>>();
  for (const c of contacts) {
    if (!c.email) continue;
    const clean: Record<string, string> = {};
    for (const key of VALID_FIELDS) {
      if (c[key]) clean[key] = String(c[key]).trim();
    }
    if (!clean.email) continue;
    if (!clean.source) clean.source = "import_excel";
    deduped.set(clean.email.toLowerCase(), clean);
  }
  const uniqueContacts = Array.from(deduped.values());

  const BATCH = 100;
  for (let i = 0; i < uniqueContacts.length; i += BATCH) {
    const batch = uniqueContacts.slice(i, i + BATCH);

    if (batch.length === 0) continue;

    const { data, error } = await supabase
      .from("contacts")
      .upsert(batch, { onConflict: "email" })
      .select("id");

    if (error) {
      console.error("[import] Upsert error:", error.message, error.code, error.details);
      errors += batch.length;
    } else {
      console.log("[import] Upserted", data?.length, "contacts");
      imported += (data?.length || 0);
      allIds.push(...(data || []).map((d) => d.id));
    }
  }

  let targetListId = list_id || "";

  if (!targetListId && new_list_name) {
    const { data: newList } = await supabase
      .from("contact_lists")
      .insert({ name: new_list_name.trim() })
      .select("id")
      .single();
    if (newList) targetListId = newList.id;
  }

  if (targetListId && allIds.length > 0) {
    const members = allIds.map((cid) => ({ list_id: targetListId, contact_id: cid }));
    for (let i = 0; i < members.length; i += BATCH) {
      await supabase
        .from("contact_list_members")
        .upsert(members.slice(i, i + BATCH), { onConflict: "list_id,contact_id" });
    }
  }

    console.log("[import] Done. imported:", imported, "errors:", errors, "listId:", targetListId);
    return NextResponse.json({ imported, errors, listId: targetListId });
  } catch (err) {
    console.error("[import] Unhandled error:", err);
    return NextResponse.json({ error: "Internal server error", details: String(err) }, { status: 500 });
  }
}
