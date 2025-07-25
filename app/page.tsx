"use client";

import { useState } from "react";
import { KeyboardEvent } from "react";
import { LookupResponse } from "@/types/LookupResponse";
import { Search } from "@/components/search";
import { SearchResults } from "@/components/search-results";

export default function Home() {
  const [searchText, setSearchText] = useState<string>("");
  const [results, setResults] = useState<LookupResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handleSearch = async (page: number = 1): Promise<void> => {
    if (!searchText.trim()) return;

    setIsLoading(true);
    setError("");
    setCurrentPage(page);

    try {
      const response = await fetch(
        `/api/lookup?text=${encodeURIComponent(searchText)}&page=${page}&page_size=${20}`,
      );

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
      // Reset to page 1 when performing a new search with Enter Key
      handleSearch(1).then((r) => console.log(r));
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <Search
          searchText={searchText}
          setSearchText={setSearchText}
          handleSearch={handleSearch}
          isLoading={isLoading}
          handleKeyDown={handleKeyDown}
        />

        <SearchResults
          results={results}
          isLoading={isLoading}
          error={error}
          currentPage={currentPage}
          handleSearch={handleSearch}
        />
      </div>
    </main>
  );
}
