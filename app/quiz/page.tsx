"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DictionaryEntry } from "@/types/DictionaryEntry";

export default function QuizPage() {
  const searchParams = useSearchParams();
  const entryIds = searchParams.get("entries")?.split(",").map(Number) || [];

  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchEntries = async () => {
      if (entryIds.length === 0) {
        setError("No entries selected for the quiz.");
        setIsLoading(false);
        return;
      }

      const supabase = createClient();

      // Get the current user
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("You must be logged in to create a quiz.");
        setIsLoading(false);
        return;
      }

      // Fetch the user's saved words that match the selected entry IDs
      const { data, error } = await supabase
        .from("vocab_entry")
        .select("*")
        .eq("user_id", session.user.id)
        .in(
          "entry_id",
          entryIds.map((id) => id.toString()),
        );

      if (error) {
        console.error("Error fetching entries:", error);
        setError("Failed to load quiz entries. Please try again.");
      } else if (!data || data.length === 0) {
        setError("No matching entries found for the quiz.");
      } else {
        // Convert to DictionaryEntry format
        const formattedEntries = data.map((entry) => ({
          entry_id: parseInt(entry.id.replace(/-/g, ""), 16) % 100000, // Generate a numeric ID from UUID
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
          hsk_level: { combined: 0, old: 0, new: 0 },
        }));

        setEntries(formattedEntries);
      }

      setIsLoading(false);
    };

    fetchEntries();
  }, [entryIds]);

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Quiz Generator</h1>

        {isLoading && (
          <div className="text-center p-4">Loading quiz entries...</div>
        )}

        {error && (
          <div className="text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
            {error}
          </div>
        )}

        {!isLoading && !error && entries.length > 0 && (
          <div className="border rounded-md p-4">
            <h2 className="text-xl font-bold mb-4">Selected Words</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {entries.map((entry) => (
                <div
                  key={entry.entry_id}
                  className="border rounded-md p-4 flex flex-col items-center"
                >
                  <div className="text-3xl font-bold mb-2">
                    {entry.simplified}
                  </div>
                  <div className="text-sm text-gray-600">
                    {entry.definition}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
