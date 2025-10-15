"use client";

import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateQuickQuizButtonProps {
  selectedEntries: string[];
}

export function Index({ selectedEntries }: CreateQuickQuizButtonProps) {
  const router = useRouter();

  // This check is redundant but keeping it as a safeguard
  if (selectedEntries.length === 0) {
    return null;
  }

  const handleClick = () => {
    // Navigate to the exercise page with the selected entries as URL parameters
    router.push(`/exercise?entries=${selectedEntries.join(",")}`);
  };

  return (
    <button
      className="flex items-center gap-1 px-3 py-2 rounded-md text-sm bg-purple-600 text-white hover:bg-purple-700 transition-colors"
      title="Create a quick quiz from selected words"
      onClick={handleClick}
    >
      <BookOpen size={16} />
      <span>Create Quick Quiz ({selectedEntries.length})</span>
    </button>
  );
}
