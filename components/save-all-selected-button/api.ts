import { DictionaryEntry } from "@/types/DictionaryEntry";

/**
 * Saves multiple words to the user's dictionary
 * @param entries Array of dictionary entries to save
 * @returns Object containing success status, saved count, and error message if applicable
 */
export async function saveMultipleWordsToDictionary(entries: DictionaryEntry[]) {
  const response = await fetch('/api/user-dictionary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      entries: entries
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save words');
  }

  return await response.json();
}
