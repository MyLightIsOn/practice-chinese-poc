"use client";

import { useState } from "react";
import { DictionaryEntry } from "@/types/DictionaryEntry";
import { BookmarkPlus } from "lucide-react";
import { toast } from "sonner";
import { useDictionary } from "@/lib/context/DictionaryContext";
import { saveMultipleWordsToDictionary } from "./api";

interface SaveAllSelectedButtonProps {
  selectedEntries: number[];
  entries: DictionaryEntry[];
}

export function SaveAllSelectedButton({
  selectedEntries,
  entries,
}: SaveAllSelectedButtonProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { refreshCount } = useDictionary();

  // This check is redundant since we're already checking in the SearchResults component,
  // but keeping it as a safeguard
  if (selectedEntries.length === 0) {
    return null;
  }

  const handleSaveAll = async () => {
    setIsLoading(true);

    try {
      // Get the full entry objects for the selected IDs
      const entriesToSave = entries.filter((entry) =>
        selectedEntries.includes(entry.id),
      );

      // Save all selected entries using the API function
      const data = await saveMultipleWordsToDictionary(entriesToSave);

      if (data.success) {
        // Refresh the count instead of incrementing by savedCount
        // because some words might already be saved
        await refreshCount();
        toast.success(`${data.savedCount} words saved to your dictionary`);
      } else {
        toast.error(data.error || "Failed to save words");
      }
    } catch (err) {
      console.error("Error saving words:", err);
      toast.error(err instanceof Error ? err.message : "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSaveAll}
      disabled={isLoading}
      className="flex items-center gap-1 px-3 py-2 rounded-md text-sm bg-green-600 text-white hover:bg-green-700 transition-colors"
      title="Save all selected words to dictionary"
    >
      {isLoading ? (
        <span className="animate-pulse">Saving...</span>
      ) : (
        <>
          <BookmarkPlus size={16} />
          <span>Save All Selected ({selectedEntries.length})</span>
        </>
      )}
    </button>
  );
}
