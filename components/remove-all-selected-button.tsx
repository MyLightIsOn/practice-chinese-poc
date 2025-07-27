"use client";

import { Trash2 } from "lucide-react";

interface RemoveAllSelectedButtonProps {
  selectedEntries: number[];
  onRemoveAll: () => void;
  isLoading?: boolean;
}

export function RemoveAllSelectedButton({
  selectedEntries,
  onRemoveAll,
  isLoading = false,
}: RemoveAllSelectedButtonProps) {
  // This check is redundant since we're already checking in the SearchResults component,
  // but keeping it as a safeguard
  if (selectedEntries.length === 0) {
    return null;
  }

  return (
    <button
      onClick={onRemoveAll}
      disabled={isLoading}
      className="flex items-center gap-1 px-3 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700 transition-colors mr-2"
      title="Remove all selected words from selection"
    >
      {isLoading ? (
        <span className="animate-pulse">Removing...</span>
      ) : (
        <>
          <Trash2 size={16} />
          <span>Remove All Selected</span>
        </>
      )}
    </button>
  );
}
