import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DictionaryEntry } from "@/types/DictionaryEntry";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const simplified = url.searchParams.get("simplified");

  // If simplified parameter is provided, check if word is saved
  if (simplified) {
    const { data, error } = await supabase
      .from("vocab_entry")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("simplified", simplified)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ saved: !!data });
  }

  // Otherwise, get all user's dictionary entries
  const { data, error } = await supabase
    .from("vocab_entry")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Get request body
  const body = await request.json();

  // Check if this is a batch operation (multiple entries)
  if (Array.isArray(body.entries) && body.entries.length > 0) {
    // This is a batch operation to save multiple words
    const entries: DictionaryEntry[] = body.entries;

    // Prepare the entries data
    const vocabEntries = entries.map((entry) => ({
      user_id: session.user.id,
      simplified: entry.simplified,
      traditional: entry.traditional,
      pinyin: entry.pinyin,
      definition: entry.definition,
      entry_id: entry.id,
    }));

    // Insert the entries into the vocab_entry table
    const { data, error } = await supabase
      .from("vocab_entry")
      .insert(vocabEntries)
      .select("id");

    if (error) {
      return NextResponse.json(
        { error: error.message, savedCount: 0 },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      savedCount: data.length,
    });
  } else {
    // This is a single entry operation
    if (!body.simplified) {
      return NextResponse.json(
        { error: "Simplified character is required" },
        { status: 400 },
      );
    }

    // Insert the entry with the user's ID
    const { data, error } = await supabase
      .from("vocab_entry")
      .insert({
        user_id: session.user.id,
        simplified: body.simplified,
        traditional: body.traditional,
        pinyin: body.pinyin,
        definition: body.definition,
        notes: body.notes,
      })
      .select("id");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      id: data[0].id,
    });
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const simplified = url.searchParams.get("simplified");

  if (!simplified) {
    return NextResponse.json(
      { error: "Simplified character is required" },
      { status: 400 },
    );
  }

  // Delete the entry
  const { error } = await supabase
    .from("vocab_entry")
    .delete()
    .eq("user_id", session.user.id)
    .eq("simplified", simplified);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
