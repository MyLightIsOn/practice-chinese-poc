"use client";

import { BookOpen } from "lucide-react";

interface CreateQuickQuizButtonProps {
  selectedEntries: number[];
}

export function CreateQuickQuizButton({
  selectedEntries,
}: CreateQuickQuizButtonProps) {
  // This check is redundant since we'll already check in the parent component,
  // but keeping it as a safeguard
  if (selectedEntries.length === 0) {
    return null;
  }

  return (
    <button
      className="flex items-center gap-1 px-3 py-2 rounded-md text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors"
      title="Create a quick quiz from selected words"
    >
      <BookOpen size={16} />
      <span>Create Quick Quiz ({selectedEntries.length})</span>
    </button>
  );
}
