"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyboardEvent } from "react";

// Define interfaces for the API response based on the updated API documentation
interface HSKLevel {
  combined: number;
  old: number;
  new: number;
}

interface Transcriptions {
  zhuyin: string;
  wadegiles: string;
}

interface DictionaryEntry {
  id: number;
  simplified: string;
  traditional: string;
  pinyin: string;
  definition: string;
  hsk_level: HSKLevel;
  frequency_rank: number;
  radical: string;
  match_type: string;
  relevance_score: number;
  parts_of_speech: string[];
  classifiers: string[];
  transcriptions: Transcriptions;
  meanings: string[];
}

interface Pagination {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
}

interface LookupResponse {
  input_type: "chinese" | "pinyin" | "english";
  results: DictionaryEntry[];
  pagination: Pagination;
}

export default function Home() {
  const [searchText, setSearchText] = useState<string>("");
  const [results, setResults] = useState<LookupResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const handleSearch = async (page: number = 1): Promise<void> => {
    if (!searchText.trim()) return;

    setIsLoading(true);
    setError("");
    setCurrentPage(page);

    try {
      const response = await fetch(
        `/api/lookup?text=${encodeURIComponent(searchText)}&page=${page}&page_size=${pageSize}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data. Please try again.");
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      // Reset to page 1 when performing a new search with Enter key
      handleSearch(1);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <div className="flex gap-4 items-center">
          <Label htmlFor="search-input">Search</Label>
          <Input
            id="search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter text to search..."
            className="flex-1"
          />
          <button
            onClick={() => handleSearch(1)}
            disabled={isLoading || !searchText.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <div className="text-red-500 p-4 border border-red-300 rounded-md bg-red-50">
            {error}
          </div>
        )}

        {isLoading && <div className="text-center p-4">Loading...</div>}

        {results && !isLoading && (
          <div className="border rounded-md p-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold">Results</h2>
              <p className="text-sm text-gray-500">
                Input type: <span className="font-medium">{results.input_type}</span>
              </p>
            </div>

            {results.results.length === 0 ? (
              <p className="text-center py-4">No results found</p>
            ) : (
              <div className="space-y-6">
                {results.results.map((entry: DictionaryEntry) => (
                  <div
                    key={entry.id}
                    className="flex flex-col gap-2 border-b border-gray-300 pb-4"
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
                          <span className="font-medium">HSK Level:</span> {entry.hsk_level.combined}
                        </div>
                      )}

                      {entry.frequency_rank && (
                        <div>
                          <span className="font-medium">Frequency Rank:</span> {entry.frequency_rank}
                        </div>
                      )}

                      {entry.parts_of_speech && entry.parts_of_speech.length > 0 && (
                        <div>
                          <span className="font-medium">Parts of Speech:</span> {entry.parts_of_speech.join(", ")}
                        </div>
                      )}

                      {entry.radical && (
                        <div>
                          <span className="font-medium">Radical:</span> {entry.radical}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination controls */}
            {results.pagination && results.pagination.total_pages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleSearch(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>

                <div className="text-sm">
                  Page {currentPage} of {results.pagination.total_pages}
                  <span className="ml-2 text-gray-500">
                    ({results.pagination.total_count} results)
                  </span>
                </div>

                <button
                  onClick={() => handleSearch(currentPage + 1)}
                  disabled={currentPage >= results.pagination.total_pages}
                  className="px-3 py-1 bg-gray-200 rounded-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
