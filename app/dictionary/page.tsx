"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { DictionaryEntry } from "@/types/DictionaryEntry";
import { VocabEntry } from "@/types/VocabEntry";
import { Card } from "@/components/card";
import { RemoveAllSelectedButton } from "@/components/remove-all-selected-button";
import { CreateQuickQuizButton } from "@/components/create-quick-quiz-button";

export default function DictionaryPage() {
  const [entries, setEntries] = useState<VocabEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);

  // Function to toggle selection of an entry
  const toggleEntrySelection = (entryId: number) => {
    if (entryId === -1) {
      // Special case: clear all selections
      setSelectedEntries([]);
      return;
    }

    setSelectedEntries((prevSelected) => {
      if (prevSelected.includes(entryId)) {
        // If already selected, remove it
        return prevSelected.filter((id) => id !== entryId);
      } else {
        // If not selected, add it
        return [...prevSelected, entryId];
      }
    });
  };

  // Function to handle removing all selected entries
  const handleRemoveAllSelected = () => {
    toggleEntrySelection(-1); // Using -1 as a signal to clear all selections
  };

  useEffect(() => {
    const fetchSavedWords = async () => {
      const supabase = createClient();

      // Get the current user
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("You must be logged in to view your dictionary.");
        setIsLoading(false);
        return;
      }

      // Fetch the user's saved words
      const { data, error } = await supabase
        .from("vocab_entry")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching saved words:", error);
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
    return entries.map((entry) => ({
      entry_id: entry.entry_id ?? -1, // Provide a default value when entry_id is undefined
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
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">My Dictionary</h1>

        {isLoading && (
          <div className="text-center p-4">Loading your dictionary...</div>
        )}

        {error && (
          <div className="text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
            {error}
          </div>
        )}

        {!isLoading && !error && entries.length === 0 && (
          <div className="text-center p-8 border rounded-md">
            <p className="text-gray-600">Your dictionary is empty.</p>
            <p className="mt-2">
              Search for words and save them to see them here.
            </p>
          </div>
        )}

        {!isLoading && !error && entries.length > 0 && (
          <div className="border rounded-md p-4">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">My Dictionary</h2>
              {selectedEntries.length > 0 && (
                <div className="flex">
                  <RemoveAllSelectedButton
                    selectedEntries={selectedEntries}
                    onRemoveAll={handleRemoveAllSelected}
                  />
                  <CreateQuickQuizButton selectedEntries={selectedEntries} />
                </div>
              )}
            </div>
            <div className="space-y-6">
              {formatEntries(entries).map((entry) => (
                <Card
                  key={entry.entry_id}
                  entry={entry}
                  isSelected={selectedEntries.includes(entry.entry_id)}
                  onSelect={() => toggleEntrySelection(entry.entry_id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
