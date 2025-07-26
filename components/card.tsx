"use client";

import { DictionaryEntry } from "@/types/DictionaryEntry";

interface CardProps {
  entry: DictionaryEntry;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function Card({ entry, isSelected = false, onSelect }: CardProps) {
  return (
    <div
      className={`flex flex-col gap-2 border-b border-gray-300 pb-4 card cursor-pointer ${
        isSelected ? "dark:bg-muted border border-blue-300 rounded-md p-2" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{entry.simplified}</span>
        {entry.traditional !== entry.simplified && (
          <span className="text-lg text-gray-600">({entry.traditional})</span>
        )}
        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
          {entry.match_type} - {(entry.relevance_score * 100).toFixed(0)}%
        </span>
      </div>

      <div className="text-lg text-blue-700">{entry.pinyin}</div>

      <div className="mt-1">
        <span className="font-medium">Definition:</span> {entry.definition}
      </div>

      {entry.meanings && entry.meanings.length > 0 && (
        <div className="mt-1">
          <span className="font-medium">Meanings:</span>
          <ul className="list-disc list-inside ml-2">
            {entry.meanings.map((meaning, idx) => (
              <li key={idx}>{meaning}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
        {entry.hsk_level && (
          <div>
            <span className="font-medium">HSK Level:</span>{" "}
            {entry.hsk_level.combined}
          </div>
        )}

        {entry.frequency_rank && (
          <div>
            <span className="font-medium">Frequency Rank:</span>{" "}
            {entry.frequency_rank}
          </div>
        )}

        {entry.parts_of_speech && entry.parts_of_speech.length > 0 && (
          <div>
            <span className="font-medium">Parts of Speech:</span>{" "}
            {entry.parts_of_speech.join(", ")}
          </div>
        )}

        {entry.radical && (
          <div>
            <span className="font-medium">Radical:</span> {entry.radical}
          </div>
        )}
      </div>
    </div>
  );
}
