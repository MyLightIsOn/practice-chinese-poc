"use client";

import { KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchProps {
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: (page?: number) => Promise<void>;
  isLoading: boolean;
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export function Search({
  searchText,
  setSearchText,
  handleSearch,
  isLoading,
  handleKeyDown,
}: SearchProps) {
  return (
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
  );
}
