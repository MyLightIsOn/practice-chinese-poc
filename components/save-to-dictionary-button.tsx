"use client";

import { useState } from "react";
import { DictionaryEntry } from "@/types/DictionaryEntry";
import {
  saveWordToDictionary,
  removeWordFromDictionary,
  isWordSaved,
} from "@/lib/dictionary";
import { useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

interface SaveToDictionaryButtonProps {
  entry: DictionaryEntry;
}

export function SaveToDictionaryButton({ entry }: SaveToDictionaryButtonProps) {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if the word is already saved when the component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      const saved = await isWordSaved(entry.simplified);
      setIsSaved(saved);
    };

    checkIfSaved();
  }, [entry.simplified]);

  const handleToggleSave = async () => {
    setIsLoading(true);

    try {
      if (isSaved) {
        // Remove from dictionary
        const { success, error } = await removeWordFromDictionary(
          entry.simplified,
        );

        if (success) {
          setIsSaved(false);
          toast.success("Word removed from your dictionary");
        } else {
          toast.error(error || "Failed to remove word");
        }
      } else {
        // Add to dictionary
        const { success, error } = await saveWordToDictionary(entry);
        if (success) {
          setIsSaved(true);
          toast.success("Word saved to your dictionary");
        } else {
          toast.error(error || "Failed to save word");
        }
      }
    } catch (err) {
      console.error("Error toggling word save:", err);
      toast.error("An error occurred. Please try again.");
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
