import { DictionaryEntry } from "@/types/DictionaryEntry";
import { VocabEntry } from "@/types/VocabEntry";
import { createClient } from "@/lib/supabase/client";

/**
 * Save a word to the user's dictionary
 */
export async function saveWordToDictionary(
  entry: DictionaryEntry,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      success: false,
      error: "You must be logged in to save words.",
    };
  }

  // Prepare the entry data
  const vocabEntry: VocabEntry = {
    user_id: session.user.id,
    simplified: entry.simplified,
    traditional: entry.traditional,
    pinyin: entry.pinyin,
    definition: entry.definition,
    entry_id: entry.id,
  };

  console.log(entry);

  // Insert the entry into the vocab_entry table
  const { error } = await supabase
    .from("vocab_entry")
    .insert(vocabEntry)
    .select("id");

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

/**
 * Check if a word is already saved in the user's dictionary
 */
export async function isWordSaved(simplified: string): Promise<boolean> {
  const supabase = createClient();

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return false;
  }

  // Check if the word exists for this user
  const { data, error } = await supabase
    .from("vocab_entry")
    .select("id")
    .eq("user_id", session.user.id)
    .eq("simplified", simplified)
    .maybeSingle();

  if (error) {
    console.error("Error checking if word is saved:", error);
    return false;
  }

  return !!data;
}

/**
 * Remove a word from the user's dictionary
 */
export async function removeWordFromDictionary(
  simplified: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      success: false,
      error: "You must be logged in to remove words.",
    };
  }

  // Delete the entry
  const { error } = await supabase
    .from("vocab_entry")
    .delete()
    .eq("user_id", session.user.id)
    .eq("simplified", simplified);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

/**
 * Save multiple words to the user's dictionary
 */
export async function saveMultipleWordsToDictionary(
  entries: DictionaryEntry[],
): Promise<{ success: boolean; error?: string; savedCount: number }> {
  const supabase = createClient();

  // Get the current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      success: false,
      error: "You must be logged in to save words.",
      savedCount: 0,
    };
  }

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
    return {
      success: false,
      error: error.message,
      savedCount: 0,
    };
  }

  return {
    success: true,
    savedCount: data.length,
  };
}
