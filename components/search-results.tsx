"use client";

import { LookupResponse } from "@/types/LookupResponse";
import { DictionaryEntry } from "@/types/DictionaryEntry";
import { Card } from "@/components/card";
import { Pagination } from "@/components/pagination";

interface SearchResultsProps {
  results: LookupResponse | null;
  isLoading: boolean;
  error: string;
  currentPage: number;
  handleSearch: (page: number) => Promise<void>;
  selectedEntries: number[];
  toggleEntrySelection: (entryId: number) => void;
}

export function SearchResults({
  results,
  isLoading,
  error,
  currentPage,
  handleSearch,
  selectedEntries,
  toggleEntrySelection,
}: SearchResultsProps) {
  return (
    <>
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
              Input type:{" "}
              <span className="font-medium">{results.input_type}</span>
            </p>
          </div>

          {results.results.length === 0 ? (
            <p className="text-center py-4">No results found</p>
          ) : (
            <div className="space-y-6">
              {results.results.map((entry: DictionaryEntry) => (
                <Card
                  key={entry.id}
                  entry={entry}
                  isSelected={selectedEntries.includes(entry.id)}
                  onSelect={() => toggleEntrySelection(entry.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {results.pagination && results.pagination.total_pages > 1 && (
            <Pagination
              currentPage={currentPage}
              pagination={results.pagination}
              onPageChange={handleSearch}
            />
          )}
        </div>
      )}
    </>
  );
}
