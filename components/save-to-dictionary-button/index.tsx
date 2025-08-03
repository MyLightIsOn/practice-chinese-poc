"use client";

import { useState } from "react";
import { DictionaryEntry } from "@/types/DictionaryEntry";
import { useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useDictionary } from "@/lib/context/DictionaryContext";
import { checkIfWordSaved, toggleWordInDictionary } from "./api";

interface SaveToDictionaryButtonProps {
  entry: DictionaryEntry;
}

export function Index({ entry }: SaveToDictionaryButtonProps) {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { incrementCount, decrementCount } = useDictionary();

  // Check if the word is already saved when the component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const saved = await checkIfWordSaved(entry.simplified);
        setIsSaved(saved);
      } catch (err) {
        console.error("Error checking if word is saved:", err);
        setIsSaved(false);
      }
    };

    checkIfSaved();
  }, [entry.simplified]);

  const handleToggleSave = async () => {
    setIsLoading(true);

    try {
      const result = await toggleWordInDictionary(entry, isSaved);

      if (result.success) {
        setIsSaved(result.isSaved);

        if (result.isSaved) {
          incrementCount();
          toast.success("Word saved to your dictionary");
        } else {
          decrementCount();
          toast.success("Word removed from your dictionary");
        }
      } else {
        toast.error(result.error || "Failed to update dictionary");
      }
    } catch (err) {
      console.error("Error toggling word save:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent card selection when clicking the button
        handleToggleSave();
      }}
      disabled={isLoading}
      className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm transition-colors ${
        isSaved
          ? "bg-green-100 text-green-800 hover:bg-green-200"
          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
      }`}
      title={isSaved ? "Remove from dictionary" : "Save to dictionary"}
    >
      {isLoading ? (
        <span className="animate-pulse">Loading...</span>
      ) : isSaved ? (
        <>
          <BookmarkCheck size={16} />
          <span>Saved</span>
        </>
      ) : (
        <>
          <Bookmark size={16} />
          <span>Save</span>
        </>
      )}
    </button>
  );
}
