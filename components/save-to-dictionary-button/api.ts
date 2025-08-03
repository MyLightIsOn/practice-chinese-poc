import { DictionaryEntry } from "@/types/DictionaryEntry";

/**
 * Adds a word to the user's dictionary
 * @param entry The dictionary entry to save
 * @returns Object containing success status and error message if applicable
 */
export async function addWordToDictionary(entry: DictionaryEntry) {
  const response = await fetch('/api/user-dictionary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      simplified: entry.simplified,
      traditional: entry.traditional,
      pinyin: entry.pinyin,
      definition: entry.definition,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to save word');
  }

  return await response.json();
}

/**
 * Removes a word from the user's dictionary
 * @param simplified The simplified Chinese characters to remove
 * @returns Object containing success status and error message if applicable
 */
export async function removeWordFromDictionary(simplified: string) {
  const response = await fetch(`/api/user-dictionary?simplified=${encodeURIComponent(simplified)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to remove word');
  }

  return await response.json();
}

/**
 * Checks if a word is saved in the user's dictionary
 * @param simplified The simplified Chinese characters to check
 * @returns Boolean indicating if the word is saved
 */
export async function checkIfWordSaved(simplified: string) {
  const response = await fetch(`/api/user-dictionary?simplified=${encodeURIComponent(simplified)}`);

  if (!response.ok) {
    throw new Error('Failed to check if word is saved');
  }

  const data = await response.json();
  return data.saved;
}

/**
 * Toggles a word's saved status in the dictionary
 * @param entry The dictionary entry to toggle
 * @param isSaved Current saved status
 * @returns Object containing success status, new saved status, and error message if applicable
 */
export async function toggleWordInDictionary(entry: DictionaryEntry, isSaved: boolean) {
  if (isSaved) {
    const result = await removeWordFromDictionary(entry.simplified);
    return {
      ...result,
      isSaved: false
    };
  } else {
    const result = await addWordToDictionary(entry);
    return {
      ...result,
      isSaved: true
    };
  }
}
