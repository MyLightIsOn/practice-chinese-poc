"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DictionaryEntry } from "@/types/DictionaryEntry";
import { Card } from "@/components/card";

// Define a type for the database entries
interface VocabEntry {
  id: string;
  simplified: string;
  traditional?: string;
  pinyin?: string;
  definition?: string;
  user_id: string;
  created_at: string;
}

export default function DictionaryPage() {
  const [entries, setEntries] = useState<VocabEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSavedWords = async () => {
      const supabase = createClient();

      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError("You must be logged in to view your dictionary.");
        setIsLoading(false);
        return;
      }

      // Fetch the user's saved words
      const { data, error } = await supabase
        .from('vocab_entry')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved words:', error);
        setError("Failed to load your dictionary. Please try again.");
      } else {
        setEntries(data || []);
      }

      setIsLoading(false);
    };

    fetchSavedWords();
  }, []);

  // Convert vocabulary entries to DictionaryEntry format
  const formatEntries = (entries: VocabEntry[]): DictionaryEntry[] => {
    return entries.map(entry => ({
      id: parseInt(entry.id.replace(/-/g, ""), 16) % 100000, // Generate a numeric ID from UUID
      simplified: entry.simplified,
      traditional: entry.traditional || entry.simplified,
      pinyin: entry.pinyin || "",
      definition: entry.definition || "",
      match_type: "saved",
      relevance_score: 1,
      parts_of_speech: [],
      classifiers: [],
      transcriptions: { zhuyin: "", wadegiles: "" },
      meanings: [],
      frequency_rank: 0,
      radical: "",
      hsk_level: { combined: 0, old: 0, new: 0 }
    }));
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">My Dictionary</h1>

        {isLoading && <div className="text-center p-4">Loading your dictionary...</div>}

        {error && (
          <div className="text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
            {error}
          </div>
        )}

        {!isLoading && !error && entries.length === 0 && (
          <div className="text-center p-8 border rounded-md">
            <p className="text-gray-600">Your dictionary is empty.</p>
            <p className="mt-2">Search for words and save them to see them here.</p>
          </div>
        )}

        {!isLoading && !error && entries.length > 0 && (
          <div className="border rounded-md p-4">
            <div className="space-y-6">
              {formatEntries(entries).map((entry) => (
                <Card key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
