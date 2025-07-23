"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyboardEvent } from "react";
import { resolveUrl } from "next/dist/lib/metadata/resolvers/resolve-url";

// Define an interface for the API response
// This should be updated based on the actual structure of your backend API response
interface LookupResult {
  [key: string]: unknown;
}

export default function Home() {
  const [searchText, setSearchText] = useState<string>("");
  const [results, setResults] = useState<LookupResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSearch = async (): Promise<void> => {
    if (!searchText.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/lookup?text=${encodeURIComponent(searchText)}`,
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
      handleSearch();
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
            onClick={handleSearch}
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
            <h2 className="text-xl font-bold mb-4">Results</h2>
            <div>
              {results.map((result: LookupResult, index: number) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 border-b border-gray-300 p-4"
                >
                  <span>Simplified: {result.simplified}</span>
                  <span>Traditional: {result.traditional}</span>
                  <span>Pinyin: {result.pinyin}</span>
                  <span>Definition: {result.definition}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
